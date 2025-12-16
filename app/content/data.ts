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

export const books: Book[] = [
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    cover: '/books/selfish-gene.jpg',
    spineColor: '#8B4513',
    rating: 5,
    reflections:
      'A groundbreaking work that changed how we think about evolution and genetics. The gene-centered view of evolution is both elegant and profound.',
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
    title: 'Sample Podcast 1',
    cover: '/podcasts/podcast1.jpg',
    rating: 4,
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
