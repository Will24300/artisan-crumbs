import { Link } from "react-router-dom";
import { testimonialData } from "../data";

function Testimonials() {
  const testimonials = testimonialData;
  return (
    <section className="my-15">
      <h2 className="text-[#F4AF25] font-bold text-[14px]">TESTIMONIALS</h2>
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] font-bold">What Our Community is Saying</h1>
        <Link to="contact" className="text-[#F4AF25] font-bold text-[16px]">
          Leave a comment
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-15 mt-10">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-[#F8F7F5] p-7 rounded-2xl">
            <div className="flex">
              {[...Array(testimonial.ratings)].map((_, index) => (
                <img key={index} src={testimonial.star} alt="" />
              ))}
            </div>
            <p className="text-[#334155] text-[16px] italic mt-5 mb-10 ">
              {testimonial.comment}
            </p>
            <div className="flex justify-start items-center gap-4">
              <img
                src={testimonial.image}
                alt="user icon"
                className="rounded-4xl"
              />
              <div>
                <h2 className="font-bold text-[16px]">{testimonial.name}</h2>
                <p className="text-[#64748B] text-[12px]">
                  {testimonial.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
