"use client";
import { useSchedule } from '../context/ScheduleContext';

export default function Profile() {
  const { profile, setProfile } = useSchedule();

  const availableTags = [
    "Gaming", "Cybersecurity", "Data Science", "Web Development", 
    "AI/Machine Learning", "Mobile App Dev", "Cloud Computing",
    "Robotics", "Startups", "Finance", "Sports & Fitness"
  ];

  // Handle standard text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle clicking the interest tags
  const toggleTag = (tag) => {
    setProfile(prev => {
      const isSelected = prev.interests.includes(tag);
      const newInterests = isSelected 
        ? prev.interests.filter(t => t !== tag)
        : [...prev.interests, tag];
      return { ...prev, interests: newInterests };
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      
      {/* Header / Avatar */}
      <div className="flex items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="w-20 h-20 bg-[#461D7C] text-[#FDD023] rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
          {profile.username ? profile.username.charAt(0).toUpperCase() : 'S'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {profile.username} {profile.lastName}
          </h2>
          <p className="text-slate-500 font-medium">{profile.email || "student@lsu.edu"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-[#461D7C] mb-4 border-b pb-2">Academic Profile</h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Concentration</label>
              <select name="major" value={profile.major} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#461D7C] outline-none">
                <option value="csc_seg">Software Engineering</option>
                <option value="csc_cyb">Cybersecurity</option>
                <option value="csc_dsa">Data Science & Analytics</option>
                <option value="csc_ccn">Cloud Computing & Networking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Catalog Year</label>
              <select name="catalogYear" value={profile.catalogYear} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#461D7C] outline-none">
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Grad Month</label>
                <select name="gradMonth" value={profile.gradMonth} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#461D7C] outline-none">
                  <option value="May">May</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Grad Year</label>
                <select name="gradYear" value={profile.gradYear} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-[#461D7C] outline-none">
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Interests & Tags */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-[#461D7C] mb-4 border-b pb-2">Interests & Tags</h3>
          <p className="text-sm text-slate-500 mb-4">Select tags to personalize your C-Track experience.</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const isSelected = profile.interests.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
                    isSelected 
                      ? 'bg-[#461D7C] text-white border-[#461D7C]' 
                      : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Save Indicator */}
      <div className="text-right text-sm text-green-600 font-bold">
        ✓ Auto-saved to local profile
      </div>
    </div>
  );
}