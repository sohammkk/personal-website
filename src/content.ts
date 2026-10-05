// ============================================================
// EDIT THIS FILE TO CUSTOMIZE ALL WEBSITE CONTENT
// Every visible string lives here, in English (en) and German (de).
// ============================================================

export type Lang = 'en' | 'de'

export const site = {
  name: 'Soham Kumthekar',
  email: 'sohamkumthekarde@gmail.com',
  phone: '+49 176599 69725',
  location: 'Duisburg, Germany',
  // Path to a photo in /public (e.g. '/me.jpg') or a full URL.
  photo: '',
  socials: {
    github: 'https://github.com/sohammkk',
    linkedin: 'https://www.linkedin.com/in/soham-kumthekar-b95aba260/',
  },
  cv: {
    en: '/SohamKumthekar_CV_English.pdf',
    de: 'https://assets.zyrosite.com/YrDW0JpewRCOjxNQ/soham_germancv-dmk8H2X17QeswQby.pdf',
  },
  // Last.fm powers the iPod widget (Apple Music can scrobble to Last.fm).
  lastfm: {
    username: import.meta.env.VITE_LASTFM_USERNAME ?? '',
    apiKey: import.meta.env.VITE_LASTFM_API_KEY ?? '',
  },
  // Twelve Data powers the live stock chart in the side quests.
  twelveData: {
    apiKey: import.meta.env.VITE_TWELVEDATA_API_KEY ?? '',
  },
}

type Localized = Record<Lang, string>

