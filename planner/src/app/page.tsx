import Image from "next/image";
import Link from "next/link";
import { CalendarRange, CheckCheck, PlusCircle, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-6 pt-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">MatchMyPlan</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Plan your day, achieve your goals</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-24">
        {/* Hero Section */}
        <div className="max-w-md mx-auto mb-12 text-center">
          <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
            
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
            Start Planning Today
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Organize tasks, track deadlines, and boost your productivity with MatchMyPlan.
          </p>
     
        </div>

      
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} MatchMyPlan • Your Productivity Companion</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}
