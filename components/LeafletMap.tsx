"use client";

import useSWR from "swr";
import axios from "axios";
import { FeatureCollection, PlaceFeature } from "@/types";
import { useState, useCallback } from "react";
import EditPlaceDialog from "./EditPlaceDialog";
import DeletePlaceAlert from "./DeletePlaceAlert";
import MapView from "./MapView";
import CursorModeControl from "./CursorModeControl";
import AddPlaceForm from "./AddPlaceForm";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const LeafletMap = () => {
    const { data, error, isLoading } = useSWR<FeatureCollection>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/places`,
        fetcher
    );

    const [selectedPlace, setSelectedPlace] = useState<PlaceFeature | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Cursor Mode State
    const [mode, setMode] = useState<"navigate" | "add">("navigate");
    const [addPlaceData, setAddPlaceData] = useState<{ lat: number; lng: number } | null>(null);

    const handleEdit = useCallback((place: PlaceFeature) => {
        setSelectedPlace(place);
        setIsEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((place: PlaceFeature) => {
        setSelectedPlace(place);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleMapClick = useCallback((latlng: { lat: number; lng: number }) => {
        setAddPlaceData(latlng);
        setMode("navigate"); // Optional: Switch back to navigate after clicking? Or keep adding? Let's keep adding or switch? User didn't specify. Usually better to switch back or keep. Let's keep "add" mode active or maybe just open the form.
        // Actually, if the form covers the screen or is modal, we might want to stay in add mode or switch.
        // Let's switch to navigate to prevent accidental double adds while form is open?
        // But the form is modal-ish.
        // Let's just open the form.
    }, []);

    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <CursorModeControl mode={mode} setMode={setMode} />
            <MapView
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
                mode={mode}
                onMapClick={handleMapClick}
            />

            <AddPlaceForm
                isOpen={!!addPlaceData}
                onClose={() => setAddPlaceData(null)}
                lat={addPlaceData?.lat || null}
                lng={addPlaceData?.lng || null}
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
