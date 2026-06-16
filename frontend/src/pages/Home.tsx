import Bakers from "../components/Bakers";
import DailySpecial from "../components/DailySpecial";
import Hero from "../components/Hero";
import OurPhilosophy from "../components/OurPhilosophy";
import Visit from "../components/Visit";

function Home() {
  return (
    <div>
      <Hero />
      <OurPhilosophy />
      <DailySpecial />
      <Bakers />
      <Visit />
    </div>
  );
}

export default Home;
