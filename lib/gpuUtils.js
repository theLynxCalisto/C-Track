export const gradePoints = {
  "A+": 4.3, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0
};

export function calculateGPA(history) {
  if (!history || history.length === 0) return "0.000";
  
  let totalPoints = 0;
  let totalCredits = 0;

  history.forEach(course => {
    // Standardize: extract letter grade from strings like "B+ (HNR)"
    const baseGrade = course.grade.split(' ')[0];
    const points = gradePoints[baseGrade];
    
    if (points !== undefined) {
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    }
  });

  return totalCredits === 0 ? "0.000" : (totalPoints / totalCredits).toFixed(3);
}
