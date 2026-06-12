import Bakers from "../components/Bakers";
import DailySpecial from "../components/DailySpecial";
import Hero from "../components/Hero";
import OurPhilosophy from "../components/OurPhilosophy";

function Home() {
  return (
    <div>
      <Hero />
      <OurPhilosophy />
      <DailySpecial />
      <Bakers />
    </div>
  );
}

export default Home;
