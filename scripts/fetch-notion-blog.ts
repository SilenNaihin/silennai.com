import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

// Your Notion page ID from the URL
const NOTION_PAGE_ID = '2370c99ae49c4e328b66b5e0d90cae3c';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  category?: string;
  publishedDate?: string;
  tags?: string[];
}

interface BlogData {
  posts: BlogPost[];
  lastUpdated: string;
}

function parseIntoBlogs(markdown: string): BlogPost[] {
  const posts: BlogPost[] = [];
  const lines = markdown.split('\n');

  let currentCategory = '';
  let currentSubcategory = '';
  let currentPost: Partial<BlogPost> | null = null;
  let contentBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Category heading (# Technical)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      currentCategory = line.replace('# ', '').trim();
      currentSubcategory = '';
      continue;
    }

    // Subcategory heading (## AI)
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      currentSubcategory = line.replace('## ', '').trim();
      continue;
    }

    // Post title (### or **)
    if (line.startsWith('### ') || line.startsWith('## ')) {
      // Save previous post if exists
      if (currentPost && contentBuffer.length > 0) {
        currentPost.content = contentBuffer.join('\n').trim();
        currentPost.excerpt =
          contentBuffer.slice(0, 3).join('\n').trim().substring(0, 200) + '...';
        posts.push(currentPost as BlogPost);
      }

      // Start new post
      const title = line.replace(/^#{2,3}\s+/, '').trim();
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      currentPost = {
        id: `${slug}-${posts.length}`,
        slug,
        title,
        category: currentCategory || undefined,
        tags: currentSubcategory ? [currentSubcategory] : [],
      };
      contentBuffer = [];
      continue;
    }

    // Check for date markers (Published YYYY)
    if (line.match(/\*\*Published \d{4}\*\*/)) {
      const year = line.match(/\d{4}/)?.[0];
      if (currentPost && year) {
        currentPost.publishedDate = year;
      }
      continue;
    }

    // Add content to current post
    if (currentPost && line !== '---') {
      contentBuffer.push(line);
    }
  }

  // Save last post
  if (currentPost && contentBuffer.length > 0) {
    currentPost.content = contentBuffer.join('\n').trim();
    currentPost.excerpt =
      contentBuffer.slice(0, 3).join('\n').trim().substring(0, 200) + '...';
    posts.push(currentPost as BlogPost);
  }

  return posts;
}

async function fetchNotionPage() {
  try {
    console.log('Fetching Notion page...');

    // Get page metadata
    const page = await notion.pages.retrieve({ page_id: NOTION_PAGE_ID });

    // Get page content as markdown blocks
    const mdblocks = await n2m.pageToMarkdown(NOTION_PAGE_ID);
    const mdString = n2m.toMarkdownString(mdblocks);

    // Parse markdown into individual blog posts
    const posts = parseIntoBlogs(mdString.parent);

    const blogData: BlogData = {
      posts,
      lastUpdated: page.last_edited_time,
    };

    // Save to file
    const outputDir = path.join(process.cwd(), 'app', 'blog');
    const outputFile = path.join(outputDir, 'blog-data.json');

    fs.writeFileSync(outputFile, JSON.stringify(blogData, null, 2));

    console.log('✅ Blog content fetched successfully!');
    console.log(`📝 Found ${posts.length} blog posts`);
    console.log(`💾 Saved to: ${outputFile}`);
    console.log(
      `📅 Last edited: ${new Date(blogData.lastUpdated).toLocaleString()}`
    );

    return blogData;
  } catch (error) {
    console.error('❌ Error fetching Notion page:', error);
    throw error;
  }
}

// Run the script
fetchNotionPage();