export const ui: Record<string, Localized> = {
  navAbout: { en: 'About', de: 'Über mich' },
  navExperience: { en: 'Experience', de: 'Erfahrung' },
  navEducation: { en: 'Education', de: 'Bildung' },
  navProjects: { en: 'Projects', de: 'Projekte' },
  navSkills: { en: 'Skills', de: 'Fähigkeiten' },
  navContact: { en: 'Contact', de: 'Kontakt' },
  navQuests: { en: 'Side quests', de: 'Nebenquests' },
  navCv: { en: 'CV', de: 'Lebenslauf' },
  navHome: { en: 'Home', de: 'Start' },
  heroHello: { en: "Hello, I'm", de: 'Hallo, ich bin' },
  heroRole1: { en: 'B.Sc. Computer Engineering @ University of Duisburg-Essen', de: 'B.Sc. Computer Engineering @ Universität Duisburg-Essen' },
  heroRole2: { en: 'Working Student in IT Architecture @ Uniper SE', de: 'Werkstudent IT-Architektur @ Uniper SE' },
  heroCta: { en: 'Get in touch', de: 'Kontakt aufnehmen' },
  heroCv: { en: 'View PDF', de: 'PDF herunterladen' },
  aboutTitle: { en: 'About me', de: 'Über mich' },
  aboutText: {
    en: "I'm a computer engineering student at the University of Duisburg-Essen with a passion for cloud infrastructure, web development and scalable architecture. Currently working at Uniper SE in the IT architecture team.",
    de: 'Ich bin Computer-Engineering-Student an der Universität Duisburg-Essen mit einer Leidenschaft für Cloud-Infrastruktur, Webentwicklung und skalierbare Architektur. Derzeit arbeite ich bei Uniper SE im IT-Architektur-Team.',
  },
  experienceTitle: { en: 'Experience', de: 'Erfahrung' },
  educationTitle: { en: 'Education', de: 'Bildung' },
  projectsTitle: { en: 'Projects', de: 'Projekte' },
  repoPrivate: { en: 'Private repo', de: 'Privates Repo' },
  repoSoon: { en: 'Coming soon', de: 'Demnächst' },
  repoView: { en: 'View repo', de: 'Repo ansehen' },
  skillsTitle: { en: 'Skills & Technologies', de: 'Fähigkeiten & Technologien' },
  languagesTitle: { en: 'Languages', de: 'Sprachen' },
  volunteeringTitle: { en: 'Volunteering', de: 'Ehrenamt' },
  certsTitle: { en: 'Certifications', de: 'Zertifikate' },
  cvTitle: { en: 'Curriculum Vitae', de: 'Lebenslauf' },
  cvTagline: {
    en: 'Everything I’ve built, studied and shipped',
    de: 'Alles, was ich gebaut, studiert und ausgeliefert habe',
  },
  cvDownload: { en: 'View PDF', de: 'PDF ansehen' },
  cvCtaTitle: { en: 'Want the full story?', de: 'Die ganze Geschichte?' },
  cvCtaText: {
    en: 'Experience, projects, skills and education',
    de: 'Erfahrung, Projekte, Fähigkeiten und Bildung',
  },
  cvCtaBtn: { en: 'View my CV', de: 'Zum Lebenslauf' },
  contactTitle: { en: "Get in touch!", de: 'Komm in Kontakt!' },

  nowPlaying: { en: 'Now playing', de: 'Läuft gerade' },
  lastPlayed: { en: 'Last played', de: 'Zuletzt gehört' },
  ipodHoverHint: { en: 'hover or click me ♪', de: 'hover oder klick mich ♪' },
  present: { en: 'Present', de: 'Heute' },
  viewCert: { en: 'View certificate', de: 'Zertifikat ansehen' },
  footerRights: { en: 'All rights reserved.', de: 'Alle Rechte vorbehalten.' },
  builtWith: { en: 'Built with React, Tailwind & Framer Motion', de: 'Erstellt mit React, Tailwind & Framer Motion' },
  // Penalty-kick unlock game
  penaltyCmd: { en: '$ ./unlock-portfolio', de: '$ ./portfolio-entsperren' },
  penaltyTitle: { en: 'beat the keeper to enter', de: 'triff, um die Seite zu betreten' },
  penaltyHint: { en: 'click (or tap) anywhere in the goal to shoot', de: 'klicke (oder tippe) irgendwo ins Tor, um zu schießen' },
  penaltySaved: { en: 'saved! try again…', de: 'gehalten! versuch’s nochmal…' },
  penaltyGoal: { en: 'GOAL!', de: 'TOR!' },
  penaltyUnlocking: { en: 'access granted — loading portfolio…', de: 'Zugriff gewährt — Portfolio wird geladen…' },
  penaltySkip: { en: 'skip the shootout →', de: 'Elfmeter überspringen →' },
  penaltyFactLabel: { en: 'did you know?', de: 'wusstest du schon?' },
  // Stock market / side quest interlude
  marketCaptionBolded: { en: 'side quests:', de: 'Nebenquests:' },
  marketCaption1: { en: 'things i like to do off the keyboard', de: 'Lieblingsaktivitäten abseits der Tastatur' },
  marketCaption2: { en: 'here i created three interactive components that reflect some hobbies i pursue: a stock ticker dashboard, a padel rally game and a penalty kick shootout simulation', de: 'Hier habe ich drei interaktive Komponenten erstellt, die einige Hobbys widerspiegeln, denen ich nachgehe: ein Aktien-Ticker-Dashboard, ein Padel-Rallye-Spiel und ein Elfmeter-Schießen Simulation' },

  questChartLoading: { en: 'fetching prices…', de: 'Kurse werden geladen…' },
  questChartNote: { en: 'live market data via twelve data api · times in ET', de: 'Live-Marktdaten über die Twelve-Data-API · Zeiten in ET' },
  questChartOffline: { en: 'api unreachable, showing demo data', de: 'API nicht erreichbar, Demodaten angezeigt' },
  questChartNoKey: {
    en: 'demo data',
    de: 'Demodaten',
  },
  questRallyTitle: { en: 'padel rally', de: 'Padel-Rallye' },
  questRallyHint: { en: 'move the racket and catch every bounce!', de: 'bewege den Schläger und triff jeden Ball!' },
  questRallyServe: { en: 'tap to serve', de: 'tippe zum Aufschlag' },
  questRallyMiss: { en: 'oops!', de: 'oops!' },
  questRallyBest: { en: 'best', de: 'Rekord' },
  questReplayTitle: { en: 'fancy another shot?', de: 'Lust auf noch einen Schuss?' },
  questReplayBtn: { en: 'replay the shootout', de: 'Elfmeter wiederholen' },
}

