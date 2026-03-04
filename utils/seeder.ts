
import { db } from '../firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';

export const seedDatabase = async () => {
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

    // --- Seed Reservations ---
    const reservations = [
        {
            name: "Joseph Vijay",
            phone: "+91 9876543210",
            date: new Date().toISOString().split('T')[0],
            time: "19:30",
            guests: "4",
            type: "Dinner",
            requests: "Quiet corner table please.",
            status: "pending",
            orderedItems: ["Fish Molee x1", "Kerala Parotta x5", "Beef Fry x1"],
            createdAt: new Date().toISOString()
        },
        {
            name: "Renuka Chowdhury",
            phone: "+91 9988776655",
            date: new Date().toISOString().split('T')[0],
            time: "13:00",
            guests: "2",
            type: "Lunch",
            status: "confirmed",
            orderedItems: ["Chatti Choru x2", "Lime Juice x2"],
            createdAt: new Date().toISOString()
        },
        {
            name: "Akhil P",
            phone: "+91 9123456780",
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: "20:00",
            guests: "6",
            type: "Dinner",
            status: "pending",
            // No pre-orders for this one
            createdAt: new Date().toISOString()
        }
    ];

    reservations.forEach((res) => {
        const docRef = doc(collection(db, 'reservations'));
        batch.set(docRef, res);
    });

    await batch.commit();
    console.log("Seeding complete!");
};
