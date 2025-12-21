# Blog System Documentation

## Overview

Your blog is now powered by Notion and automatically parses your content into individual posts with categories, tags, and proper navigation.

## How It Works

### 1. Fetch Content from Notion

Run this command whenever you update your Notion page:

```bash
npm run fetch-blog
```

This will:
- Connect to your Notion page using the API
- Parse the markdown content into individual blog posts
- Save everything to `app/blog/blog-data.json`
- Currently finds **214 blog posts** from your Notion page

### 2. Content Structure

The script automatically parses your Notion content based on heading levels:

- **`#` Headings** → Categories (e.g., "Technical", "AI")
- **`##` or `###` Headings** → Individual blog post titles
- **Published YYYY** → Extracts publication year
- Content between headings → Post content

### 3. Pages

#### Blog Index (`/blog`)
- Lists all posts organized by category
- Shows post title, excerpt, tags, and publication date
- Clean, card-based layout with hover effects
- Dark text on white background for excellent readability

#### Individual Posts (`/blog/[slug]`)
- Full post content with proper markdown rendering
- Category and tags displayed at the top
- "Back to all posts" navigation
- Proper typography with good text contrast

### 4. Styling & Colors

All text now has proper contrast for readability:
- **Headings**: `text-gray-900` (dark gray/black)
- **Body text**: `text-gray-700` (medium-dark gray)
- **Meta text**: `text-gray-600` or `text-gray-500` (lighter gray)
- **Links**: `text-blue-600` with hover effects
- **Code blocks**: Light gray background with dark text

### 5. Features

✅ **214 blog posts** automatically parsed  
✅ Organized by categories  
✅ Tags for subcategories  
✅ Publication dates extracted  
✅ Markdown rendering with syntax highlighting  
✅ Responsive design  
✅ SEO-friendly with static generation  
✅ External links open in new tabs  
✅ Image support with rounded corners and shadows  

## Updating Your Blog

1. Edit your Notion page: https://www.notion.so/silen/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c
2. Run: `npm run fetch-blog`
3. Refresh your local site: http://localhost:3000/blog

## File Structure

```
app/blog/
├── page.tsx              # Blog index (lists all posts)
├── [slug]/
│   └── page.tsx          # Individual post pages
├── types.ts              # TypeScript interfaces
└── blog-data.json        # Fetched content (auto-generated)

scripts/
└── fetch-notion-blog.ts  # Fetch & parse script
```

## Customization

### Change Colors

Edit the Tailwind classes in:
- `app/blog/page.tsx` - Blog index styling
- `app/blog/[slug]/page.tsx` - Post page styling

### Adjust Typography

The prose classes control text styling. You can adjust:
- Font sizes (`prose-h1:text-4xl`)
- Spacing (`prose-p:mb-4`)
- Colors (`prose-p:text-gray-700`)

### Modify Parsing Logic

Edit `scripts/fetch-notion-blog.ts` to change how posts are parsed from your Notion content.

## Troubleshooting

**No posts showing?**
- Make sure you've run `npm run fetch-blog`
- Check that `app/blog/blog-data.json` exists

**Text too light?**
- All text colors have been updated to `text-gray-700+` for better contrast

**Post not found?**
- The URL slug is generated from the post title
- Check `blog-data.json` for the correct slug

## Environment Variables

Your `.env.local` contains:
```
NOTION_API_KEY=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
```

Keep this file secure and never commit it to git!

