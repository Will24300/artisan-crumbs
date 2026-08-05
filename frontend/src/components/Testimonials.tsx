import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import { testimonialData } from "../data";
import { API_BASE } from "../utils/api";

interface TestimonialCardItem {
  id: string | number;
  ratings: number;
  comment: string;
  image: string;
  name: string;
  detail: string;
}

function Testimonials() {
  const [items, setItems] = useState<TestimonialCardItem[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/contact/testimonials`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch testimonials");
        return res.json();
      })
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const fetched: TestimonialCardItem[] = data.map((t) => ({
            id: t._id,
            ratings: t.rating > 0 ? t.rating : 5,
            comment: t.message.startsWith('"') ? t.message : `"${t.message}"`,
            name: t.name,
            detail: t.subject || "VERIFIED CUSTOMER",
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`,
          }));

          // Fill remainder with static data if fewer than 3 items
          const fallbacks = testimonialData.slice(0, Math.max(0, 3 - fetched.length)).map((f) => ({
            id: f.id,
            ratings: f.ratings,
            comment: f.comment,
            name: f.name,
            detail: f.detail,
            image: f.image,
          }));

          setItems([...fetched, ...fallbacks]);
        } else {
          setItems(
            testimonialData.map((f) => ({
              id: f.id,
              ratings: f.ratings,
              comment: f.comment,
              name: f.name,
              detail: f.detail,
              image: f.image,
            }))
          );
        }
      })
      .catch(() => {
        setItems(
          testimonialData.map((f) => ({
            id: f.id,
            ratings: f.ratings,
            comment: f.comment,
            name: f.name,
            detail: f.detail,
            image: f.image,
          }))
        );
      });
  }, []);

  const testimonials = items.length > 0 ? items : testimonialData.map((f) => ({
    id: f.id,
    ratings: f.ratings,
    comment: f.comment,
    name: f.name,
    detail: f.detail,
    image: f.image,
  }));

  return (
    <section className="relative bg-[#D46211] -mx-5 md:-mx-10 lg:-mx-15 px-10 py-16 overflow-hidden">
      {/* Ambient depth — soft darker glow in the corner */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,0,0,0.15), transparent 70%)" }}
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-white/60" />
            <h2 className="text-white/90 font-bold text-[13px] tracking-[0.15em] uppercase">
              Testimonials
            </h2>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[36px] font-bold text-white">
            What Our Community is Saying
          </h1>
        </div>

        <Link
          to="contact"
          className="group inline-flex items-center gap-1.5 bg-white text-[#D46211] font-bold text-[14px] px-5 py-2.5 rounded-full w-fit transition-transform duration-200 hover:-translate-y-0.5"
        >
          Leave a comment
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {testimonials.map((testimonial, i) => (
          <div
            key={testimonial.id}
            className="relative bg-white/10 backdrop-blur-md border border-white/20 p-7 rounded-2xl overflow-hidden fade-in-up transition-transform duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* Watermark quote mark — signature element */}
            <span className="font-serif absolute -top-3 right-4 text-[80px] leading-none text-white/10 select-none pointer-events-none">
              "
            </span>

            <div className="relative flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={
                    index < testimonial.ratings
                      ? "fill-amber-300 text-amber-300"
                      : "text-white/30"
                  }
                />
              ))}
            </div>

            <p className="relative text-white/90 text-[16px] italic mt-5 mb-10 leading-relaxed">
              {testimonial.comment}
            </p>

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="rounded-full w-14 h-14 sm:w-16 sm:h-16 object-cover ring-2 ring-white/30 float-slow bg-white/20"
              />
              <div>
                <h2 className="font-bold text-[16px] text-white">{testimonial.name}</h2>
                <p className="text-white/70 text-[12px]">{testimonial.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;