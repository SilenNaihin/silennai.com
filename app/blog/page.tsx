export default function Blog() {
  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <a
        href="https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 transition-colors duration-200 text-lg font-medium"
      >
        Silen&apos;s Blog
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </main>
  );
}
