"use client";
import { useSchedule } from '../context/ScheduleContext';

export default function WeeklySchedule() {
  const { schedule, dropCourse } = useSchedule();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const startHour = 5; // 5:00 AM
  const endHour = 21; // 9:00 PM
  const totalMinutes = (endHour - startHour) * 60;

  // --- THE PARSER: Converts "Mon Wed | 11:30 AM - 12:20 PM" to numbers ---
  const parseTime = (timeString) => {
    if (timeString.includes("Online") || timeString.includes("TBD")) return null;
    
    try {
      const [daysPart, timePart] = timeString.split(' | ');
      if (!timePart) return null;

      const days = daysOfWeek.filter(day => daysPart.includes(day));
      const [startStr, endStr] = timePart.split(' - ');

      const parseHourMin = (t) => {
        const [time, ampm] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return h * 60 + m; // Total minutes since midnight
      };

      return {
        days,
        startMins: parseHourMin(startStr),
        endMins: parseHourMin(endStr)
      };
    } catch (e) {
      console.error("Failed to parse time:", timeString);
      return null;
    }
  };

  // Separate grid classes from online classes
  const gridClasses = [];
  const onlineClasses = [];

  schedule.forEach(course => {
    const parsed = parseTime(course.time);
    if (parsed) {
      parsed.days.forEach(day => {
        gridClasses.push({ ...course, day, ...parsed });
      });
    } else {
      onlineClasses.push(course);
    }
  });

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Empty State */}
      {schedule.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white p-12 border border-slate-200 rounded-xl shadow-sm text-slate-500 h-64">
          <span className="text-4xl mb-4">🗓️</span>
          <p className="font-bold">Your schedule is empty</p>
          <p className="text-sm">Go to the Course Planner tab to add classes.</p>
        </div>
      )}

      {/* The Grid */}
      {schedule.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Day Headers */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <div className="w-16 border-r border-slate-200 flex-shrink-0"></div> {/* Time axis spacer */}
            {daysOfWeek.map(day => (
              <div key={day} className="flex-1 text-center py-3 font-bold text-[#461D7C] border-r border-slate-200 last:border-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="flex relative overflow-y-auto" style={{ minHeight: '600px' }}>
            
            {/* Time Axis (Y-Axis) */}
            <div className="w-16 border-r border-slate-200 flex-shrink-0 relative bg-white">
              {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
                const currentHour = startHour + i;
                const displayHour = currentHour > 12 ? currentHour - 12 : currentHour;
                const ampm = currentHour >= 12 ? 'PM' : 'AM';
                return (
                  <div key={i} className="absolute w-full text-right pr-2 text-xs text-slate-400 font-medium -mt-2" style={{ top: `${(i * 60 / totalMinutes) * 100}%` }}>
                    {displayHour} {ampm}
                  </div>
                );
              })}
            </div>

            {/* Day Columns */}
            {daysOfWeek.map(day => (
              <div key={day} className="flex-1 relative border-r border-slate-100 last:border-0 bg-white min-h-[600px]">
                
                {/* Horizontal Grid Lines */}
                {Array.from({ length: endHour - startHour }).map((_, i) => (
                  <div key={i} className="absolute w-full border-b border-slate-100" style={{ top: `${(i * 60 / totalMinutes) * 100}%`, height: `${(60 / totalMinutes) * 100}%` }}></div>
                ))}

                {/* The Course Blocks */}
                {gridClasses.filter(c => c.day === day).map((course, idx) => {
                  const topPercent = ((course.startMins - (startHour * 60)) / totalMinutes) * 100;
                  const heightPercent = ((course.endMins - course.startMins) / totalMinutes) * 100;

                  return (
                    <div 
                      key={`${course.id}-${idx}`}
                      className="absolute left-1 right-1 bg-[#461D7C] bg-opacity-90 border-l-4 border-[#FDD023] text-white p-2 rounded-md shadow-sm overflow-hidden text-xs hover:bg-[#311459] transition-colors group cursor-pointer"
                      style={{ 
                        top: `${topPercent}%`, 
                        height: `${heightPercent}%`,
                        zIndex: 10
                      }}
                    >
                      <div className="font-bold truncate">{course.id.split(' ')[0]} {course.id.split(' ')[1]}</div>
                      <div className="opacity-80 truncate">{course.location}</div>
                      
                      {/* Hover Drop Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); dropCourse(course.id); }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded p-1"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Online / TBA Classes */}
      {onlineClasses.length > 0 && (
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          <h3 className="font-bold text-[#461D7C] border-b pb-2 mb-3">Online / TBA Classes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onlineClasses.map(course => (
              <div key={course.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-bold text-sm">{course.id}</div>
                  <div className="text-xs text-slate-500">{course.name}</div>
                </div>
                <button onClick={() => dropCourse(course.id)} className="text-xs text-red-600 font-bold hover:underline">Drop</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}