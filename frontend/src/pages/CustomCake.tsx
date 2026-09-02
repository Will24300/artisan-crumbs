import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Cake,
  Check,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { addToCart } from "../features/cart";

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */

interface SizeOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  badge?: string;
  cakeW: number;
  cakeH: number;
  cakeY: number;
  plateRx: number;
}

interface FlavorOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  hex: string;
  badge?: string;
}

interface FillingOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  hex: string;
}

interface ToppingOption {
  id: string;
  name: string;
  desc: string;
  price: number;
  badge?: string;
}

interface DietaryOption {
  id: string;
  name: string;
  extra: number;
}

const SIZES: SizeOption[] = [
  { id: "6-round",  name: '6" Round', desc: "Feeds 4–6. Intimate celebrations.",  price: 28.0, cakeW: 72, cakeH: 52, cakeY: 170, plateRx: 50 },
  { id: "8-round",  name: '8" Round', desc: "Feeds 8–12. Our most-ordered size.", price: 38.0, badge: "Popular", cakeW: 100, cakeH: 62, cakeY: 158, plateRx: 66 },
  { id: "10-round", name: '10" Round', desc: "Feeds 14–18. Built for a crowd.",   price: 52.0, cakeW: 120, cakeH: 72, cakeY: 148, plateRx: 76 },
  { id: "2-tier",   name: "2-Tier",   desc: "Feeds 22+. Stacked and dressed up.", price: 85.0, badge: "Showstopper", cakeW: 110, cakeH: 70, cakeY: 150, plateRx: 74 },
];

const FLAVORS: FlavorOption[] = [
  { id: "vanilla", name: "Tahitian vanilla bean", desc: "Light sponge, real vanilla bean pods.", price: 0, hex: "#F6E7B4" },
  { id: "chocolate", name: "Belgian dark chocolate", desc: "70% cocoa sponge, espresso undertone.", price: 4.0, hex: "#5A3624" },
  { id: "red-velvet", name: "Classic red velvet", desc: "Cocoa buttermilk sponge, ruby hue.", price: 4.0, hex: "#8C1F2F" },
  { id: "lemon-berry", name: "Lemon zest & wild berry", desc: "Zesty sponge studded with raspberry.", price: 5.0, hex: "#EAD873" },
  { id: "pistachio", name: "Sicilian pistachio", desc: "Roasted pistachio, hint of cardamom.", price: 6.0, hex: "#A9C48A", badge: "Artisan" },
];

const FILLINGS: FillingOption[] = [
  { id: "swiss-buttercream", name: "Swiss meringue buttercream", desc: "Silky, light, traditionally French.", price: 0, hex: "#FBF3E1" },
  { id: "cream-cheese", name: "Whipped cream cheese", desc: "Tangy, smooth, classic pairing.", price: 3.5, hex: "#F3E2B8" },
  { id: "salted-caramel", name: "Salted caramel ganache", desc: "Slow-cooked caramel, sea salt.", price: 4.5, hex: "#B8722C" },
  { id: "raspberry-curd", name: "Raspberry jam & lemon curd", desc: "Tart curd layered with preserve.", price: 4.0, hex: "#C23B54" },
  { id: "hazelnut-praline", name: "Hazelnut chocolate praline", desc: "Crunchy praline, gianduja swirl.", price: 5.5, hex: "#6B4423" },
];

const TOPPINGS: ToppingOption[] = [
  { id: "fresh-berries", name: "Organic fresh berries", desc: "Raspberry, blackberry, strawberry.", price: 6.0 },
  { id: "macarons", name: "Mini macarons", desc: "Four delicate almond shells on top.", price: 7.5, badge: "Chef's pick" },
  { id: "gold-leaf", name: "24k edible gold leaf", desc: "Genuine gold leaf accents.", price: 8.0 },
  { id: "choc-curls", name: "Belgian chocolate curls", desc: "Cascading dark & white shavings.", price: 4.0 },
  { id: "edible-flowers", name: "Pressed edible flowers", desc: "Organic pansies and rose petals.", price: 5.0 },
];

const DIETARY: DietaryOption[] = [
  { id: "standard", name: "Standard", extra: 0 },
  { id: "gluten-free", name: "Gluten-free", extra: 5.0 },
  { id: "vegan", name: "Vegan", extra: 5.0 },
];

