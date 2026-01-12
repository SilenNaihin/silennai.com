export interface Book {
  title: string;
  author: string;
  cover: string;
  spineColor: string;
  rating?: number | string;
  reflections?: string;
  dateRead?: string;
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
    title: 'Let Them',
    author: 'Mel Robbins',
    cover: '/books/let-them.jpg',
    spineColor: '#FFFFFF',
    rating: 6,
    dateRead: 'January 2026',
    reflections: `"Let them, and let me." A simple framing that combines an internal locus of control with Stoic acceptance.
The ideas aren't novel, but the strength of the book is in how digestible and actionable they are.
Very much a "blog post as a book," yet still enjoyable, and I can easily see it being genuinely helpful for a wide audience.`,
  },
  {
    title: 'Robot Visions',
    author: 'Isaac Asimov',
    cover: '/books/robot-visions.jpg',
    spineColor: '#000000',
    rating: 5.5,
    dateRead: 'January 2026',
    reflections: `Enjoyable read. A collection of short stories centered around the exploration of Asimov's three rules of robotics.
1. A robot shall not harm, or due to inaction allow a human being to come to harm.
2. A robot will obey human orders, except when in conflict with 1.
3. A robot will protect itself, except when in conflict with 2.
Evidence and the Bicentennial Man were great. I teared up at some point in the latter.
Calvin was an enjoyable character to observe throughout the book.
My personal opinion is that we'll treat robots that exhibit conscious characteristics as conscious. Robots that clean our house will benefit economically from building an emotional connection, vs robots in the factory the inverse would hold.
My biggest gripe is that he presents a simplified version of the universe in his stories. There's one corporation with a monopoly, and the rules of robotics always hold unconditionally.
The application of the three rules of robotics is questioned in multiple stories, but it doesn't go far beyond a surface level. I didn't find myself pausing to ponder deeply about deontological vs utilitarian viewpoints for example.`,
  },
  {
    title: 'The 38 Letters From J.D Rockefeller To His Son',
    author: 'G. Ng',
    cover: '/books/38-letters-rockefeller.jpg',
    spineColor: '#2D2020',
    rating: 9,
    dateRead: 'November 2025',
    reflections: `Another book that feels like a historical accident.
Private correspondence from the richest person in the world never intended for publication, preserved by chance rather than design.
Its value comes less from novelty than from the rare, unfiltered access it provides to a mind thinking in real time about character, responsibility, wealth, and power.
You read it with the quiet awareness that you were never meant to be in the room.
You'll enjoy if you're a prior fan of Rockefeller.
Even more valuable if you haven't yet solidified your intuitions around money, duty, and the moral obligations of success.`,
  },
  {
    title: 'Mistborn Series 2',
    author: 'Brandon Sanderson',
    cover: '/books/mistborn-series-2.jpg',
    spineColor: '#87693B',
    rating: 7.5,
    dateRead: 'October 2025',
    reflections: `Less on the fantasy aspect and the scope is smaller for the first 3 books, but still enjoyable.
More juvenile humor but it doesn't feel as forced as with the WoK series. Wayne is a standout character whose growth across the series is satisfying, and the western-meets-fantasy setting offers a fresh take on the Cosmere.`,
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover: '/books/thinking-fast-slow.jpg',
    spineColor: '#FFFFFF',
    rating: 8.5,
    dateRead: 'September 2025',
    reflections: `Thought-provoking and foundational, though unevenly paced.
System 1 (fast, intuitive, automatic)
System 2 (slow, deliberative, effortful) is intuitive but powerful, and serves as a useful compression of decades of behavioral research.
Much of the value comes from cataloging where intuition systematically fails: heuristics, biases, framing effects, loss aversion, and base rate neglect.
The errors are not random but structural, which makes them predictable and exploitable at scale.
The book is strongest when it connects cognitive bias to real decision making under uncertainty (economics, forecasting, incentives).
It weakens toward the end, where the marginal insight diminishes and the final ~100 pages drag.`,
  },
  {
    title: 'Mistborn Series 1',
    author: 'Brandon Sanderson',
    cover: '/books/mistborn-series-1.jpg',
    spineColor: '#886585',
    rating: 8,
    dateRead: 'September 2025',
    reflections: `One of the most epic endings to a trilogy I've ever read. Vin is a delightful character to follow, and the progress of the stories feels interesting all the way through. Book 2 was a weak spot, but otherwise an amazing read and unique action system.`,
  },
  {
    title: 'The Four Agreements',
    author: 'Don Miguel Ruiz',
    cover: '/books/four-agreements.jpg',
    spineColor: '#636939',
    rating: 6.5,
    dateRead: 'August 2025',
    reflections: `Nothing groundbreaking but from a novel perspective (Toltec spiritual tradition). Good choice to use as your socialization bible.
Normative rather than analytical.
Moral rather than empirical.
Encourages emotional restraint, interpretive charity, and personal accountability. Makes you a more stoic and effective participant in social life.`,
  },
  {
    title: 'Ego Is the Enemy',
    author: 'Ryan Holiday',
    cover: '/books/ego-is-the-enemy.jpg',
    spineColor: '#0A4666',
    rating: 5.5,
    dateRead: 'July 2025',
    reflections: `Felt similar in spirit to Robert Greene's books. A story that is then polemically marshaled to support a predetermined thesis when other interpretations are abound.
While the core principle has merit, it did not meaningfully change my thinking.
Ego is valuable in moderation. It is a powerful motivator. Properly harnessed, it is one of the more beautiful and productive features of the human condition.
Control your ego, rather than the inverse.`,
  },
  {
    title: 'The Tao of Charlie Munger',
    author: 'David Clark',
    cover: '/books/tao-charlie-munger.jpg',
    spineColor: '#EE4121',
    rating: 7,
    dateRead: 'July 2025',
    reflections: `Bite sized philosophy of Charlie.
It is a collection of excerpts, each no longer than a page, which necessarily limits contextual depth and conceptual density.
Anecdotal rather than analytical.
Still a valuable read especially since I haven't read the Almanack at this point.`,
  },
  {
    title: 'Venture Deals',
    author: 'Brad Feld & Jason Mendelson',
    cover: '/books/venture-deals.jpg',
    spineColor: '#30302F',
    rating: 7.5,
    dateRead: 'July 2025',
    reflections: `Prescriptive version of The Power Law. Some concepts are dated but this is a must read before raising.`,
  },
  {
    title: 'The Power Law',
    author: 'Sebastian Mallaby',
    cover: '/books/power-law.jpg',
    spineColor: '#FEE01E',
    rating: 8,
    dateRead: 'June 2025',
    reflections: `The definitive history of venture capital.
Strong on historical narrative and incentive structure, lighter on transferable heuristics.
More descriptive than prescriptive, but valuable for understanding how a small number of decisions drive the majority of returns.
Useful for calibrating expectations about risk, selection, and variance.`,
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    cover: '/books/meditations.jpg',
    spineColor: '#000000',
    rating: 8,
    dateRead: 'May 2025',
    reflections: `The inner exposition of a man that controlled half the world 2000 years ago.
The book itself is an anomalous artifact.
If you're unfamiliar with Stoic principles, interpreting them through the lenses of another's thoughts can be ambiguous and you won't love it.
If you're already familiar (and ideally have interest in Roman antiquity), you have the fortune of seeing the principles applied in practice (on a grand scale) outside of yourself.
This cannot be replicated.`,
  },
  {
    title: 'Never Split the Difference',
    author: 'Chris Voss',
    cover: '/books/never-split-difference.jpg',
    spineColor: '#f34920',
    rating: 6.5,
    dateRead: 'May 2025',
    reflections: `The core point is that effective negotiation is primarily emotional, not rational.
Tactical empathy creates leverage by making the other party feel understood rather than persuaded.
Labeling emotions, calibrated questions, and controlled misalignment.
Could have been a long blog post. Chris Voss has a lot of interesting stories which makes it a fun read.`,
  },
  {
    title: 'What every BODY is saying',
    author: 'Joe Navarro',
    cover: '/books/what-every-body-is-saying.jpg',
    spineColor: '#16a5df',
    rating: 7.5,
    dateRead: 'April 2025',
    reflections: `The most practical book I've read on body language. Focuses less on theatrical "tells" and more on baseline behavior, comfort vs. discomfort cues, and probabilistic interpretation.
Emphasizes pattern recognition over certainty, which keeps it grounded and usable.`,
  },
  {
    title: 'Thinking in Systems',
    author: 'Donella Meadows',
    cover: '/books/thinking-in-systems.jpg',
    spineColor: '#FFFFFF',
    rating: 8,
    dateRead: 'March 2025',
    reflections: `Dense framework that demands repetition and concrete examples to internalize.
The book succeeds at starting with basic systems theory concepts and building up without losing you along the way.
Thinking in systems → thinking in stocks and flows (accumulations and rates of change). A lot of confusion comes from mixing one and the other, and often results in second order effects you didn't expect. In general complex systems often have many stocks and flows which can lead to unexpected second and third order behaviour.
Introduces reinforcing feedback loops (exponential growth, collapse) and balancing feedback loops (prices, regulation).
Time is crucial, don't underestimate the effects of delay. It can cause oscillations, overshooting, or whiplash.
Leverage points in systems, incentives > information flow > tweaking numbers.
Other points on information flow, policy resistance, bounded rationality (systems fail from individual level rationality which is limited in information and incentive), optimization destroys resilience (like overfitting in a ml model), and more.
Will likely require a re-read.`,
  },
  {
    title: 'Becoming Supernatural',
    author: 'Joe Dispenza',
    cover: '/books/becoming-supernatural.jpg',
    spineColor: '#BFCBB2',
    rating: 2.5,
    dateRead: 'March 2025',
    reflections: `Heavily pseudoscientific in presentation. Frequent appeals to vague neuroscience or empirical studies with substantial confounding variables. The word "quantum" is used more as mystique than mechanism.
The underlying message is directionally positive but the conceptual framing is shallow and often misleading.
Difficult to get through if you're sensitive to loose scientific language.
Was recommended to me by my sister and mother who are especially spiritual.
Read if you've tried traditional self help advice and it didn't resonate or help.`,
  },
  {
    title: 'The Challenger Sale',
    author: 'Matthew Dixon & Brent Adamson',
    cover: '/books/challenger-sale.jpg',
    spineColor: '#E0312F',
    rating: 5.5,
    dateRead: 'March 2025',
    reflections: `Out of the different sales personas, the "Challenger" does the best. They are usually an expert in the topic and can flip the dynamic to where the customer wants to be on calls as it's closer to consulting. This expertise and "challenge" is different depending on the stakeholder. Guidance > reaction. Could have been a blog post.`,
  },
  {
    title: 'The Transparency Sale',
    author: 'Todd Caponi',
    cover: '/books/transparency-sale.jpg',
    spineColor: '#E01E26',
    rating: 6,
    dateRead: 'February 2025',
    reflections: `For B2B sales, educating > "selling". The best way to educate is to be honest and find customers that will genuinely value your product the most.
There's good practical advice on how to run meetings and structure your sales cycle around this, but the core concept could have been a blog post.`,
  },
  {
    title: 'Founding Sales',
    author: 'Pete Kazanjy',
    cover: '/books/founding-sales.jpg',
    spineColor: '#E5E7E9',
    rating: 7.5,
    dateRead: 'February 2025',
    reflections: `Dated in parts, but still rich in relevant heuristics and practical guidance. One of the few sales books that genuinely earns its length through idea density. You can almost treat it like a textbook.`,
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    cover: '/books/steve-jobs.jpg',
    spineColor: '#FFFFFF',
    rating: 8,
    dateRead: 'February 2025',
    reflections: `Caligraphy at Reed transferring later.
His young life, just seems like a sociopath on a mission.
He had an incredible understanding of UX, both for marketing and his products. He always had a reality distortion field, but his second time around...`,
  },
  {
    title: 'Crossing the Chasm',
    author: 'Geoffrey Moore',
    cover: '/books/crossing-the-chasm.jpg',
    spineColor: '#F0563A',
    rating: 2,
    dateRead: 'January 2025',
    reflections: `A blog post book. A single important concept and then lots of filler. Not sure what I expected.
There will be transition points for your company. The hardest one is going from your innovators to early adopters and onwards.
Companies in SF can often be bad at this. Especially novelty items as we saw with the wearables.`,
  },
  {
    title: 'Way of Kings Series',
    author: 'Brandon Sanderson',
    cover: '/books/way-of-kings.jpg',
    spineColor: '#4c6293',
    rating: 8.5,
    dateRead: 'December 2024',
    reflections: `This one sucked me in. I read the first three books within a week. And the last two within another week.
The world building is unparalleled, rivaling GRRM. Characters are deep and variegated. Magic system is logical and grounded in lore.
There are chapters that solely exist to get to know a character better and have no influence on the story. Likewise with world-building. The juvenile humor can get repetitive.
Brandon Sanderson is known for his "Sanderlanche" where not much happens for 800 pages and then you get blown around from epic impactful action scene to another for the last 200.
If you're into deep world and character building and don't mind a slow start this series is a must read.`,
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: '/books/project-hail-mary.jpg',
    spineColor: '#000000',
    rating: 8,
    dateRead: 'December 2024',
    reflections: `An interesting demonstration of what alternative non carbon based life could look like.
And how the principles underlying evolution (second law of thermodynamics → tending towards max entropy) can act as a cosmic scale that affects us.
Without intellectualizing, it's just a genuinely enjoyable read.`,
  },
  {
    title: 'Foundation Series',
    author: 'Isaac Asimov',
    cover: '/books/foundation.jpg',
    spineColor: '#000e35',
    rating: '8.5 (trilogy), 7.5 (prequels), 6 (sequels)',
    dateRead: 'October 2024',
    reflections: `Draws certain sociological questions to their logical conclusion.
(a) Very relevant in modernity if you replace psychohistory with an oracle AI controlling the vectors of humanity.
(b) What is humanity's terminal trajectory? A future where labor is automated and civilization expands into the cosmos, what happens if we're still constrained by the same imperfect cognitive architecture? Restless desires, status seeking, ego, etc. Asimov's solution is psychohistory as a containment function and Gaea as a universal solution.
(c) Is a future that is stable, prosperous, and predictable worth the loss of meaningful individual agency? Is benevolent determinism ethically distinguishable from tyranny when its hand is sufficiently invisible?`,
  },
  {
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    cover: '/books/48-laws-of-power.jpg',
    spineColor: '#d04621',
    rating: 2.5,
    dateRead: 'October 2024',
    reflections: `Despite not loving The Laws of Human Nature, I read this hoping the issue was the subject matter rather than the writing.
The historical anecdotes were particularly interesting. But then they start to repeat.
And you can't look past the slant that's often felt repetitive and steeped in a deeply cynical view of human nature.
Many of the "laws" themselves could be explored more productively in a less polemical framework, one that acknowledges both their constructive and destructive expressions.`,
  },
  {
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgensen',
    cover: '/books/almanack-naval.jpg',
    spineColor: '#FFFFFF',
    rating: 8.5,
    dateRead: 'October 2024',
    reflections: `A well-curated synthesis of Naval's thinking on leverage, wealth, and personal philosophy.
Wealth ≠ money. Wealth is owning assets that earn while you sleep. Money is a unit of account. Status is a zero sum game. Optimize for wealth, avoid status games when possible.
Leverage is the multiplier: The biggest outcomes come from leverage, not effort: labor leverage (people), capital leverage (money), permissionless leverage (code, media). Modern leverage scales without asking anyone's approval.
Specific knowledge is non-replicable. The most valuable skills: are highly contextual, feel like "play" to you, cannot be easily taught or credentialed. If it can be trained quickly, it will be competed away.
Long-term games with long-term people. Compounding requires trust and repeated interaction. Reputation becomes an invisible form of leverage over time.
Judgment > intelligence. Good decisions compound more than raw IQ. Judgment comes from: understanding incentives, reading second-order effects, and knowing when not to act.
Accountability concentrates upside. Take responsibility in public ways (ownership, equity, authorship). Accountability lets you capture the full upside of being right.
You get rich by owning, not renting. Equity beats salary asymmetrically. Renting your time caps upside; owning systems removes the ceiling.
Desire is a contract you make with yourself. Every desire says: I won't be happy until X happens. Fewer desires → less suffering → more baseline happiness.
Happiness is largely subtractive. It comes less from adding pleasure and more from removing: anxiety, unhealthy ambition, and unnecessary comparison.
Peace beats pleasure. Sustainable happiness is calm and low-variance, not excitement-maximizing.
Read to build judgment. Read what has survived time. The goal isn't information, it's worldview calibration.
Basic health dominates. Sleep, movement, sunlight, and diet beat hacks. Most "optimization" is compensation for ignoring fundamentals.
Environment > willpower. Design defaults so good behavior is easy and bad behavior is costly.`,
  },
  {
    title: 'Elon Musk',
    author: 'Walter Isaacson',
    cover: '/books/elon-musk-isaacson.jpg',
    spineColor: '#0D0B12',
    rating: 9,
    dateRead: 'September 2024',
    reflections: `High level notes:
- Sci fi and day dreaming can be valuable (the meetings about going to mars)
- More audacity (him just cutting off the cracks in the rocket booster and launching it)
- You can just do things. He knew nothing about rockets and put together a world class company
- Be relentless (his fourth rocket being his last chance, failures before that)
- His brain is built differently than mine. He can play Polytopia in the car for 5 minutes, then lock back in. I can't as readily disengage, so I don't start.
A lot more depth in his early life and later life than the Vance book. Already outdated, I'm sure Walter will give us a 2nd edition in a decade.`,
  },
  {
    title: 'Endurance',
    author: 'Alfred Lansing',
    cover: '/books/endurance.jpg',
    spineColor: '#100F13',
    rating: 9.5,
    dateRead: 'August 2024',
    reflections: `One of my favorite books.
If you set out to invent an epic of discovery and survival, you could scarcely devise a story as improbable or compelling.
And it happens to be real.
Skip all "motivation" content and read this.`,
  },
  {
    title: 'The Fish That Ate the Whale',
    author: 'Rich Cohen',
    cover: '/books/fish-ate-whale.jpg',
    spineColor: '#5695F4',
    rating: 7.5,
    dateRead: 'August 2024',
    reflections: `The biography of Sam Zemurray, once owner of the largest company in the world and the country of Honduras.
The narrative carries here. It's impossible to make this story uninteresting.
The prose and tangents in the book are not phenomenal.`,
  },
  {
    title: 'Manufacturing Processes',
    author: 'Various',
    cover: '/books/manufacturing-processes.jpg',
    spineColor: '#0C0F13',
    rating: 6,
    dateRead: 'July 2024',
    reflections: `I now broadly understand how things are made.`,
  },
  {
    title: '$100M Leads',
    author: 'Alex Hormozi',
    cover: '/books/100m-leads.jpg',
    spineColor: '#1963A7',
    rating: 4.5,
    dateRead: 'July 2024',
    reflections: `Good practical advice if you know nothing about sales, else all the concepts in the book can be learned JIT in collaboration with ChatGPT.
There's nothing explicitly controversial, and the main benefit is knowing what's out there and when it can be applied.`,
  },
  {
    title: 'How to Make a Few Billion Dollars',
    author: 'Brad Jacobs',
    cover: '/books/how-to-make-billion.jpg',
    spineColor: '#010101',
    rating: 3,
    dateRead: 'June 2024',
    reflections: `I was expecting a lot after listening to the Founders podcast episode on the book. Brad is an incredible founder.
But it turns out the podcast was enough to capture all the signal from the book.`,
  },
  {
    title: 'The Wizard of Menlo Park',
    author: 'Randall E. Stross',
    cover: '/books/wizard-menlo-park.jpg',
    spineColor: '#FFFFFF',
    rating: 6.5,
    dateRead: 'April 2024',
    reflections: `A fun read, although not the densest out there. He was incredibly tenacious, and a great marketer.
If you have abundant quantities of these two skills, you don't need much else. And he didn't have much else, which in some ways his ego prevented him from (for example business acumen).`,
  },
  {
    title: 'The Founders',
    author: 'Jimmy Soni',
    cover: '/books/the-founders.jpg',
    spineColor: '#FFFFFF',
    rating: 8,
    dateRead: 'April 2024',
    reflections: `In depth window into both the X and Paypal sides of the story.
The interplay between egos, vision, and timing. A masterclass in how great companies emerge from chaos and competition.`,
  },
  {
    title: 'Am I Being Too Subtle?',
    author: 'Sam Zell',
    cover: '/books/am-i-being-too-subtle.jpg',
    spineColor: '#B87826',
    rating: 5,
    dateRead: 'April 2024',
    reflections: `An autobiography from the guy that invented the REIT and sold his company for a few tens of billion dollars.
The opening chapters are engaging as narrative, while Chapters 11 and 12 stand out for their density of practical, transferable insight. Beyond that, the book distills to three core ideas:
(a) the discipline to reason from first principles and diverge from consensus when informed conviction warrants it;
(b) the primacy of information. being early to understand a law, regulation, or structural change is itself a durable asymmetric advantage;
(c) the value of intellectual range. most constraints dissolve once you identify what skills transfer and, just as importantly, what you do not yet know.`,
  },
  {
    title: 'How I Raised Myself from Failure to Success in Selling',
    author: 'Frank Bettger',
    cover: '/books/how-i-raised-myself.jpg',
    spineColor: '#f6e600',
    rating: 8,
    dateRead: 'March 2024',
    reflections: `A recommendation from a YC partner.
This is the hands down best book on sales I've read even if it has little directly applicable with the modern world.
Similar to how to win friends and influence others, it encodes the wisdom of the forefathers that still holds today.
The Lindy effect is strong with this one.`,
  },
  {
    title: 'Build',
    author: 'Tony Fadell',
    cover: '/books/build.jpg',
    spineColor: '#FEFEFE',
    rating: 7.5,
    dateRead: 'December 2023',
    reflections: `Enjoyable half autobiography, half philosophy and advice on building delightful products.
He has the experience and the ability to communicate it.
Practical wisdom from someone who built the iPod and Nest—grounded in real decisions rather than abstract frameworks.`,
  },
  {
    title: 'Only the Paranoid Survive',
    author: 'Andy Grove',
    cover: '/books/only-paranoid-survive.jpg',
    spineColor: '#8D7C74',
    rating: 5.5,
    dateRead: 'December 2023',
    reflections: `A case study driven book on exploiting crisis moments, with Intel's CPU pivot from memory chips as the central example.
Valuable for people running organizations where politics have come into play, and those pivoting.
There's a part of me that thinks this could have been a 9/10 blog post.`,
  },
  {
    title: "The Founder's Dilemmas",
    author: 'Noam Wasserman',
    cover: '/books/founders-dilemmas.jpg',
    spineColor: '#FFFFFF',
    rating: 2,
    dateRead: 'November 2023',
    reflections: `Not an enjoyable read. Felt like I was reading a philosophical research paper but it was business concepts. There's valuable advice in the book (and some of the statistics I do remember from time to time) but it was so much of a pain to extract them.
Key statistics to remember: solo founders take longer to reach liquidity, founding teams with prior relationships perform better, equity splits done early tend to be more equal and sometimes problematic.`,
  },
  {
    title: 'Atlas Shrugged',
    author: 'Ayn Rand',
    cover: '/books/atlas-shrugged.jpg',
    spineColor: '#800d24',
    rating: 9,
    dateRead: 'November 2023',
    reflections: `A book that still frames the way I think. Must read.
It's well written and the story is captivating.
It's thought provoking whether you agree or disagree with underlying premises.
It's long and some parts can drag on (like Francisco's 80 page monologue).`,
  },
  {
    title: 'The Three-Body Problem',
    author: 'Cixin Liu',
    cover: '/books/three-body-problem.jpg',
    spineColor: '#3F778E',
    rating: 9,
    dateRead: 'November 2023',
    reflections: `A recommendation from our YC partner.
I loved this series. I couldn't rip myself away for all 3 books.
The last book was weak on characters, but very strong on plot.
A plausible and colorful exposition to the Fermi Paradox.`,
  },
  {
    title: 'The Mom Test',
    author: 'Rob Fitzpatrick',
    cover: '/books/mom-test.jpg',
    spineColor: '#DD1A6B',
    rating: 8,
    dateRead: 'November 2023',
    reflections: `Short and dense. Something that should be a long blog post, and essentially is.
Must read if you're starting a non moonshot company.`,
  },
  {
    title: 'The CEO Within',
    author: 'Joseph L. Bower',
    cover: '/books/ceo-within.jpg',
    spineColor: '#0E040D',
    rating: 6.5,
    dateRead: 'October 2023',
    reflections: `I was just starting my company when I read this.
The group habits section wasn't super valuable to me at the time, but individual habits were good reminders. In particular when you say it twice write it down is something that stuck with me.
Some of the advice felt premature for the stage the company was at and relatively straightforward (already being in the startup world previously).
If you've not worked at or started a startup before, must read. If you have, look at the table of contents and read what intrigues you.`,
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    cover: '/books/zero-to-one.jpg',
    spineColor: '#7192B7',
    rating: 8.5,
    dateRead: 'September 2023',
    reflections: `I'd heard most of the advice in different forms before I read the book else it would be higher.
Basically the bible for starting a venture growth company.
Whether you agree or disagree with everything, it helps shape your thinking.
Core thesis: aim for monopoly through differentiation, not competition. Competition is for losers. Secrets still exist—find them.`,
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    author: 'Douglas Adams',
    cover: '/books/hitchhikers-guide.jpg',
    spineColor: '#718594',
    rating: 4,
    dateRead: 'September 2023',
    reflections: `Highly acclaimed.`,
  },
  {
    title: "The Innovator's Dilemma",
    author: 'Clayton Christensen',
    cover: '/books/innovators-dilemma.jpg',
    spineColor: '#414993',
    rating: 4,
    dateRead: 'May 2023',
    reflections: `A blog post book. The central idea: successful companies fail not because they ignore innovation, but because they rationally focus on serving existing customers with sustaining innovations while disruptive technologies enter from below with worse performance but different value propositions. By the time the disruption is visible, it is too late. The concept is valuable but could be communicated in a fraction of the pages.`,
  },
  {
    title: 'How to Create a Mind',
    author: 'Ray Kurzweil',
    cover: '/books/how-to-create-mind.jpg',
    spineColor: '#FFFFFF',
    rating: 6,
    dateRead: 'February 2023',
    reflections: `Main reason it's not higher is it's not super relevant right now. On Intelligence is a superset, and A Thousand Brains is a superset of that. Some of the later sections are thought provoking.

Notes:
Pattern Recognition Theory of Mind (PRTM): The neocortex is composed of approximately 300 million pattern recognizers organized hierarchically. Each recognizer handles a specific pattern and connects to others above and below in the hierarchy.
Hierarchical structure: Lower levels recognize simple features (edges, phonemes), higher levels recognize increasingly abstract concepts (faces, words, ideas). Information flows both up (recognition) and down (prediction).
The neocortex is remarkably uniform in structure. The same basic algorithm processes vision, language, and abstract thought. Specialization comes from connectivity, not architecture.
Redundancy and robustness: Multiple pattern recognizers can encode the same concept. The brain uses statistical pattern matching, not exact lookup.
Hidden Markov models as a computational analogy for how the neocortex processes sequential patterns and makes predictions.
Thought experiments on consciousness: If we simulate the brain neuron by neuron, at what point does consciousness emerge? Kurzweil argues it would, but the boundary is fuzzy.
Law of Accelerating Returns applied to neuroscience: Our ability to understand and simulate the brain is growing exponentially. Kurzweil predicts we will reverse engineer the neocortex and use those principles to create human-level AI.
The later chapters speculate on mind uploading, the singularity, and the future of intelligence. Interesting but more speculative than the neuroscience sections.`,
  },
  {
    title: 'A Thousand Brains',
    author: 'Jeff Hawkins',
    cover: '/books/thousand-brains.jpg',
    spineColor: '#EAEAEA',
    rating: 7.5,
    dateRead: 'January 2023',
    reflections: `Our brain is unified under the cortical column (and implications to AI and other neuroscience theories).
The theory proposes that thousands of cortical columns each build models of the world, and intelligence emerges from their voting and reference frame alignment.
Part 1 is the novel. Parts 2 and 3 are interesting but it wasn't what I was looking from in the book and are skippable.`,
  },
  {
    title: 'On Intelligence',
    author: 'Jeff Hawkins',
    cover: '/books/on-intelligence.jpg',
    spineColor: '#0665B3',
    rating: 7,
    dateRead: 'December 2022',
    reflections: `This book was one of the first I read that combined the biology of the brain directly to AI.
A book focused on AI or the brain will give you more dense understanding of either.
The memory-prediction framework is the core insight: the brain is fundamentally a prediction machine that uses hierarchical temporal memory.
Read from chapters "The Brain" to the end of "How The Cortex Works" here and then part 1 of the Thousand Brain Theory.`,
  },
  {
    title: 'Life 3.0',
    author: 'Max Tegmark',
    cover: '/books/life-3-0.jpg',
    spineColor: '#22223C',
    rating: 6,
    dateRead: 'November 2022',
    reflections: `The central point is life 1.0 was evolution, life 2.0 was tool use, and life 3.0 is intelligence that evolves outside of ourselves.
I would read the intro chapter if nothing else. It's a thought experiment as a short story of how superintelligence leads to utopia.
The primary sections are probably outdated.
Read A Brief History of Intelligence instead.`,
  },
  {
    title: 'The Brain That Changes Itself',
    author: 'Norman Doidge',
    cover: '/books/brain-that-changes.jpg',
    spineColor: '#D9D9D0',
    rating: 9.5,
    dateRead: 'November 2022',
    reflections: `It would be easy to for Norman to write basic prose off the back of an interesting subject.
But it's both well written, informative, and dense.
Which makes it both a pleasurable reading experience, and immensely interesting.
Often reference this book internally and externally.
After reading this alongside Oliver Sacks, I began keeping a brain log and spent a year working through a tracing book with my left hand as a deliberate attempt to improve temporal processing and strengthen interhemispheric connectivity.
Notes:
Neuroplasticity is not an edge case or recovery mechanism but a core property of the brain throughout life; structure follows use.
The brain reallocates cortical real estate aggressively. Functions that are trained expand, neglected ones are repurposed.
Constraints shape plasticity: change is possible, but not arbitrary; it is path-dependent and biased by existing architecture.
Plasticity cuts both ways. Maladaptive loops (chronic pain, OCD, addictions) are learned and reinforced through the same mechanisms as skill acquisition.
Repetition matters less than attention + emotional salience; what the brain treats as important is what gets rewired.
Speed of change is often underestimated. Targeted, intense intervention can produce measurable functional shifts faster than intuition suggests.
Identity and perception are partially learned states; changing behavior can precede and reshape subjective experience rather than the reverse.
Neuroplasticity explains both rehabilitation and performance. Recovery from injury and elite skill training are points on the same spectrum.
The book's strength is epistemic humility: it documents mechanisms through cases rather than overextending into grand theory.
Strong corrective to static "hardware" metaphors of the brain; closer to a continuously reconfiguring system under constraint.`,
  },
  {
    title: 'The Man Who Mistook His Wife for a Hat',
    author: 'Oliver Sacks',
    cover: '/books/man-mistook-wife.jpg',
    spineColor: '#BBB686',
    rating: 9,
    dateRead: 'November 2022',
    reflections: `A collection of clinical short stories written by a psychiatrist, each centered on a distinct neurological anomaly.
Reframes your perspective on your subjective experience and consciousness.
It provokes a sense of intellectual humility and quiet awe at how little we truly understand about the brain.
One of the most interesting books I've ever read.`,
  },
  {
    title: 'The Stand',
    author: 'Stephen King',
    cover: '/books/the-stand.jpg',
    spineColor: '#000000',
    rating: 7.5,
    dateRead: 'June 2022',
    reflections: `Enjoyable read, very captivating. I read the whole 1000 page book in 2 days. Wasn't doing much but eating and reading. Interesting read in relation to pandemics.`,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    cover: '/books/dune.jpg',
    spineColor: '#D44B2D',
    rating: 7,
    dateRead: 'June 2022',
    reflections: `The first two books are good.
I enjoyed the prequels more than the original Dune series. I also like the movies more than the books.`,
  },
  {
    title: 'Fooled by Randomness',
    author: 'Nassim Nicholas Taleb',
    cover: '/books/fooled-by-randomness.jpg',
    spineColor: '#FFFFFF',
    rating: 5,
    dateRead: 'June 2022',
    reflections: `I don't love Nassim's prose.
I probably should've skipped this and read Thinking Fast and Slow earlier, which covers the same ground much more densely.
Nassim's version is more colorful. It's based on stories and is polemically worded.`,
  },
  {
    title: 'The Laws of Human Nature',
    author: 'Robert Greene',
    cover: '/books/laws-human-nature.jpg',
    spineColor: '#18407E',
    rating: 3.5,
    dateRead: 'April 2022',
    reflections: `I didn't finish this one. It felt unnecessarily dense and persistently negative in its framing.
While it might be an out of distribution read for the general population, it didn't offer much that felt novel to me. Much of it rehashed well-worn, pessimistic interpretations of human behavior, and I found it increasingly cynicism inducing rather than insightful, so I chose not to continue.`,
  },
  {
    title: 'A History of Philosophy',
    author: 'A.C. Grayling',
    cover: '/books/history-philosophy.jpg',
    spineColor: '#EFF0F0',
    rating: 4,
    dateRead: 'December 2021',
    reflections: `Exactly what it claims to be. A broad and chronological survey of European philosophy.
Informative, and occasionally interesting.
Delivered like it was in my grade 9 history class. Dates and facts.
A dry, encyclopedic register that prioritizes coverage over insight.
I'm sure there are others that would resonate with stronger, but it did not land with me. I marched until the halfway point before conceding defeat.`,
  },
  {
    title: 'Elon Musk',
    author: 'Ashlee Vance',
    cover: '/books/elon-musk-vance.jpg',
    spineColor: '#121112',
    rating: 7,
    dateRead: 'December 2021',
    reflections: `Walter Isaacson's more recent version is essentially a superset of this book. Had to drop the rating due to that fact. It's still a well written book.`,
  },
  {
    title: 'Fundraising',
    author: 'Ryan Breslow',
    cover: '/books/fundraising.jpg',
    spineColor: '#EF6155',
    rating: 8,
    dateRead: 'August 2021',
    reflections: `How to play the game. From the master himself. Short, dense, and practical.`,
  },
  {
    title: 'Game of Thrones',
    author: 'George R.R. Martin',
    cover: '/books/game-of-thrones.jpg',
    spineColor: '#000000',
    rating: 7.5,
    dateRead: 'May 2021',
    reflections: `Would be a 9/10 if not for all the unfinished storylines that will never get resolved.
GRRM is a world builder second to none. He is also a person in perpetual imminence.`,
  },
  {
    title: 'Tribe of Mentors',
    author: 'Tim Ferriss',
    cover: '/books/tribe-of-mentors.jpg',
    spineColor: '#ffc519',
    rating: 3.5,
    dateRead: 'January 2020',
    reflections: `A compilation of short form advice from a wide range of high profile individuals. While occasionally interesting, the format fragments insight into decontextualized heuristics, making it difficult to extract durable mental models.
More inspirational than instructive; most of the value comes from exposure to breadth rather than depth. Low marginal return if you already consume long-form interviews or have strong priors.`,
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    cover: '/books/the-martian.jpg',
    spineColor: '#CA6C2B',
    rating: 8,
    dateRead: '2019',
    reflections: `One of the foremost sci-fi books. I remember thoroughly enjoying.`,
  },
  {
    title: "God's Debris",
    author: 'Scott Adams',
    cover: '/books/gods-debris.jpg',
    spineColor: '#793526',
    rating: 6,
    dateRead: '2019',
    reflections: `Intriguing read. One of my first forays into philosophy.
The thing I remember most latently is the interesting thought experiment for why we were created assuming god exists.
If God is omnipotent, he's immortal and can know and influence anything and everything past present and future. It follows that the only thing he can't do is destroy himself as he's omnipotent. So he created us as fragments of himself to do so.
There's holes in the argument, and it's roughly the point of the book to pose plausible sounding arguments and for you to find holes, but thought provoking nonetheless.`,
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    cover: '/books/lean-startup.jpg',
    spineColor: '#2674AE',
    rating: 5,
    dateRead: '2019',
    reflections: `Build, measure, learn. The core framework is sound: validate assumptions quickly through minimum viable products, use actionable metrics rather than vanity metrics, and pivot or persevere based on evidence. The ideas have become so ingrained in startup culture that they feel obvious now. Better suited for first time founders or those from traditional corporate backgrounds.`,
  },
  {
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    cover: '/books/how-to-win-friends.jpg',
    spineColor: '#8f7f70',
    rating: 8,
    dateRead: '2019',
    reflections: `A sincere Lindy Effect book.
Good read to reinforce principles even if you're already a social whiz.

Notes:
Don't criticize, condemn, or complain; it triggers defensiveness and shuts down influence.
Give honest and sincere appreciation; people respond to recognition more than correction.
Arouse in the other person an eager want; influence works when it aligns with their incentives.

Become genuinely interested in other people rather than trying to be interesting.
Smile; warmth lowers social friction and signals safety.
Remember that a person's name is, to them, the most personal sound in any language.
Be a good listener and encourage others to talk about themselves; people like those who make them feel understood.
Talk in terms of the other person's interests, not your own agenda.
Make the other person feel important. And do it sincerely, without manipulation.

Avoid arguments; winning the debate often loses the relationship.
Show respect for the other person's opinions and avoid blunt contradiction.
If you are wrong, admit it quickly and clearly; credibility compounds.
Begin in a friendly way; tone sets the ceiling for outcomes.
Get the other person saying "yes" early to establish psychological momentum.
Let the other person do most of the talking; insight emerges when you listen.
Let the other person feel the idea is theirs; ownership beats persuasion.
Try honestly to see things from the other person's point of view, even when you disagree.
Be sympathetic to the other person's ideas and desires; validation precedes influence.
Appeal to nobler motives rather than base incentives when possible. This one is the most non consensus valuable point to me.
Dramatize your ideas to make them concrete and memorable.
Throw down a challenge when motivation lags; people respond to standards.

Begin with praise and honest appreciation before offering critique.
Call attention to mistakes indirectly to preserve dignity.
Talk about your own mistakes before criticizing others to lower defenses.
Ask questions instead of giving direct orders; autonomy increases buy-in.
Let the other person save face; humiliation destroys trust.
Praise even small improvements; encouragement accelerates progress.
Give the other person a fine reputation to live up to; expectations shape behavior.
Use encouragement and make faults seem correctable, not fixed.
Make the other person feel happy about doing what you suggest.`,
  },
  {
    title: 'Refactoring UI',
    author: 'Adam Wathan & Steve Schoger',
    cover: '/books/refactoring-ui.jpg',
    spineColor: '#1C2530',
    rating: 8.5,
    dateRead: '2019',
    reflections: `As someone learning product design for the first time, this book blew my mind.
It trained my internal neural network at a practical level. The subtle intuitions behind color and font, etc.
I've been using Tailwind since.
If you're just getting into product design, must read.`,
  },
  {
    title: 'The Elephant in the Brain',
    author: 'Robin Hanson & Kevin Simler',
    cover: '/books/elephant-in-brain.jpg',
    spineColor: '#FFFFFF',
    rating: 6.5,
    dateRead: 'April 2019',
    reflections: `On ego, self deception, and why human dynamics play out the way they do. Was hoping for a more technical version of Sapiens, got something meaningfully different.`,
  },
  {
    title: 'Efficiency',
    author: 'BowTiedBull',
    cover: '/books/efficiency.jpg',
    spineColor: '#FFFFFF',
    rating: 8,
    dateRead: 'February 2019',
    reflections: `This was an amazing book for my 16 year old self to read.
Looking back it has a lot of now obvious advice. Would not recommend for anyone established.
Some practical advice around career is probably outdated and not as good as it could be. It's heavily biased towards sales > sciences.
I wish it talked more about maximizing your personal alpha. Be someone no one else can be by combining interests, predispositions, and a lot of hard work.
The marketing and sales you can learn JIT.`,
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover: '/books/sapiens.jpg',
    spineColor: '#FFFFFF',
    rating: 8,
    dateRead: '2018',
    reflections: `I enjoyed this book as it was my first deep foray into evolutionary framing.
It both informed and gave language to some of the ways I already thought.`,
  },
  {
    title: 'Principles',
    author: 'Ray Dalio',
    cover: '/books/principles.jpg',
    spineColor: '#FAFAFA',
    rating: 6.5,
    dateRead: '2018',
    reflections: `Ray Dalio's attempt to systematize decision making and organizational culture. The life principles section is more universally applicable than the work principles. Core ideas: radical transparency, idea meritocracy, and treating problems as puzzles to solve. Some of the principles feel obvious once stated, but the rigor of writing them down and applying them consistently is the value. Better as a reference than a cover to cover read.`,
  },
  {
    title: 'Start with Why',
    author: 'Simon Sinek',
    cover: '/books/start-with-why.jpg',
    spineColor: '#f21751',
    rating: 1.5,
    dateRead: '2018',
    reflections: `The best example of a blog post book. If you've seen the TED talk you have the essence. The central idea is just an illustrative repackaging of the Socratic method.`,
  },
  {
    title: 'The Power of Habit',
    author: 'Charles Duhigg',
    cover: '/books/power-of-habit.jpg',
    spineColor: '#EDE012',
    rating: 6,
    dateRead: '2018',
    reflections: `The central idea that every habit has a trigger, a routine, and a reward. The most effective way to build or replace a habit is to keep the trigger fixed while changing the response.
It's a valuable principle I've applied many times throughout my life.
Could be a blog post.`,
  },
  {
    title: '1984',
    author: 'George Orwell',
    cover: '/books/1984.jpg',
    spineColor: '#E70101',
    rating: 7,
    dateRead: '2017',
    reflections: `Thought provoking and haunting. A prescient exploration of totalitarianism, surveillance, and the manipulation of truth. The world-building is immersive and the psychological horror builds steadily. Required reading for understanding power structures and the fragility of individual autonomy.`,
  },
  {
    title: "Ender's Game",
    author: 'Orson Scott Card',
    cover: '/books/enders-game.jpg',
    spineColor: '#161C25',
    rating: 8,
    dateRead: '2017',
    reflections: `A masterclass in pacing and escalation. The Battle School sequences are gripping, and Ender is a compelling protagonist. The ending lands with real weight. Explores themes of manipulation, leadership, and the ethics of warfare through the lens of a child soldier. One of the best sci-fi novels I have read.`,
  },
  {
    title: 'Percy Jackson',
    author: 'Rick Riordan',
    cover: '/books/percy-jackson.jpg',
    spineColor: '#152012',
    rating: 'Classic',
    dateRead: '2014',
    reflections: `I'm including this because it's my favorite book series from my childhood. I read all 10 books from the first and second series on the order of 5 times.`,
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
