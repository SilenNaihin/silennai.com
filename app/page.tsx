import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <section className="mb-4">
        <h2 className="font-bold mb-3">Some of my journey</h2>
        <ul className="space-y-3 list-disc pl-5 text-gray-700">
          <li>
            Currently building a fast and realistic simulator of reality for hypothesis testing at Experiential Labs. We&apos;ve raised YC and angels across Meta, TBD, GDM, Nvidia, Waabi, etc.{' '}
            <a
              href="https://github.com/experientiallabs/world-model-harness"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline hover:text-gray-900"
            >
              <svg className="w-4 h-4 inline" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              Star our repo
            </a>
          </li>
          <li>
            I work on{' '}
            <a
              href="https://arxiv.org/abs/2606.05559"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              continual learning
            </a>
            , world models, and mech interp (
            <a
              href="https://arxiv.org/abs/2606.15054"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              ICML spotlight
            </a>
            ).
          </li>
          <li>
            I did{' '}
            <a
              href="https://genesis.energy.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              work with the DOE
            </a>{' '}
            to accelerate scientific discovery with AI. I ran a company that was in YC (StackwiseAI) for two years. Before that, I helped build AutoGPT to 160k stars, built the first agentic benchmark, and published it at NeurIPS. I&apos;ve also done various ML and AI eng jobs as a contractor/founding engineer. I dropped out of a CS degree at Minerva University.
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-3">Some of my thoughts</h2>
        <ul className="space-y-3 list-disc pl-5 text-gray-700">
          <li>
            My worldview combines verifiability of experience with biologically
            grounded utilitarianism. Through this lens I practice Stoic
            asceticism: a good life is virtuous, disciplined, and conviction
            driven.
          </li>
          <li>
            Happiness is a function of eudaemonia and hedonia through the lenses
            of your worldview. For me, this means adding value and understanding
            the world better.
          </li>
          <li>
            I&apos;m hyper aware of my dopamine and regulate my environment as
            such. I did 12 dopamine fasts in 2025 (no eating, talking, reading,
            devices for 36 hours).
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="font-bold mb-3">Some of my interests</h2>
        <ul className="space-y-3 list-disc pl-5 text-gray-700">
          <li>
            I particularly enjoy{' '}
            <Link
              href="/podcasts"
              className="underline hover:text-gray-900"
            >
              history through late antiquity
            </Link>
            . The past is the present unrolled for understanding. The present is
            the past rolled up for action.
          </li>
          <li>
            I&apos;m{' '}
            <a
              href="https://silen.notion.site/Fitness-1962b9e3813780788b53d5fc6d4bffd3"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              currently working on
            </a>{' '}
            hitting the 1000lb club and a 3 plate bench press.
          </li>
          <li>
            I&apos;ve visited 30+ countries across 6 continents. I&apos;ve lived
            in several places including in a desert (van + starlink) for 4
            months.
          </li>
          <li>
          I&apos;ve explored quantum computing, neuroscience, math, and philosophy at{' '}
            <Link href="/blog" className="underline hover:text-gray-900">
              varying levels of depth
            </Link>
            .
          </li>
        </ul>
      </section>
    </main>
  );
}