const STEPS = [
  { id: 1, label: "Size" },
  { id: 2, label: "Sponge" },
  { id: 3, label: "Frosting" },
  { id: 4, label: "Toppings" },
  { id: 5, label: "Finishing" },
];

/* ---------------------------------------------------------------------- */
/* Cake preview illustration — reflects live selection                    */
/* ---------------------------------------------------------------------- */

interface ToppingMarkProps {
  id: string;
  x: number;
  y: number;
  k: string;
}

function ToppingMark({ id, x, y, k }: ToppingMarkProps) {
  switch (id) {
    case "fresh-berries":
      return (
        <g key={k}>
          <circle cx={x} cy={y} r="4.2" fill="#7B1E3D" />
          <circle cx={x + 8} cy={y + 3} r="3.4" fill="#9C2C4C" />
        </g>
      );
    case "macarons":
      return (
        <g key={k}>
          <ellipse cx={x} cy={y} rx="7" ry="4.5" fill="#F6CADD" stroke="#E3A9C4" strokeWidth="0.6" />
          <rect x={x - 7} y={y - 1} width="14" height="2" fill="#FBEFE0" />
        </g>
      );
    case "gold-leaf":
      return (
        <path key={k} d={`M${x - 6},${y} l5,-4 l6,2 l-3,5 l-6,1 Z`} fill="#D4AF37" stroke="#B8901F" strokeWidth="0.4" />
      );
    case "choc-curls":
      return (
        <path key={k} d={`M${x - 6},${y + 3} q4,-9 8,0 q4,-9 8,0`} fill="none" stroke="#4A2A16" strokeWidth="2" strokeLinecap="round" />
      );
    case "edible-flowers":
      return (
        <g key={k}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={x} cy={y} rx="3" ry="1.6" fill="#E8A6C6" transform={`rotate(${a} ${x} ${y}) translate(0 -3)`} />
          ))}
          <circle cx={x} cy={y} r="1.6" fill="#D4AF37" />
        </g>
      );
    default:
      return null;
  }
}

interface CakePreviewProps {
  size: SizeOption;
  flavor: FlavorOption;
  filling: FillingOption;
  toppings: ToppingOption[];
  message: string;
}

