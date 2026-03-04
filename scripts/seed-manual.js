
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA5r0OlCr23ephce_svdtjpVhjAH7LB8Dw",
    authDomain: "farmers-meenchatti.firebaseapp.com",
    projectId: "farmers-meenchatti",
    storageBucket: "farmers-meenchatti.firebasestorage.app",
    messagingSenderId: "1070131338966",
    appId: "1:1070131338966:web:306cb66be59ba74b76f377"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedDatabase = async () => {
    console.log("Starting database seed...");
    const batch = writeBatch(db);

    // --- Seed Products ---
    const products = [
        {
            name: 'Kerala Parotta',
            price: '₹45',
            description: 'Flaky, layered flatbread made with refined flour, perfect for mopping up spicy curries.',
            image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?q=80&w=800&auto=format&fit=crop',
            category: 'sides',
            type: 'veg'
        },
        {
            name: 'Fish Molee',
            price: '₹580',
            description: 'A milder, creamy coconut milk based fish stew with turmeric, ginger, and green chilies.',
            image: 'https://images.unsplash.com/photo-1628191139360-4083564d03fd?q=80&w=800&auto=format&fit=crop',
            category: 'curry',
            type: 'non-veg'
        },
        {
            name: 'Squid Roast (Koonthal)',
            price: '₹490',
            description: 'Spicy squid rings stir-fried with onions, curry leaves, and a punch of crushed black pepper.',
            image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=800&auto=format&fit=crop',
            category: 'appetizer',
            type: 'non-veg'
        },
        {
            name: 'Crab Roast',
            price: '₹650',
            description: 'Fresh mud crabs cooked in a thick, spicy masala paste. Messy but absolutely worth it.',
            image: 'https://images.unsplash.com/photo-1594950005574-e85d68d19760?q=80&w=800&auto=format&fit=crop',
            category: 'special',
            type: 'non-veg'
        }
    ];

    products.forEach((product) => {
        const docRef = doc(collection(db, 'menu_items'));
        batch.set(docRef, product);
    });

    // --- Seed Reviews ---
    const reviews = [
        {
            name: 'Arun George',
            location: 'Trivandrum',
            rating: 5,
            text: "The Fish Molee is to die for! Creamy, rich, and just the right amount of spice. Reminds me of Easter lunch at home.",
            dish: 'Fish Molee',
            avatar: 'https://i.pravatar.cc/150?u=arun',
            createdAt: new Date().toISOString()
        },
        {
            name: 'Meera Nair',
            location: 'Mumbai',
            rating: 4,
            text: "Authentic taste. The Parottas were flaky and hot. Delivery was a bit slow but the food made up for it.",
            dish: 'Kerala Parotta',
            avatar: 'https://i.pravatar.cc/150?u=meera',
            createdAt: new Date().toISOString()
        },
        {
            name: 'David Miller',
            location: 'London',
            rating: 5,
            text: "Discovered this gem on my trip to Kerala. The Clay Pot cooking really does give it a unique earthy flavor. Loved it!",
            dish: 'Handcrafted Meenchatti',
            avatar: 'https://i.pravatar.cc/150?u=david',
            createdAt: new Date().toISOString()
        },
        {
            name: 'Lakshmi Priya',
            location: 'Kottayam',
            rating: 5,
            text: "Finally a place that serves real spicy Squid Roast without overdoing the oil. Highly recommended for spice lovers.",
            dish: 'Squid Roast',
            avatar: 'https://i.pravatar.cc/150?u=lakshmi',
            createdAt: new Date().toISOString()
        }
    ];

    reviews.forEach((review) => {
        const docRef = doc(collection(db, 'reviews'));
        batch.set(docRef, review);
    });

    await batch.commit();
    console.log("Seeding complete!");
};

seedDatabase()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
