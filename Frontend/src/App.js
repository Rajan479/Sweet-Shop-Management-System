import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Edit2, Trash2, LogOut, User, Lock, Mail, Package, DollarSign, Tag } from 'lucide-react';
import './App.css';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Service
const api = {
    auth: {
        register: async (username, email, password) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            if (!response.ok) throw new Error('Registration failed');
            return response.json();
        },
        login: async (username, password) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) throw new Error('Invalid credentials');
            return response.json();
        }
    },
    sweets: {
        getAll: async (token) => {
            const response = await fetch(`${API_BASE_URL}/sweets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch sweets');
            return response.json();
        },
        search: async (token, params) => {
            const queryParams = new URLSearchParams();
            if (params.name) queryParams.append('name', params.name);
            if (params.category) queryParams.append('category', params.category);
            if (params.minPrice) queryParams.append('minPrice', params.minPrice);
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

            const response = await fetch(`${API_BASE_URL}/sweets/search?${queryParams}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Search failed');
            return response.json();
        },
        add: async (token, sweet) => {
            const response = await fetch(`${API_BASE_URL}/sweets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sweet)
            });
            if (!response.ok) throw new Error('Failed to add sweet');
            return response.json();
        },
        update: async (token, id, sweet) => {
            const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sweet)
            });
            if (!response.ok) throw new Error('Failed to update sweet');
            return response.json();
        },
        delete: async (token, id) => {
            const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete sweet');
            return response.json();
        },
        purchase: async (token, id, quantity) => {
            const response = await fetch(`${API_BASE_URL}/sweets/${id}/purchase?quantity=${quantity}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Purchase failed');
            }
            return response.json();
        },
        restock: async (token, id, quantity) => {
            const response = await fetch(`${API_BASE_URL}/sweets/${id}/restock?quantity=${quantity}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Restock failed');
            return response.json();
        }
    }
};

// Main App Component
const SweetShopApp = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('token');
        } catch {
            return null;
        }
    });
    const [sweets, setSweets] = useState([]);
    const [filteredSweets, setFilteredSweets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const [searchParams, setSearchParams] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        if (token) {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                setUser(userData);
                loadSweets();
            } catch (err) {
                console.error('Error loading user data:', err);
            }
        }
    }, [token]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const loadSweets = async () => {
        try {
            setLoading(true);
            const data = await api.sweets.getAll(token);
            setSweets(data);
            setFilteredSweets(data);
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await api.sweets.search(token, searchParams);
            setFilteredSweets(data);
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (err) {
            console.error('Error clearing storage:', err);
        }
        setToken(null);
        setUser(null);
    };

    if (!token) {
        return <AuthPage
            onLogin={(newToken, newUser) => {
                setToken(newToken);
                setUser(newUser);
                try {
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('user', JSON.stringify(newUser));
                } catch (err) {
                    console.error('Error saving to storage:', err);
                }
            }}
            showNotification={showNotification}
        />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {notification && <Notification message={notification.message} type={notification.type} />}

            <Header user={user} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <SearchBar
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    onSearch={handleSearch}
                    onReset={() => {
                        setSearchParams({ name: '', category: '', minPrice: '', maxPrice: '' });
                        setFilteredSweets(sweets);
                    }}
                />

                {user?.role === 'ADMIN' && (
                    <AdminControls
                        token={token}
                        onSuccess={() => {
                            loadSweets();
                            showNotification('Operation successful!');
                        }}
                        showNotification={showNotification}
                    />
                )}

                <SweetGrid
                    sweets={filteredSweets}
                    loading={loading}
                    token={token}
                    isAdmin={user?.role === 'ADMIN'}
                    onPurchase={loadSweets}
                    onUpdate={loadSweets}
                    onDelete={loadSweets}
                    showNotification={showNotification}
                />
            </main>
        </div>
    );
};

// Auth Page Component
const AuthPage = ({ onLogin, showNotification }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!formData.username || !formData.password || (!isLogin && !formData.email)) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        setLoading(true);

        try {
            if (isLogin) {
                const data = await api.auth.login(formData.username, formData.password);
                const userData = { username: formData.username, role: data.role || 'USER' };
                onLogin(data.token, userData);
                showNotification('Login successful!');
            } else {
                await api.auth.register(formData.username, formData.email, formData.password);
                showNotification('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
                        Sweet Shop
                    </h1>
                    <p className="text-gray-600">Your favorite candy store</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <User size={16} className="inline mr-2" />
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Mail size={16} className="inline mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Lock size={16} className="inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Header Component
const Header = ({ user, onLogout }) => (
    <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <ShoppingCart className="text-white" size={20} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Sweet Shop</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    </header>
);

// Search Bar Component
const SearchBar = ({ searchParams, setSearchParams, onSearch, onReset }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Search size={20} />
            Search & Filter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
                type="text"
                placeholder="Search by name..."
                value={searchParams.name}
                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
                type="text"
                placeholder="Category..."
                value={searchParams.category}
                onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
                type="number"
                placeholder="Min Price"
                value={searchParams.minPrice}
                onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
                type="number"
                placeholder="Max Price"
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
        </div>
        <div className="flex gap-3 mt-4">
            <button
                onClick={onSearch}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
                Search
            </button>
            <button
                onClick={onReset}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Reset
            </button>
        </div>
    </div>
);

// Admin Controls Component
const AdminControls = ({ token, onSuccess, showNotification }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: '', price: '', quantity: '', description: ''
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
            showNotification('Please fill all required fields', 'error');
            return;
        }

        try {
            await api.sweets.add(token, {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity)
            });
            setShowForm(false);
            setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
            onSuccess();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md p-6 mb-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Package size={20} />
                    Admin Controls
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add New Sweet
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg p-4 text-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Category *"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price *"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <input
                            type="number"
                            placeholder="Quantity *"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="px-4 py-2 border rounded-lg col-span-2"
                            rows="3"
                        />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSubmit} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Add Sweet
                        </button>
                        <button onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sweet Grid Component
const SweetGrid = ({ sweets, loading, token, isAdmin, onPurchase, onUpdate, onDelete, showNotification }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (sweets.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">No sweets found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.map(sweet => (
                <SweetCard
                    key={sweet.id}
                    sweet={sweet}
                    token={token}
                    isAdmin={isAdmin}
                    onPurchase={onPurchase}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    showNotification={showNotification}
                />
            ))}
        </div>
    );
};

// Sweet Card Component
const SweetCard = ({ sweet, token, isAdmin, onPurchase, onUpdate, onDelete, showNotification }) => {
    const [showPurchase, setShowPurchase] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [purchaseQty, setPurchaseQty] = useState(1);
    const [restockQty, setRestockQty] = useState(10);
    const [editData, setEditData] = useState(sweet);

    const handlePurchase = async () => {
        try {
            await api.sweets.purchase(token, sweet.id, purchaseQty);
            showNotification(`Purchased ${purchaseQty} ${sweet.name}!`);
            setShowPurchase(false);
            setPurchaseQty(1);
            onPurchase();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleRestock = async () => {
        try {
            await api.sweets.restock(token, sweet.id, restockQty);
            showNotification(`Restocked ${restockQty} ${sweet.name}!`);
            setRestockQty(10);
            onUpdate();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleUpdate = async () => {
        try {
            await api.sweets.update(token, sweet.id, editData);
            showNotification('Sweet updated!');
            setShowEdit(false);
            onUpdate();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await api.sweets.delete(token, sweet.id);
                showNotification('Sweet deleted!');
                onDelete();
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
                <Package size={64} className="text-white opacity-80" />
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {sweet.category}
          </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{sweet.description || 'Delicious sweet treat'}</p>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-lg">
                        <DollarSign size={20} />
                        {sweet.price.toFixed(2)}
                    </div>
                    <div className={`flex items-center gap-2 ${sweet.quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        <Tag size={16} />
                        <span className="font-medium">{sweet.quantity} in stock</span>
                    </div>
                </div>

                {showEdit ? (
                    <div className="space-y-2 mb-4">
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                        <input
                            type="number"
                            step="0.01"
                            value={editData.price}
                            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                        <input
                            type="number"
                            value={editData.quantity}
                            onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleUpdate} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm">
                                Save
                            </button>
                            <button onClick={() => setShowEdit(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg text-sm">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : showPurchase ? (
                    <div className="space-y-2 mb-4">
                        <input
                            type="number"
                            min="1"
                            max={sweet.quantity}
                            value={purchaseQty}
                            onChange={(e) => setPurchaseQty(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Quantity"
                        />
                        <div className="flex gap-2">
                            <button onClick={handlePurchase} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg">
                                Confirm
                            </button>
                            <button onClick={() => setShowPurchase(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            onClick={() => setShowPurchase(true)}
                            disabled={sweet.quantity === 0}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={16} />
                            {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                        </button>

                        {isAdmin && (
                            <div className="flex gap-2">
                                <button onClick={() => setShowEdit(true)} className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
                                    <Edit2 size={14} />
                                    Edit
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2">
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        )}

                        {isAdmin && (
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={restockQty}
                                    onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Restock qty"
                                />
                                <button onClick={handleRestock} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Restock
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Notification Component
const Notification = ({ message, type }) => (
    <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white font-medium animate-pulse`}>
        {message}
    </div>
);

export default SweetShopApp;