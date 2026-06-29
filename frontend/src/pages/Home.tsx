import Bakers from "../components/Bakers";
import DailySpecial from "../components/DailySpecial";
import Hero from "../components/Hero";
import Ingredients from "../components/Ingredients";
import OurPhilosophy from "../components/OurPhilosophy";
import Testimonials from "../components/Testimonials";
import Visit from "../components/Visit";

function Home() {
  return (
    <div>
      <Hero />
      <div id="our-story">
        <OurPhilosophy />
      </div>
      <div id="daily-specials">
        <DailySpecial />
      </div>
      <Bakers />
      <Visit />
      <Ingredients />
      <Testimonials />
    </div>
  );
}

export default Home;
