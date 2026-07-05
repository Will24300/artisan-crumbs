import type { OpeningHour } from "../types";
import iconImg from "../assets/Icon.png";
import { MapPin, Phone, Mail, Globe, Share2, ThumbsUp } from "lucide-react";

const openingHours: OpeningHour[] = [
    { label: "Mon - Fri", hours: "6:00 AM - 6:00 PM" },
    { label: "Saturday", hours: "7:00 AM - 4:00 PM" },
    { label: "Sunday", hours: "8:00 AM - 2:00 PM" },
];

export default function Footer2() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16 px-6 md:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-white">
                        <img src={iconImg} alt="" />
                        <h2 className="text-2xl font-bold tracking-tight">Sweet Delights</h2>
                    </div>
                    <p className="text-sm leading-relaxed">
                        Crafting artisan pastries and breads with tradition and love since 1995. Your daily source of baked
                        happiness.
                    </p>

                    {/* Fixed the broken anchor tags below */}
                    <div className="flex gap-4">
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            href="#"
                            aria-label="Website"
                        >
                            <Globe className="w-5 h-5" />
                        </a>

                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            href="#"
                            aria-label="Share"
                        >
                            <Share2 className="w-5 h-5" />
                        </a>

                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            href="#"
                            aria-label="Like"
                        >
                            <ThumbsUp className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-white font-bold text-lg">Quick Links</h3>
                    <ul className="space-y-3 text-sm">
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                Our Menu
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                Order Online
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                Catering
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-primary transition-colors" href="#">
                                Gift Cards
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="text-white font-bold text-lg">Contact Us</h3>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <MapPin className="text-primary w-5 h-5 shrink-0" />
                            <span>
                                123 Baker Street, Flour District
                                <br />
                                Pastry City, PC 45678
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="text-primary w-5 h-5 shrink-0" />
                            <span>(555) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="text-primary w-5 h-5 shrink-0" />
                            <span>hello@sweetdelights.com</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="text-white font-bold text-lg">Opening Hours</h3>
                    <ul className="space-y-3 text-sm">
                        {openingHours.map((entry) => (
                            <li key={entry.label} className="flex justify-between">
                                <span>{entry.label}</span>
                                <span className="text-white">{entry.hours}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Open Now
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs">
                <p>© 2026 Sweet Delights Bakery. All rights reserved. Handcrafted with love.</p>
            </div>
        </footer>
    );
}