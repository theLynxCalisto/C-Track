"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSchedule } from '../../context/ScheduleContext';
import Catalog from '../../components/Catalog';
import Profile from '../../components/Profile';
import FlowchartCanvas from '../../components/FlowchartCanvas';
import WeeklySchedule from '../../components/WeeklySchedule';
import CourseHistory from '../../components/CourseHistory';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('planner');
  const [isMounted, setIsMounted] = useState(false);
  const { profile } = useSchedule();
  const router = useRouter();

  // Ensures animations only run after the component mounts on the client
  useEffect(() => setIsMounted(true), []);

  const tabs = [
    { id: 'schedule', label: 'Weekly Schedule', icon: '📅' },
    { id: 'planner', label: 'Course Planner', icon: '📚' },
    { id: 'history', label: 'Course History', icon: '⏱️' },
    { id: 'flowchart', label: 'Degree Requirements', icon: '🗺️' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      
      {/* Refined Navbar with LSU Purple */}
      <nav className="bg-[#461D7C] px-8 h-16 flex justify-between items-center text-white shadow-md z-10 relative">
        <div className="text-xl font-bold tracking-wide flex items-center gap-2">
          <span className="text-[#FDD023]">⚜</span> LSU CourseTracker
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80 hidden sm:block">
            Welcome, {profile.username || profile.email?.split('@')[0] || 'Student'}
          </span>
          <button 
            onClick={() => router.push('/')}
            className="font-semibold text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors duration-200"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Fluid Tab Menu with LSU Gold Accents */}
      <div className="bg-white border-b border-slate-200 px-8 flex gap-2 shadow-sm relative z-0 overflow-x-auto">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-4 px-4 text-sm font-semibold transition-all duration-300 ease-in-out whitespace-nowrap outline-none ${
              activeTab === tab.id 
                ? 'text-[#461D7C]' 
                : 'text-slate-500 hover:text-[#461D7C] hover:bg-slate-50 rounded-t-md'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            
            {/* Animated Gold Bottom Border */}
            <span 
              className={`absolute bottom-0 left-0 w-full h-1 rounded-t-md bg-[#FDD023] transition-transform duration-300 origin-bottom ${
                activeTab === tab.id ? 'scale-y-100' : 'scale-y-0'
              }`} 
            />
          </button>
        ))}
      </div>

      {/* Animated Content Area */}
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-grow flex flex-col">
        {isMounted && (
          <div 
            key={activeTab} // Forces re-mount to trigger the animation on tab switch
            className="flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards"
          >
            {/* 1. WEEKLY SCHEDULE VIEW */}
            {activeTab === 'schedule' && (
              <div className="h-full">
                <h2 className="text-2xl font-bold text-[#461D7C] mb-4">Weekly Schedule</h2>
                <WeeklySchedule />
              </div>
            )}
            
            {/* 2. COURSE PLANNER VIEW */}
            {activeTab === 'planner' && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full">
                <h2 className="text-2xl font-bold text-[#461D7C] mb-2">Course Planner</h2>
                <p className="text-slate-500 mb-4">Search and add courses to your schedule.</p>
                <Catalog />
              </div>
            )}
            
            {/* 3. COURSE HISTORY VIEW (Now Linked) */}
            {activeTab === 'history' && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#461D7C] mb-1">Course History</h2>
                  <p className="text-slate-500">Unofficial Academic Record</p>
                </div>
                <CourseHistory />
              </div>
            )}
            
            {/* 4. ANNOTATE FLOWCHART VIEW */}
            {activeTab === 'flowchart' && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full">
                <h2 className="text-2xl font-bold text-[#461D7C] mb-2">Degree Flowchart</h2>
                <p className="text-slate-500 mb-4">Annotate and track your degree progress.</p>
                <FlowchartCanvas />
              </div>
            )}
            
            {/* 5. MY PROFILE VIEW */}
            {activeTab === 'profile' && (
              <div className="h-full">
                <Profile />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}