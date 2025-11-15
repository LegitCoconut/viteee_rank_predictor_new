import { timelineEvents } from '@/lib/data/timeline-data';
import { CalendarCheck } from 'lucide-react';

export function ImportantDates() {
  return (
    <section id="important-dates" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">Important Dates</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Stay updated with the key dates for the VITEEE 2026 admission process.</p>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border"></div>
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative flex items-center mb-12">
              <div className="w-1/2 pr-8 text-right">
                {index % 2 === 0 && (
                  <div className="bg-card p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-primary">{event.date}</h3>
                    <p className="font-medium text-lg mt-1">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                )}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 z-10">
                <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center ring-8 ring-background">
                  <CalendarCheck className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              <div className="w-1/2 pl-8">
                {index % 2 !== 0 && (
                   <div className="bg-card p-6 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-primary">{event.date}</h3>
                    <p className="font-medium text-lg mt-1">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
