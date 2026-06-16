import { ingredientData } from "../data";

function Ingredients() {
  const ingredients = ingredientData;
  return (
    <section className="bg-[#F8F7F5] -mx-15 my-20 p-15">
      <div className="text-center">
        <h3 className="text-[14px] text-[#F4AF25] font-bold">QUALITY FIRST</h3>
        <h2 className="text-[36px] font-bold">Featured Ingredients</h2>
      </div>
      <div className="grid grid-cols-3 mt-10 gap-15 ">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex flex-col justify-center items-center text-center bg-white rounded-2xl p-5 gap-4"
          >
            <div className="bg-[#fdf2dc] p-4 rounded-[50%]">
              <img src={ingredient.image} alt="" />
            </div>
            <h2 className="text-[20px] font-bold">{ingredient.name}</h2>
            <p className="text-[#64748B] text-[14px]">
              {ingredient.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Ingredients;
