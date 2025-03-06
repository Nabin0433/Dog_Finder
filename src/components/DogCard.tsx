import Image from "next/image";
import { Dog } from "../../types";
import { MdOutlineFavoriteBorder } from "react-icons/md";

interface DogCardProps {
    dog: Dog
    favClick: () => void
    isFev: boolean
}

export default function DogCard({ dog, favClick, isFev }: DogCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
                <Image src={dog.img} alt={dog.name} width={200} height={200} className="rounded-t-md object-cover w-full h-80 lg:h-60" />
                <div className={`absolute bottom-2 left-2 cursor-pointer ${isFev ? 'bg-blue-200/80' : 'bg-gray-50/60 hover:bg-blue-200/80'} rounded-full p-1`} onClick={favClick}>
                    <MdOutlineFavoriteBorder color={isFev ? "blue" : "gray"} size={23} />
                </div>
            </div>
            <div className="p-4 flex justify-between items-start">
                <div className="mb-1">
                    <h3 className="text-lg font-semibold mb-3">{dog.name}</h3>
                    <p className="text-gray-600 text-sm">{dog.age} Year</p>
                </div>
                <p className="text-gray-600 text-sm py-1 px-3 bg-gray-100 rounded-full">{dog.breed}</p>
            </div>
        </div>
    );
}
