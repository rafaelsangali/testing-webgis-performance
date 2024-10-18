import Mapbox from "@/components/mapbox";
import { Toaster } from "react-hot-toast";
import Bemagrinho from "@/components/bemagrinho";
export default function Home() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} gutter={8} />
    <div className="relative">
    <Mapbox />
    <Bemagrinho />
    </div>
    </>
  );
}
