import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import BASE_URL from "../config";

function AdminRegister() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        secretKey: "",
    });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${BASE_URL}/admin/register`,
                formData
            );
            enqueueSnackbar(response.data.message, { variant: "success" });
            navigate("/admin/login");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    return (

        <div className="bg-gray-50 relative p-16">

            <div className="min-h-screen flex items-center justify-center  py-4 px-4 sm:px-6 lg:px-8">

                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                        <div className="flex items-start">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p>
                                <strong>Note:</strong> Only individuals issued a secret key by the development team can register as an admin or access admin privileges.
                                Please contact the development team if you have not received a secret key.
                            </p>
                        </div>
                    </div>

                    <div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Admin Registration</h2>
                        {/* <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Admin Registration
                        </h2> */}

                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <a
                                href="/admin/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Log in here
                            </a>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div>
                                <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                                    Secret Key
                                </label>
                                <input
                                    id="secretKey"
                                    name="secretKey"
                                    type="password"
                                    required
                                    value={formData.secretKey}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter admin secret key"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                                Register as Admin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;
