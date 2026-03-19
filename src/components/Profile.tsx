import React, { useState } from 'react';
import { User, Shield, Settings, LogOut, Star, CheckCircle, Clock, Edit2 } from 'lucide-react';
import { useRiderStore } from '../store';
import { cn } from '../utils';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { rider, logout } = useRiderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(rider.name);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleSettingClick = (label: string) => {
    if (label === 'Personal Information') {
      setIsEditing(true);
    } else if (label === 'Security & Privacy') {
      toast.success('Security settings coming soon!');
    } else {
      toast.success('Preferences updated!');
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={rider.avatar}
            alt={rider.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            referrerPolicy="no-referrer"
          />
          <button className="absolute bottom-2 right-2 p-2 bg-[#FF6B00] text-white rounded-full shadow-lg border-2 border-white">
            <Edit2 size={14} />
          </button>
        </div>
        <div className="mt-4">
          {isEditing ? (
            <div className="flex flex-col items-center gap-2">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold text-center border-b-2 border-orange-500 outline-none bg-transparent"
              />
              <button 
                onClick={handleSaveProfile}
                className="text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-stone-900">{rider.name}</h1>
              <p className="text-stone-500">{rider.email}</p>
            </>
          )}
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-stone-100">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-2 text-amber-500">
              <Star size={20} fill="currentColor" />
            </div>
            <p className="text-2xl font-bold text-stone-900">{rider.rating}</p>
            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Rating</p>
          </div>
          <div className="p-6 text-center">
            <div className="flex justify-center mb-2 text-blue-500">
              <CheckCircle size={20} />
            </div>
            <p className="text-2xl font-bold text-stone-900">{rider.completionRate}%</p>
            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Completion</p>
          </div>
          <div className="p-6 text-center">
            <div className="flex justify-center mb-2 text-purple-500">
              <Clock size={20} />
            </div>
            <p className="text-2xl font-bold text-stone-900">{rider.totalDeliveries}</p>
            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Total Orders</p>
          </div>
        </div>
      </section>

      {/* Menu Options */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest px-4 mb-4">Account Settings</h3>
        <ProfileMenuItem 
          icon={<User size={20} />} 
          label="Personal Information" 
          onClick={() => handleSettingClick('Personal Information')}
        />
        <ProfileMenuItem 
          icon={<Shield size={20} />} 
          label="Security & Privacy" 
          onClick={() => handleSettingClick('Security & Privacy')}
        />
        <ProfileMenuItem 
          icon={<Settings size={20} />} 
          label="App Preferences" 
          onClick={() => handleSettingClick('App Preferences')}
        />
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-bold">Logout</span>
        </button>
      </section>

      {/* Vehicle Info */}
      <section className="bg-stone-900 rounded-3xl p-6 text-white">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Vehicle Information</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">Yamaha MT-07</p>
            <p className="text-sm text-stone-400">Plate: ABC-1234 • Blue</p>
          </div>
          <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center">
            <Settings size={24} className="text-stone-500" />
          </div>
        </div>
      </section>
    </div>
  );
};

const ProfileMenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="text-stone-400 group-hover:text-[#FF6B00] transition-colors">
        {icon}
      </div>
      <span className="font-bold text-stone-700">{label}</span>
    </div>
    <Settings size={16} className="text-stone-300" />
  </button>
);
