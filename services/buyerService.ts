import { collection, getDocs, writeBatch, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import { PotentialBuyer } from "../types";

// --- MOCK DATA GENERATION UTILITIES ---
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const industries = ['Construction', 'Healthcare', 'Automotive', 'Agriculture', 'Technology', 'Textiles', 'Food & Beverage', 'Energy', 'Manufacturing', 'Retail'];
const countries = {
    USA: ['New York', 'Los Angeles', 'Houston'],
    Germany: ['Berlin', 'Hamburg', 'Munich'],
    China: ['Shanghai', 'Shenzhen', 'Guangzhou'],
    Japan: ['Tokyo', 'Osaka', 'Nagoya'],
    Canada: ['Toronto', 'Vancouver', 'Montreal'],
    UK: ['London', 'Manchester', 'Birmingham'],
};
const nameSuffixes = ['Group', 'Inc', 'LLC', 'Solutions', 'International', 'Traders', 'Supplies', 'Co.'];
const buyerTypes: PotentialBuyer['buyerType'][] = ['distributor', 'ecommerce', 'project_contractor', 'trader'];
const sourcingPreferences: PotentialBuyer['sourcingPreference'][] = ['factory', 'trader'];
const purchasingPreferences: PotentialBuyer['purchasingPreference'][] = ['price', 'quality', 'stability'];

const generateRandomBuyer = (index: number): Omit<PotentialBuyer, 'id'> => {
    const industry = getRandomElement(industries);
    const country = getRandomElement(Object.keys(countries));
    const location = getRandomElement(countries[country as keyof typeof countries]);
    const name = `${getRandomElement(['Global', 'Apex', 'Pioneer', 'Summit', 'Dynamic'])} ${industry} ${getRandomElement(nameSuffixes)}`;
    const joinDate = new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
        name,
        avatarUrl: `https://i.pravatar.cc/150?u=buyer${index}`,
        website: `www.${name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}.com`,
        country,
        location,
        buyerType: getRandomElement(buyerTypes),
        industry,
        joinDate,
        monthlyPurchaseAmount: Math.floor(Math.random() * 500000) + 10000,
        sourcingPreference: getRandomElement(sourcingPreferences),
        purchasingPreference: getRandomElement(purchasingPreferences),
        historicalInquiries: Math.floor(Math.random() * 50),
        intendedProducts: ['Product A', 'Product B'], // Simplified for demonstration
    };
};

// --- FIRESTORE SERVICE FUNCTIONS ---

const BUYERS_COLLECTION = "buyers";

export const fetchBuyers = async (): Promise<{ total: number; top10: PotentialBuyer[] }> => {
  try {
    const querySnapshot = await getDocs(collection(db, BUYERS_COLLECTION));
    const buyers: PotentialBuyer[] = [];
    querySnapshot.forEach((doc) => {
      buyers.push({ id: doc.id, ...doc.data() } as PotentialBuyer);
    });
    return { 
      total: buyers.length,
      top10: buyers.slice(0, 10) // Return only the first 10 for display
    };
  } catch (error) {
    console.error("Error fetching buyers from Firestore:", error);
    return { total: 0, top10: [] };
  }
};

export const seedDatabase = async () => {
  console.log("Starting to seed database...");
  const batch = writeBatch(db);
  const buyersCol = collection(db, BUYERS_COLLECTION);
  const numberOfRecords = 573;

  console.log(`Generating ${numberOfRecords} records...`);
  for (let i = 0; i < numberOfRecords; i++) {
      const newDocRef = doc(buyersCol);
      const buyerData = generateRandomBuyer(i);
      batch.set(newDocRef, buyerData);
  }

  try {
    console.log("Committing batch to Firestore...");
    await batch.commit();
    console.log(`Database seeded successfully with ${numberOfRecords} records!`);
    alert(`Database seeded successfully with ${numberOfRecords} records!`);
  } catch (error) {
    console.error("Error seeding database:", error);
    alert(`Error seeding database: ${error}`);
  }
};
