export interface Book {
  title: string;
  author: string;
  cover: string;
  spineColor: string;
  rating?: number;
  reflections?: string;
}

export interface Podcast {
  title: string;
  cover: string;
  url: string;
  summary: string;
  recommendations: string;
  episodes: string;
  rating: string;
  isTopPodcast?: boolean; // For main record player podcasts vs guest-dependent ones
}

export interface SimplePodcast {
  name: string;
  description: string;
}

export interface StandalonePodcast {
  name: string;
  url: string;
}

export interface Link {
  name: string;
  url: string;
  category: string;
  reflections?: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  url?: string;
  tags?: string[];
  reflections?: string;
}

export const books: Book[] = [
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.png',
    spineColor: '#333331',
    rating: 9,
    reflections:
      'A groundbreaking work that changed how we think about evolution and genetics. The gene-centered view of evolution is both elegant and profound.',
  },
  {
    title: 'The Selfish Gene: A New Perspective on Evolution',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#8B4513',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#2C5F2D',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#1E3A5F',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#7C2D12',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#4A5568',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#8B4513',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#2C5F2D',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#1E3A5F',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#7C2D12',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#4A5568',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#8B4513',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#2C5F2D',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#1E3A5F',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#7C2D12',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#4A5568',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#8B4513',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#2C5F2D',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#1E3A5F',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#7C2D12',
  },
];

