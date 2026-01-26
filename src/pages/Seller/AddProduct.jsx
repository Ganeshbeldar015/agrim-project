import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, doc, setDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

const AddProduct = () => {
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        tag: '', // New attribute named tag
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
        setLoading(true);
        setError('');

        if (!currentUser) {
            setError('You must be logged in as a seller to create products.');
            setLoading(false);
            return;
        }

        try {
            // Reference to the products collection
            const productsRef = collection(db, 'products');

            // Generate a new document reference with a unique ID
            const newProductRef = doc(productsRef);

            const payload = {
                uuid: newProductRef.id,
                name: formData.name,
                category: formData.category,
                tag: formData.tag, // Added tag to db schema
                price: parseFloat(formData.price) || 0,
                stock: parseInt(formData.stock, 10) || 0,
                description: formData.description,
                image: formData.image,
                sellerId: currentUser.uid,
                sellerName: userProfile?.displayName || userProfile?.name || 'Seller',
                rating: 0,
                reviews: 0,
                status: 'active',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            // Insert into Database
            await setDoc(newProductRef, payload);

            console.log("Product successfully added with ID:", newProductRef.id);
            navigate('/seller/products');
        } catch (err) {
            console.error("Error adding product:", err);
            setError('Failed to save product. ' + err.message);
        } finally {
            setLoading(false);
        }
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

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

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
                        <label className="block text-sm font-medium text-gray-700">Tag (Sub-category)</label>
                        <select
                            name="tag"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white font-medium"
                            value={formData.tag}
                            onChange={handleChange}
                        >
                            <option value="">Select Tag/Filter</option>
                            {/* Using same categories for simplicity as requested */}
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
                        disabled={loading}
                        className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
