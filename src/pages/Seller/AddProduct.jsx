import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

const AddProduct = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catRef = collection(db, 'categories');
                const q = query(catRef, orderBy('name'));
                const snap = await getDocs(q);
                const cats = snap.docs.map(d => d.data().name);
                if (cats.length > 0) {
                    setCategories(cats);
                } else {
                    // Fallback
                    setCategories(['Seeds & Plants', 'Fertilizers', 'Farm Tools', 'Crops']);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in as a seller to create products.');
            return;
        }
        const productsRef = collection(db, 'products');
        const payload = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price) || 0,
            stock: parseInt(formData.stock, 10) || 0,
            description: formData.description,
            image: formData.image,
            sellerId: currentUser.uid,
            rating: 0,
            reviews: 0,
            createdAt: serverTimestamp()
        };
        await addDoc(productsRef, payload);
        navigate('/seller/products');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
                    <p className="text-sm text-gray-500">Create a new listing for your shop</p>
                </div>
                <button
                    onClick={() => navigate('/seller/products')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="e.g. Wireless Headphones"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                        <input
                            type="number"
                            name="price"
                            min="0"
                            step="0.01"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            placeholder="0"
                            value={formData.stock}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        placeholder="Describe your product..."
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* Image URL (Simplified for now) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="url"
                                name="image"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {formData.image && (
                        <div className="mt-2 text-sm text-gray-500">
                            Preview: <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover inline-block ml-2 rounded border border-gray-200" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/seller/products')}
                        className="mr-4 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
