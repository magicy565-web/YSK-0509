import { collection, getDocs, writeBatch, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import { PotentialBuyer } from "../types";

// --- MOCK DATA GENERATION UTILITIES ---
// This section creates realistic, diverse mock data for potential buyers.

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Focused list of industries for more targeted data generation.
const industries = ['Construction', 'Healthcare', 'Automotive', 'Agriculture', 'Technology', 'Textiles', 'Food & Beverage', 'Energy', 'Manufacturing', 'Retail'];

// Geographically focused on US and UK markets as requested.
const locations = {
    USA: ['New York, NY', 'Los Angeles, CA', 'Houston, TX', 'Chicago, IL', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'],
    UK: ['London', 'Manchester', 'Birmingham'],
};

// Realistic product keywords mapped to each industry.
const productKeywordsByIndustry: { [key: string]: string[] } = {
    Construction: ['Structural Steel', 'Rebar', 'Cement', 'Plywood', 'Drywall', 'Guard Rails', 'H-Beam Steel', 'Scaffolding'],
    Healthcare: ['Surgical Gloves', 'Face Masks', 'Syringes', 'Hospital Gowns', 'Medical Tubing', 'Sanitizer', 'Ventilators'],
    Automotive: ['Tires', 'Brake Pads', 'Engine Oil', 'Spark Plugs', 'Car Batteries', 'Alloy Wheels', 'Headlights'],
    Agriculture: ['Fertilizers', 'Pesticides', 'Tractors', 'Irrigation Pipes', 'Seeds', 'Animal Feed', 'Harvesters'],
    Technology: ['Microchips', 'LED Displays', 'USB Cables', 'Power Banks', 'Drones', 'Printed Circuit Boards', 'SSDs'],
    Textiles: ['Cotton Fabric', 'Polyester Yarn', 'Denim', 'Nylon Cord', 'Spandex', 'Wool', 'Silk'],
    'Food & Beverage': ['Coffee Beans', 'Olive Oil', 'Wine', 'Canned Fish', 'Pasta', 'Frozen Vegetables', 'Infant Formula'],
    Energy: ['Solar Panels', 'Lithium-ion Batteries', 'Wind Turbine Blades', 'LED Bulbs', 'Transformers', 'Inverters'],
    Manufacturing: ['Ball Bearings', 'Electric Motors', 'Aluminum Ingots', 'Plastic Pellets', 'Sheet Metal', 'CNC Machines'],
    Retail: ['POS Systems', 'Shopping Carts', 'Display Racks', 'Barcode Scanners', 'Mannequins', 'Security Tags'],
};

const nameSuffixes = ['Group', 'Inc', 'LLC', 'Solutions', 'International', 'Traders', 'Supplies', 'Co.'];
const buyerTypes: PotentialBuyer['buyerType'][] = ['distributor', 'ecommerce', 'project_contractor', 'trader'];
const sourcingPreferences: PotentialBuyer['sourcingPreference'][] = ['factory', 'trader'];
const purchasingPreferences: PotentialBuyer['purchasingPreference'][] = ['price', 'quality', 'stability'];

/**
 * Generates a single, randomized potential buyer with realistic, associated data.
 * @param index - A unique index for the buyer to ensure unique avatar URLs.
 * @returns A buyer object conforming to the Omit<PotentialBuyer, 'id'> type.
 */
const generateRandomBuyer = (index: number): Omit<PotentialBuyer, 'id'> => {
    const industry = getRandomElement(industries);
    const country = getRandomElement(Object.keys(locations));
    const location = getRandomElement(locations[country as keyof typeof locations]);
    const name = `${getRandomElement(['Global', 'Apex', 'Pioneer', 'Summit', 'Dynamic'])} ${industry} ${getRandomElement(nameSuffixes)}`;
    const joinDate = new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Generate 2-3 relevant products for the buyer's industry.
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
        monthlyPurchaseAmount: Math.floor(Math.random() * 500000) + 10000,
        sourcingPreference: getRandomElement(sourcingPreferences),
        purchasingPreference: getRandomElement(purchasingPreferences),
        historicalInquiries: Math.floor(Math.random() * 50),
        intendedProducts,
    };
};


// --- FIRESTORE SERVICE FUNCTIONS ---

const BUYERS_COLLECTION = "buyers";

/**
 * Fetches potential buyers from Firestore and filters them based on a product keyword.
 * This function performs a basic keyword search on the buyer's industry and intended products.
 * @param productKeyword - The product name entered by the user.
 * @returns A promise that resolves to a list of matching potential buyers.
 */
export const fetchBuyers = async (productKeyword: string): Promise<{ total: number; top10: PotentialBuyer[] }> => {
  try {
    const querySnapshot = await getDocs(collection(db, BUYERS_COLLECTION));
    const allBuyers: PotentialBuyer[] = [];
    querySnapshot.forEach((doc) => {
      allBuyers.push({ id: doc.id, ...doc.data() } as PotentialBuyer);
    });

    // Filter buyers based on the product keyword (simple intent recognition)
    const lowercasedKeyword = productKeyword.toLowerCase();
    const matchedBuyers = allBuyers.filter(buyer => {
        const industryMatch = buyer.industry.toLowerCase().includes(lowercasedKeyword);
        const productMatch = buyer.intendedProducts.some(p => p.toLowerCase().includes(lowercasedKeyword));
        return industryMatch || productMatch;
    });

    return { 
      total: matchedBuyers.length,
      top10: matchedBuyers.slice(0, 10) // Return top 10 matches
    };
  } catch (error) {
    console.error("Error fetching or filtering buyers from Firestore:", error);
    return { total: 0, top10: [] };
  }
};

/**
 * Seeds the database with a large, diverse set of procedurally generated buyers.
 * This is a developer utility and should be used cautiously.
 * NOTE: This function will overwrite existing data in the 'buyers' collection.
 */
export const seedDatabase = async () => {
  console.log("Starting to seed database with potential EU/US buyers...");
  const batch = writeBatch(db);
  const buyersCol = collection(db, BUYERS_COLLECTION);
  const numberOfRecords = 573;

  // First, delete existing documents to prevent duplicates (optional, but good for clean seeding)
  const existingDocs = await getDocs(buyersCol);
  existingDocs.forEach(doc => batch.delete(doc.ref));

  console.log(`Generating ${numberOfRecords} new records...`);
  for (let i = 0; i < numberOfRecords; i++) {
      const newDocRef = doc(buyersCol);
      const buyerData = generateRandomBuyer(i);
      batch.set(newDocRef, buyerData);
  }

  try {
    console.log("Committing batch to Firestore...");
    await batch.commit();
    const successMsg = `Database seeded successfully with ${numberOfRecords} new, diverse EU/US buyer profiles!`;
    console.log(successMsg);
    alert(successMsg);
  } catch (error) {
    console.error("Error seeding database:", error);
    alert(`Error seeding database: ${error}`);
  }
};
