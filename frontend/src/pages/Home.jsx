import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import './Home.css';
import axios from 'axios';

const Home = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const roleRoutes = {
        admin: '/AdminDashboard',
        technician: '/technicianDashboard',
        manager: '/managerDashboard',
        coordinator: '/coordinatorDashboard',
        parts_team: '/partsTeamDashboard'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/auth/login', formData);
            login({
                ...response.data.user,
                token: response.data.token
            });

            setIsLoginModalOpen(false);
            navigate(roleRoutes[response.data.user.role] || '/');

        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`home-container ${isLoginModalOpen ? 'modal-open' : ''}`}>
            {/* Dark overlay when modal is open */}

            {/* Main content that gets hidden when modal is open */}
            <div className={`main-content ${isLoginModalOpen ? 'hidden' : ''}`}>
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Welcome to Lenovo Service Portal</h1>
                        <p className="hero-subtitle">
                            {user ? `Hello, ${user.name}! Ready to get to work?` : 'Get started by signing in to your account'}
                        </p>

                        {!user && (
                            <button
                                className="cta-button"
                                onClick={() => setIsLoginModalOpen(true)}
                            >
                                Sign In
                            </button>
                        )}

                        {user && (
                            <button
                                className="cta-button"
                                onClick={() => navigate(roleRoutes[user.role])}
                            >
                                Go to Dashboard
                            </button>
                        )}
                    </div>
                    <div className="hero-image">
                        <div className="image-placeholder"></div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2 className="section-title">Our Services</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔧</div>
                            <h3>Device Repairs</h3>
                            <p>Fast and reliable repair services for all Lenovo devices</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🛠️</div>
                            <h3>Parts Replacement</h3>
                            <p>Genuine parts with warranty coverage</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Status Tracking</h3>
                            <p>Real-time updates on your service requests</p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="cta-section">
                    <h2>Need Help?</h2>
                    <p>Our support team is available 24/7 to assist you</p>
                    <button className="secondary-button">Contact Support</button>
                </section>
            </div>

            {/* Login Modal */}
            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => {
                    setIsLoginModalOpen(false);
                    setError('');
                }}
                title="Sign in to your account"
                size="sm"
            >
                <div className="modal-form-container">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Home;