// Trivia shown on the penalty-kick gate, rotating every few seconds.
export const penaltyFacts: Localized[] = [
  {
    en: 'A penalty kick has an xG (expected goals) of roughly 0.78, which is a ~78% statistical chance of scoring.',
    de: 'Ein Elfmeter hat ein xG (erwartete Tore) von rund 0,78; eine statistische Trefferwahrscheinlichkeit von ca. 78%.',
  },
  {
    en: 'Germany has historically been the most clinical nation in major-tournament shootouts, rarely missing when it matters.',
    de: 'Deutschland war historisch die treffsicherste Nation bei Elfmeterschießen in großen Turnieren.',
  },
  {
    en: 'The "Panenka" (a chipped penalty down the middle) is named after Antonín Panenka, who scored one to win Euro 1976.',
    de: 'Der „Panenka" (ein gechippter Elfmeter in die Mitte) ist nach Antonín Panenka benannt, der damit 1976 die EM gewann.',
  },
  {
    en: 'Goalkeepers dive to a side over 94% of the time, even though staying centered statistically saves more penalties.',
    de: 'Torhüter springen in über 94 % der Fälle zur Seite, obwohl zentrales Stehenbleiben statistisch mehr Elfmeter hält.',
  },
  {
    en: 'England lost their first six major-tournament penalty shootouts before finally winning one at the 2018 World Cup.',
    de: 'England verlor seine ersten sechs Elfmeterschießen bei großen Turnieren, bevor es bei der WM 2018 endlich gewann.',
  },
  {
    en: 'The fastest recorded penalty kicks exceed 130 km/h, faster than most goalkeepers can physically react.',
    de: 'Die schnellsten gemessenen Elfmeter überschreiten 130 km/h, schneller, als die meisten Torhüter reagieren können.',
  },
  {
    en: "Since the 1982 World Cup, roughly 3 out of every 4 penalties taken in shootouts have been scored.",
    de: 'Seit der WM 1982 wurden ungefähr 3 von 4 Elfmetern im Elfmeterschießen verwandelt.',
  },
  {
    en: 'The Netherlands have one of the worst World Cup shootout records of any major footballing nation, despite their talent.',
    de: 'Die Niederlande haben trotz ihres Talents eine der schlechtesten WM-Elfmeterschießen-Bilanzen aller großen Fußballnationen.',
  },
]

export interface ExperienceItem {
  role: Localized
  company: string
  period: Localized
  bullets: Record<Lang, string[]>
}

