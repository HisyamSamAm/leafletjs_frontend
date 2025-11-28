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
        <div className="absolute top-4 right-4 z-[5000] flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-xl border">
            <Button
                variant={mode === "navigate" ? "default" : "ghost"}
                size="icon"
                onClick={() => setMode("navigate")}
                title="Navigate Mode (Pan/Zoom)"
                className={cn("h-10 w-10", mode === "navigate" && "bg-blue-600 hover:bg-blue-700")}
            >
                <MousePointer2 className="h-5 w-5" />
            </Button>
            <Button
                variant={mode === "add" ? "default" : "ghost"}
                size="icon"
                onClick={() => setMode("add")}
                title="Add Place Mode (Click map to add)"
                className={cn("h-10 w-10", mode === "add" && "bg-blue-600 hover:bg-blue-700")}
            >
                <MapPin className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default CursorModeControl;
