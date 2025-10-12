
import { Header } from "@/components/Header";
import { ProdutoCard } from "@/components/ProdutoCard";

export default async function Home() {
  return (
    <div className="bg-[#326497]">
      <Header/>
      <div className="ml-22 grid grid-cols-3 gap-6 content-evenly">
        <div><ProdutoCard type={1} /></div>
        <div><ProdutoCard type={2} /></div>        
        <div><ProdutoCard type={3} /></div>
        <div><ProdutoCard type={4} /></div>        
        <div><ProdutoCard type={5}/></div>
        <div><ProdutoCard type={6} /></div>
      </div>
    </div>
  );
}