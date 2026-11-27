// All copy and links on the site. Components get this data as props and
// contain no text of their own.
//
// Experience and project copy comes from the CV (public/cv.pdf), and the
// robot controller's from Ian.

export type LayerId = 'surface' | 'underground' | 'caverns' | 'deep'
export type IconName = 'github' | 'linkedin' | 'email' | 'cv'

export interface LinkItem {
  label: string
  href: string
  icon: IconName
  /** Set to download the link instead of opening it; the value is the saved file name. */
  download?: string
}

export interface DepthLayer {
  id: LayerId
  name: string
  sub: string
  /** Game-style depth text shown at the top of the meter. Decorative. */
  readout: string
}

export interface MonthDate {
  label: string
  /** Machine-readable value for <time datetime>, e.g. "2026-09". */
  datetime: string
}

export interface Experience {
  role: string
  org: string
  start: MonthDate
  /** null while the role is ongoing */
  end: MonthDate | null
  bullets: string[]
}

export interface Project {
  /** Used for element ids, e.g. "loot-valstats". */
  slug: string
  name: string
  summary: string
  tags: string[]
  bullets: string[]
  /** Short label shown on the closed chest, e.g. "Coursework". */
  badge?: string
  /** Left out when the code can't be public. */
  repoUrl?: string
  demoUrl?: string
}

const email = 'ian.gitau@warwick.ac.uk'

/** The name the CV is saved under when someone downloads it. */
const cvFileName = 'Ian Gitau CV.pdf'

const urls = {
  github: 'https://github.com/ixng',
  linkedin: 'https://www.linkedin.com/in/ian-gitau-703799284',
  cv: '/cv.pdf',
  email: `mailto:${email}`,
}

export const site = {
  skipLink: 'Skip to content',
}

export const depthMeter = {
  label: 'Sections',
  layers: [
    { id: 'surface', name: 'Surface', sub: 'Intro', readout: 'Surface' },
    { id: 'underground', name: 'Underground', sub: 'Experience', readout: "150' Underground" },
    { id: 'caverns', name: 'Caverns', sub: 'Projects', readout: "420' Caverns" },
    { id: 'deep', name: 'Deep caverns', sub: 'Contact', readout: "780' Deep caverns" },
  ] satisfies DepthLayer[],
}

export const intro = {
  name: 'Ian Gitau',
  tagline: 'I like learning new things.',
  /** Shown in a panel under the link buttons. */
  overview: {
    title: 'Overview',
    paragraphs: [
      'I am a second-year undergraduate Computer Systems Engineering student at the University of Warwick. I work on backend and systems engineering: data pipelines, APIs, and the testing and automation that keep them reliable.',
      'I worked as a backend software engineering intern at Winpact, building Django REST endpoints on PostgreSQL and writing 85 automated tests that raised coverage from 0% to 50%. I now lead the Python course at Warwick Code Society, where I write and teach weekly sessions, from the basics through to building apps on real web APIs.',
      "Alongside my degree I build tools from first principles, most of all Valstats, a multi-account game stats platform with a rate-limited Python ingestion pipeline, CI testing, and a live API on Cloudflare Workers. My other projects include a natural-language interpreter in Haskell, a Dijkstra-based journey planner for Manchester Metrolink, and a maze-solving robot controller built on Trémaux's algorithm.",
    ],
  },
  /** What Ian is working on next, in its own panel under the overview. */
  workingOn: {
    title: 'Working on',
    text: "Next, I'm planning a smurf detector for Valstats: a system that flags accounts whose performance suggests a much stronger player on a lower-ranked account. There's no labelled data saying who is a smurf, so I'm planning it as an anomaly detection problem. I'll compare each player's stats against others at the same rank, look at signals like how quickly an account climbs, and validate the results by checking whether flagged accounts go on to rank up faster. I'll only publish aggregate or anonymised results, since a false flag would unfairly label a real player.",
  },
  /** Hobbies, in a third panel. `highlight` is shown in gold between `before` and `after`. */
  outsideCoding: {
    title: 'Outside of Coding',
    before: "I'm a competitive gamer currently ranked in the ",
    highlight: 'top 0.5%',
    after:
      ' of Valorant players, which is also what got me building Valstats. Away from the screen, I play table tennis and badminton, and I enjoy cooking.',
  },
  links: [
    { label: 'GitHub', href: urls.github, icon: 'github' },
    { label: 'Download CV', href: urls.cv, icon: 'cv', download: cvFileName },
    { label: 'Email', href: urls.email, icon: 'email' },
  ] satisfies LinkItem[],
}

