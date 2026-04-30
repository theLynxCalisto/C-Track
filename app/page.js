"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchedule } from '../context/ScheduleContext';

export default function Home() {
  const [step, setStep] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { profile, setProfile } = useSchedule();

  const handleLogin = () => {
    const cleanEmail = emailInput.trim().toLowerCase();
    if (cleanEmail.endsWith('@lsu.edu') || cleanEmail.endsWith('@tigers.lsu.edu')) {
      setError('');
      // Extract username before the @ symbol
      const extractedUsername = cleanEmail.split('@')[0];
      
      // Save it to global state immediately
      setProfile(prev => ({
        ...prev,
        email: cleanEmail,
        username: extractedUsername
      }));
      
      setStep('onboarding');
    } else {
      setError('Authentication failed. Please use a valid @lsu.edu email.');
    }
  };

  const handleOnboarding = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    setProfile(prev => ({
      ...prev,
      catalogYear: formData.get('catalogYear'),
      major: formData.get('major')
    }));
    
    router.push('/dashboard');
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 text-slate-800 font-sans">
        <div className="bg-white w-full max-w-md border border-slate-200 shadow-sm rounded-lg overflow-hidden">
          <div className="bg-[#461D7C] text-white p-6 text-center border-b-4 border-[#FDD023]">
            <h1 className="m-0 text-2xl font-bold tracking-wide">C-Track Login</h1>
          </div>
          <div className="p-8">
            <p className="text-sm mb-6 text-slate-500">Please enter your myLSU credentials.</p>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">myLSU ID (Email)</label>
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#461D7C]" 
                placeholder="mtiger1@lsu.edu" 
              />
              {error && <div className="text-red-600 text-[13px] mt-2 font-bold">{error}</div>}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Password</label>
              <input type="password" className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#461D7C]" placeholder="••••••••" />
            </div>
            <button onClick={handleLogin} className="w-full bg-[#461D7C] hover:bg-[#311459] text-white font-bold py-3 rounded-md transition-colors shadow-sm">
              LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-5 text-slate-800 font-sans">
      <div className="bg-white w-full max-w-md border border-slate-200 shadow-sm rounded-lg overflow-hidden">
        <div className="bg-[#461D7C] text-white p-6 text-center border-b-4 border-[#FDD023]">
          <h1 className="m-0 text-2xl font-bold tracking-wide">Academic Setup</h1>
        </div>
        <form onSubmit={handleOnboarding} className="p-8">
          <p className="text-sm mb-6 text-slate-500">Welcome, <strong>{profile.username}</strong>! Select your program to load your degree requirements.</p>
          
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Catalog Year</label>
            <select name="catalogYear" required className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#461D7C]">
              <option value="" disabled selected>Select your catalog year...</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Engineering Major</label>
            <select name="major" required className="w-full p-3 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#461D7C]">
              <option value="" disabled selected>Select your major...</option>
              <option value="bae">Biological and Agricultural Engineering</option>
              <option value="che">Chemical Engineering</option>
              <option value="ce">Civil Engineering</option>
              <option value="eec">Computer Engineering</option>
              <option value="csc_ccn">Computer Science — Cloud Computing</option>
              <option value="csc_cyb">Computer Science — Cybersecurity</option>
              <option value="csc_dsa">Computer Science — Data Science</option>
              <option value="csc_sd">Computer Science — Second Discipline</option>
              <option value="csc_seg">Computer Science — Software Engineering</option>
              <option value="cm">Construction Management</option>
              <option value="ee">Electrical Engineering</option>
              <option value="eveg">Environmental Engineering</option>
              <option value="ie">Industrial Engineering</option>
              <option value="me">Mechanical Engineering</option>
              <option value="pete">Petroleum Engineering</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-[#461D7C] hover:bg-[#311459] text-white font-bold py-3 rounded-md transition-colors shadow-sm">
            Load Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}