export const podcasts: Podcast[] = [
  {
    title: 'Fall Of Civilizations with Paul Cooper',
    cover: '/podcasts/FoC.jpg',
    url: 'https://open.spotify.com/show/44DE64rRpX1cFIQUlqQtvi?si=18c59f29bae248cb',
    summary:
      "Incredibly well produced. If Christopher Nolan made podcasts about history.\nVoice actors that quote scripts in the native language, sound affects, compelling narration.\nListening to this podcast I've played god sculpting civilizations.\nI've lived in different empires throughout history.\nI've brought civilizations to the tipping point. And nudged the domino.",
    recommendations: "You can't go wrong. Start with Carthage (episode 17).",
    episodes: 'All episodes',
    rating: '5/5',
    isTopPodcast: true,
  },
  {
    title: 'How to Take Over The World',
    cover: '/podcasts/httotw.jpeg',
    url: 'https://open.spotify.com/show/1gqvQ7h7BxNSVoQVTnwihr?si=cc14c2b884d4487b',
    summary:
      'Learn from Lee Kuan Yew, Jesus, and Caesar.\nBen siphons the leverage points, obsession, and architecture of power, of the most influential people in history from many different sources.\nCondenses it.\nAnd hands it to you on a silver platter.\nIf the title intrigues you give it a listen.',
    recommendations:
      'The Lee Kuan Yew and Jesus episodes are great starting points.',
    episodes: 'Most episodes',
    rating: '4.5/5',
    isTopPodcast: true,
  },
  {
    title: 'Founders',
    cover: '/podcasts/founders.jpg',
    url: 'https://open.spotify.com/show/7txiovdzPARhjm18NwMUYj?si=953e61c311b64d36',
    summary:
      "David is obsessed with great people.\nHe has consumed both the canonical and obscure literature on history's most consequential founders.\nOnce a week he adds a book to this corpus, adds in his encyclopedic knowledge, and translates into a narrative.\nBooks have been translated specifically for his podcast.\nFocused on people in the business world aren't currently active.",
    recommendations:
      'My favorite episodes were any of those with James Dyson, Sam Zemurray, Rockefeller, Paul Graham essays, and John Malone in roughly that order.',
    episodes: '80% of episodes',
    rating: '4/5',
    isTopPodcast: true,
  },
  {
    title: 'Cost Of Glory',
    cover: '/podcasts/cost-of-glory.jpg',
    url: 'https://open.spotify.com/show/4safRYjMIq51vEfNHRUCUz?si=960a30c0ac504908',
    summary:
      "Alex Petkas has a PhD in the classics from Princeton.\nIn this case it means something.\nHe roughly follows Plutarch's Parallel Lives which the likes of Napoleon and Churchill thoroughly annotated in their pursuits.\nEvery narration driven episode on a historical driven figure is exceptional. The rating reflects only those episdoes.",
    recommendations: 'Gallic Wars, Agesilaus, Marius',
    episodes: 'All person related episodes',
    rating: '4.5/5',
    isTopPodcast: true,
  },
  {
    title: 'Anthology of Heroes',
    cover: '/podcasts/anthology-of-heroes.jpg',
    url: 'https://open.spotify.com/show/1hDB7ZtZBfd06S2F7Z0CIM?si=e270feff2113414d',
    summary:
      'Consistently high quality.\nReminiscent of HHTOTW.\nBut distinguished with an Aussie accent and minimal topical overlap from a focus on events rather than people.',
    recommendations:
      'The Sobibor episodes made me tear up. Skandabeg was epic. The recent Constantinople series is incredible.',
    episodes: 'All',
    rating: '4.5/5',
    isTopPodcast: true,
  },
  {
    title: 'The Explorers Podcast',
    cover: '/podcasts/explorers.jpeg',
    url: 'https://open.spotify.com/show/6RC8NVlOzdfY8Rt4jDPNrU?si=cf473bd15d56451a',
    summary:
      'Matt is a great narrator and good at condensing stories of exploration into enjoyable listens.\nNot quite as epic or high production quality as some of the earlier pods but if you have any latent interest in exploration, this is the best one.',
    recommendations:
      'Ernest Shackleton (please read the book), conquest of Mexico and the Incan empires.',
    episodes: '33%',
    rating: '3.9/5',
    isTopPodcast: true,
  },
  {
    title: 'History of Rome',
    cover: '/podcasts/history-of-rome.png',
    url: 'https://open.spotify.com/show/6wiEd40oPbQ9UK1rSpIy8I?si=b39bc7ea76054ffb',
    summary:
      'The definitive podcast on Rome.\nNo other podcast covers Rome in as much detail chronologically.\nI never felt like it was a slog to get through the ~180 episodes.',
    recommendations: 'All',
    episodes: 'All',
    rating: '4/5',
    isTopPodcast: true,
  },
  {
    title: 'Revolutions',
    cover: '/podcasts/revolutions.jpeg',
    url: 'https://open.spotify.com/show/05lvdf9T77KE6y4gyMGEsD?si=e91ecb79b8c8493f',
    summary:
      "Turns out there's been a lot of civil unrest in history for some reason.\nSkip the English revolution (1st series) and start from the American or French revolution.\nRoughly equivalent to History of Rome but for Revolutions.",
    recommendations:
      'English revolution of 1640s, American revolution, French revolution, Haiti.',
    episodes: '~100 episodes / 400?',
    rating: '4/5',
    isTopPodcast: true,
  },
  {
    title: 'The Ancient World',
    cover: '/podcasts/ancient-world.jpeg',
    url: 'https://open.spotify.com/show/765nK6U4KXuceyVGNco4Xo?si=f9b8f703ff654c37',
    summary:
      "Great but it's really in the weeds and takes a while to get into. Especially the earlier episodes more closely resemble history as it was taught to me in school with a lot of date and name listing.\nOnce I accepted that it wasn't going to be the optimal narration style, I think this is the best podcast for diving into early antiquity and some out of distribution stories.\nWould only recommend to listen if you're listened to all of the Fall of Civilizations.",
    recommendations: 'Start with his series on the bronze age (C episodes)',
    episodes: 'All episodes',
    rating: '3/5',
    isTopPodcast: true,
  },
  {
    title: 'BG^2',
    cover: '/podcasts/bg2.jpeg',
    url: 'https://open.spotify.com/show/3dVqgYXN29DwwnqdY3YsCk?si=222f4fe7d30647dd',
    summary:
      'I would say "5/5 hands down best podcast for macroeconomics bar none".\nHowever, Bill Gurley (co-host) recently left the show.\nIt remains to be seen if the podcast quality remains the same.\nSo far it seems as though it will be biased towards interviews rather than bi weekly dives and opinions on the market.',
    recommendations: 'All episodes',
    episodes: 'All episodes',
    rating: '4/5',
    isTopPodcast: true,
  },
  {
    title: 'Dwarkesh Podcast',
    cover: '/podcasts/dwarkesh.jpeg',
    url: 'https://open.spotify.com/show/4JH4tybY1zX6e5hjCwU6gF?si=84e17640d89d432a',
    summary:
      'By the nature of the format interview based podcasts are hit or miss. But this is about the best it gets.\nThe podcast I have to slow down from 2x the most often.',
    recommendations:
      "I've quoted his Andrej Karpathy interview on the order of tens of times. Nick Lane was interesting.",
    episodes: '1/4 of all episodes',
    rating: '4/5',
    isTopPodcast: true,
  },
  {
    title: 'Latent Space',
    cover: '/podcasts/latent-space.webp',
    url: 'https://open.spotify.com/show/2p7zZVwVF6Yk0Zsb4QmT7t?si=d2ba9b78a4d341cd',
    summary: 'Shawn and Alessio are great interviewers.',
    recommendations:
      'Recent episodes on World models from Fei-Fei Li and Pim were great.',
    episodes: '1/8 of all episodes',
    rating: '4/5',
    isTopPodcast: true,
  },
];