function CakePreview({ size, flavor, filling, toppings, message }: CakePreviewProps) {
  const isTiered = size.id === "2-tier";
  const cx = 120;
  const { cakeW, cakeH, cakeY, plateRx } = size;
  const cakeX = cx - cakeW / 2;
  const plateY = cakeY + cakeH + 2;
  const frostH = Math.round(cakeH * 0.2);
  const dripY = cakeY + frostH;

  const upperW = Math.round(cakeW * 0.58);
  const upperH = Math.round(cakeH * 0.72);
  const upperX = cx - upperW / 2;
  const upperY = cakeY - upperH - 2;
  const upperFrostH = Math.round(upperH * 0.22);
  const upperDripY = upperY + upperFrostH;

  const spread = toppings.slice(0, 5);
  const topY = isTiered ? upperY - 4 : cakeY - 4;
  const startX = cx - (spread.length - 1) * 11;

  const scallops = Math.max(3, Math.round(cakeW / 18));
  const sw = cakeW / scallops;
  let dripPath = `M${cakeX},${dripY}`;
  for (let i = 0; i < scallops; i++) {
    const depth = 8 + (i % 2) * 4;
    dripPath += ` q${sw / 2},${depth} ${sw},0`;
  }
  dripPath += " Z";

  const upperScallops = Math.max(2, Math.round(upperW / 18));
  const usw = upperW / upperScallops;
  let upperDripPath = `M${upperX},${upperDripY}`;
  for (let i = 0; i < upperScallops; i++) {
    const depth = 6 + (i % 2) * 4;
    upperDripPath += ` q${usw / 2},${depth} ${usw},0`;
  }
  upperDripPath += " Z";

  return (
    <svg viewBox="0 0 240 270" className="w-full max-w-[220px] mx-auto select-none" aria-hidden="true">
      <ellipse cx={cx} cy={plateY + 6} rx={plateRx} ry="11" fill="#E2D9CC" stroke="#C9BEAF" strokeWidth="1" />
      <ellipse cx={cx} cy={plateY + 3} rx={plateRx} ry="9" fill="#FAF6F0" />

      {isTiered && (
        <>
          <rect x={upperX} y={upperY} width={upperW} height={upperH} rx="7" fill={flavor.hex} stroke="rgba(36,24,18,0.2)" strokeWidth="0.8" />
          <rect x={upperX} y={upperY} width={upperW} height={upperFrostH} rx="6" fill={filling.hex} />
          <path d={upperDripPath} fill={filling.hex} />
          <rect x={upperX + 3} y={upperY + upperH - 6} width={upperW - 6} height="3" rx="1.5" fill={filling.hex} opacity="0.5" />
        </>
      )}

      <rect x={cakeX} y={cakeY} width={cakeW} height={cakeH} rx="9" fill={flavor.hex} stroke="rgba(36,24,18,0.2)" strokeWidth="0.8" />
      <rect x={cakeX} y={cakeY} width={cakeW} height={frostH} rx="7" fill={filling.hex} />
      <path d={dripPath} fill={filling.hex} />
      <rect x={cakeX + 4} y={cakeY + cakeH - 7} width={cakeW - 8} height="3" rx="1.5" fill={filling.hex} opacity="0.45" />

      <text x={cx} y={cakeY + cakeH / 2 + 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" style={{ fontSize: "11px", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>
        {size.name}
      </text>

      {spread.map((t, i) => (
        <ToppingMark key={t.id} id={t.id} x={startX + i * 22} y={topY} k={t.id} />
      ))}

      {message ? (
        <g>
          <rect x="58" y="255" width="124" height="1" fill="#D46211" opacity="0.4" />
          <text
            x={cx}
            y="266"
            textAnchor="middle"
            fill="#D46211"
            style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700 }}
          >
            {message.length > 28 ? message.slice(0, 28) + "…" : message}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Small UI components                                                    */
/* ---------------------------------------------------------------------- */

interface SealProps {
  children: React.ReactNode;
}

function Seal({ children }: SealProps) {
  return (
    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF4EB] dark:bg-[#D46211]/20 text-[#D46211] dark:text-amber-400 border border-[#D46211]/20">
      {children}
    </span>
  );
}

interface OptionCardProps {
  active?: boolean;
  onClick?: () => void;
  title: string;
  desc: string;
  priceLabel: string;
  badge?: string;
  swatch?: string;
  checkbox?: boolean;
}

function OptionCard({
  active,
  onClick,
  title,
  desc,
  priceLabel,
  badge,
  swatch,
  checkbox,
}: OptionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 bg-white dark:bg-stone-900 ${
        active
          ? "border-[#D46211] bg-[#FFF4EB]/60 dark:bg-[#D46211]/15 ring-1 ring-[#D46211]"
          : "border-gray-200 dark:border-stone-800 hover:border-gray-300 dark:hover:border-stone-700"
      }`}
    >
      {badge && <Seal>{badge}</Seal>}
      <div className="flex items-start gap-3">
        {swatch && <span className="w-2.5 h-9 rounded-md flex-shrink-0 mt-0.5 border border-black/10" style={{ backgroundColor: swatch }} />}
        <div className="min-w-0 flex-1 pr-12">
          <h3 className="font-serif font-bold text-base text-[#241812] dark:text-stone-100 leading-snug">{title}</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">{desc}</p>
        </div>
        {checkbox !== undefined && (
          <span
            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
              checkbox
                ? "bg-[#D46211] border-[#D46211] text-white"
                : "border-gray-300 dark:border-stone-700 text-transparent"
            }`}
          >
            {checkbox && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
          </span>
        )}
      </div>
      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-stone-800 flex justify-between items-baseline text-xs">
        <span className="text-stone-400 dark:text-stone-500">{swatch ? "Flavor" : ""}</span>
        <span className="font-bold text-[#D46211] text-sm">{priceLabel}</span>
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  value: string;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <span className="text-stone-500 dark:text-stone-400 shrink-0">{label}</span>
      <span className="text-[#241812] dark:text-stone-200 font-medium text-right">{value}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main Custom Cake Page                                                  */
/* ---------------------------------------------------------------------- */

export function CustomCakePage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(SIZES[1]);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorOption>(FLAVORS[0]);
  const [selectedFilling, setSelectedFilling] = useState<FillingOption>(FILLINGS[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([TOPPINGS[0]]);
  const [pipedText, setPipedText] = useState<string>("");
  const [dietaryOption, setDietaryOption] = useState<string>("standard");
  const [confirmation, setConfirmation] = useState<boolean>(false);

  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const dietary = DIETARY.find((d) => d.id === dietaryOption) || DIETARY[0];
  const totalPrice = useMemo(
    () => selectedSize.price + selectedFlavor.price + selectedFilling.price + toppingsPrice + (dietary?.extra || 0),
    [selectedSize, selectedFlavor, selectedFilling, toppingsPrice, dietary]
  );

  const toggleTopping = (topping: ToppingOption) => {
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  /** Build a self-contained SVG data-URL that mirrors live preview. */
  const generateCakeImageDataUrl = useCallback(() => {
    const cx = 120;
    const { cakeW, cakeH, cakeY, plateRx } = selectedSize;
    const cakeX = cx - cakeW / 2;
    const plateY = cakeY + cakeH + 2;
    const frostH = Math.round(cakeH * 0.2);
    const dripY = cakeY + frostH;
    const isTiered = selectedSize.id === "2-tier";
    const upperW = Math.round(cakeW * 0.58);
    const upperH = Math.round(cakeH * 0.72);
    const upperX = cx - upperW / 2;
    const upperY = cakeY - upperH - 2;
    const upperFrostH = Math.round(upperH * 0.22);
    const upperDripY = upperY + upperFrostH;

    const scallops = Math.max(3, Math.round(cakeW / 18));
    const sw = cakeW / scallops;
    let dripPath = `M${cakeX},${dripY}`;
    for (let i = 0; i < scallops; i++) { dripPath += ` q${sw / 2},${8 + (i % 2) * 4} ${sw},0`; }
    dripPath += " Z";

    const usc = Math.max(2, Math.round(upperW / 18));
    const usw = upperW / usc;
    let udp = `M${upperX},${upperDripY}`;
    for (let i = 0; i < usc; i++) { udp += ` q${usw / 2},${6 + (i % 2) * 4} ${usw},0`; }
    udp += " Z";

    const upperTierSvg = isTiered ? `
      <rect x="${upperX}" y="${upperY}" width="${upperW}" height="${upperH}" rx="7" fill="${selectedFlavor.hex}" stroke="rgba(36,24,18,0.2)" stroke-width="0.8"/>
      <rect x="${upperX}" y="${upperY}" width="${upperW}" height="${upperFrostH}" rx="6" fill="${selectedFilling.hex}"/>
      <path d="${udp}" fill="${selectedFilling.hex}"/>
    ` : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 270" width="240" height="270">
      <rect width="240" height="270" fill="#F9F9F8" rx="12"/>
      <ellipse cx="${cx}" cy="${plateY + 6}" rx="${plateRx}" ry="11" fill="#E2D9CC" stroke="#C9BEAF" stroke-width="1"/>
      <ellipse cx="${cx}" cy="${plateY + 3}" rx="${plateRx}" ry="9" fill="#FAF6F0"/>
      ${upperTierSvg}
      <rect x="${cakeX}" y="${cakeY}" width="${cakeW}" height="${cakeH}" rx="9" fill="${selectedFlavor.hex}" stroke="rgba(36,24,18,0.2)" stroke-width="0.8"/>
      <rect x="${cakeX}" y="${cakeY}" width="${cakeW}" height="${frostH}" rx="7" fill="${selectedFilling.hex}"/>
      <path d="${dripPath}" fill="${selectedFilling.hex}"/>
      <text x="${cx}" y="${cakeY + cakeH / 2 + 4}" text-anchor="middle" fill="rgba(255,255,255,0.4)" style="font-size:11px;font-weight:700">🎂</text>
    </svg>`;

    return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
  }, [selectedSize, selectedFlavor, selectedFilling]);

  const authUser = useSelector((state: any) => state.auth?.user);

  const handleAddToCart = () => {
    if (authUser?.role === "admin") {
      toast.error("Administrators cannot place orders or customize cakes.");
      return;
    }
    const summaryLines = [
      `Size: ${selectedSize.name}`,
      `Sponge: ${selectedFlavor.name}`,
      `Filling: ${selectedFilling.name}`,
      `Toppings: ${selectedToppings.map((t) => t.name).join(", ") || "None"}`,
      dietaryOption !== "standard" ? `Dietary: ${dietaryOption.toUpperCase()}` : "",
      pipedText ? `Piped Message: "${pipedText}"` : "",
    ].filter(Boolean);

    const customDetails = summaryLines.join(" | ");

    dispatch(
      addToCart({
        productId: `custom-cake-${Date.now()}`,
        quantity: 1,
        customName: `Custom ${selectedSize.name}`,
        customPrice: totalPrice,
        customDetails,
        customImage: generateCakeImageDataUrl(),
      })
    );

    setConfirmation(true);
    toast.success("Custom Cake added to cart! 🎂");
    setTimeout(() => {
      setConfirmation(false);
      navigate("/cart");
    }, 1200);
  };

  return (
    <div className="min-h-screen py-9 px-4 sm:px-6 lg:px-10 bg-[#F9F9F8] dark:bg-[#0f0d0c] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {confirmation && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-[#241812] dark:bg-stone-800 text-white pl-3.5 pr-5 py-3 rounded-2xl shadow-2xl text-sm font-medium border border-stone-700 animate-bounce">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D46211] shrink-0">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </span>
          Added to your cart — {selectedSize.name}, ${totalPrice.toFixed(2)}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 dark:border-stone-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[#D46211] font-semibold text-xs uppercase tracking-widest mb-1.5">
              <Cake className="w-4 h-4" />
              <span>Artisan Custom Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241812] dark:text-stone-100 leading-tight">
              Design Your <span className="text-[#D46211]">Cake</span>
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed">
              Handcrafted layer by layer with organic flour and French butter. Select your sponge, filling,
              and toppings — watch your custom cake build live.
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center bg-white dark:bg-stone-900 p-4 rounded-2xl border border-gray-200 dark:border-stone-800 shadow-sm overflow-x-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => setActiveStep(s.id)}
                className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    activeStep === s.id
                      ? "bg-[#D46211] text-white shadow-md shadow-[#D46211]/30 scale-105"
                      : activeStep > s.id
                      ? "bg-[#241812] dark:bg-stone-700 text-white"
                      : "bg-gray-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                  }`}
                >
                  {activeStep > s.id ? <Check className="w-4 h-4" strokeWidth={3} /> : s.id}
                </span>
                <span
                  className={`text-xs font-bold transition-colors ${
                    activeStep === s.id
                      ? "text-[#D46211]"
                      : activeStep > s.id
                      ? "text-stone-800 dark:text-stone-200"
                      : "text-stone-400 dark:text-stone-500"
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  className={`flex-1 min-w-[20px] h-0.5 mx-3 rounded-full transition-colors ${
                    activeStep > s.id ? "bg-[#241812] dark:bg-stone-700" : "bg-gray-200 dark:bg-stone-800"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile preview */}
        <div className="block lg:hidden">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-[#D46211]" />
              <span className="text-xs font-bold text-[#D46211] font-serif uppercase tracking-wider">Live Preview</span>
            </div>
            <CakePreview
              size={selectedSize}
              flavor={selectedFlavor}
              filling={selectedFilling}
              toppings={selectedToppings}
              message={pipedText}
            />
            <div className="pt-3 mt-2 border-t border-dashed border-gray-200 dark:border-stone-800 flex items-baseline justify-between">
              <span className="text-xs font-bold text-stone-500">Estimated Total</span>
              <span className="font-serif font-bold text-xl text-[#D46211]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Options Step Content */}
          <div className="space-y-6">
            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#241812] dark:text-stone-100">Choose Cake Size</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Every cake is freshly baked to order.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SIZES.map((s) => (
                    <OptionCard
                      key={s.id}
                      active={selectedSize.id === s.id}
                      onClick={() => setSelectedSize(s)}
                      title={s.name}
                      desc={s.desc}
                      priceLabel={`$${s.price.toFixed(2)}`}
                      badge={s.badge}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#241812] dark:text-stone-100">Pick Your Sponge Flavor</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Baked daily with stoneground flour and real butter.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FLAVORS.map((f) => (
                    <OptionCard
                      key={f.id}
                      active={selectedFlavor.id === f.id}
                      onClick={() => setSelectedFlavor(f)}
                      title={f.name}
                      desc={f.desc}
                      priceLabel={f.price === 0 ? "Included" : `+$${f.price.toFixed(2)}`}
                      badge={f.badge}
                      swatch={f.hex}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#241812] dark:text-stone-100">Select Filling & Frosting</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Silky buttercream, rich ganache, or tangy curd.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FILLINGS.map((f) => (
                    <OptionCard
                      key={f.id}
                      active={selectedFilling.id === f.id}
                      onClick={() => setSelectedFilling(f)}
                      title={f.name}
                      desc={f.desc}
                      priceLabel={f.price === 0 ? "Included" : `+$${f.price.toFixed(2)}`}
                      swatch={f.hex}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#241812] dark:text-stone-100">Add Decorative Toppings</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Select multiple toppings to customize your finish.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {TOPPINGS.map((t) => (
                    <OptionCard
                      key={t.id}
                      active={selectedToppings.some((x) => x.id === t.id)}
                      onClick={() => toggleTopping(t)}
                      title={t.name}
                      desc={t.desc}
                      priceLabel={`+$${t.price.toFixed(2)}`}
                      badge={t.badge}
                      checkbox={selectedToppings.some((x) => x.id === t.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#241812] dark:text-stone-100">Finishing Touches</h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Add a custom piped message and select dietary options.</p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 space-y-3">
                  <label className="block text-sm font-bold text-[#241812] dark:text-stone-100 font-serif">
                    Piped Message (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={35}
                    placeholder="Happy 30th Birthday, Sarah!"
                    value={pipedText}
                    onChange={(e) => setPipedText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-stone-800 bg-[#F9F9F8] dark:bg-stone-850 text-[#241812] dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#D46211] text-sm"
                  />
                  <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span>Hand-piped in icing at no extra charge</span>
                    <span>{pipedText.length} / 35</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 space-y-3">
                  <label className="block text-sm font-bold text-[#241812] dark:text-stone-100 font-serif">
                    Dietary Requirements
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {DIETARY.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDietaryOption(opt.id)}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          dietaryOption === opt.id
                            ? "border-[#D46211] bg-[#FFF4EB] dark:bg-[#D46211]/20 text-[#D46211] shadow-sm"
                            : "border-gray-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-gray-50 dark:hover:bg-stone-850"
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[10px] opacity-75 font-normal">
                          {opt.extra === 0 ? "Included" : `+$${opt.extra.toFixed(2)}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Nav Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((p) => Math.min(5, p + 1))}
                  className="bg-[#D46211] hover:bg-[#b04f0b] text-white flex items-center gap-1.5 px-6 py-2.5 rounded-full font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add Custom Cake to Cart
                </button>
              )}
            </div>
          </div>

          {/* Desktop Preview Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-6 self-start space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 p-6 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-[#D46211]" />
                <span className="text-xs font-bold text-[#D46211] font-serif uppercase tracking-wider">Live Preview</span>
              </div>
              <CakePreview
                size={selectedSize}
                flavor={selectedFlavor}
                filling={selectedFilling}
                toppings={selectedToppings}
                message={pipedText}
              />
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-gray-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#241812] dark:text-stone-100 border-b border-gray-100 dark:border-stone-800 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2.5">
                <Row label="Size" value={selectedSize.name} />
                <Row label="Sponge" value={selectedFlavor.name} />
                <Row label="Frosting" value={selectedFilling.name} />
                <Row
                  label={`Toppings (${selectedToppings.length})`}
                  value={selectedToppings.map((t) => t.name).join(", ") || "None"}
                />
                {dietaryOption !== "standard" && <Row label="Dietary" value={dietary?.name || dietaryOption} />}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-stone-800 flex items-baseline justify-between">
                <span className="text-xs font-bold text-stone-500">Total Price</span>
                <span className="font-serif font-bold text-2xl text-[#D46211]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#D46211] hover:bg-[#b04f0b] text-white font-bold py-3 rounded-full text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomCakePage;