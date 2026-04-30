"use client";
import { createContext, useState, useContext, useEffect } from 'react';

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [schedule, setSchedule] = useState([]);
  
  // 1. The internal React state
  const [profileState, setProfileState] = useState({
      username: '',
      email: '',
      major: '',
      catalogYear: '', 
      gradMonth: 'May',
      gradYear: '2028',
      interests: ['Gaming', 'Software Development']
  });

  // 2. Load data ONCE when the app starts
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('ctrack_user_profile');
      if (savedProfile) {
        setProfileState(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  }, []);

  // 3. The Interceptor: Updates state AND saves to local storage instantly
  const setProfile = (newProfileData) => {
    setProfileState(prev => {
      // Check if the component is passing a function (like prev => ...) or a direct object
      const updatedProfile = typeof newProfileData === 'function' ? newProfileData(prev) : newProfileData;
      
      // Forcefully save it to the hard drive immediately
      localStorage.setItem('ctrack_user_profile', JSON.stringify(updatedProfile));
      
      return updatedProfile;
    });
  };

  const addCourse = (course) => {
    if (schedule.some(c => c.id === course.id)) {
      alert("Course already added!");
      return;
    }
    setSchedule([...schedule, course]);
  };

  const dropCourse = (courseId) => {
    setSchedule(schedule.filter(c => c.id !== courseId));
  };

  return (
    // Notice we pass our custom `setProfile` interceptor down to the rest of the app
    <ScheduleContext.Provider value={{ schedule, addCourse, dropCourse, profile: profileState, setProfile }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);