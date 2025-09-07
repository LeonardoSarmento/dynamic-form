import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';

import { useState } from 'react';
import { Card, CardTitle, CardContent, CardDescription } from '../card';

export type CardHoverItemType = {
  title: string;
  content: React.ReactNode;
  description?: string;
  link?: string;
};

export const HoverEffect = ({ items, className }: { items: CardHoverItemType[]; className?: string }) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.title + '-' + idx}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-100 dark:bg-slate-800/[0.8]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <CardHover>
            <CardTitleHover>{item.title}</CardTitleHover>
            <CardContentHover>{item.content}</CardContentHover>
            <CardDescriptionHover>{item.description}</CardDescriptionHover>
          </CardHover>
        </a>
      ))}
    </div>
  );
};

export const CardHover = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <Card
      className={cn(
        'relative z-20 flex h-full w-full overflow-auto rounded-2xl border bg-inherit p-4 group-hover:border-slate-700 dark:border-white/[0.2]',
        className,
      )}
    >
      <div className="relative z-50 flex w-full flex-1 flex-col">{children}</div>
    </Card>
  );
};
export const CardTitleHover = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <CardTitle className={cn('tracking-wid border-b-1 pb-2', className)}>{children}</CardTitle>;
};
export const CardContentHover = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <CardContent className={cn('tracking-wid my-4 flex h-full items-center justify-center', className)}>
      {children}
    </CardContent>
  );
};
export const CardDescriptionHover = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <CardDescription className={cn('tracking-wid  text-sm leading-relaxed', className)}>
      {children}
    </CardDescription>
  );
};
