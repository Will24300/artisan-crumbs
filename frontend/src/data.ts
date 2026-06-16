import daily1 from "./assets/daily1.png";
import daily2 from "./assets/daily2.png";
import daily3 from "./assets/daily3.png";
import baker1 from "./assets/baker/baker1.jpg";
import baker2 from "./assets/baker/baker2.jpg";
import baker3 from "./assets/baker/baker3.jpg";
import ingredient1 from "./assets/ingredients-img/ing1.png";
import ingredient2 from "./assets/ingredients-img/ing2.png";
import ingredient3 from "./assets/ingredients-img/ing3.png";
import star from "./assets/testimonials-img/star.png";
import user1 from "./assets/testimonials-img/user1.png";
import user2 from "./assets/testimonials-img/user2.png";
import user3 from "./assets/testimonials-img/user3.png";

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

interface IngredientItems {
  id: string | number;
  image: string;
  name: string;
  description: string;
}

interface TestimonialsItems {
  id: string | number;
  star: string;
  ratings: number;
  comment: string;
  image: string;
  name: string;
  detail: string;
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

export const ingredientData: IngredientItems[] = [
  {
    id: 1,
    name: "Heritage Wheat",
    description:
      "Stone-ground ancient grains sourced from local organic farms for superior nutrition.",
    image: ingredient1,
  },
  {
    id: 2,
    name: "Filtered Spring Water",
    description:
      "Pure water is essential for the healthy growth of our wild yeast cultures.",
    image: ingredient2,
  },
  {
    id: 3,
    name: "Seasonal Produce",
    description:
      "Fresh berries, nuts, and herbs from the Sweetwater Valley farmer's market.",
    image: ingredient3,
  },
];

export const testimonialData: TestimonialsItems[] = [
  {
    id: 1,
    star: star,
    ratings: 5,
    comment: `"The sourdough here is life-changing. I come every Saturday morning for a loaf and a croissant. The atmosphere is just so warm and welcoming."`,
    image: user1,
    name: "Sarah Jenkins",
    detail: "LOCAL GUIDE",
  },
  {
    id: 2,
    star: star,
    ratings: 4,
    comment: `"The custom cake they made for my daughter's birthday was stunning and delicious. Not too sweet, perfectly balanced flavors."`,
    image: user2,
    name: "Marcus Thorne",
    detail: "VERIFIED CUSTOMER",
  },
  {
    id: 3,
    star: star,
    ratings: 5,
    comment: `"Best coffee in the neighborhood paired with a cinnamon bun? Yes please. This has become my favorite remote working spot."`,
    image: user3,
    name: "Elena Rodriguez",
    detail: "PASTRY ENTHUSIAST",
  },
];
