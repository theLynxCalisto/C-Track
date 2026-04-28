"use client";
import { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import catalogData from '@/data/fall2026_catalog.json';
import profData from '@/data/professor_ratings.json';
import ProfRating from './ProfRating';
import { fetchLiveRMP } from '@/app/actions/rmp';

export default function Catalog() {
  const { schedule, addCourse, dropCourse } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [bestProfs, setBestProfs] = useState({});

  // Fuzzy Name Normalizer for RMP Matching
  const normalizeName = (name) => {
    if (!name) return "";
    const parts = name.toLowerCase().trim().split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  };

  // Mock Workday Sync Function
  const handleSync = async () => {
    setSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    setSyncing(false);
    alert("Workday Fall 2026 Catalog Synced Successfully!");
  };

  // Search Filtering & Course Grouping
  const groupedCourses = catalogData.reduce((acc, course) => {
    const baseCourse = course.id.split(' (')[0];
    const normBase = baseCourse.replace(/\s+/g, '').toLowerCase();
    const normSearch = searchTerm.replace(/\s+/g, '').toLowerCase();

    if (normBase.includes(normSearch) || course.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      if (!acc[baseCourse]) acc[baseCourse] = { name: course.name, sections: [] };
      acc[baseCourse].sections.push(course);
    }
    return acc;
  }, {});

  // Logic to find the highest-rated professor in a group
  const findBestInGroup = async (baseCourse, sections) => {
    const currentNames = sections.map(s => s.instructor);
    const pastNames = profData[baseCourse]?.past_professors?.map(p => p.name) || [];
    
    const seenNorm = new Set();
    const uniqueList = [];
    [...currentNames, ...pastNames].forEach(n => {
      const norm = normalizeName(n);
      if (!seenNorm.has(norm) && n !== "Staff") {
        seenNorm.add(norm);
        uniqueList.push(n);
      }
    });

    const results = await Promise.all(uniqueList.map(name => fetchLiveRMP(name)));
    const valid = results.filter(r => r !== null);
    if (valid.length === 0) return;

    const top = valid.reduce((p, c) => (c.rating > p.rating ? c : p));
    setBestProfs(prev => ({ ...prev, [baseCourse]: top.name }));
  };

  return (
    <div className="mt-4 flex flex-col gap-6">
      {/* Search and Sync Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search e.g. CSC 1350..."
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-[#461D7C] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 bg-white border border-slate-200 px-6 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <span className={syncing ? "animate-spin" : ""}>🔄</span>
          {syncing ? "SYNCING..." : "SYNC"}
        </button>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(groupedCourses).map(([baseCourse, data]) => {
          const isExpanded = expandedGroups[baseCourse];
          const bestName = normalizeName(bestProfs[baseCourse]);

          return (
            <div key={baseCourse} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              <div 
                onClick={() => {
                  if (!isExpanded) findBestInGroup(baseCourse, data.sections);
                  setExpandedGroups(prev => ({ ...prev, [baseCourse]: !isExpanded }));
                }} 
                className="p-5 bg-slate-50/50 cursor-pointer flex justify-between items-center group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#461D7C] font-black tracking-tight">{baseCourse}</span>
                  <span className="text-slate-400 font-bold">|</span>
                  <span className="text-slate-700 font-bold text-sm">{data.name}</span>
                </div>
                <div className="text-slate-300 group-hover:text-[#461D7C] transition-colors">
                  {isExpanded ? '▲' : '▼'}
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 flex flex-col gap-10 border-t border-slate-100">
                  {/* Current Offerings */}
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Available Sections</h5>
                    <div className="grid grid-cols-1 gap-4">
                      {data.sections.map(section => {
                        const isBest = normalizeName(section.instructor) === bestName;
                        const isAdded = schedule.some(c => c.id === section.id);
                        return (
                          <div key={section.id} className={`p-5 border-2 rounded-2xl transition-all ${isBest ? 'border-[#FDD023] bg-yellow-50/30 ring-4 ring-yellow-100/20' : 'border-slate-100 bg-white'}`}>
                            {isBest && (
                              <div className="inline-block text-[9px] font-black text-[#461D7C] bg-[#FDD023] px-2 py-0.5 rounded-full mb-3 uppercase italic">
                                ⭐ Top Career Rating
                              </div>
                            )}
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-black text-slate-800 text-base">{section.instructor}</p>
                                <p className="text-xs text-slate-500 font-bold mt-1">{section.time} • {section.location}</p>
                              </div>
                              <button 
                                onClick={() => isAdded ? dropCourse(section.id) : addCourse(section)} 
                                className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
                                  isAdded ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-[#461D7C] text-white'
                                }`}
                              >
                                {isAdded ? 'Remove' : 'Select Section'}
                              </button>
                            </div>
                            <ProfRating instructorName={section.instructor} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Historical Context */}
                  <div className="pt-8 border-t border-dashed border-slate-200">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Other Faculty History</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profData[baseCourse]?.past_professors?.filter(p => !data.sections.some(s => normalizeName(s.instructor) === normalizeName(p.name))).map(pastProf => (
                        <div key={pastProf.name} className={`p-4 border rounded-xl transition-all ${normalizeName(pastProf.name) === bestName ? 'border-[#FDD023] bg-yellow-50/50' : 'border-slate-100 bg-slate-50/30'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-black text-slate-700">{pastProf.name}</p>
                            {normalizeName(pastProf.name) === bestName && <span className="text-xs">⭐</span>}
                          </div>
                          <ProfRating instructorName={pastProf.name} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}