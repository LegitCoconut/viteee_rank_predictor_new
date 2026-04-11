import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare, BookOpenCheck, MapPin, Building2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { campuses } from '@/lib/data/campus-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { velloreCourses, chennaiCourses, apCourses, bhopalCourses } from '@/lib/data/course-data';

const courseMap: Record<string, string[]> = {
  vellore: velloreCourses,
  chennai: chennaiCourses,
  ap: apCourses,
  bhopal: bhopalCourses,
};

const campusTitles: Record<string, string> = {
  vellore: 'VIT Vellore',
  chennai: 'VIT Chennai',
  ap: 'VIT-AP',
  bhopal: 'VIT Bhopal',
};

export function CampusCards() {
  return (
    <section id="campuses" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Building2 className="h-3.5 w-3.5" />
            Explore Campuses
          </div>
          <h2 className="text-3xl md:text-5xl font-headline tracking-tighter font-semibold">Our Campuses</h2>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            Explore the vibrant and diverse campuses of Vellore Institute of Technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {campuses.map((campus) => {
            const image = PlaceHolderImages.find(img => img.id === campus.imageId);
            const courses = courseMap[campus.id];
            return (
              <Card key={campus.id} className="flex flex-col overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                {image && (
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={campus.name}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-500"
                      data-ai-hint={image.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <Badge className="bg-white/90 text-foreground hover:bg-white/80 backdrop-blur-sm border-0 gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {campus.name}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardContent className="flex-1 pt-5 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{campus.name}</CardTitle>
                    {courses && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors text-xs">
                            <BookOpenCheck className="mr-1 h-3 w-3" />
                            Courses
                          </Badge>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle>B.Tech Programmes - {campusTitles[campus.id]}</DialogTitle>
                            <DialogDescription>
                              Undergraduate engineering courses available at the {campusTitles[campus.id]} campus.
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-72 w-full rounded-md border p-4">
                            <ul className="space-y-2">
                              {courses.map((course, index) => (
                                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1 text-xs">&#9679;</span>
                                  {course}
                                </li>
                              ))}
                            </ul>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{campus.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0 pb-5 px-6 gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5 h-9">
                    <Link href={campus.website} target="_blank" rel="noopener noreferrer">
                      Website <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5 h-9">
                    <Link href={campus.redditUrl} target="_blank" rel="noopener noreferrer">
                      Reddit <MessageSquare className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
