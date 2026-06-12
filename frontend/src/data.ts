import daily1 from "./assets/daily1.png";
import daily2 from "./assets/daily2.png";
import daily3 from "./assets/daily3.png";
import baker1 from "./assets/baker1.jpg";
import baker2 from "./assets/baker2.jpg";
import baker3 from "./assets/baker3.jpg";

interface DailySpecialItems {
  id: string | number;
  name: string;
  image: string;
  tag?: "LIMITED" | "CHEF'S CHOICE";
  description: string;
  price: number;
}

interface BakerItems {
  id: string | number;
  name: string;
  speciality: string;
  image: string;
}

export const dailySpecialData: DailySpecialItems[] = [
  {
    id: 1,
    name: "Honey Glazed Danish",
    price: 4.5,
    description:
      "Sweet, flaky pastry layers filled with vanilla creamand topped with seasonal berries.",
    tag: "LIMITED",
    image: daily1,
  },
  {
    id: 2,
    name: "Rustic Rye Loaf",
    price: 8,
    description:
      "Hearty and wholesome 48-hour fermented sourdough rye with a thick, crunchy crust.",
    image: daily2,
  },
  {
    id: 3,
    name: "Wildberry Tart",
    price: 5.5,
    description:
      "Bursting with flavor, featuring hand-picked mountain berries on a buttery shortbread crust",
    image: daily3,
    tag: "CHEF'S CHOICE",
  },
];

export const bakersData: BakerItems[] = [
  {
    id: 1,
    name: "Thomas Miller",
    speciality: "Head Baker & Founder",
    image: baker1,
  },
  {
    id: 2,
    name: "Elena Rossi",
    speciality: "Master Pastry Chef",
    image: baker2,
  },
  {
    id: 3,
    name: "David Chen",
    speciality: "Sourdough Specialist",
    image: baker3,
  },
];
