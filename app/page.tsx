import MapWrapper from "@/components/MapWrapper";
import AddPlaceForm from "@/components/AddPlaceForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <div className="w-full h-screen relative">
        <MapWrapper />
        <AddPlaceForm />
      </div>
    </main>
  );
}
