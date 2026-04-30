import { ScheduleProvider } from '@/context/ScheduleContext'; // Adjust path if your context is elsewhere
import './globals.css';

export const metadata = {
  title: 'C-Track | LSU Command Center',
  description: 'Interactive degree flowchart, schedule planner, and academic transcript tracker for LSU students.',
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning prevents browser extensions (like adblockers) 
    // from crashing the app when they inject code into the HTML tag
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen">
        <ScheduleProvider>
          {children}
        </ScheduleProvider>
      </body>
    </html>
  );
}
