import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/artisan-crumbs";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 20, min: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const productsData = [
  // Cakes
  {
    name: "Chocolate Fudge Cake",
    price: 24.99,
    category: "Cake",
    description: "Rich chocolate cake with fudge frosting",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
    tags: ["Best Seller", "Chocolate"],
    stock: 25,
  },
  {
    name: "Red Velvet Cake",
    price: 26.99,
    category: "Cake",
    description: "Classic red velvet with cream cheese frosting",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=1000&auto=format&fit=crop",
    tags: ["Popular"],
    stock: 20,
  },
  {
    name: "Carrot Cake",
    price: 22.99,
    category: "Cake",
    description: "Moist carrot cake with cream cheese frosting",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=1000&auto=format&fit=crop",
    tags: ["Nuts", "Organic"],
    stock: 18,
  },
  {
    name: "Cheesecake",
    price: 28.99,
    category: "Cake",
    description: "Classic New York style cheesecake",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
    tags: ["Rich", "Creamy"],
    stock: 15,
  },
  {
    name: "Lemon Drizzle Cake",
    price: 23.99,
    category: "Cake",
    description: "Zesty lemon cake with a tangy drizzle glaze",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
    tags: ["Zesty", "Citrus"],
    stock: 22,
  },
  {
    name: "Vanilla Sponge Cake",
    price: 21.99,
    category: "Cake",
    description: "Light and fluffy vanilla cake with buttercream frosting",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1000&auto=format&fit=crop",
    tags: ["Classic"],
    stock: 30,
  },

  // Muffins
  {
    name: "Blueberry Muffin",
    price: 3.99,
    category: "Muffins",
    description: "Fresh blueberries in every bite",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=1000&auto=format&fit=crop",
    tags: ["Fresh", "Fruity"],
    stock: 40,
  },
  {
    name: "Chocolate Chip Muffin",
    price: 3.99,
    category: "Muffins",
    description: "Loaded with chocolate chips",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=1000&auto=format&fit=crop",
    tags: ["Chocolate", "Sweet"],
    stock: 35,
  },
  {
    name: "Lemon Poppy Seed Muffin",
    price: 3.89,
    category: "Muffins",
    description: "Tangy lemon with poppy seeds",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop",
    tags: ["Citrus"],
    stock: 25,
  },
  {
    name: "Banana Nut Muffin",
    price: 3.79,
    category: "Muffins",
    description: "Classic banana with walnuts",
    image: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?q=80&w=1000&auto=format&fit=crop",
    tags: ["Nuts", "Breakfast"],
    stock: 28,
  },
  {
    name: "Cinnamon Swirl Muffin",
    price: 4.29,
    category: "Muffins",
    description: "Sweet cinnamon swirls in a soft muffin",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    tags: ["Warm Spice"],
    stock: 20,
  },
  {
    name: "Pumpkin Spice Muffin",
    price: 4.49,
    category: "Muffins",
    description: "Seasonal pumpkin flavor with warm spices",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    tags: ["Seasonal", "Spiced"],
    stock: 15,
  },

  // Croissants
  {
    name: "Butter Croissant",
    price: 3.49,
    category: "Croissant",
    description: "Classic French butter croissant",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
    tags: ["French", "Flaky"],
    stock: 50,
  },
  {
    name: "Chocolate Croissant",
    price: 3.99,
    category: "Croissant",
    description: "Buttery croissant with chocolate filling",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1000&auto=format&fit=crop",
    tags: ["Chocolate", "Breakfast"],
    stock: 45,
  },
  {
    name: "Almond Croissant",
    price: 4.29,
    category: "Croissant",
    description: "Croissant filled with almond cream",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=1000&auto=format&fit=crop",
    tags: ["Nuts", "Sweet"],
    stock: 30,
  },

  // Breads
  {
    name: "Sourdough Bread",
    price: 5.99,
    category: "Bread",
    description: "Traditional sourdough with crispy crust",
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=1000&auto=format&fit=crop",
    tags: ["Artisan", "Crusty"],
    stock: 25,
  },
  {
    name: "Whole Wheat Bread",
    price: 4.99,
    category: "Bread",
    description: "Healthy whole wheat bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    tags: ["Healthy", "Whole Grain"],
    stock: 30,
  },
  {
    name: "Flat Bread",
    price: 3.49,
    category: "Bread",
    description: "Soft flatbread topped with garlic and fresh herbs",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop",
    tags: ["Herbs", "Garlic"],
    stock: 20,
  },
  {
    name: "Brioche Loaf",
    price: 6.49,
    category: "Bread",
    description: "Rich and buttery brioche",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop",
    tags: ["Buttery", "Soft"],
    stock: 18,
  },

  // Tarts
  {
    name: "Fruit Tart",
    price: 5.99,
    category: "Tart",
    description: "Assorted fresh fruits on custard",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
    tags: ["Fresh Fruit", "Custard"],
    stock: 20,
  },
  {
    name: "Apple Tart",
    price: 6.49,
    category: "Tart",
    description: "A rustic tart with sliced apples",
    image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=1000&auto=format&fit=crop",
    tags: ["Apple", "Cinnamon"],
    stock: 15,
  },
  {
    name: "Lemon Tart",
    price: 5.79,
    category: "Tart",
    description: "Tangy lemon curd in sweet pastry",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
    tags: ["Tangy", "Citrus"],
    stock: 22,
  },
  {
    name: "Berry Tart",
    price: 6.29,
    category: "Tart",
    description: "Mixed berries on vanilla cream",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
    tags: ["Berries", "Cream"],
    stock: 25,
  },
  {
    name: "Almond Jam Tart",
    price: 5.49,
    category: "Tart",
    description: "A delightful tart with a flaky pastry crust and almond jam",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1000&auto=format&fit=crop",
    tags: ["Almond", "Jam"],
    stock: 18,
  },
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    console.log("Upserting products into local database...");
    let inserted = 0;
    let updated = 0;

    for (const item of productsData) {
      const res = await Product.updateOne(
        { name: item.name },
        { $set: item },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        inserted++;
      } else {
        updated++;
      }
    }

    const count = await Product.countDocuments();
    console.log(`✅ Seeding Complete! ${inserted} new products inserted, ${updated} updated. Total products in database: ${count}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