export const experience: ExperienceItem[] = [
  {
    role: { en: 'Working Student in IT Architecture', de: 'Werkstudent IT-Architektur' },
    company: 'Uniper IT · Düsseldorf',
    period: { en: 'Jun 2025 - Present', de: 'Jun 2025 - Heute' },
    bullets: {
      en: [
        'Architected a Python workflow in GitHub Actions to extract Confluent Kafka API resources across 200+ applications, generating Mermaid.js Markdown files and automating architectural documentation on the GitHub Wiki',
        'Orchestrated an enterprise-wide file share migration of ≈5 TB by provisioning Azure infrastructure via Terraform and automating deployments through CI/CD DevOps pipelines',
        'Developed an AI agent using Microsoft Copilot Studio to dynamically generate Mermaid architecture diagrams and populate documentation from enterprise data, reducing manual effort by 50%',
        'Engineered a Docker-containerized telephone name resolution pipeline using Python and OpenLDAP, configuring custom network routing to synchronize directory data with Fanvil telecom hardware',
        'Built a voice recording archival app storing over 300,000 recordings, by using Azure Function Apps for API data retrieval, optimizing database schemas and enhancing UI/UX with Vue.js and Nuxt UI',
        'Implemented enterprise datasets in Collibra to establish data lineage, metadata management and cataloging for core business assets',
        'Drafted Architecture Outline Documents for multiple core business applications',
        'Developed a Power BI dashboard for IT application assessment logs with visualizations and advanced filtering',
      ],
      de: [
        'Entwicklung eines Python-Workflows in GitHub Actions zur Extraktion von Confluent-Kafka-API-Ressourcen aus über 200 Anwendungen, Generierung von Mermaid.js-Markdown-Dateien und automatisierte Architekturdokumentation im GitHub Wiki',
        'Orchestrierung einer unternehmensweiten Fileshare-Migration von ca. 5 TB durch Bereitstellung von Azure-Infrastruktur mit Terraform und automatisierte Deployments über CI/CD-DevOps-Pipelines',
        'Entwicklung eines KI-Agenten mit Microsoft Copilot Studio zur dynamischen Generierung von Mermaid-Architekturdiagrammen und Dokumentation aus Unternehmensdaten — 50 % weniger manueller Aufwand',
        'Entwicklung einer Docker-containerisierten Telefon-Namensauflösungs-Pipeline mit Python und OpenLDAP, inklusive Netzwerk-Routing zur Synchronisation von Verzeichnisdaten mit Fanvil-Telefonhardware',
        'Entwicklung einer Archivierungs-App für über 300.000 Sprachaufzeichnungen, unter Verwendung von Azure Function Apps für API-Datenabruf, optimierte Datenbankschemata und verbesserte UI/UX mit Vue.js und Nuxt UI',
        'Implementierung von Unternehmensdatensätzen in Collibra für Data Lineage, Metadatenmanagement und Katalogisierung zentraler Business-Assets',
        'Erstellung von Architecture Outline Documents für mehrere Kerngeschäftsanwendungen',
        'Entwicklung eines Power-BI-Dashboards für IT-Anwendungsbewertungen mit Visualisierungen und erweiterten Filtern',
      ],
    },
  },
  {
    role: { en: 'Student Assistant', de: 'Studentische Hilfskraft' },
    company: 'Faculty of Engineering, University of Duisburg-Essen',
    period: { en: 'Jun 2024 - May 2025', de: 'Jun 2024 - Mai 2025' },
    bullets: {
      en: [
        'Developed and maintained a web interface for the university research database',
        'Integrated backend database functionality with front-end user interfaces using PHP and MySQL',
        'Created dynamic web pages and managed content for the university website using the CMS Imperia',
      ],
      de: [
        'Entwicklung und Pflege einer Weboberfläche für die Forschungsdatenbank der Universität',
        'Integration von Backend-Datenbankfunktionalität mit Frontend-Oberflächen mittels PHP und MySQL',
        'Erstellung dynamischer Webseiten und Content-Pflege für die Universitätswebsite mit dem CMS Imperia',
      ],
    },
  },
  {
    role: { en: 'Intern', de: 'Praktikant' },
    company: 'Fachhochschule Aachen · Jülich',
    period: { en: 'Oct 2022 - Nov 2022', de: 'Okt 2022 - Nov 2022' },
    bullets: {
      en: ['Created a full-stack restaurant ordering project using PHP, HTML, CSS, MySQL and Python'],
      de: ['Erstellung eines Full-Stack-Projekts zur Restaurantbestellung mit PHP, HTML, CSS, MySQL und Python'],
    },
  },
]

export const volunteering: ExperienceItem[] = [
  {
    role: { en: 'Vice President & Technical Member', de: 'Vizepräsident & Mitglied des Technikteams' },
    company: 'Student Council ISE, University of Duisburg-Essen',
    period: { en: 'Nov 2024 - Present', de: 'Nov 2024 - Heute' },
    bullets: {
      en: [
        'Helped lead the student council by organizing regular meetings with professors and collaborations with other councils',
        'Planned and organized engineering-focused events and workshops with the technical team',
        'Co-organized hands-on workshops including hackathons, a Robotic Arm Workshop and a 3D Design Workshop',
      ],
      de: [
        'Mitleitung des Fachschaftsrats durch Organisation regelmäßiger Treffen mit Professoren und Kooperationen mit anderen Räten',
        'Planung und Organisation technischer Veranstaltungen und Workshops mit dem Technikteam',
        'Mitorganisation praktischer Workshops, darunter Hackathons, ein Roboterarm-Workshop und ein 3D-Design-Workshop',
      ],
    },
  },
  {
    role: { en: 'International Referent', de: 'Internationaler Referent' },
    company: 'AStA Duisburg-Essen',
    period: { en: 'Nov 2024 - May 2026', de: 'Nov 2024 - Mai 2026' },
    bullets: {
      en: [
        'Planned and organized cultural, social, and informational events to support international students in integrating into German society and university life',
        'Responded to inquiries from international students regarding housing, finances, and bureaucratic procedures via email and in-person support',
      ],
      de: [
        'Planung und Organisation kultureller, sozialer und informativer Veranstaltungen zur Unterstützung internationaler Studierender bei der Integration',
        'Beantwortung von Anfragen internationaler Studierender zu Wohnen, Finanzen und bürokratischen Verfahren per E-Mail und persönlich',
      ],
    },
  },
]

export interface EducationItem {
  school: Localized
  degree: Localized
  period: Localized
  grade: Localized
}

