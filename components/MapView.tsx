"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { FeatureCollection, PlaceFeature } from "@/types";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import PlaceListControl from "./PlaceListControl";
import { LatLng } from "leaflet";

interface MapViewProps {
    data: FeatureCollection | undefined;
    onEdit: (place: PlaceFeature) => void;
    onDelete: (place: PlaceFeature) => void;
    mode: "navigate" | "add";
    onMapClick: (latlng: LatLng) => void;
}

const MapClickHandler = ({ mode, onMapClick }: { mode: "navigate" | "add"; onMapClick: (latlng: LatLng) => void }) => {
    useMapEvents({
        click(e) {
            if (mode === "add") {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
};

const MapView = memo(({ data, onEdit, onDelete, mode, onMapClick }: MapViewProps) => {
    return (
        <MapContainer
            center={[-6.917, 107.619]} // Bandung coordinates
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <MapClickHandler mode={mode} onMapClick={onMapClick} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <PlaceListControl data={data} />
            {data?.features.map((place) => (
                <Marker
                    key={place.properties.id}
                    position={[
                        place.geometry.coordinates[1], // lat
                        place.geometry.coordinates[0], // lng
                    ]}
                >
                    <Popup>
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg">{place.properties.name}</h3>
                            <p className="text-sm text-gray-600">{place.properties.category}</p>
                            <p className="mt-2 mb-4 break-words whitespace-normal max-w-[200px]">{place.properties.description}</p>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onEdit(place)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onDelete(place)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
});

MapView.displayName = "MapView";

export default MapView;
