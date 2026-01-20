import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <section className="mb-4">
        <h2 className="font-bold mb-3">Some of my journey</h2>
        <ul className="space-y-3 list-disc pl-5 text-gray-700">
          <li>
            I&apos;m doing work on the{' '}
            <a
              href="https://genesis.energy.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              Genesis Mission
            </a>{' '}
            to accelerate scientific discovery with AI.{' '}
            <a
              href="https://www.whitehouse.gov/presidential-actions/2025/11/launching-the-genesis-mission/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              The modern day Manhattan Project
            </a>
            .
          </li>
          <li>
            I&apos;m focused on expanding humanity&apos;s epistemic frontier.
            Exploring ideas in continual learning, OOD generation,
            verifiability, and alternate architectures.
          </li>
          <li>
            I ran a company that was in YC (StackwiseAI) for two years. Before
            that, I helped build{' '}
            <a
              href="https://github.com/Significant-Gravitas/Auto-GPT"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              AutoGPT
            </a>
            , built the first{' '}
            <a
              href="https://github.com/Significant-Gravitas/Auto-GPT-Benchmarks"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              agentic benchmark
            </a>
            , and published a{' '}
            <a
              href="https://neurips.cc/virtual/2023/78940"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-900"
            >
              paper
            </a>{' '}
            on a portion of that work. I&apos;ve also done various ML and AI eng
            jobs as a contractor/founding engineer. I dropped out of a CS degree
            at Minerva University.
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
            I&apos;m currently working on hitting the 1000lb club and a 3 plate
            bench press.
          </li>
          <li>
            I&apos;ve visited 30+ countries across 6 continents. I&apos;ve lived
            in several places including in a desert (van + starlink) for 4
            months.
          </li>
          <li>
            I have interest in quantum computing, neuroscience, bio
            nanorobotics, and aerospace. I&apos;ve explored each at{' '}
            <Link href="/blog" className="underline hover:text-gray-900">
              varying levels of depth
            </Link>
            . Alongside AI, these are the last frontiers towards humanity
            immortality.
          </li>
        </ul>
      </section>
    </main>
  );
}
