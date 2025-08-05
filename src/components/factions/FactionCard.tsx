import Link from "next/link";
import Image from "next/image";
import { Faction } from "@/types/faction";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FactionCardProps {
  faction: Faction;
}

export function FactionCard({ faction }: FactionCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={faction.bannerImage || `/images/factions/${faction.id}-banner.jpg`}
          alt={`${faction.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-2 left-2 p-1 bg-background/60 rounded-full">
          <Image
            src={faction.logo || `/images/factions/${faction.id}-logo.svg`}
            alt={`${faction.name} logo`}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle 
          className="text-xl font-bold" 
          style={{ color: faction.color }}
        >
          {faction.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {faction.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {faction.mechanics && (
          <div className="flex flex-wrap gap-1 mt-2">
            {faction.mechanics.map((mechanic) => (
              <Badge key={mechanic} variant="outline">
                {mechanic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/factions/${faction.id}`}>
            Explore Faction
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}