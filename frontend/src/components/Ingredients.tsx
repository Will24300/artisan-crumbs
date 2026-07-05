import { ingredientData } from "../data";

function Ingredients() {
  const ingredients = ingredientData;
  return (
    <section className="bg-[#F8F7F5] -mx-15 my-20 p-6 sm:p-10">
      <div className="text-center">
        <h3 className="text-[14px] text-[#F4AF25] font-bold">QUALITY FIRST</h3>
        <h2 className="text-[36px] sm:text-[40px] font-bold">Featured Ingredients</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex flex-col justify-center items-center text-center bg-white rounded-2xl p-5 gap-4"
          >
            <div className="bg-[#fdf2dc] p-4 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <img src={ingredient.image} alt={ingredient.name} className="w-full h-full object-contain" />
            </div>
            <h2 className="text-[20px] font-bold">{ingredient.name}</h2>
            <p className="text-[#64748B] text-[14px] leading-relaxed">
              {ingredient.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Ingredients;