export const experience = {
  eyebrow: 'Underground',
  title: 'Experience',
  dateSeparator: 'to',
  present: 'present',
  entries: [
    {
      role: 'Python Course Leader',
      org: 'Warwick Code Society',
      start: { label: 'Sep 2026', datetime: '2026-09' },
      end: null,
      bullets: [
        'Selected to write and present weekly Python sessions in Google Colab for members at every level.',
        'Taught members to use web APIs in Python, then led a hands-on session building a CLI weather app.',
        'Run Code Nights, mentoring members on their own projects, and help deliver LeetCode workshops.',
      ],
    },
    {
      role: 'Backend Software Engineer Intern',
      org: 'Winpact · Remote, UK',
      start: { label: 'Nov 2024', datetime: '2024-11' },
      end: { label: 'Jan 2025', datetime: '2025-01' },
      bullets: [
        'Built Python and Django REST API endpoints for habit-tracking features, backed by a PostgreSQL schema.',
        'Raised test coverage from 0% to 50% with 85 automated Behave-Django scenarios on date and streak edge cases.',
        'Owned features from requirements to merged Git pull requests, acting on code review feedback from my mentor.',
      ],
    },
  ] satisfies Experience[],
}

export const projects = {
  eyebrow: 'Caverns',
  title: 'Projects',
  hint: 'Hover, tap or tab to a chest to open it.',
  tagsLabel: 'Tech used',
  repoLabel: 'GitHub repo',
  demoLabel: 'Live demo',
  items: [
    {
      slug: 'valstats',
      name: 'valstats',
      summary: 'Collects game stats across several accounts behind a live REST API.',
      tags: ['Python', 'TypeScript', 'SQL', 'Cloudflare Workers'],
      bullets: [
        'Built a closed-loop rate limiter driven by API quota headers, with typed retryable and permanent errors.',
        'Cut runs from 10 minutes to 5 seconds with idempotent ingestion, and serve the API on Cloudflare Workers.',
        'Automated lint, format and tests with pytest and GitHub Actions CI, which caught two unhandled error paths.',
      ],
      repoUrl: 'https://github.com/ixng/valorant-stats-aggregator',
      demoUrl: 'https://valstats-api.ixng.workers.dev/',
    },
    {
      slug: 'metrolink',
      name: 'Metrolink journey planner',
      summary: "Plans the fastest or fewest-changes route across Manchester's tram network.",
      tags: ['Java', 'Graph algorithms'],
      bullets: [
        "Implemented Dijkstra's algorithm over a 92-station, 8-line weighted graph parsed from CSV timetable data.",
        'Supported shortest-time and fewest-changes routing by modelling line changes as weighted edge penalties.',
        'Modelled the network with adjacency lists and hash maps in object-oriented Java, keeping queries under 1ms.',
      ],
      repoUrl: 'https://github.com/ixng/Manchester-Metrolink-Journey-Planner',
    },
    {
      slug: 'robot',
      name: 'Maze-solving robot controller',
      summary: 'Java controllers that guide a robot out of mazes, loops included.',
      tags: ['Java'],
      bullets: [
        'Built four Java maze-solving controllers, progressing from depth-first backtracking to stack-based and Trémaux exploration.',
        "Applied Trémaux's algorithm with per-junction direction marks to handle loops that simple backtracking cannot escape.",
        'Recorded junction history on the first run and replayed it on later runs, skipping branches already found to be dead ends.',
      ],
      badge: 'Coursework',
      // No repo: coursework solutions can't be published.
    },
    {
      slug: 'precedent',
      name: 'Precedent',
      summary: 'Hackathon finalist: an AI agent that applies documented incident fixes.',
      tags: ['Python', 'FastAPI', 'SQLite'],
      bullets: [
        'Helped build a permission-gated AI agent in a team of 4, applying documented fixes with automatic rollback.',
        'Owned the memory layer over a 141,000-event dataset, with fail-closed access control and a hash-chained audit trail.',
        'Analysed 24,918 real incidents (94% repeats), cutting median resolution from 18 hours to about 15 seconds.',
      ],
      repoUrl: 'https://github.com/ixng/AI-Agent-Hackathon',
    },
    {
      slug: 'lambdagpt',
      name: 'λGPT',
      summary: 'A Haskell interpreter that answers questions asked in plain English.',
      tags: ['Haskell'],
      bullets: [
        'Built an interpreter in Haskell that parses and answers natural-language questions with parser combinators.',
        'Refactored to separate parsing from evaluation, so back-references like "add five to that" resolve first.',
        'Learned Haskell from scratch, traced a design flaw to its root cause and rebuilt the pipeline.',
      ],
      repoUrl: 'https://github.com/ixng/Haskell-Natural-Language-REPL',
    },
  ] satisfies Project[],
}

export const contact = {
  eyebrow: 'Deep caverns',
  title: 'Contact',
  lead: "I'm looking for a software engineering internship for summer 2027. Get in touch.",
  email: {
    label: 'Email',
    address: email,
    copy: 'Copy',
    copied: 'Copied',
    copiedStatus: 'Email address copied',
  },
  links: [
    { label: 'LinkedIn', href: urls.linkedin, icon: 'linkedin' },
    { label: 'GitHub', href: urls.github, icon: 'github' },
    { label: 'Download CV', href: urls.cv, icon: 'cv', download: cvFileName },
  ] satisfies LinkItem[],
}