export const education: EducationItem[] = [
  {
    school: { en: 'University of Duisburg-Essen', de: 'Universität Duisburg-Essen' },
    degree: { en: 'B.Sc. Computer Engineering', de: 'B.Sc. Computer Engineering' },
    period: { en: 'Oct 2023 - Oct 2026', de: 'Okt 2023 - Okt 2026' },
    grade: { en: 'Grade (German system): 1.4', de: 'Note (deutsches Notensystem): 1,4' },
  },
  {
    school: { en: 'Freshman Institute, FH Aachen', de: 'Freshman Institute, FH Aachen' },
    degree: { en: 'Studienkolleg', de: 'Studienkolleg' },
    period: { en: 'Oct 2022 - Jun 2023', de: 'Okt 2022 - Jun 2023' },
    grade: { en: 'Grade (German system): 1.4', de: 'Note (deutsches Notensystem): 1,4' },
  },
  {
    school: { en: 'The Emirates National School, Sharjah', de: 'The Emirates National School, Sharjah' },
    degree: { en: 'CBSE Grade 12', de: 'CBSE Klasse 12' },
    period: { en: 'Apr 2021 - Jun 2022', de: 'Apr 2021 - Jun 2022' },
    grade: { en: 'Grade: 96.6%', de: 'Note: 96,6 %' },
  },
]

export interface ProjectItem {
  title: Localized
  description: Localized
  period: Localized
  tags: string[]
  // Path to an image in /public or a full URL.
  // Leave empty to show a placeholder.
  image: string
  // Direct website URL. When present, clicking the project title opens it.
  website?: string
  // GitHub repo URL. Leave empty + set repoStatus to show "private repo" or
  // "coming soon" instead of a link.
  repo: string
  repoStatus: 'private' | 'soon'
}

export const projects: ProjectItem[] = [
  {
    title: { en: 'Zero Trust Security for EV Charging Stations', de: 'Zero-Trust-Sicherheit für E-Ladestationen' },
    description: {
      en: 'A zero-trust security solution for EV charging stations using Random Forest classifiers: significantly reduced compute overhead with pure OpenFlow-based statistics while matching the discriminative power of NFStream.',
      de: 'Eine Zero-Trust-Sicherheitslösung für E-Ladestationen mit Random-Forest-Klassifikatoren: deutlich reduzierter Rechenaufwand durch reine OpenFlow-Statistiken bei vergleichbarer Trennschärfe zu NFStream.',
    },
    period: { en: 'Jun 2026 - Sep 2026', de: 'Jun 2026 - Sep 2026' },
    tags: ['Python', 'ML', 'Security'],
    image: '',
    repo: '',
    repoStatus: 'private',
  },
  {
    title: { en: 'iseportal.com', de: 'iseportal.com' },
    description: {
      en: 'A full-stack web platform serving ≈500 international engineering students at the University of Duisburg-Essen, centralizing academic and relocation resources, managed across the full software development lifecycle.',
      de: 'Eine Full-Stack-Webplattform für ca. 500 internationale Ingenieurstudierende an der Universität Duisburg-Essen, zentralisiert Studien- und Umzugsressourcen, betreut über den gesamten Software-Lebenszyklus.',
    },
    period: { en: 'Jun 2025 - Apr 2026', de: 'Jun 2025 - Apr 2026' },
    tags: ['TypeScript', 'PostgreSQL', 'Next.js'],
    image: '/iseportal.png',
    website: 'https://iseportal.com',
    repo: '',
    repoStatus: 'private',
  },
  {
    title: { en: 'Raytracer', de: 'Raytracer' },
    description: {
      en: 'A raytracer built from scratch in C++ using object-oriented programming principles.',
      de: 'Ein von Grund auf in C++ entwickelter Raytracer nach objektorientierten Prinzipien.',
    },
    period: { en: 'Oct 2023 - Jan 2024', de: 'Okt 2023 - Jan 2024' },
    tags: ['C++', 'OOP', 'Graphics'],
    image: '/raytracer.png',
    repo: 'https://github.com/sohammkk/raytracer_oop',
    repoStatus: 'soon',
  },
  {
    title: { en: 'CNN Digit Recognition', de: 'CNN-Ziffernerkennung' },
    description: {
      en: 'A convolutional neural network built in MATLAB, trained on the MNIST database and optimized to 95.3% accuracy.',
      de: 'Ein in MATLAB entwickeltes Convolutional Neural Network, trainiert mit der MNIST-Datenbank und auf 95,3 % Genauigkeit optimiert.',
    },
    period: { en: 'Apr 2024 - Jun 2024', de: 'Apr 2024 - Jun 2024' },
    tags: ['MATLAB', 'CNN', 'MNIST'],
    image: '/neuralnetwork.png',
    repo: 'https://github.com/sohammkk/CBEM_3NeuralNetworks/tree/main',
    repoStatus: 'soon',
  },
]

