export interface GeoJSONPoint {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
}

export interface PlaceProperties {
    id: string;
    name: string;
    description?: string;
    category: string;
}

export interface PlaceFeature {
    type: 'Feature';
    geometry: GeoJSONPoint;
    properties: PlaceProperties;
}

export interface FeatureCollection {
    type: 'FeatureCollection';
    features: PlaceFeature[];
}
