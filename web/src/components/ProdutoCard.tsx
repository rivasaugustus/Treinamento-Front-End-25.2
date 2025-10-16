"use client";

import { Button } from "./ui/button";
import Image, { StaticImageData } from "next/image";
import blue_puffle from "./imgs/blue_puffle.png";
import golden_puffle from "./imgs/golden_puffle.png";
import rainbow_puffle from "./imgs/rainbow_puffle.png"
import pink_puffle from "./imgs/pink_puffle.png"
import diamond_puffle from "./imgs/diamond_puffle.png"
import black_puffle from "./imgs/black_puffle.png"
import { useCart } from "@/hooks/use-card";


const puffleList: Puffle[] = [];

type ProdutoCardProps = {
    type: number;
}

function getPuffle(type: number): Puffle {
    const puffle = puffleList[type - 1];
    return puffle;
}

export class Puffle {
    name: string;
    price: number;
    img: StaticImageData

    constructor(name: string, price: number, img: StaticImageData) {
        this.name = name;
        this.price = price;
        this.img = img;
        puffleList.push(this);
    }
}

const bluePuffle = new Puffle("Puffle Azul", 400, blue_puffle);
const rainbowPuffle = new Puffle("Puffle Arco-Íris", 800, rainbow_puffle);
const goldenPuffle = new Puffle("Puffle Dourado", 5000, golden_puffle);
const unicornPuffle = new Puffle("Puffle Rosa", 1200, pink_puffle);
const diamondPuffle = new Puffle("Puffle Diamante", 8000, diamond_puffle);
const blackPuffle = new Puffle("Puffle Preto", 1200, black_puffle);

export const ProdutoCard = ({ type }: ProdutoCardProps) => {
    const {
        addToCart,
    } = useCart();

    const puffle = getPuffle(type);
    
    return (
        
        <div>
            <div className=" mt-25 h-62 w-87 bg-gray-900 grid border-3 rounded  border-white">
                <div className="flex justify-center mt-1">
                    <Image src={puffle.img} alt="blue_puffle" width={70} className="object-contain" />
                </div>
                <div className="flex justify-center items-center">
                    <h3 className="text-white text-xl font-medium "><span className="font-bold mr-0.5">{puffle.name}</span> - {puffle.price} coins</h3>
                </div>
                <div className="flex justify-center">
                    {puffle.name !== undefined && <Button title="AddToCart" onClick={() => addToCart(puffle)} className="w-[30%] bg-blue-700 text-white rounded-lg cursor-pointer mr-3">Adicionar</Button>}
                </div>
            </div>
        </div>
    );
}