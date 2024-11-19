import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../Firebase'; // Import Firebase authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
import Header from '../components/Header';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // State for success notification
    const navigate = useNavigate(); // Initialize navigate

    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form refresh
        setError(''); // Clear previous errors
        setSuccess(false); // Reset success state

        try {
            // Firebase authentication
            await signInWithEmailAndPassword(auth, email, password);

            // Set success notification
            setSuccess(true);

            // Redirect to /home after a brief delay
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div>
            <Header />
            {/* Main Container */}
            <div className="bg-sky-100 flex justify-center items-center h-screen">
                {/* Left: Image */}
                <div className="w-1/2 h-screen hidden lg:block">
                    <img
                        src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
                        alt="Placeholder Image"
                        className="object-cover w-full h-full"
                    />
                </div>
                {/* Right: Login Form */}
                <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold mb-4">Login</h1>

                    {/* Error Notification */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Success Notification */}
                    {success && (
                        <div className="alert success flex items-center p-4 mb-4 text-sm text-green-800 bg-green-50 rounded-lg dark:bg-gray-800 dark:text-green-400" role="alert">
                            <svg
                                className="icon w-4 h-4 me-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span>
                                <strong>Success!</strong> Login successful. Redirecting to your dashboard...
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-800">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                autoComplete="off"
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
