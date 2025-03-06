import { useState } from "react";
import toast from "react-hot-toast";

const LocationSearch = () => {
    const [city, setCity] = useState("");
    const [states, setStates] = useState<string[]>([]);
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    const [locationResults, setLocationResults] = useState<any[]>([]);
    const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const constructRequestBody = () => {
        const body: any = {};
        
        if (city) body.city = city;
        if (states.length > 0) body.states = states;

        return body;
    };

    const handleSearchLocations = async () => {
        setLoading(true);
        const body = constructRequestBody();

        try {
            const response = await fetch("/locations/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                setLocationResults(data.results); // Store results from location search
                toast.success("Locations found!");
            } else {
                toast.error("Search failed.");
            }
        } catch (error) {
            toast.error("An error occurred while searching.");
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleZipCodeSelection = (zipCode: string) => {
        setSelectedZipCodes((prev) => {
            if (prev.includes(zipCode)) {
                return prev.filter((z) => z !== zipCode);
            } else {
                return [...prev, zipCode];
            }
        });
    };

    const handleSearchDogs = async () => {
        if (selectedZipCodes.length === 0) {
            toast.error("Please select at least one zip code.");
            return;
        }

        setLoading(true);
        // Pass selected zip codes to the dog search query
        try {
            const response = await fetch(`/searchDogs?zipCodes=${selectedZipCodes.join(",")}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Handle the dog search result
                toast.success("Dogs found!");
            } else {
                toast.error("Dog search failed.");
            }
        } catch (error) {
            toast.error("An error occurred during dog search.");
            console.error("Error during dog search:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Location Search</h2>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="input"
            />
            
            <div>
                <input
                    type="text"
                    placeholder="State abbreviations (comma separated)"
                    onChange={(e) => setStates(e.target.value.split(",").map(s => s.trim()))}
                />
            </div>

            <button onClick={handleSearchLocations} disabled={loading}>
                {loading ? "Loading..." : "Search Locations"}
            </button>

            {locationResults.length > 0 && (
                <div>
                    <h3>Select Zip Codes</h3>
                    <ul>
                        {locationResults.map((location, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={location.zipCode}
                                        checked={selectedZipCodes.includes(location.zipCode)}
                                        onChange={() => handleZipCodeSelection(location.zipCode)}
                                    />
                                    {location.city}, {location.state} - {location.zipCode}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={handleSearchDogs} disabled={loading || selectedZipCodes.length === 0}>
                {loading ? "Loading..." : "Search Dogs"}
            </button>

            {selectedZipCodes.length > 0 && (
                <div>
                    <h3>Selected Zip Codes:</h3>
                    <ul>
                        {selectedZipCodes.map((zipCode, index) => (
                            <li key={index}>{zipCode}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
