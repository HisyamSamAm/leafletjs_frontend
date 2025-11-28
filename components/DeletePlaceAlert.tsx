"use client";

import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { mutate } from "swr";
import { useState } from "react";

interface DeletePlaceAlertProps {
    placeId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeletePlaceAlert = ({ placeId, isOpen, onOpenChange }: DeletePlaceAlertProps) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/places/${placeId}`);
            mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/places`);
            onOpenChange(false);
            toast.success("Place deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete place");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the place from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeletePlaceAlert;
