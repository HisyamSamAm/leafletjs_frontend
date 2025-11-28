"use client";

import { MousePointer2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CursorModeControlProps {
    mode: "navigate" | "add";
    setMode: (mode: "navigate" | "add") => void;
}

const CursorModeControl = ({ mode, setMode }: CursorModeControlProps) => {
    return (
        <div className="absolute top-4 right-4 z-[5000] flex flex-col gap-4">
            <Button
                variant={mode === "navigate" ? "default" : "secondary"}
                size="icon"
                onClick={() => setMode("navigate")}
                title="Navigate Mode (Pan/Zoom)"
                className={cn(
                    "h-12 w-12 rounded-full shadow-xl",
                    mode === "navigate" ? "bg-primary hover:bg-primary/90" : "bg-white hover:bg-gray-100 text-foreground"
                )}
            >
                <MousePointer2 className="h-6 w-6" />
            </Button>
            <Button
                variant={mode === "add" ? "default" : "secondary"}
                size="icon"
                onClick={() => setMode("add")}
                title="Add Place Mode (Click map to add)"
                className={cn(
                    "h-12 w-12 rounded-full shadow-xl",
                    mode === "add" ? "bg-primary hover:bg-primary/90" : "bg-white hover:bg-gray-100 text-foreground"
                )}
            >
                <MapPin className="h-6 w-6" />
            </Button>
        </div>
    );
};

export default CursorModeControl;
