import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Map from "./components/Map";
import ListingComponent from "./components/Listing";
import type { Listing } from "./components/Listing";

function App() {
  const [searchLocation, setSearchLocation] = useState<any>(null);
  const [coordinate, setCoordinate] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isMapMoving, setIsMapMoving] = useState(false);

  const updateListings = async (title?: string, lat?: number, lng?: number) => {
    if (title) {
      try {
        const res = await fetch(`/api/listings?title=${title}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    } else if (lat && lng) {
      try {
        const res = await fetch(`/api/listings?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    }
  };

  useEffect(() => {
    if (searchLocation) {
      updateListings(searchLocation, undefined, undefined);
    }
  }, [searchLocation]);

  useEffect(() => {
    if (coordinate && !isMapMoving) {
      updateListings(undefined, coordinate.lat, coordinate.lng);
    }
  }, [coordinate, isMapMoving]);

  if (searchLocation || listings.length > 0) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar onSearch={setSearchLocation} setListings={setListings} />
        <main className="flex-1 mt-16">
          <div className="h-full grid grid-cols-1 md:grid-cols-2">
            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              <ListingComponent listings={listings} />
            </div>
            <div className="h-[calc(100vh-64px)] sticky top-16">
              <Map
                searchLocation={searchLocation}
                onMapMove={updateListings}
                listings={listings}
                setCoordinate={setCoordinate}
                setIsMapMoving={setIsMapMoving}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar onSearch={setSearchLocation} setListings={setListings} />
      <main className="flex-1 mt-16">
        <div className="h-[calc(100vh-64px)] sticky top-16">
          <Map
            searchLocation={searchLocation}
            onMapMove={updateListings}
            listings={listings}
            setCoordinate={setCoordinate}
            setIsMapMoving={setIsMapMoving}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
