import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPassword } from '../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setLoading(true);

        try {
            const response = await forgotPassword({ email });
            const data = response.data;

            if (data?.success) {
                setIsError(false);
                setMessage(data.message || 'If an account exists with this email, password reset instructions will be sent.');
            } else {
                setIsError(true);
                setMessage(data?.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Unable to connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-slate-50">
            <div className="max-w-md w-full">

                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                        <GraduationCap className="w-8 h-8" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Forgot Password?
                    </h2>

                    <p className="text-sm text-slate-600 mt-2">
                        Enter your email address to reset your password
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8">

                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-xl text-xs font-medium flex items-center space-x-2 ${
                                isError
                                    ? 'bg-rose-50 border border-rose-200 text-rose-700'
                                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            }`}
                        >
                            {isError ? (
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                            )}
                            <span>{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail className="w-4 h-4" />
                                </div>

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span>Send Reset Instructions</span>
                            )}
                        </button>

                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;