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
import cake1 from "./assets/cakes/cake1.png";
import cake2 from "./assets/cakes/cake2.png";
import cake3 from "./assets/cakes/cake3.png";
import cake4 from "./assets/cakes/cake4.png";
import cake5 from "./assets/cakes/cake5.png";
import cake6 from "./assets/cakes/cake6.png";
import muffin1 from "./assets/muffins/muffin1.jpeg";
import muffin2 from "./assets/muffins/muffin2.jpeg";
import muffin3 from "./assets/muffins/muffin3.jpeg";
import muffin4 from "./assets/muffins/muffin4.jpeg";
import muffin5 from "./assets/muffins/muffin5.jpeg";
import muffin6 from "./assets/muffins/muffin6.jpeg";
import croissant1 from "./assets/croissants/croissant1.jpeg";
import croissant2 from "./assets/croissants/croissant2.jpeg";
import croissant3 from "./assets/croissants/croissant3.jpeg";
import bread1 from "./assets/breads/bread1.jpeg";
import bread2 from "./assets/breads/bread2.jpeg";
import bread3 from "./assets/breads/bread3.jpeg";
import bread4 from "./assets/breads/bread4.jpeg";
import tart1 from "./assets/tarts/tart1.jpeg";
import tart2 from "./assets/tarts/tart2.jpeg";
import tart3 from "./assets/tarts/tart3.jpeg";
import tart4 from "./assets/tarts/tart4.jpeg";
import tart5 from "./assets/tarts/tart5.jpeg";

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

export interface BakeryItem {
  id: string | number;
  name: string;
  img: string;
  price: number;
  description: string;
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
    price: 8.0,
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

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: any; // Type as 'string' if these are image URL paths, or 'any' if they are imported assets
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
}

export interface MenuData {
  categories: Category[];
}

export const data: MenuData = {
  categories: [
    {
      id: 1,
      name: "Cake",
      products: [
        {
          id: 101,
          name: "Chocolate Fudge Cake",
          price: 24.99,
          description: "Rich chocolate cake with fudge frosting",
          image: cake1,
        },
        {
          id: 102,
          name: "Red Velvet Cake",
          price: 26.99,
          description: "Classic red velvet with cream cheese frosting",
          image: cake2,
        },
        {
          id: 103,
          name: "Carrot Cake",
          price: 22.99,
          description: "Moist carrot cake with cream cheese frosting",
          image: cake3,
        },
        {
          id: 104,
          name: "Cheesecake",
          price: 28.99,
          description: "Classic New York style cheesecake",
          image: cake4,
        },
        {
          id: 105,
          name: "Lemon Drizzle Cake",
          price: 23.99,
          description: "Zesty lemon cake with a tangy drizzle glaze",
          image: cake5,
        },
        {
          id: 106,
          name: "Vanilla Sponge Cake",
          price: 21.99,
          description:
            "Light and fluffy vanilla cake with buttercream frosting",
          image: cake6,
        },
      ],
    },
    {
      id: 2,
      name: "Muffins",
      products: [
        {
          id: 201,
          name: "Blueberry Muffin",
          price: 3.99,
          description: "Fresh blueberries in every bite",
          image: muffin6,
        },
        {
          id: 202,
          name: "Chocolate Chip Muffin",
          price: 3.99,
          description: "Loaded with chocolate chips",
          image: muffin5,
        },
        {
          id: 203,
          name: "Lemon Poppy Seed Muffin",
          price: 3.89,
          description: "Tangy lemon with poppy seeds",
          image: muffin3,
        },
        {
          id: 204,
          name: "Banana Nut Muffin",
          price: 3.79,
          description: "Classic banana with walnuts",
          image: muffin4,
        },
        {
          id: 205,
          name: "Cinnamon Swirl Muffin",
          price: 4.29,
          description: "Sweet cinnamon swirls in a soft muffin",
          image: muffin2,
        },
        {
          id: 206,
          name: "Pumpkin Spice Muffin",
          price: 4.49,
          description: "Seasonal pumpkin flavor with warm spices",
          image: muffin1,
        },
      ],
    },
    {
      id: 3,
      name: "Croissant",
      products: [
        {
          id: 301,
          name: "Butter Croissant",
          price: 3.49,
          description: "Classic French butter croissant",
          image: croissant1,
        },
        {
          id: 302,
          name: "Chocolate Croissant",
          price: 3.99,
          description: "Buttery croissant with chocolate filling",
          image: croissant2,
        },
        {
          id: 303,
          name: "Almond Croissant",
          price: 4.29,
          description: "Croissant filled with almond cream",
          image: croissant3,
        },
      ],
    },
    {
      id: 4,
      name: "Bread",
      products: [
        {
          id: 401,
          name: "Sourdough Bread",
          price: 5.99,
          description: "Traditional sourdough with crispy crust",
          image: bread1,
        },
        {
          id: 402,
          name: "Whole Wheat Bread",
          price: 4.99,
          description: "Healthy whole wheat bread",
          image: bread2,
        },
        {
          id: 403,
          name: "Flat Bread",
          price: 3.49,
          description: "Soft flatbread topped with garlic and fresh herbs",
          image: bread3,
        },
        {
          id: 404,
          name: "Brioche Loaf",
          price: 6.49,
          description: "Rich and buttery brioche",
          image: bread4,
        },
      ],
    },
    {
      id: 5,
      name: "Tart",
      products: [
        {
          id: 501,
          name: "Fruit Tart",
          price: 5.99,
          description: "Assorted fresh fruits on custard",
          image: tart1,
        },
        {
          id: 502,
          name: "Apple Tart",
          price: 6.49,
          description: "A rustic tart with sliced apples ",
          image: tart4,
        },
        {
          id: 503,
          name: "Lemon Tart",
          price: 5.79,
          description: "Tangy lemon curd in sweet pastry",
          image: tart2,
        },
        {
          id: 504,
          name: "Berry Tart",
          price: 6.29,
          description: "Mixed berries on vanilla cream",
          image: tart3,
        },
        {
          id: 505,
          name: "Almond Jam Tart",
          price: 5.49,
          description: "A delightful tart with a flaky pastry crust",
          image: tart5,
        },
      ],
    },
    {
      id: 6,
      name: "Favorite",
      products: [
        {
          id: 101,
          name: "Chocolate Fudge Cake",
          price: 24.99,
          description: "Rich chocolate cake with fudge frosting",
          image: cake1,
        },
        {
          id: 201,
          name: "Blueberry Muffin",
          price: 3.99,
          description: "Fresh blueberries in every bite",
          image: muffin1,
        },
        {
          id: 301,
          name: "Butter Croissant",
          price: 3.49,
          description: "Classic French butter croissant",
          image: croissant1,
        },
        {
          id: 401,
          name: "Sourdough Bread",
          price: 5.99,
          description: "Traditional sourdough with crispy crust",
          image: bread1,
        },
        {
          id: 303,
          name: "Almond Croissant",
          price: 4.29,
          description: "Croissant filled with almond cream",
          image: croissant3,
        },
        {
          id: 503,
          name: "Lemon Tart",
          price: 5.79,
          description: "Tangy lemon curd in sweet pastry",
          image: tart3,
        },
      ],
    },
  ],
};
