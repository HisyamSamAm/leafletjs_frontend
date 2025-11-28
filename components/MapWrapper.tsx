"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
    loading: () => <p>Loading Map...</p>,
});

const MapWrapper = () => {
    return <LeafletMap />;
};

export default MapWrapper;
