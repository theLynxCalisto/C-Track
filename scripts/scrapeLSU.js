const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeDept(deptCode) {
  console.log(`🚀 Scraping ${deptCode} for Fall 2026...`);
  
  // Note: The URL structure for the public portal usually requires campus and term IDs
  // This is a representative URL for the LSU Baton Rouge Public Offerings
  const url = `https://courseofferings.lsu.edu/api/courses?campus=1&dept=${deptCode}&term=2026-10`;

  try {
    const { data } = await axios.get(url);
    
    // Most modern portals return JSON directly. If it's HTML, we use Cheerio:
    // const $ = cheerio.load(data);
    
    const processedCourses = data.map(course => ({
      id: `${course.subjectCode} ${course.courseNumber} (${course.sectionNumber})`,
      name: course.courseTitle,
      instructor: course.instructorName || "Staff",
      time: `${course.daysOfWeek} ${course.startTime}-${course.endTime}`,
      location: course.location || "TBA",
      credits: course.creditHours
    }));

    return processedCourses;
  } catch (error) {
    console.error(`❌ Error scraping ${deptCode}:`, error.message);
    return [];
  }
}

async function run() {
  const depts = ['CSC', 'MATH', 'ENGL'];
  let fullCatalog = [];

  for (const dept of depts) {
    const courses = await scrapeDept(dept);
    fullCatalog = [...fullCatalog, ...courses];
  }

  fs.writeFileSync('./data/fall2026_catalog.json', JSON.stringify(fullCatalog, null, 2));
  console.log('✅ Catalog Updated: data/fall2026_catalog.json');
}

run();