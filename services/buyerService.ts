import { collection, getDocs, writeBatch, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import { PotentialBuyer } from "../types";

// --- COMPREHENSIVE MOCK DATA GENERATION ---
// This section is inspired by major e-commerce platforms to ensure broad industry coverage.

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Geographically focused on US and UK markets as requested.
const locations = {
    USA: ['New York, NY', 'Los Angeles, CA', 'Houston, TX', 'Chicago, IL', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'],
    UK: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
};

// Expanded and categorized list of industries and their corresponding product keywords.
const productKeywordsByIndustry: { [key: string]: string[] } = {
    'Automotive & Powersports': ['Brake Pads', 'Motor Oil', 'ATV Winches', 'Motorcycle Helmets', 'Carburetor Kits'],
    'Beauty & Personal Care': ['Anti-aging Cream', 'Essential Oils', 'Electric Shavers', 'Dental Floss', 'Hair Dryers'],
    'Books & Stationery': ['Offset Paper Rolls', 'Fountain Pens', 'Leather Journals', 'Thermal Binders', 'Whiteboard Markers'],
    'Industrial & Scientific': ['Flow Meters', 'Centrifuge Tubes', 'Spectrometers', 'Lab Coats', 'Soldering Irons'],
    'Apparel, Shoes & Accessories': ['Polyester Fabric', 'Running Shoes', 'Leather Handbags', 'Zippers', 'Sunglasses'],
    'Consumer Electronics': ['USB-C Cables', 'Bluetooth Headphones', 'Security Cameras', 'Drones', 'Portable Projectors'],
    'Food & Beverage': ['Organic Coffee Beans', 'Olive Oil Tins', 'Whey Protein Powder', 'Canned Sardines', 'Artisanal Pasta'],
    'Health & Medical Supplies': ['Nitrile Examination Gloves', 'Surgical Masks (Level 3)', 'Portable Ultrasound Machines', 'Crutches', 'First-Aid Kits'],
    'Home, Garden & Kitchen': ['Robot Vacuum Cleaners', 'Air Fryers', 'Gardening Tool Sets', 'Memory Foam Pillows', 'LED Strip Lights'],
    'Jewelry & Watches': ['Sterling Silver Chains', 'Automatic Watches', 'Jewelry Polishing Cloths', 'Watch Repair Kits', 'Gemstones'],
    'Luggage & Travel Gear': ['Spinner Suitcases', 'TSA-Approved Locks', 'Travel Adapters', 'Hiking Backpacks', 'Neck Pillows'],
    'Movies, Music & Games': ['Vinyl Records', 'Acoustic Guitars', 'Poker Chip Sets', 'Microphones', 'Gaming Chairs'],
    'Pet Supplies': ['Dry Cat Food', 'Dog Harnesses', 'Aquarium Heaters', 'Bird Seed Mixes', 'Pet Grooming Gloves'],
    'Sports & Outdoors': ['Yoga Mats', 'Adjustable Dumbbells', 'Camping Tents', 'Electric Bicycles', 'Fishing Lures'],
    'Toys, Kids & Baby': ['Wooden Building Blocks', 'Baby Monitors', 'Remote Control Cars', 'Educational Toys', 'Strollers'],
    'Building & Construction Materials': ['Fiber Cement Siding', 'PEX Tubing', 'Quartz Countertops', 'Spray Foam Insulation', 'Composite Decking'],
    'Agriculture & Farming': ['Drip Irrigation Kits', 'NPK Fertilizers', 'Tractor Tires', 'Greenhouse Plastic Sheeting', 'Seedling Trays'],
    'Energy & Renewables': ['Monocrystalline Solar Panels', 'Lithium Iron Phosphate (LiFePO4) Batteries', 'Wind Turbine Blades', 'Inverters', 'EV Chargers'],
    'Packaging & Printing': ['Corrugated Shipping Boxes', 'Void Fill Air Pillows', 'Thermal Transfer Labels', 'Digital Printing Ink', 'Mailing Tubes'],
    'Chemicals & Raw Materials': ['Caustic Soda Flakes', 'Polyethylene Pellets', 'Titanium Dioxide Powder', 'Silicone Sealant', 'Epoxy Resin'],
};

const allIndustries = Object.keys(productKeywordsByIndustry);
const nameSuffixes = ['Global', 'Corp', 'LLC', 'Solutions', 'International', 'Traders', 'Supplies', 'Co.', 'Group'];
const buyerTypes: PotentialBuyer['buyerType'][] = ['distributor', 'ecommerce', 'project_contractor', 'trader'];
const sourcingPreferences: PotentialBuyer['sourcingPreference'][] = ['factory', 'trader'];
const purchasingPreferences: PotentialBuyer['purchasingPreference'][] = ['price', 'quality', 'stability'];

const generateRandomBuyer = (index: number, industry: string): Omit<PotentialBuyer, 'id'> => {
    const country = getRandomElement(Object.keys(locations));
    const location = getRandomElement(locations[country as keyof typeof locations]);
    const name = `${getRandomElement(['Apex', 'Pioneer', 'Summit', 'Dynamic', 'Keystone'])} ${industry.split(' ')[0].replace('&','')} ${getRandomElement(nameSuffixes)}`;
    const joinDate = new Date(Date.now() - Math.random() * 4 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const intendedProducts = [...new Set(Array.from({ length: getRandomElement([2, 3]) }, () => getRandomElement(productKeywordsByIndustry[industry])))];

    return {
        name,
        avatarUrl: `https://i.pravatar.cc/150?u=buyer${index}`,
        website: `www.${name.toLowerCase().replace(/\s+/g, '-').replace(/[.,']/g, '')}.com`,
        country,
        location,
        buyerType: getRandomElement(buyerTypes),
        industry,
        joinDate,
        monthlyPurchaseAmount: Math.floor(Math.random() * 500000) + 25000,
        sourcingPreference: getRandomElement(sourcingPreferences),
        purchasingPreference: getRandomElement(purchasingPreferences),
        historicalInquiries: Math.floor(Math.random() * 100),
        intendedProducts,
    };
};

// --- FIRESTORE SERVICE FUNCTIONS ---

const BUYERS_COLLECTION = "buyers";

export const fetchBuyers = async (productKeyword: string): Promise<{ total: number; top10: PotentialBuyer[] }> => {
  // (Omitted for brevity - this function remains the same as before)
  try {
    const querySnapshot = await getDocs(collection(db, BUYERS_COLLECTION));
    const allBuyers: PotentialBuyer[] = [];
    querySnapshot.forEach((doc) => {
      allBuyers.push({ id: doc.id, ...doc.data() } as PotentialBuyer);
    });
    const lowercasedKeyword = productKeyword.toLowerCase();
    const matchedBuyers = allBuyers.filter(buyer => {
        const industryMatch = buyer.industry.toLowerCase().includes(lowercasedKeyword);
        const productMatch = buyer.intendedProducts.some(p => p.toLowerCase().includes(lowercasedKeyword));
        // A simple keyword-to-industry mapping for better matching
        const keywordInIndustry = Object.entries(productKeywordsByIndustry).some(([industry, products]) => 
            products.some(p => p.toLowerCase().includes(lowercasedKeyword)) && buyer.industry === industry
        );
        return industryMatch || productMatch || keywordInIndustry;
    });
    return { 
      total: matchedBuyers.length,
      top10: matchedBuyers.slice(0, 10)
    };
  } catch (error) {
    console.error("Error fetching or filtering buyers from Firestore:", error);
    return { total: 0, top10: [] };
  }
};

export const seedDatabase = async () => {
  console.log("Starting to seed database with comprehensive, categorized buyer data...");
  const batch = writeBatch(db);
  const buyersCol = collection(db, BUYERS_COLLECTION);
  const totalRecordsToCreate = 573;
  
  // Clear existing data for a clean seed
  const existingDocs = await getDocs(buyersCol);
  console.log(`Deleting ${existingDocs.size} existing documents...`);
  existingDocs.forEach(doc => batch.delete(doc.ref));
  await batch.commit(); // Commit deletions before adding new data

  // Start a new batch for additions
  const addBatch = writeBatch(db);
  const recordsPerIndustry = Math.floor(totalRecordsToCreate / allIndustries.length);
  let recordsCreated = 0;

  console.log(`Generating approx. ${recordsPerIndustry} records for each of the ${allIndustries.length} industries...`);

  for (const industry of allIndustries) {
      for (let i = 0; i < recordsPerIndustry; i++) {
          const newDocRef = doc(buyersCol);
          const buyerData = generateRandomBuyer(recordsCreated, industry);
          addBatch.set(newDocRef, buyerData);
          recordsCreated++;
      }
  }

  // Top-up with random industries to reach the exact target number
  while (recordsCreated < totalRecordsToCreate) {
      const newDocRef = doc(buyersCol);
      const buyerData = generateRandomBuyer(recordsCreated, getRandomElement(allIndustries));
      addBatch.set(newDocRef, buyerData);
      recordsCreated++;
  }

  try {
    console.log(`Committing ${recordsCreated} new records to Firestore...`);
    await addBatch.commit();
    const successMsg = `Database seeded successfully with ${recordsCreated} new buyers across ${allIndustries.length} industries!`;
    console.log(successMsg);
    alert(successMsg);
  } catch (error) {
    console.error("Error seeding database:", error);
    alert(`Error seeding database: ${error}`);
  }
};
