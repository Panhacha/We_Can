"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: 'usr_123',
        name: 'Guest User',
        email: loginMethod === 'email' ? email : 'guest@example.com',
        phone: loginMethod === 'phone' ? phone : '+855 12 345 678'
      });
      router.push('/account');
    }, 1500);
  };

  const handleSendOTP = () => {
    if (!phone) return;
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Method Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
              className={`flex-1 py-3 text-sm font-medium text-center ${loginMethod === 'email' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-3 text-sm font-medium text-center ${loginMethod === 'phone' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Phone Number
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            {loginMethod === 'email' && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">Forgot password?</Link>
                  </div>
                  <div className="mt-1">
                    <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                  </div>
                </div>
              </>
            )}

            {loginMethod === 'phone' && !otpSent && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    +855
                  </span>
                  <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 min-w-0 block w-full px-4 py-3 rounded-none rounded-r-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="12 345 678" />
                </div>
              </div>
            )}

            {loginMethod === 'phone' && otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter 4-digit OTP</label>
                <p className="text-xs text-gray-500 mb-2">Code sent to +855 {phone}</p>
                <div className="mt-1">
                  <input id="otp" type="text" maxLength={4} required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-[1em] text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" placeholder="----" />
                </div>
              </div>
            )}

            <div>
              {loginMethod === 'phone' && !otpSent ? (
                <button type="button" onClick={handleSendOTP} disabled={isLoading || !phone} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors">
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
