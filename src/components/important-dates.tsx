import { timelineEvents } from '@/lib/data/timeline-data';
import { CalendarCheck, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ImportantDates() {
  return (
    <section id="important-dates" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Calendar className="h-3.5 w-3.5" />
            Key Dates
          </div>
          <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">Important Dates</h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Stay updated with the key dates for the VITEEE 2026 admission process.
          </p>
        </div>

        {/* Desktop: Timeline */}
        <div className="hidden md:block relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-border" />
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative flex items-center mb-12 last:mb-0">
              <div className="w-1/2 pr-10 text-right">
                {index % 2 === 0 && (
                  <Card className="inline-block text-left border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-primary">{event.date}</p>
                      <p className="font-medium text-base mt-1">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div className="bg-primary rounded-full h-9 w-9 flex items-center justify-center ring-4 ring-background shadow-sm">
                  <CalendarCheck className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              <div className="w-1/2 pl-10">
                {index % 2 !== 0 && (
                  <Card className="inline-block text-left border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <p className="text-sm font-semibold text-primary">{event.date}</p>
                      <p className="font-medium text-base mt-1">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Stacked cards */}
        <div className="md:hidden grid gap-3 max-w-md mx-auto">
          {timelineEvents.map((event, index) => (
            <Card key={index} className="border-border/50 shadow-sm">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{event.date}</p>
                  <p className="font-medium text-sm mt-0.5">{event.title}</p>
                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
