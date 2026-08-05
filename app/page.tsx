import Piano from "./Components/piano";

export default function Home(){
  return(
    <main className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-bold mb-8">My piano</h1>
    <Piano/>
    </main>
  );

}
