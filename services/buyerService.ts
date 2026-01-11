import { collection, getDocs, writeBatch, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import { PotentialBuyer } from "../types";

const BUYERS_COLLECTION = "buyers";

/**
 * Fetches a list of potential buyers from the Firestore database.
 * 
 * @returns A promise that resolves to an object containing the total number of buyers
 *          and a list of the top 10 buyers.
 */
export const fetchBuyers = async (): Promise<{ total: number; top10: PotentialBuyer[] }> => {
  try {
    const querySnapshot = await getDocs(collection(db, BUYERS_COLLECTION));
    const buyers: PotentialBuyer[] = [];
    querySnapshot.forEach((doc) => {
      buyers.push({ id: doc.id, ...doc.data() } as PotentialBuyer);
    });

    // For now, we return all buyers as "top10" until pagination is implemented.
    return { 
      total: buyers.length,
      top10: buyers 
    };
  } catch (error) {
    console.error("Error fetching buyers from Firestore:", error);
    // It might be better to return a default or empty state rather than throwing an error,
    // to prevent the entire component from crashing.
    return { total: 0, top10: [] };
  }
};

/**
 * Seeds the Firestore database with initial buyer data.
 * This is a one-time operation to populate the database for development and testing.
 * 
 * NOTE: This function will overwrite any existing data in the 'buyers' collection.
 */
export const seedDatabase = async () => {
  const batch = writeBatch(db);
  
  const mockData: Omit<PotentialBuyer, 'id'>[] = [
     {
      name: 'Global Construction Supplies',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer001',
      website: 'www.globalconstructionsupplies.com',
      country: 'USA',
      location: 'Houston, TX',
      buyerType: 'distributor',
      industry: 'Construction & Building Materials',
      joinDate: '2022-08-15',
      monthlyPurchaseAmount: 150000,
      sourcingPreference: 'factory',
      purchasingPreference: 'quality',
      historicalInquiries: 12,
      intendedProducts: ['H-Beam Steel', 'Rebar', 'Structural Tubing'],
    },
    {
      name: 'Euro Steel Traders B.V.',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer002',
      website: 'www.eurosteeltraders.com',
      country: 'Netherlands',
      location: 'Rotterdam',
      buyerType: 'trader',
      industry: 'Industrial Manufacturing',
      joinDate: '2021-03-20',
      monthlyPurchaseAmount: 80000,
      sourcingPreference: 'trader',
      purchasingPreference: 'price',
      historicalInquiries: 8,
      intendedProducts: ['Steel Coils', 'Sheet Metal', 'Pipes'],
    },
    {
      name: 'Southeast Asia Metal Co.',
      avatarUrl: 'https://i.pravatar.cc/150?u=buyer003',
      website: 'www.seametals.com.sg',
      country: 'Singapore',
      location: 'Singapore',
      buyerType: 'ecommerce',
      industry: 'Metal Fabrication',
      joinDate: '2023-01-10',
      monthlyPurchaseAmount: 50000,
      sourcingPreference: 'factory',
      purchasingPreference: 'stability',
      historicalInquiries: 5,
      intendedProducts: ['H-Beam Steel', 'Angle Iron'],
    },
  ];

  const buyersCol = collection(db, BUYERS_COLLECTION);

  mockData.forEach((buyer) => {
    // Create a new document reference with an auto-generated ID
    const newDocRef = doc(buyersCol);
    batch.set(newDocRef, buyer);
  });

  try {
    await batch.commit();
    console.log("Database seeded successfully!");
    alert('Database seeded successfully!'); // Provide feedback to the user
  } catch (error) {
    console.error("Error seeding database:", error);
    alert(`Error seeding database: ${error}`); // Provide feedback to the user
  }
};
