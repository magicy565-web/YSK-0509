
// api/submit-application.js
import { Client } from '@hubspot/api-client';

export default async function handler(req, res) {
  // --- 调试代码开始 ---
  console.log("正在尝试提交...");
  console.log("Token状态:", process.env.HUBSPOT_ACCESS_TOKEN ? "✅ 已读取" : "❌ 未找到 (是 undefined)");
  // --- 调试代码结束 ---

  // 1. Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const hubspotClient = new Client({
        accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
      });
      const { companyName, contactPerson, contactPhone } = req.body;

      const dealResponse = await hubspotClient.crm.deals.basicApi.create({
        properties: {
          dealname: `${companyName} - 入驻申请`,
          pipeline: 'default',
          dealstage: 'appointmentscheduled',
          factory_name: companyName
        }
      });

      const landingPageUrl = `https://244873556.hs-sites-na2.com/factory-profile-template?name=${encodeURIComponent(companyName)}&id=${dealResponse.id}`;

      return res.status(200).json({
        success: true,
        crmId: dealResponse.id,
        landingPageUrl: landingPageUrl
      });
    } catch (e) {
      console.error(e);
      // It's better to send a generic error message to the client
      return res.status(500).json({ error: '服务器内部错误' });
    }
  } else {
    // Handle non-POST requests
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
