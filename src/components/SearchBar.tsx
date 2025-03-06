import { getAllBreedNames } from "@/services/api";
import { useState, useEffect, useRef, FormEvent } from "react";
import { MdDeleteForever } from "react-icons/md";

const SearchBar = ({ query, setQuery, searchApply }: { query: any, setQuery: any, searchApply: any }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [breedNames, setBreedNames] = useState<string[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | any>(null);
    const searchRef = useRef<HTMLDivElement | any>(null);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                const res = await getAllBreedNames();
                const names = await res.json();
                if (Array.isArray(names)) {
                    setBreedNames(names);
                } else {
                    console.error("Invalid breed names data received:", names);
                }
            } catch (error) {
                console.error("Error fetching breed names:", error);
            }
        };

        fetchBreeds();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.breeds.length === 0) return;
        setShowSuggestions(false);
        searchApply(query);
    };

    const handleBreedToggle = (breed: string) => {
        setQuery((prev: any) => {
            const newBreeds = prev.breeds.includes(breed)
                ? prev.breeds.filter((b: string) => b !== breed)
                : [...prev.breeds, breed];
            searchApply({ ...prev, breeds: newBreeds, searchText: "" });
            return { ...prev, breeds: newBreeds, searchText: "" };
        });
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) return;

        if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) => (prev < filteredBreeds.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredBreeds[highlightedIndex]) {
                handleBreedToggle(filteredBreeds[highlightedIndex]);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const filteredBreeds = query.searchText
        ? breedNames.filter((breed) => breed.toLowerCase().includes(query.searchText.toLowerCase()))
        : [];

    return (
        <form onSubmit={handleSearch} className="relative w-full lg:w-[50vw]" ref={searchRef}>
            <div className="flex items-center border rounded-xl p-2 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query.searchText ?? ''}
                    onChange={(e) => {
                        setShowSuggestions(true);
                        setQuery((prev: any) => ({ ...prev, searchText: e.target.value.toLowerCase() }));
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter breed..."
                    className="w-full outline-none"
                />

                {query.breeds.length > 0 && (
                    <button
                        type="button"
                        className="text-gray-500 hover:text-black mr-4"
                        onClick={() => {
                            setQuery((prev: any) => {
                                searchApply({ ...prev, breeds: [], searchText: "" });
                                return { ...prev, breeds: [], searchText: "" }
                            });
                        }}
                    >
                        <MdDeleteForever size={20} color="red" />
                    </button>
                )}

                <button type="submit" className="text-gray-500 hover:text-black">
                    🔍
                </button>
            </div>

            {showSuggestions && filteredBreeds.length > 0 && (
                <ul className="absolute z-10 w-full bg-white rounded border-gray-200 shadow-md max-h-[50vh] overflow-auto top-full mt-1">
                    {filteredBreeds.map((breed, index) => (
                        <li
                            key={index}
                            className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between ${index === highlightedIndex ? "bg-gray-200" : ""
                                }`}
                            onClick={() => handleBreedToggle(breed)}
                        >
                            <span>{breed}</span>
                            {query.breeds.includes(breed) && <span className="text-green-500">✓</span>}
                        </li>
                    ))}
                </ul>
            )}

            {query.breeds.length > 0 && (
                <div className="mt-2">
                    <span className="font-bold">Selected Breeds:</span>
                    {query.breeds.map((breed: string) => (
                        <span
                            key={breed}
                            className="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-300 inline-flex gap-1 items-center"
                            onClick={() => handleBreedToggle(breed)}
                        >
                            {breed}
                            <MdDeleteForever size={18} color="red" />
                        </span>
                    ))}
                </div>
            )}
        </form>
    );
};

export default SearchBar;
