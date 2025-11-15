import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare, BookOpenCheck } from 'lucide-react';
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
import { velloreCourses, chennaiCourses, apCourses } from '@/lib/data/course-data';

export function CampusCards() {
  return (
    <section id="campuses" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">Our Campuses</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Explore the vibrant and diverse campuses of Vellore Institute of Technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {campuses.map((campus) => {
            const image = PlaceHolderImages.find(img => img.id === campus.imageId);
            return (
              <Card key={campus.id} className="flex flex-col">
                <CardHeader>
                  {image && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Image 
                            src={image.imageUrl} 
                            alt={campus.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{campus.name}</CardTitle>
                    {campus.id === 'vellore' && (
                       <Dialog>
                         <DialogTrigger asChild>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                              <BookOpenCheck className="mr-1 h-3 w-3" />
                              Courses
                            </Badge>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[625px]">
                           <DialogHeader>
                             <DialogTitle>B.Tech Programmes - VIT Vellore</DialogTitle>
                             <DialogDescription>
                               List of undergraduate engineering courses available at the Vellore campus.
                             </DialogDescription>
                           </DialogHeader>
                           <ScrollArea className="h-72 w-full rounded-md border p-4">
                            <ul className="space-y-2">
                                {velloreCourses.map((course, index) => (
                                    <li key={index} className="text-sm text-foreground">{course}</li>
                                ))}
                            </ul>
                           </ScrollArea>
                         </DialogContent>
                       </Dialog>
                    )}
                     {campus.id === 'chennai' && (
                       <Dialog>
                         <DialogTrigger asChild>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                              <BookOpenCheck className="mr-1 h-3 w-3" />
                              Courses
                            </Badge>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[625px]">
                           <DialogHeader>
                             <DialogTitle>B.Tech Programmes - VIT Chennai</DialogTitle>
                             <DialogDescription>
                               List of undergraduate engineering courses available at the Chennai campus.
                             </DialogDescription>
                           </DialogHeader>
                           <ScrollArea className="h-72 w-full rounded-md border p-4">
                            <ul className="space-y-2">
                                {chennaiCourses.map((course, index) => (
                                    <li key={index} className="text-sm text-foreground">{course}</li>
                                ))}
                            </ul>
                           </ScrollArea>
                         </DialogContent>
                       </Dialog>
                    )}
                    {campus.id === 'ap' && (
                       <Dialog>
                         <DialogTrigger asChild>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20 transition-colors">
                              <BookOpenCheck className="mr-1 h-3 w-3" />
                              Courses
                            </Badge>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[625px]">
                           <DialogHeader>
                             <DialogTitle>B.Tech Programmes - VIT-AP</DialogTitle>
                             <DialogDescription>
                               List of undergraduate engineering courses available at the VIT-AP campus.
                             </DialogDescription>
                           </DialogHeader>
                           <ScrollArea className="h-72 w-full rounded-md border p-4">
                            <ul className="space-y-2">
                                {apCourses.map((course, index) => (
                                    <li key={index} className="text-sm text-foreground">{course}</li>
                                ))}
                            </ul>
                           </ScrollArea>
                         </DialogContent>
                       </Dialog>
                    )}
                  </div>
                  <CardDescription className="mt-2">{campus.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-2">
                  <Button asChild variant="secondary">
                    <Link href={campus.website} target="_blank" rel="noopener noreferrer">
                      Visit Website <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={campus.redditUrl} target="_blank" rel="noopener noreferrer">
                      Reddit Community <MessageSquare className="ml-2 h-4 w-4" />
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
