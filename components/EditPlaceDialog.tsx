"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import axios from "axios";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlaceFeature } from "@/types";

interface EditPlaceDialogProps {
    place: PlaceFeature;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    name: string;
    description: string;
    category: string;
}

const EditPlaceDialog = ({ place, isOpen, onOpenChange }: EditPlaceDialogProps) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue } = useForm<FormData>({
        defaultValues: {
            name: place.properties.name,
            description: place.properties.description,
            category: place.properties.category,
        },
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/places/${place.properties.id}`, {
                name: data.name,
                description: data.description,
                category: data.category,
            });
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/places`);
            onOpenChange(false);
            toast.success("Place updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update place");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Place</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            onValueChange={(val) => setValue("category", val)}
                            defaultValue={place.properties.category}
                        >
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

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPlaceDialog;
