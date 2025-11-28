"use client";

import { useState, useMemo } from "react";
import { useMap } from "react-leaflet";
import { List, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeatureCollection } from "@/types";

interface PlaceListControlProps {
    data: FeatureCollection | undefined;
}

const PlaceListControl = ({ data }: PlaceListControlProps) => {
    const map = useMap();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPlaces = useMemo(() => {
        if (!data) return [];
        return data.features.filter((place) =>
            place.properties.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.properties.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const handleFlyTo = (lat: number, lng: number) => {
        map.flyTo([lat, lng], 15, {
            duration: 2,
        });
        setIsOpen(false);
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Park": return "bg-green-500 hover:bg-green-600";
            case "Restaurant": return "bg-orange-500 hover:bg-orange-600";
            case "School": return "bg-blue-500 hover:bg-blue-600";
            case "Hospital": return "bg-red-500 hover:bg-red-600";
            case "Mosque": return "bg-emerald-600 hover:bg-emerald-700";
            case "Office": return "bg-slate-500 hover:bg-slate-600";
            case "Market": return "bg-yellow-500 hover:bg-yellow-600";
            default: return "bg-primary hover:bg-primary/90";
        }
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    return (
        <div className="absolute top-4 right-20 z-[1000]">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="secondary"
                        className="rounded-full w-12 h-12 shadow-xl flex items-center justify-center bg-white hover:bg-gray-100"
                    >
                        <List className="h-6 w-6 text-black" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="z-[6000] w-full sm:max-w-md p-0">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle className="text-2xl font-bold">Places List</SheetTitle>
                        <div className="relative mt-4">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search places..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-140px)]">
                        <div className="flex flex-col gap-3 mt-2 px-6 pb-6">
                            {filteredPlaces.map((place) => (
                                <div
                                    key={place.properties.id}
                                    className="group flex items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
                                    onClick={() =>
                                        handleFlyTo(
                                            place.geometry.coordinates[1],
                                            place.geometry.coordinates[0]
                                        )
                                    }
                                >
                                    <div className={`p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors shrink-0`}>
                                        <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 gap-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold truncate text-base" title={place.properties.name}>
                                                {place.properties.name}
                                            </span>
                                            <Badge className={`${getCategoryColor(place.properties.category)} text-white border-none shadow-none shrink-0`}>
                                                {place.properties.category}
                                            </Badge>
                                        </div>
                                        <span className="text-sm text-muted-foreground truncate" title={place.properties.description}>
                                            {truncateText(place.properties.description || "No description", 33)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {filteredPlaces.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <MapPin className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No places found</p>
                                    <p className="text-sm">Try adjusting your search query</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default PlaceListControl;
