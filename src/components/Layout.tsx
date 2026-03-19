import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Wallet, User, Bell } from 'lucide-react';
import { cn } from '../utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-stone-200 p-6 z-50">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-xl tracking-tight">Foodie<span className="text-[#FF6B00]">Express</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/orders" icon={<ListOrdered size={20} />} label="Orders" />
          <NavItem to="/earnings" icon={<Wallet size={20} />} label="Earnings" />
          <NavItem to="/profile" icon={<User size={20} />} label="Profile" />
        </nav>

        <div className="pt-6 border-t border-stone-100">
          <button className="flex items-center gap-3 w-full p-3 text-stone-500 hover:text-stone-900 transition-colors">
            <Bell size={20} />
            <span className="font-medium">Notifications</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center text-white font-bold">F</div>
          <span className="font-bold text-lg tracking-tight">Foodie<span className="text-[#FF6B00]">Express</span></span>
        </div>
        <button className="p-2 text-stone-500">
          <Bell size={22} />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around p-2 z-50">
        <MobileNavItem to="/" icon={<LayoutDashboard size={24} />} label="Home" />
        <MobileNavItem to="/orders" icon={<ListOrdered size={24} />} label="Orders" />
        <MobileNavItem to="/earnings" icon={<Wallet size={24} />} label="Earnings" />
        <MobileNavItem to="/profile" icon={<User size={24} />} label="Profile" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
        isActive ? "bg-orange-50 text-[#FF6B00] font-semibold" : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
      )
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const MobileNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all duration-200",
        isActive ? "text-[#FF6B00]" : "text-stone-400"
      )
    }
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </NavLink>
);
