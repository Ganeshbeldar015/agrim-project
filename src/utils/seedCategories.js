import { db } from '../services/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const categoriesData = [    
    { name: 'Fruits', image: '/images/Fruits.avif' },
    { name: 'Vegetables', image: '/images/vegetables.avif' },
    { name: 'Grains', image: '/images/grains.avif' },
    { name: 'Spices', image: '/images/spices.avif' },
    { name: 'Seeds & Plants', image: '/images/seed and plants.avif' },
    { name: 'Fertilizers & Soil Care', image: '/images/fertilizer and soil care.avif' },
    { name: 'Crop Protection', image: '/images/crops protection.avif' },
    { name: 'Farm Tools', image: '/images/ToolsKitGardening.jfif' },
    { name: 'Dairy & Poultry', image: '/images/Dairy & Poultry.avif' },
    { name: 'Irrigation Systems', image: '/images/Irrigation Systems.avif' },
    { name: 'Organic Honey', image: '/images/Organic Honey.avif' }
];

export const seedCategories = async () => {
    try {
        const categoriesRef = collection(db, 'categories');
        const snapshot = await getDocs(categoriesRef);
        
        const promises = categoriesData.map(async (cat) => {
            const existingDoc = snapshot.docs.find(d => d.data().name === cat.name);
            
            if (!existingDoc) {
                await addDoc(categoriesRef, {
                    ...cat,
                    createdAt: serverTimestamp()
                });
                console.log(`Added new category: ${cat.name}`);
            } else if (existingDoc.data().image !== cat.image) {
                const docRef = doc(db, 'categories', existingDoc.id);
                await updateDoc(docRef, { image: cat.image });
                console.log(`Updated image for category: ${cat.name}`);
            }
        });

        await Promise.all(promises);
        console.log('Categories synced successfully.');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};