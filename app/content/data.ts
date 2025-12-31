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
  rating?: number;
  reflections?: string;
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
    title: 'Fall of Civilizations',
    cover: '/podcasts/FoC.jpg',
    rating: 8,
    reflections:
      'Great insights on technology and society. The host brings unique perspectives to complex topics.',
  },
  { title: 'Sample Podcast 2', cover: '/podcasts/podcast2.jpg' },
  { title: 'Sample Podcast 3', cover: '/podcasts/podcast3.jpg' },
  { title: 'Sample Podcast 4', cover: '/podcasts/podcast4.jpg' },
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
