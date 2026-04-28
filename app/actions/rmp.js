"use server";

export async function fetchLiveRMP(profName) {
  if (!profName || profName === "Staff" || profName.includes("TBD")) return null;

  const schoolId = "U2Nob29sLTU1MA=="; // LSU
  
  const query = `
    query TeacherSearch($query: TeacherSearchQuery!) {
      newSearch {
        teachers(query: $query) {
          edges {
            node {
              firstName
              lastName
              avgRating
              avgDifficulty
              wouldTakeAgainPercent
              numRatings
              teacherRatingTags { tagName }
              ratings(first: 1) {
                edges { node { comment } }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://www.ratemyprofessors.com/graphql", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": "Basic dGVzdDp0ZXN0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({ 
        query, 
        variables: { query: { text: profName, schoolID: schoolId } } 
      }),
      cache: 'no-store'
    });

    const json = await response.json();
    let teachers = json.data?.newSearch?.teachers?.edges;

    // Fallback: search by last name if full name fails
    if (!teachers || teachers.length === 0) {
      const lastName = profName.split(' ').pop();
      const fallbackRes = await fetch("https://www.ratemyprofessors.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Basic dGVzdDp0ZXN0" },
        body: JSON.stringify({ query, variables: { query: { text: lastName, schoolID: schoolId } } }),
      });
      const fallbackJson = await fallbackRes.json();
      teachers = fallbackJson.data?.newSearch?.teachers?.edges;
    }

    if (!teachers || teachers.length === 0) return null;

    const prof = teachers[0].node;
    return {
      name: `${prof.firstName} ${prof.lastName}`,
      rating: prof.avgRating || 0,
      difficulty: prof.avgDifficulty || 0,
      takeAgain: Math.round(prof.wouldTakeAgainPercent) || 0,
      numRatings: prof.numRatings || 0,
      tags: prof.teacherRatingTags?.map(t => t.tagName).slice(0, 2) || [],
      topReview: prof.ratings.edges[0]?.node?.comment || null
    };
  } catch (e) {
    return null;
  }
}