
// api/submit-application.js
import { Client } from '@hubspot/api-client';
import formidable from 'formidable';
import fs from 'fs';

// Disable Vercel's default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Promisified form parser
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    console.error("HubSpot access token is not set.");
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    console.log("[API] Parsing form data...");
    const { fields, files } = await parseForm(req);
    console.log("[API] Form data parsed successfully. Fields:", Object.keys(fields));
    console.log("[API] Received files:", Object.keys(files));

    const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

    // 1. Create the Deal in HubSpot with text fields
    console.log(`[API] Creating deal for: ${fields.companyName}`);
    const dealProperties = {
      "dealname": `${fields.companyName || 'New Factory'} - Sourcing Application`,
      "pipeline": "default",
      "dealstage": "appointmentscheduled", // Initial stage
      "factory_name__c": fields.companyName,
      "product_keywords__c": fields.productName,
      "contact_person__c": fields.contactPerson,
      "contact_phone__c": fields.contactPhone,
      "core_advantages__c": fields.productDetails,
      "established_year__c": fields.establishedYear,
      "annual_revenue__c": fields.annualRevenue,
      "main_product_category__c": fields.mainProductCategory,
      "position__c": fields.position,
      "main_certificates__c": Array.isArray(fields['mainCertificates[]']) ? fields['mainCertificates[]'].join(';') : (fields.mainCertificates || ''),
    };

    const dealResponse = await hubspotClient.crm.deals.basicApi.create({ properties: dealProperties });
    console.log(`[API] Deal created successfully. Deal ID: ${dealResponse.id}`);

    // 2. Upload files and attach them as notes to the deal
    const fileUploadPromises = Object.entries(files).map(async ([formField, fileData]) => {
      const filesToUpload = Array.isArray(fileData) ? fileData : [fileData];
      for (const file of filesToUpload) {
        console.log(`[API] Uploading file: ${file.originalFilename}`);
        
        const fileUploadResponse = await hubspotClient.files.filesApi.upload({
          file: fs.createReadStream(file.filepath),
          fileName: file.originalFilename,
          folderPath: 'factory_applications', 
          options: JSON.stringify({ access: 'PRIVATE' })
        });
        
        console.log(`[API] File uploaded: ${fileUploadResponse.id}. Attaching to deal.`);
        
        // Create a note with the file link and associate it with the deal
        await hubspotClient.crm.objects.notes.basicApi.create({
          properties: {
            "hs_timestamp": new Date().toISOString(),
            "hs_note_body": `User submitted file: ${file.originalFilename} for field ${formField}.<br/>Access it here: <a href="${fileUploadResponse.url}">View File</a>`,
            "hubspot_owner_id": "", // Optional: assign to a specific owner
          },
          associations: [{
            to: { id: dealResponse.id },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] // Deal to Note association
          }]
        });
      }
    });

    await Promise.all(fileUploadPromises);
    console.log("[API] All files processed and attached to deal.");

    return res.status(200).json({ success: true, crmId: dealResponse.id });

  } catch (e) {
    console.error("--- HubSpot API Error ---");
    if(e.body) {
      console.error("Status:", e.body.status);
      console.error("Message:", e.body.message);
      console.error("Details:", e.body.errors);
    } else {
      console.error(e);
    }
    return res.status(500).json({ error: 'Failed to process application.' });
  }
}
