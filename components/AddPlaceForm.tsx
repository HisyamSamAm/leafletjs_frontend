"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface FormData {
    name: string;
    description: string;
    category: string;
    lat: number;
    lng: number;
}

interface AddPlaceFormProps {
    isOpen: boolean;
    onClose: () => void;
    lat: number | null;
    lng: number | null;
}

const AddPlaceForm = ({ isOpen, onClose, lat, lng }: AddPlaceFormProps) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm<FormData>();

    useEffect(() => {
        if (lat && lng) {
            setValue("lat", lat);
            setValue("lng", lng);
        }
    }, [lat, lng, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/places`, {
                name: data.name,
                description: data.description,
                category: data.category,
                location: {
                    type: "Point",
                    coordinates: [Number(data.lng), Number(data.lat)],
                },
            });
            reset();
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/places`); // Refresh map data
            onClose();
            toast.success("Place added successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add place");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Card className="w-full max-w-md absolute top-4 right-4 z-[5000] shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Add New Place</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="Place Name" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(val) => setValue("category", val)} defaultValue="Other">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Park">Park</SelectItem>
                                <SelectItem value="Restaurant">Restaurant</SelectItem>
                                <SelectItem value="School">School</SelectItem>
                                <SelectItem value="Hospital">Hospital</SelectItem>
                                <SelectItem value="Mosque">Mosque</SelectItem>
                                <SelectItem value="Office">Office</SelectItem>
                                <SelectItem value="Market">Market</SelectItem>
                                <SelectItem value="Hotel">Hotel</SelectItem>
                                <SelectItem value="Bank">Bank</SelectItem>
                                <SelectItem value="Gas Station">Gas Station</SelectItem>
                                <SelectItem value="Police Station">Police Station</SelectItem>
                                <SelectItem value="University">University</SelectItem>
                                <SelectItem value="Cafe">Cafe</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input id="lat" type="number" step="any" {...register("lat", { required: true })} placeholder="-6.917" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lng">Longitude</Label>
                            <Input id="lng" type="number" step="any" {...register("lng", { required: true })} placeholder="107.619" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} placeholder="Description..." />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Adding..." : "Add Place"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddPlaceForm;
