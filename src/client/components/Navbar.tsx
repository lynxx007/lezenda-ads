import { useState } from "react";
import { Search } from "lucide-react";
import { search } from "@orama/orama";
import { db } from "../lib/orama";

export default function Navbar({
  onSearch,
  setListings,
}: {
  onSearch: any;
  setListings: any;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (query = searchQuery) => {
    if (!query) return;
    try {
      const res = await fetch(`/api/listings?title=${query}`);
      const data = await res.json();

      setSuggestions(data);
      setShowSuggestions(true);
      setListings(data);
    } catch (error) {
      setSuggestions([]);
      console.error("Error fetching listings:", error);
    }

    // try {
    //   const response = await fetch(
    //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //       query
    //     )}`
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   setSuggestions(data.slice(0, 5)); // Limit to 5 suggestions
    //   setShowSuggestions(true);
    // } catch (error) {
    //   console.error("Error searching location:", error);
    //   setSuggestions([]);
    // }

    // const searchResult = search(db, {
    //   term: query,
    // });
    // console.log(searchResult.hits);
    // setSuggestions(searchResult.hits);
    // setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.document.title);
    setShowSuggestions(false);
    // onSearch({
    //   lat: parseFloat(suggestion.document.location.lat),
    //   lng: parseFloat(suggestion.document.location.lon),
    // });
    onSearch(suggestion.document.title);
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md h-16">
        <div className="flex items-center justify-center h-full px-6 max-w-7xl mx-auto">
          <div className="relative flex items-center border rounded-full shadow-sm hover:shadow-md transition-all duration-200 py-2 px-4">
            <input
              type="text"
              placeholder="Start your search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) {
                  handleSearch(e.target.value);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="outline-none text-sm font-medium w-64 placeholder-gray-600"
            />
            <button
              className="bg-[#FF385C] text-white rounded-full p-2 ml-2"
              onClick={() => handleSearch()}
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[400px] max-h-[300px] overflow-y-auto bg-white rounded-lg shadow-lg z-40 mt-2">
          {suggestions.map((suggestion: any, index: number) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0"
            >
              <p className="text-sm text-gray-800 font-medium truncate">
                {suggestion.document.title}
              </p>
              {/* <p className="text-xs text-gray-500 mt-1">
                {suggestion.addresstype}
              </p> */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
