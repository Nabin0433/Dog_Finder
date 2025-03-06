import Image from "next/image";
import { Dog } from "../../types";
import { MdDeleteForever } from "react-icons/md";

interface DogCardProps {
    dog: Dog
    removeDogs: () => void
}

export default function DogCardList({ dog, removeDogs }: DogCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex items-center space-x-4 p-4 min-w-80 max-w-96 min-h-32">
            <Image
                src={dog.img}
                alt={dog.name}
                width={100}
                height={100}
                className="rounded-md object-cover w-24 h-24"
            />
            <div className="flex-1 gap-1 flex flex-col">
                <h3 className="text-lg font-semibold">{dog.name}</h3>
                <p className="text-gray-600 text-sm">{dog.age} Year</p>
                <p className="text-gray-600 text-xs py-1 px-1 flex items-center justify-center bg-gray-100 rounded-full">{dog.breed}</p>
            </div>
            <div className="cursor-pointer" onClick={removeDogs}>
                <MdDeleteForever size={22} color="red" />
            </div>
        </div>
    );
}
