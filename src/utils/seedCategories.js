import { db } from '../services/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const categories = [
    { name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Seeds & Plants', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Fertilizers & Soil Care', image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Crop Protection', image: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Farm Tools', image: 'https://images.unsplash.com/photo-1605000797499-7e20a58aa4e2?q=80&w=1000&auto=format&fit=crop' }
];

export const seedCategories = async () => {
    try {
        const categoriesRef = collection(db, 'categories');
        const snapshot = await getDocs(categoriesRef);

        if (!snapshot.empty) {
            console.log('Categories already seeded');
            return;
        }

        console.log('Seeding categories...');
        const promises = categories.map(cat =>
            addDoc(categoriesRef, {
                ...cat,
                createdAt: serverTimestamp()
            })
        );

        await Promise.all(promises);
        console.log('Categories seeded successfully');
    } catch (error) {
        console.error('Error seeding categories:', error);
    }
};
