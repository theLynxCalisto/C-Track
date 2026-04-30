C-Track
- The Unified LSU Command Center for Computer Science Students.

About The Project
- Managing a computer science degree often feels like playing a game without a minimap. Students are forced to cross-reference Workday for registration, static PDFs for flowcharts, and external sites for professor reviews. C-Track solves this by unifying the academic journey into a single, real-time environment. It is designed to help students stop managing logistics and focus on their coursework.

Key Features
- Course History & GPA: Automated LSU GPA calculation with an overall degree completion progress bar.
- Course Planner & Live Professor Data: Real-time professor ratings fetched via a custom GraphQL query from RateMyProfessor, utilizing fuzzy-name matching and assigning "Historically Challenging" badges.
- Interactive Flowchart Canvas: A visual degree map where you can draw annotations, stamp completed courses, and seamlessly save state via LocalStorage and the GitHub API.
- Weekly Schedule View: A live outlook of your current semester's registered courses that instantly updates via global state management as you plan.

Built With
- Frontend Framework: Next.js 16 (App Router + Turbopack)
- Styling: Tailwind CSS
- State Management: React Context API
- Data Aggregation: GraphQL
- Cloud Persistence: GitHub API

Getting Started
1. Clone the repo: git clone https://github.com/theLynxCalisto/C-Track
2. Install NPM packages: npm install
3. Run the development server: 'npm run dev' through VS Code
4. Access the project using "localhost:3000" in browser

System Architecture
- C-Track was built with a robust, "No Black Boxes" architecture:
- App & Browser: User interactions trigger global state updates via React Context.
- API Layer: Server Routes securely handle API calls (like pushing binary canvas image data to GitHub) without exposing tokens to the client. A custom GraphQL fetcher programmatically queries external systems to bypass locked REST APIs.
- Persistence Layer: Dual-save architecture using LocalStorage for instant visual feedback and the GitHub API for cloud version control.

Roadmap
- Workday PDF Parser: Auto-import unofficial Workday transcripts directly into the app's JSON schema for zero-manual onboarding.
- Elective Filtering: Degree-specific catalog search for smarter course discovery.
