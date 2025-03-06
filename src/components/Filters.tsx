import { locationsSearch } from "@/services/api";
import { useState, useRef, useEffect } from "react";
import { Location } from "../../types";
import toast from "react-hot-toast";

const perPage = 12;

const FilterModal = ({ show, onClose, setQuery, filterApply }: { show: boolean; filterApply: () => void; onClose: () => void; setQuery: any }) => {
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(15);
    const [locationQuery, setLocationQuery] = useState({
        city: '',
        states: '',
        size: perPage,
        from: 0
    });
    const [locationResults, setLocationResults] = useState<any[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
    const [totalLocation, setTotalLocation] = useState(0);

    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose]);

    useEffect(() => {
        handleSearchLocations(locationQuery);
    }, [])

    useEffect(() => {
        setQuery((old: any) => ({
            ...old,
            zipCodes: selectedLocations.map(loc => loc.zip_code),
        }));
    }, [selectedLocations]);

    const handleSearchLocations = async (locationQuery: { city: any; states: any; size?: number; from?: number; }, showLoading?: boolean) => {
        const queryParams: any = {};

        if (locationQuery.city) {
            queryParams.city = locationQuery.city;
        }
        if (locationQuery.states) {
            queryParams.states = [locationQuery.states];
        }

        queryParams.size = perPage;
        queryParams.from = locationQuery.from;
        let toastId;

        if (showLoading) {
            toastId = toast.loading("Loading...");
        }

        try {
            const response = await locationsSearch(queryParams);
            const cities = await response.json();
            setTotalLocation(cities.total);
            if (showLoading) {
                toast.success(`${cities.total} Location Found`, { id: toastId });
            }
            if (queryParams.from === 0) {
                setLocationResults(cities.results);
            } else {
                setLocationResults(old => ([...old, ...cities.results]));
            }
        } catch (error) {
            console.error("Error while searching locations:", error);
            if (showLoading) {
                toast.error("Match failed!", { id: toastId });
            }
        }
    };

    const loadMoreLocations = () => {
        handleSearchLocations({ ...locationQuery, from: locationQuery.from + perPage })
        setLocationQuery(old => ({ ...old, from: locationQuery.from + perPage }))
    }

    const handleSearch = () => {
        if (!locationQuery.city && !locationQuery.states) {
            toast.error('Please enter a city or a state to search.');
            return;
        }
        handleSearchLocations({ ...locationQuery, from: 0 }, true);
        setSelectedLocations([]);
        setLocationResults([]);
    }

    const checkActive = (item: Location) => {
        if (selectedLocations[0]) {
            const findValue = selectedLocations?.find(loc => loc.zip_code === item.zip_code);
            return !!findValue
        } else {
            return false;
        }
    }

    const toggleSelectedLocation = (item: Location) => {
        setSelectedLocations((prev) => {
            const isAlreadySelected = prev.some(loc => loc.zip_code === item.zip_code);
            return isAlreadySelected
                ? prev.filter(loc => loc.zip_code !== item.zip_code)
                : [...prev, item];
        });
    };

    return show ? (
        <div ref={modalRef} className="bg-gray-100 rounded-xl px-2 py-4 absolute flex flex-col w-80 gap-3 z-30">
            <div className="flex flex-col space-y-2 mt-4 mx-2">
                <h5 className="font-bold">Age</h5>
                <div className="flex space-x-2">
                    <input
                        type="range"
                        min="0"
                        max="15"
                        value={minAge}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setMinAge(value);
                            setQuery((old: any) => ({ ...old, ageMin: value }));
                        }}
                        className="w-full"
                    />
                    <span>{minAge}</span>
                    <span>-</span>
                    <span>{maxAge}</span>
                    <input
                        type="range"
                        min="0"
                        max="15"
                        value={maxAge}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setMaxAge(value);
                            setQuery((old: any) => ({ ...old, ageMax: value }));
                        }}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="mt-4 border-[0.5px] border-gray-200 px-1 py-3 rounded-xl">
                <h5 className="font-bold">Search Available Locations</h5>
                <input
                    type="text"
                    value={locationQuery.city}
                    placeholder="Enter a city"
                    onChange={(e) => setLocationQuery(old => ({ ...old, city: e.target.value }))}
                    className="border-[0.5px] border-gray-300 rounded pl-2 text-sm h-9 mt-4 w-full"
                />

                <input
                    type="text"
                    placeholder="Enter a state"
                    value={locationQuery.states}
                    onChange={(e) => setLocationQuery(old => ({ ...old, states: e.target.value }))}
                    className="border-[0.5px] border-gray-300 rounded pl-2 text-sm h-9 mt-4 w-full"
                />
                <div className="flex items-center justify-center">
                    <button onClick={handleSearch} className="bg-blue-400 rounded-xl text-white py-2 px-4 mt-6 cursor-pointer">Search</button>
                </div>
            </div>
            <div className="border-[0.5px] border-gray-200 px-1 py-1 pb-3 rounded-xl">
                <h5 className="font-bold my-3 ml-2">Available Locations <span className="text-sm text-gray-600">({totalLocation})</span></h5>
                <div className="grid grid-cols-3 gap-2">
                    {locationResults?.map((item: Location) => (
                        <div
                            key={item.zip_code}
                            className={`rounded-xl ${checkActive(item) ? 'bg-blue-500 text-white' : 'bg-gray-200'} py-1 px-2 flex items-center justify-center text-xs flex-col cursor-pointer`}
                            onClick={() => toggleSelectedLocation(item)}
                        >
                            <p>city: {item.city}</p>
                            <p>State: {item.state}</p>
                        </div>
                    ))}
                </div>
                {!locationResults?.[0] && (
                    <div className="text-sm flex items-center justify-center h-16">
                        <p className="">No Location Found</p>
                    </div>
                )}
                {locationResults?.length < totalLocation && <div className="flex items-center justify-center">
                    <button onClick={loadMoreLocations} className="bg-blue-400 rounded-xl text-white py-2 px-4 mt-6 cursor-pointer">Load more location</button>
                </div>}
            </div>
            <button
                onClick={filterApply}
                className="bg-blue-400 rounded-xl text-white py-2 mt-6 cursor-pointer">
                Apply
            </button>
        </div>
    ) : null;
};

const Filters = ({ filterApply, setQuery }: { filterApply: () => void, setQuery: any }) => {
    const [showFilterModal, setShowFilterModal] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setShowFilterModal(true)}
                className="h-12 w-32 cursor-pointer flex items-center justify-center border border-blue-400 rounded-lg"
            >
                Filters
            </button>
            <FilterModal
                filterApply={() => {
                    filterApply();
                    setShowFilterModal(false);
                }}
                show={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                setQuery={setQuery}
            />
        </div>
    );
};

export default Filters;
