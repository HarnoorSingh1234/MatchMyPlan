"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, CheckSquare, PlusCircle, Settings, Home } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();
  
  // Only show on mobile devices
  if (typeof window !== 'undefined' && window.innerWidth > 768) {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2 z-40 md:hidden">
      <NavItem href="/" icon={<Home size={24} />} label="Home" isActive={pathname === '/'} />
      <NavItem href="/tasks" icon={<CheckSquare size={24} />} label="Tasks" isActive={pathname === '/tasks'} />
      <NavItem href="/new-task" icon={<PlusCircle size={32} />} label="New" isActive={pathname === '/new-task'} isPrimary />
      <NavItem href="/calendar" icon={<Calendar size={24} />} label="Calendar" isActive={pathname === '/calendar'} />
      <NavItem href="/settings" icon={<Settings size={24} />} label="Settings" isActive={pathname === '/settings'} />
    </nav>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isPrimary?: boolean;
}

function NavItem({ href, icon, label, isActive, isPrimary }: NavItemProps) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center ${isPrimary ? '-mt-6' : ''}`}
    >
      <div 
        className={`
          ${isPrimary ? 'bg-blue-600 text-white p-3 rounded-full shadow-lg' : ''} 
          ${isActive && !isPrimary ? 'text-blue-600' : 'text-gray-500'}
        `}
      >
        {icon}
      </div>
      <span 
        className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
      >
        {label}
      </span>
    </Link>
  );
}