export const guestDependentPodcasts: SimplePodcast[] = [
  {
    name: 'Lex Fridman',
    description:
      "Michael Levin was one I listened to recently that was very interesting. Lex is a hit or miss interviewer in my opinion so I'll only listen if I know the guest or off of a recommendation.",
  },
  {
    name: 'Joe Rogan',
    description:
      'An entertaining interviewer. Value is very much based on the guest.',
  },
  {
    name: 'Acquired',
    description: 'The Nvidia and Amazon episodes are incredible.',
  },
  {
    name: 'Legacy',
    description:
      "A version of Cost of Glory / HTTOTW / Anthology of Heroes that focuses more on how we view these characters. I'd recommend those two first, though their Cleopatra episodes were great.",
  },
  {
    name: 'Inner Cosmos with David Eagleman',
    description:
      "In the search of a neuroscience podcast I've been listening to this more recently off of a recommendation. He's a great speaker and almost all the topics are interesting and I learn about a new study that was conducted. Only two gripes a) there's 3*3 minute ad chunks per 30 min episode b) I sometimes think the podcast could be more dense. 2x+ podcast for sure",
  },
];

export const standalonePodcasts: StandalonePodcast[] = [
  {
    name: 'Nayib Bukele Tucker Carlson',
    url: 'https://open.spotify.com/episode/54HA4BOH7ycd2mJfGEpTWx?si=c98fc4f654aa4bb1',
  },
  {
    name: 'Freakonomics Why Is it so hard to build in America',
    url: 'https://open.spotify.com/episode/4CGtWphSB8mkSFKLEw0Wax?si=77c8074734d84bc0',
  },
  {
    name: 'Anything with Andrej Karpathy',
    url: '',
  },
  {
    name: 'MAD podcast with Matt Turck',
    url: 'https://open.spotify.com/show/7yLATDSaFvgJG80ACcRJtq?si=aa8207b8a215415d',
  },
  {
    name: 'Tyler Cowen, Sam Altman',
    url: 'https://open.spotify.com/episode/05w5p5aDdbjfShPmKNhgmg?si=a4b7c45772d24940',
  },
  {
    name: 'Closer to Truth, Roger Penrose',
    url: 'https://open.spotify.com/episode/6LqRL2yQ1ZwYpvaIDsGVk3?si=2c7a7d9476444798',
  },
  {
    name: "Robert Sapolsky's lectures",
    url: 'https://open.spotify.com/episode/6IF6RJAszsFxdX920z6hzM?si=a9a2fbab2f364b8f',
  },
  {
    name: 'World of DaaS, Annie Duke',
    url: 'https://open.spotify.com/episode/3ZOhBBYzzE8KQtEd3Pztne?si=596ad06a1ce74c3b',
  },
];

export const links: Link[] = [
  { name: 'Example Link 1', url: 'https://example.com', category: 'Articles' },
  { name: 'Example Link 2', url: 'https://example.com', category: 'Articles' },
  { name: 'Example Link 3', url: 'https://example.com', category: 'Papers' },
  { name: 'Example Link 4', url: 'https://example.com', category: 'Papers' },
  { name: 'Example Link 5', url: 'https://example.com', category: 'Tools' },
];

export const projects: Project[] = [
  {
    title: 'Neural Canvas',
    description: 'AI-powered generative art platform',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['AI', 'React', 'Python'],
    reflections:
      'Exploring the intersection of machine learning and creative expression. Built with a custom diffusion model fine-tuned on abstract art.',
  },
  {
    title: 'Temporal',
    description: 'Time-tracking with spatial memory',
    image: '/podcasts/FoC.jpg',
    tags: ['TypeScript', 'Three.js'],
    reflections:
      'A new approach to productivity that maps your work to physical spaces in your mind.',
  },
  {
    title: 'Whisper Graph',
    description: 'Voice-first knowledge management',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['Swift', 'ML'],
    reflections:
      'Capture thoughts as audio, let AI organize them into a searchable knowledge graph.',
  },
  {
    title: 'Chromatic',
    description: 'Design system generator',
    image: '/podcasts/FoC.jpg',
    tags: ['Design', 'CSS'],
  },
  {
    title: 'Lattice',
    description: 'Distributed computing framework',
    image: '/podcasts/FoC.jpg',
    tags: ['Rust', 'Systems'],
    reflections: 'Making distributed systems accessible to solo developers.',
  },
  {
    title: 'Syntax Garden',
    description: 'Interactive language learning',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['Education', 'NLP'],
  },
  {
    title: 'Syntax Garden',
    description: 'Interactive language learning',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['Education', 'NLP'],
  },
  {
    title: 'Syntax Garden',
    description:
      'Interactive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learning',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['Education', 'NLP'],
  },
  {
    title: 'Syntax Garden',
    description: 'Interactive language learning',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['Education', 'NLP'],
  },
  {
    title: 'Syntax Garden',
    description:
      'Interactive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learningInteractive language learning',
    image: '/podcasts/FoC.jpg',
    url: 'https://example.com',
    tags: ['Education', 'NLP'],
  },
];
