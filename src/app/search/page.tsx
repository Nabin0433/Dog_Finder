'use client'
import DogCard from "@/components/DogCard";
import { logout, matchDogs, postDogs, searchDogs } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import { Dog } from "../../../types";
import Filters from "@/components/Filters";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import DogCardList from "@/components/DogCardList";
import { MdOutlineExitToApp } from "react-icons/md";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const perPage = 16;

export default function Search() {
    const router = useRouter();
    const [fevDogs, setFevDogs] = useState([]);
    const fevModalRef = useRef<HTMLDivElement | null>(null);
    const [showFavDog, setShowFevDogs] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);
    const [sortOption, setSortOption] = useState("");
    const [totalFoundData, setTotalFoundData] = useState(0);
    const [results, setResults] = useState<Dog[]>([]);
    const [matchDog, setMatchDog] = useState<Dog | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [query, setQuery] = useState({
        breeds: [],
        ageMin: 0,
        ageMax: 15,
        location: 0,
        from: 1,
        sort: "breed:asc"
    });

    useEffect(() => {
        const dogs = localStorage.getItem('fevDogs');
        const jsonDogs = dogs ? JSON.parse(dogs) : [];
        setFevDogs(jsonDogs);
        handleQuery(query);
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fevModalRef.current && !fevModalRef.current.contains(event.target as Node)) {
                setShowFevDogs(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [fevModalRef]);


    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSortOption(value);
        const updateQuery = { ...query, sort: value, from: 1 };
        setCurrentPage(1);
        setQuery(updateQuery);
        handleQuery(updateQuery);
    };


    const fevMatch = async () => {
        try {
            const response = await matchDogs(fevDogs?.map((dog: Dog) => dog.id));
            const dogsDataResponse = await postDogs([response.match]);
            if (dogsDataResponse) {
                setMatchDog(dogsDataResponse[0]);
                setShowFevDogs(false);
                localStorage.removeItem('fevDogs');
                setFevDogs([]);
            }
        } catch (error) {
            console.error("Error during match:", error);
        }
    }

    const favClick = (dog: Dog) => {
        const dogs = localStorage.getItem('fevDogs');
        let jsonDogs = dogs ? JSON.parse(dogs) : [];
        const dogIndex = jsonDogs.findIndex((favDog: Dog) => favDog.id === dog.id);

        if (dogIndex === -1) {
            jsonDogs.push(dog);
        } else {
            jsonDogs.splice(dogIndex, 1);
        }
        localStorage.setItem('fevDogs', JSON.stringify(jsonDogs));
        setFevDogs(jsonDogs)
    }

    const filterApply = () => {
        handleQuery({ ...query, from: 1 });
        setCurrentPage(1);
    }

    const searchApply = (query:any) => {
        handleQuery({ ...query, from: 1 });
        setCurrentPage(1);
    }

    const handleQuery = async (query: any) => {        
        setLoading(true);
        try {
            const breedsQuery = query.breeds.map((breed: string) => `breeds=${encodeURIComponent(breed)}`).join('&');
            const response = await searchDogs(`${breedsQuery}&size=${perPage}&from=${(currentPage - 1) * perPage}&sort=${query.sort}&ageMin=${query.ageMin}&ageMax=${query.ageMax}`);
            if (response.ok) {
                const data = await response.json();                
                const dogsDataResponse = await postDogs(data.resultIds);
                setResults(dogsDataResponse);
                setTotalFoundData(data.total);
                setLoading(false);
                setPageLoading(false);
            } else {
                console.log("Search failed");
                setLoading(false);
                router.replace('/');
            }
        } catch (error) {
            console.log("Error during search:", error);
            setLoading(false);
            router.replace('/');
        }
    };

    const logoutAuth = async () => {
        try {
            const response = await logout();
            if (response.ok) {
                router.replace('/');
            } else {
                console.log("failed");
            }
        } catch (error) {
            console.log("Error during logout:", error);
        }
    }

    if (pageLoading) {
        return (
            <div className="w-full min-h-[80vh] flex items-center justify-center">
                <p>Loading....</p>
            </div>
        )
    }

    return (
        <>
            <header className="bg-blue-500 h-16 flex items-center">
                <div className="container px-4 md:mx-auto flex justify-between items-center">
                    <p className="text-white font-bold text-2xl">Dog Finder</p>
                    <div className="flex gap-12 items-center">
                        <div ref={fevModalRef} className="relative text-white" onClick={() => setShowFevDogs(true)}>
                            <MdOutlineFavoriteBorder className="cursor-pointer" size={28} />
                            <p className="absolute rounded-full h-5 p-1 text-xs bg-orange-500 flex items-center justify-center -top-2 -right-2 cursor-pointer">{fevDogs?.length ?? 0}</p>
                            {showFavDog && fevDogs.length > 0 && <div className="bg-gray-100 rounded-xl py-4 absolute text-gray-800 right-0 z-50">
                                <h3 className="text-lg font-semibold mb-6 px-4">Your Favorite Dogs</h3>
                                <div className="flex flex-col gap-4 max-h-[60vh] overflow-scroll px-4">
                                    {fevDogs?.map((dog: Dog) => <DogCardList key={dog.id} removeDogs={() => favClick(dog)} dog={dog} />)}
                                </div>
                                <div className="flex items-center justify-center">
                                    <button onClick={fevMatch} className="bg-blue-400 rounded-xl text-white py-2 px-12 mt-6">Match</button>
                                </div>
                            </div>}
                        </div>
                        <div className="bg-gray-800/30 text-red-200 rounded-full p-2 cursor-pointer hover:bg-red-300/30 hover:text-red-100" onClick={logoutAuth}>
                            <MdOutlineExitToApp size={20} />
                        </div>
                    </div>
                </div>
            </header>
            <main className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row mt-8 gap-6">
                    <h1 className="text-2xl font-bold mb-4">Search for a Dog</h1>
                    <SearchBar query={query} setQuery={setQuery} searchApply={searchApply} />
                </div>

                <div className="mt-8">
                    <div className="flex flex-col-reverse lg:flex-row items-start gap-6 justify-between">
                        <h2>Results : {totalFoundData} Dogs found</h2>
                        <div className="flex items-center gap-6">
                            <Filters filterApply={filterApply} setQuery={setQuery} />
                            <div
                                className="h-12 w-40 px-2 border border-blue-400 rounded-lg"
                            >
                                <select
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    className="h-full w-full outline-none"
                                >
                                    <option value="breed:asc">Breed (A-Z)</option>
                                    <option value="breed:desc">Breed (Z-A)</option>
                                    <option value="name:asc">Name (A-Z)</option>
                                    <option value="name:desc">Name (Z-A)</option>
                                    <option value="age:asc">Age (Youngest First)</option>
                                    <option value="age:desc">Age (Oldest First)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {results.length > 0 && !loading && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 pb-20">
                                {results?.map((dog: Dog) => <DogCard key={dog.id} dog={dog} isFev={fevDogs?.find((item: Dog) => item.id === dog.id) ?? false} favClick={() => favClick(dog)} />)}
                            </div>
                            <div className="flex justify-center items-center gap-4 mb-20">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage(prev => prev - 1);
                                        handleQuery({ ...query, from: (currentPage - 2) * perPage + 1 });
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                                >
                                    Previous
                                </button>

                                <span>Page {currentPage} of {Math.ceil(totalFoundData / perPage)}</span>

                                <button
                                    disabled={currentPage * perPage >= totalFoundData}
                                    onClick={() => {
                                        setCurrentPage(prev => prev + 1);
                                        handleQuery({ ...query, from: currentPage * perPage + 1 });
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {!results?.[0] && !loading && (
                        <div className="w-full min-h-[40vh] flex items-center justify-center">
                            <p>No Dogs Found</p>
                        </div>
                    )}

                    {loading && (
                        <div className="w-full min-h-[40vh] flex items-center justify-center">
                            <p>Loading....</p>
                        </div>
                    )}

                    {matchDog && (
                        <div className="fixed inset-0 bg-gray-300/70 flex items-center justify-center">
                            <div className="px-4 py-4 bg-white rounded-xl">
                                <h2 className="text-lg font-bold text-center mb-4">Match Result</h2>
                                <div className="bg-gray-100 rounded-xl">
                                    <Image src={matchDog.img} alt={matchDog.name} width={200} height={200} className="rounded-t-md object-cover w-[80vw] max-w-[400px]" />
                                    <div className="p-4 flex justify-between items-start">
                                        <div className="mb-1">
                                            <h3 className="text-lg font-semibold mb-3">{matchDog.name}</h3>
                                            <p className="text-gray-600 text-sm">{matchDog.age} Year</p>
                                        </div>
                                        <p className="text-gray-600 text-sm py-1 px-3 bg-gray-100 rounded-full">{matchDog.breed}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button onClick={() => setMatchDog(null)} className="bg-blue-400 rounded-xl text-white py-2 px-8 mt-4">Pickup</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}