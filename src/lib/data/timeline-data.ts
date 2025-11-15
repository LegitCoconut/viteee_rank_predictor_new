import data from './timeline-data.json';

export interface TimelineEvent {
    date: string;
    title: string;
    description: string;
}

export const timelineEvents: TimelineEvent[] = data.timelineEvents;