export interface SkillItem {
  name: string
  percent: number // 0-100, fills the bar — tweak freely
}

export interface SkillCategory {
  category: Localized
  items: SkillItem[]
}

export const skills: SkillCategory[] = [
  {
    category: { en: 'Languages', de: 'Programmiersprachen' },
    items: [
      { name: 'Python', percent: 90 },
      { name: 'TypeScript', percent: 85 },
      { name: 'SQL', percent: 80 },
      { name: 'C++', percent: 75 },
      { name: 'PHP', percent: 70 },
      { name: 'HCL', percent: 75 },
      { name: 'MATLAB', percent: 60 },
    ],
  },
  {
    category: { en: 'Frameworks & Libraries', de: 'Frameworks & Bibliotheken' },
    items: [
      { name: 'Vue.js', percent: 85 },
      { name: 'Tailwind CSS', percent: 85 },
      { name: 'React', percent: 85 },
      { name: 'Next.js', percent: 80 },
      { name: 'pandas', percent: 80 },
      { name: 'NumPy', percent: 75 },
      { name: 'pytest / unittest', percent: 80 },
      { name: 'scikit-learn', percent: 70 },
    ],
  },
  {
    category: { en: 'DevOps & Infrastructure', de: 'DevOps & Infrastruktur' },
    items: [
      { name: 'Git', percent: 90 },
      { name: 'Docker', percent: 80 },
      { name: 'GitHub Actions', percent: 85 },
      { name: 'Microsoft Azure', percent: 90 },
      { name: 'PostgreSQL', percent: 80 },
      { name: 'Terraform', percent: 85 },
      { name: 'Apache Kafka / Confluent Cloud', percent: 60 },
    ],
  },
  {
    category: { en: 'Cloud & Enterprise Tools', de: 'Cloud- & Enterprise-Tools' },
    items: [
      { name: 'Microsoft Excel', percent: 90 },
      { name: 'Power BI', percent: 90 },
      { name: 'Copilot Studio', percent: 80 },
      { name: 'Power Automate', percent: 70 },
      { name: 'Collibra', percent: 70 },
      { name: 'ServiceNow', percent: 80 },
    ],
  },
]

export const languages: { name: Localized; level: string }[] = [
  { name: { en: 'English', de: 'Englisch' }, level: 'C2' },
  { name: { en: 'German', de: 'Deutsch' }, level: 'C1' },
  { name: { en: 'Hindi', de: 'Hindi' }, level: 'C1' },
]

export const certifications: { title: string; issuer: string; url: string }[] = [
  { title: 'Introduction to Python: Absolute Beginner', issuer: 'Microsoft', url: 'https://courses.edx.org/certificates/e5182683f1ae41f5b571c05e5f5f98da' },
  { title: 'Introduction to Python: Fundamentals', issuer: 'Microsoft', url: 'https://courses.edx.org/certificates/5949090a50184d18a07fbce890ccc2fa' },
  { title: 'Introduction to Cloud Computing', issuer: 'IBM', url: 'https://courses.edx.org/certificates/1f788671a08b4ac7b15891618efe56cd' },
  { title: 'Python for Data Science Project', issuer: 'IBM', url: 'https://courses.edx.org/certificates/d1512a7d8ed847eba4bec9853707966c' },
  { title: 'Docker for Developers', issuer: 'Educative', url: 'https://www.educative.io/verify-certificate/r0w3pLtnWZ5LgVKopIQPVO1NkqLrT6' },
  { title: 'Building Scalable Data Pipelines with Kafka', issuer: 'Educative', url: 'https://www.educative.io/verify-certificate/D0nkzZJVon2cMgM72xRgZAsBopj1kNg89cG' },
]
