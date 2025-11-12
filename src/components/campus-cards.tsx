import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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

export function CampusCards() {
  return (
    <section id="campuses" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-headline tracking-tighter font-semibold">Our Campuses</h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Explore the vibrant and diverse campuses of Vellore Institute of Technology.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <CardTitle>{campus.name}</CardTitle>
                  <CardDescription className="mt-2">{campus.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full">
                    <Link href={campus.website} target="_blank" rel="noopener noreferrer">
                      Visit Website <ArrowRight className="ml-2 h-4 w-4" />
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
