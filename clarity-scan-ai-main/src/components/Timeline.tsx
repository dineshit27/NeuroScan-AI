import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type TimelineProps = {
  items?: TimelineItem[];
  className?: string;
};

const defaultItems: TimelineItem[] = [
  {
    year: '2025',
    title: 'Project Discussion',
    description: 'Defined clinical goals, data governance, and MRI quality baselines with advisors.',
  },
  {
    year: '2026',
    title: 'Project Development',
    description: 'Built the MRI ingestion pipeline, interactive UX, and Supabase-backed workflows.',
  },
  {
    year: '2026',
    title: 'Product Deployment',
    description: 'Shipped the first NeuroScan AI release with monitoring, drift alerts, and user onboarding.',
  },
];

const springLine = { type: 'spring', stiffness: 120, damping: 18 } as const;
const springDot = { type: 'spring', stiffness: 220, damping: 12 } as const;
const springCard = { type: 'spring', stiffness: 140, damping: 16 } as const;

const yearVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.08, ...springCard } }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(10px)' },
  visible: (i: number) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: 0.05 + i * 0.08, ...springCard } }),
};

export function Timeline({ items = defaultItems, className }: TimelineProps) {
  const prefersReducedMotion = useReducedMotion();
  const list = useMemo(() => items, [items]);

  return (
    <section className={cn('relative w-full max-w-4xl mx-auto px-4', className)}>
      <div className="relative grid grid-cols-[auto,1fr] gap-6 md:gap-10">
        {/* Vertical line container */}
        <div className="relative flex justify-center">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full bg-gradient-to-b from-primary to-primary/30"
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={prefersReducedMotion ? { duration: 0 } : springLine}
            aria-hidden
          />
        </div>

        <div className="flex flex-col gap-12">
          {list.map((item, index) => (
            <TimelineRow key={`${item.year}-${index}`} item={item} index={index} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}

type RowProps = {
  item: TimelineItem;
  index: number;
  prefersReducedMotion: boolean;
};

function TimelineRow({ item, index, prefersReducedMotion }: RowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rowRef, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <div ref={rowRef} className="relative grid grid-cols-[auto,1fr] gap-4 md:gap-8">
      {/* Dot + Year */}
      <div className="relative flex flex-col items-center">
        <motion.div
          className="w-5 h-5 rounded-full bg-primary shadow-[0_0_0_6px] shadow-primary/15"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : undefined}
          transition={prefersReducedMotion ? { duration: 0 } : springDot}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.08, boxShadow: '0 0 0 10px rgba(59,130,246,0.18)' }}
          aria-hidden
        />
        {!prefersReducedMotion && inView && (
          <motion.div
            className="absolute w-5 h-5 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.12, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            aria-hidden
          />
        )}
      </div>

      <div className="space-y-3">
        <motion.p
          className="text-sm uppercase tracking-[0.18em] text-primary/80 font-semibold"
          variants={yearVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={index}
        >
          {item.year}
        </motion.p>

        <motion.div
          className="bg-card/60 border border-border/60 shadow-sm rounded-2xl p-5 backdrop-blur"
          variants={cardVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          custom={index}
          whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01, boxShadow: '0px 16px 50px -24px rgba(0,0,0,0.35)' }}
          transition={prefersReducedMotion ? { duration: 0 } : springCard}
        >
          <div className="space-y-2">
            <motion.h3
              className="text-lg md:text-xl font-semibold text-foreground"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0, transition: { delay: 0.08, ...springCard } } : undefined}
            >
              {item.title}
            </motion.h3>
            <motion.p
              className="text-sm md:text-base text-muted-foreground leading-relaxed"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0, transition: { delay: 0.14, ...springCard } } : undefined}
            >
              {item.description}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
