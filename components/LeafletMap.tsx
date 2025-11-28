"use client";

import useSWR from "swr";
import axios from "axios";
import { FeatureCollection, PlaceFeature } from "@/types";
import { useState, useCallback } from "react";
import EditPlaceDialog from "./EditPlaceDialog";
import DeletePlaceAlert from "./DeletePlaceAlert";
import MapView from "./MapView";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const LeafletMap = () => {
    const { data, error, isLoading } = useSWR<FeatureCollection>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/places`,
        fetcher
    );

    const [selectedPlace, setSelectedPlace] = useState<PlaceFeature | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleEdit = useCallback((place: PlaceFeature) => {
        setSelectedPlace(place);
        setIsEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((place: PlaceFeature) => {
        setSelectedPlace(place);
        setIsDeleteDialogOpen(true);
    }, []);

    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <MapView
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {selectedPlace && (
                <>
                    <EditPlaceDialog
                        place={selectedPlace}
                        isOpen={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    />
                    <DeletePlaceAlert
                        placeId={selectedPlace.properties.id}
                        isOpen={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                    />
                </>
            )}
        </>
    );
};

export default LeafletMap;
