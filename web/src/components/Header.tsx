import Image from "next/image";
import { CartButton } from "./cartButton";
import blue_puffle from "./imgs/blue_puffle.png";
import { LogOut } from "lucide-react";

export function Header() {
    return (
        <div className="bg-[#000E41] h-25 border-b-3 border-white flex items-center justify-between p-4">
            <div className="flex items-center">
                <Image src={blue_puffle} alt="blue_puffle" width={70} height={70}></Image>
                <h1 className="font-bold text-white m-4 text-5xl order-2">Puffle Store</h1>
            </div>
            <div className="flex items-center gap-3">
                <h4 className="text-white m-5 text-xl">Olá, <span className="font-bold">NTecDaSilvaJR</span>!</h4>
                <CartButton/>
                <LogOut className="text-white" size={40} />
            </div>
        </div>
    );
}