// Edit this file to add or change projects. The page builds itself from it.
//
// category : which filter pill the project belongs to (must match a name in `categories`)
// view     : layout of the detail window
//              "default"  - screenshot, description, how it was built (works for any project)
//              "dataviz"  - chart-led: question, data source, key finding
//              "purposes" - tabs for the different ways to use one app
// status   : "live" shows working buttons; "soon" greys them out until you add links
window.GALLERY = {
  title: "Vibe code library",
  script: "made by talking to Claude",
  intro: "Small apps I built by describing them, then testing and refining until they felt right.",
  owner: "Phuong Le",
  footer: "© 2026 Phuong Le · Every project here was built with Claude",

  categories: [
    { name: "Web app", color: "blue" },
    { name: "Data visualization", color: "pink" }
  ],

  projects: [
    {
      id: "fun-fact-roster",
      category: "Web app",
      view: "default",
      status: "live",
      title: "Fun Fact Roster",
      hook: "Turns something small about you into a short story you'll want to tell.",
      thumb: "/assets/roster.png",
      thumbFit: "bleed",
      thumbAlt: "Fun Fact Roster story screen: a short story about pumpkin spice and a question to ask back",
      hero: "/assets/roster.png",
      heroPortrait: true,
      heroAlt: "Fun Fact Roster story screen: a short story about pumpkin spice and a question to ask back",
      about: "Pick a topic, answer a few tap-friendly questions, and get a 2–3 sentence story in your own words, plus a question to ask the other person. Built for icebreakers, so everyone leaves with one to three facts they're happy to bring up.",
      built: [
        "Designed through a step-by-step Q&A with Claude: a 5W1H-based question flow, with routes for habits, one-off moments, origins and people.",
        "The story is written by Claude Haiku 4.5 through a small Cloudflare Worker that keeps the API key private and caps daily use.",
        "The prompt keeps the story close to what the user said and stops it inventing details; I tested it on many inputs and tightened it."
      ],
      tags: ["Claude API", "Cloudflare Worker", "GitHub Pages"],
      links: { app: "https://workofphuong.github.io/fun-fact-roster/", code: "https://github.com/workofphuong/fun-fact-roster" }
    },

    {
      id: "halloween",
      category: "Data visualization",
      view: "dataviz",
      status: "live",
      openLabel: "Open dashboard",
      title: "Halloween Trick-or-Treat Tracker",
      hook: "18 years of front-door visitor counts, with a candy calculator for next year.",
      thumb: "/assets/halloween.jpg",
      thumbFit: "bleed",
      thumbAlt: "Dashboard with five headline numbers and a bar chart of trick-or-treaters per year, 2008 to 2025",
      question: "How has trick-or-treater turnout changed from 2008 to 2025, and how much candy should I buy next year?",
      source: "Front-door visitor counts logged every half hour from 6:00pm to 8:15pm, 2008–2025.",
      finding: "2011 was the busiest night (869), 2020 the quietest (219), and 2025 reached 738, up 17% on 2024.",
      tags: ["HTML", "CSS", "JavaScript", "SVG charts"],
      links: { app: "/projects/halloween/", code: "https://github.com/workofphuong/workofphuong.github.io/tree/main/projects/halloween" }
    },

    {
      id: "scooby-doo",
      category: "Data visualization",
      view: "dataviz",
      status: "live",
      openLabel: "Open dashboard",
      title: "Scooby-Doo Case Files",
      hook: "603 episodes and movies, 1969–2021: who catches the monster, and how the formula changed.",
      thumb: "/assets/scooby-doo.jpg",
      thumbFit: "bleed",
      thumbAlt: "Scooby-Doo Case Files dashboard header and a table of who catches the monster, by character",
      question: "How has the Scooby-Doo formula changed across 29 series and five decades?",
      source: "603 episodes and movies from 29 series, aired 1969 to 2021; 588 have an IMDb rating.",
      finding: "Real monsters made up 10% of episodes in 1969–79, 44% in 1980–99 and just 4% since 2010. Scooby-Doo Mystery Incorporated has the highest average rating (8.3).",
      tags: ["HTML", "CSS", "JavaScript", "SVG charts"],
      links: { app: "/projects/scooby-doo/", code: "https://github.com/workofphuong/workofphuong.github.io/tree/main/projects/scooby-doo" }
    }
  ]
};
