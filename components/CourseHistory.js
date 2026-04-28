"use client";
import historyData from '@/data/course_history.json';
import { calculateGPA } from '@/lib/gpaUtils';

export default function CourseHistory() {
  const history = Array.isArray(historyData) ? historyData : [];
  
  // --- STATS CALCULATION ---
  const cumulativeGPA = calculateGPA(history);
  
  const flowchartRequirements = [
    "CSC 1350", "MATH 1550", "ENGL 1001", "ASTR 1101",
    "CSC 1351", "CSC 2259", "MATH 1552", "ASTR 1102",
    "CSC 3102", "CSC 2262", "CSC 3380", "EE 2720",
    "CSC 4103", "CSC 4330", "CSC 4243", "CSC 4999"
  ];

  const completedIds = history.map(c => c.id);
  const matchedRequirements = flowchartRequirements.filter(req => completedIds.includes(req));
  const percentCompleted = Math.round((matchedRequirements.length / flowchartRequirements.length) * 100);

  // --- SEMESTER GROUPING ---
  const semesters = history.reduce((acc, course) => {
    if (!acc[course.semester]) acc[course.semester] = [];
    acc[course.semester].push(course);
    return acc;
  }, {});

  const sortedSemesters = Object.entries(semesters).sort((a, b) => {
    const parseSem = (str) => {
      const parts = str.split(' ');
      const year = parseInt(parts[2]);
      const seasonValue = parts[0] === 'Fall' ? 2 : 1;
      return (year * 10) + seasonValue;
    };
    return parseSem(b[0]) - parseSem(a[0]);
  });

  return (
    <div className="space-y-10 pb-20">
      {/* SUMMARY HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#461D7C] p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="z-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">LSU Cumulative GPA</h4>
            <p className="text-6xl font-black mt-2 italic tracking-tighter">{cumulativeGPA}</p>
          </div>
          <div className="z-10 mt-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FDD023] rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FDD023]">Good Standing</span>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white/5 text-9xl font-black rotate-12 select-none">LSU</div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flowchart Completion</h4>
            <div className="flex items-end gap-2 mt-2">
              <p className="text-5xl font-black text-slate-800 tracking-tighter">{percentCompleted}%</p>
              <p className="text-slate-400 font-bold mb-1 text-sm">of degree core</p>
            </div>
          </div>
          <div className="mt-6 w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#FDD023] transition-all duration-1000 ease-out" 
              style={{ width: `${percentCompleted}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* SEMESTER TABLE LIST */}
      <div className="space-y-12">
        {sortedSemesters.map(([semester, courses]) => (
          <div key={semester}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em]">{semester}</h3>
              <div className="h-px flex-1 bg-slate-200"></div>
              <div className="px-4 py-1 bg-[#461D7C] text-[#FDD023] rounded-full text-[10px] font-black uppercase">
                GPA: {calculateGPA(courses)}
              </div>
            </div>
            
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-50">
                  {courses.map((course, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-black text-slate-800 text-sm">{course.id}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{course.name}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg font-black text-xs text-slate-600">
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}