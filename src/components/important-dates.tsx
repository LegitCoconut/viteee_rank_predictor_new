"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timelineEvents } from '@/lib/data/timeline-data';
import { CalendarCheck, Calendar, Sparkles } from 'lucide-react';

export function ImportantDates() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.85', 'end 0.15'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="important-dates" className="relative overflow-hidden py-24 md:py-32">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-coral/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Calendar className="h-3.5 w-3.5" />
            Mark your calendar
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 text-4xl md:text-6xl font-semibold tracking-tighter leading-[0.95]"
          >
            The{' '}
            <span className="font-display italic gradient-text">road</span>
            <br /> to VITEEE 2026.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Every deadline that matters — in one living timeline. Miss nothing.
          </motion.p>
        </div>

        {/* Desktop / tablet timeline */}
        <div
          ref={wrapRef}
          className="relative mx-auto hidden max-w-3xl md:block"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border">
            <motion.div
              style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
              className="h-full w-full bg-gradient-to-b from-coral via-peach to-mint"
            />
          </div>

          {timelineEvents.map((event, index) => (
            <TimelineRow
              key={index}
              event={event}
              side={index % 2 === 0 ? 'left' : 'right'}
              index={index}
            />
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden">
          <div className="relative mx-auto max-w-md">
            <div className="absolute left-5 top-0 h-full w-px bg-border" />
            <div className="space-y-4">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                    <CalendarCheck className="h-4 w-4 text-coral" />
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-coral">
                      {event.date}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{event.title}</p>
                    {event.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            Dates are indicative — refer to the official VIT portal for the
            final word.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type TimelineEvent = (typeof timelineEvents)[number];

function TimelineRow({
  event,
  side,
  index,
}: {
  event: TimelineEvent;
  side: 'left' | 'right';
  index: number;
}) {
  return (
    <div className="relative mb-12 grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 last:mb-0">
      {/* Left column */}
      <div className="flex justify-end">
        {side === 'left' && <TimelineCard event={event} side="left" index={index} />}
      </div>

      {/* Node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5, delay: 0.1 + index * 0.05, type: 'spring' }}
        className="relative z-10"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-coral to-peach shadow-lg shadow-coral/25 ring-4 ring-background">
          <CalendarCheck className="h-4 w-4 text-white" />
        </div>
      </motion.div>

      {/* Right column */}
      <div className="flex justify-start">
        {side === 'right' && <TimelineCard event={event} side="right" index={index} />}
      </div>
    </div>
  );
}

function TimelineCard({
  event,
  side,
  index,
}: {
  event: TimelineEvent;
  side: 'left' | 'right';
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative w-full max-w-xs overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-coral/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="text-xs font-semibold uppercase tracking-wider text-coral">
        {event.date}
      </p>
      <p className="mt-1.5 text-base font-semibold tracking-tight">
        {event.title}
      </p>
      {event.description && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {event.description}
        </p>
      )}
    </motion.div>
  );
}
