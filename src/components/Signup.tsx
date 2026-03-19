import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRiderStore } from '../store';

export const Signup: React.FC = () => {
  const { signup } = useRiderStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    signup(formData);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row">
      {/* Left Side: Brand Imagery (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FF6B00] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-lg text-white">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FF6B00] font-bold text-2xl shadow-xl">F</div>
            <span className="font-bold text-3xl tracking-tight">FoodieExpress</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Start Your Journey <br />as a Delivery Partner.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-orange-50 text-xl leading-relaxed opacity-90"
          >
            Flexible hours, competitive earnings, and the best support in the industry. Sign up today and start delivering.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 space-y-4"
          >
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">✓</div>
              <p className="font-semibold">Quick 5-minute registration</p>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">✓</div>
              <p className="font-semibold">Weekly payments directly to bank</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">F</div>
          <span className="font-bold text-2xl tracking-tight flex">
            Foodie<span className="text-[#FF6B00]">Express</span>
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-stone-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Account</h1>
            <p className="text-stone-400">Join the FoodieExpress rider team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <User size={20} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF6B00] transition-all"
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF6B00] transition-all"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Phone size={20} />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF6B00] transition-all"
                placeholder="Phone Number"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#FF6B00] transition-all"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 group mt-4"
            >
              Sign up
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-10 text-stone-500">
            Already have an account? <Link to="/login" className="text-[#FF6B00] font-bold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
