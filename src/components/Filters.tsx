import { useState, useRef, useEffect } from "react";

const FilterModal = ({ show, onClose, setQuery, filterApply }: { show: boolean; filterApply: () => void; onClose: () => void; setQuery: any }) => {
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(15);
    const [location, setLocation] = useState(200);
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

    return show ? (
        <div ref={modalRef} className="bg-gray-100 rounded-xl px-6 py-4 absolute flex flex-col w-80 gap-3 z-30">
            <div className="flex flex-col space-y-2 mt-4">
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
            <div className="flex flex-col space-y-2 mt-6">
                <h5 className="font-bold">Location</h5>
                <div className="flex space-x-2">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={location}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setLocation(value);
                            setQuery((old: any) => ({ ...old, location: value }));
                        }}
                        className="w-full"
                    />
                    <span>{location}Km</span>
                </div>
            </div>
            <button onClick={filterApply} className="bg-blue-400 rounded-xl text-white py-2 mt-6">Apply</button>
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
            <FilterModal filterApply={()=>{
                filterApply();
                setShowFilterModal(false);
            }} show={showFilterModal} onClose={() => setShowFilterModal(false)} setQuery={setQuery} />
        </div>
    );
};

export default Filters;
