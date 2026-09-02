import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { API_BASE } from "../utils/api";

/* ─── Types ─────────────────────────────────────────────────────────────── */
export interface TimeSlot {
  id: string;
  label: string;
  emoji: string;
  name: string;
  capacity: number;
  booked: number;
  remaining: number;
  available: boolean;
}

export interface ScheduleSelection {
  scheduledDate: string; // "YYYY-MM-DD"
  timeSlot: string;      // slot.label, e.g. "08:00 AM – 09:30 AM"
}

interface FulfillmentSchedulerProps {
  value: ScheduleSelection | null;
  onChange: (sel: ScheduleSelection | null) => void;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function formatDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateLabel(key: string) {
  const todayKey = formatDateKey(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrowDate);

  if (key === todayKey) return "Today";
  if (key === tomorrowKey) return "Tomorrow";

  const d = new Date(key + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// Build next 7 days (starting today)
function buildDateRange(): string[] {
  const dates: string[] = [];
  const start = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(formatDateKey(d));
  }
  return dates;
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export const FulfillmentScheduler: React.FC<FulfillmentSchedulerProps> = ({ value, onChange }) => {
  const dates = buildDateRange();

  // Keep a stable ref to onChange so effects don't need it as a dependency
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const [dateOffset, setDateOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(value?.scheduledDate || dates[0]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // 4 dates visible at a time
  const visibleDates = dates.slice(dateOffset, dateOffset + 4);

  const fetchSlots = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/orders/available-slots?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      } else {
        // Fallback slots if response is not ok
        setSlots([
          { id: "morning-early", label: "08:00 AM – 09:30 AM", emoji: "🌅", name: "Fresh Morning Batch", capacity: 8, booked: 0, remaining: 8, available: true },
          { id: "morning-mid", label: "10:00 AM – 11:30 AM", emoji: "☀️", name: "Mid-Morning Batch", capacity: 8, booked: 0, remaining: 8, available: true },
          { id: "afternoon", label: "02:00 PM – 03:30 PM", emoji: "🌇", name: "Afternoon Fresh", capacity: 8, booked: 0, remaining: 8, available: true },
          { id: "evening", label: "04:30 PM – 06:00 PM", emoji: "🌆", name: "Evening Batch", capacity: 8, booked: 0, remaining: 8, available: true },
        ]);
      }
    } catch {
      setError(null);
      // Fallback: show generic slots on network error
      setSlots([
        { id: "morning-early", label: "08:00 AM – 09:30 AM", emoji: "🌅", name: "Fresh Morning Batch", capacity: 8, booked: 0, remaining: 8, available: true },
        { id: "morning-mid", label: "10:00 AM – 11:30 AM", emoji: "☀️", name: "Mid-Morning Batch", capacity: 8, booked: 0, remaining: 8, available: true },
        { id: "afternoon", label: "02:00 PM – 03:30 PM", emoji: "🌇", name: "Afternoon Fresh", capacity: 8, booked: 0, remaining: 8, available: true },
        { id: "evening", label: "04:30 PM – 06:00 PM", emoji: "🌆", name: "Evening Batch", capacity: 8, booked: 0, remaining: 8, available: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(selectedDate);
    // Reset slot selection when date changes (use ref to avoid dependency loop)
    setSelectedSlot(null);
    onChangeRef.current(null);
  }, [selectedDate, fetchSlots]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    onChangeRef.current({ scheduledDate: selectedDate, timeSlot: slot.label });
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CalendarDays className="w-4 h-4 text-[#D46211] shrink-0" />
        <span className="text-xs font-bold text-[#64748B] dark:text-stone-400 uppercase tracking-wider">
          Schedule Pickup / Delivery
        </span>
      </div>

      {/* Date Selector */}
      <div className="relative">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={dateOffset === 0}
            onClick={() => setDateOffset((o) => Math.max(0, o - 1))}
            className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-stone-500" />
          </button>

          <div className="flex gap-1.5 flex-1 overflow-hidden">
            {visibleDates.map((date) => {
              const isSelected = selectedDate === date;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => handleDateChange(date)}
                  className={`flex-1 min-w-0 text-center rounded-xl border py-2 px-1 text-[11px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#D46211] border-[#D46211] text-white shadow-md shadow-[#D46211]/20"
                      : "border-gray-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-[#D46211]/50 hover:bg-[#FFF4EB] dark:hover:bg-[#D46211]/10"
                  }`}
                >
                  <div className="truncate">{formatDateLabel(date)}</div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={dateOffset >= dates.length - 4}
            onClick={() => setDateOffset((o) => Math.min(dates.length - 4, o + 1))}
            className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 transition-colors shrink-0"
          >
            <ChevronRight className="w-4 h-4 text-stone-500" />
          </button>
        </div>
      </div>

      {/* Time Slot Cards */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-stone-400 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading slots...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-amber-600 text-xs py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const fillPct = Math.round(((slot.capacity - slot.remaining) / slot.capacity) * 100);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleSlotClick(slot)}
                    className={`relative flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all cursor-pointer group overflow-hidden ${
                      !slot.available
                        ? "border-gray-200 dark:border-stone-800 opacity-40 cursor-not-allowed bg-gray-50 dark:bg-stone-900"
                        : isSelected
                        ? "border-[#D46211] bg-[#FFF4EB] dark:bg-[#D46211]/15 shadow-md shadow-[#D46211]/10"
                        : "border-gray-200 dark:border-stone-800 hover:border-[#D46211]/60 hover:bg-[#FFF4EB]/60 dark:hover:bg-[#D46211]/5"
                    }`}
                  >
                    {/* Fill indicator */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#D46211]/30 transition-all"
                      style={{ width: `${fillPct}%` }}
                    />

                    <div className="flex items-center gap-1.5 w-full">
                      <span className="text-base leading-none">{slot.emoji}</span>
                      <span className={`text-[11px] font-bold truncate ${isSelected ? "text-[#D46211]" : "text-stone-700 dark:text-stone-300"}`}>
                        {slot.label}
                      </span>
                      {isSelected && (
                        <span className="ml-auto w-3.5 h-3.5 rounded-full bg-[#D46211] flex items-center justify-center shrink-0">
                          <Clock className="w-2 h-2 text-white" />
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">{slot.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {slot.available ? (
                        <span className={`text-[10px] font-semibold ${slot.remaining <= 2 ? "text-amber-600" : "text-emerald-600"}`}>
                          {slot.remaining <= 2 ? `⚡ Only ${slot.remaining} left!` : `${slot.remaining} spots left`}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-500">Fully Booked</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Selected Summary */}
      {value && selectedSlot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-[#FFF4EB] dark:bg-[#D46211]/15 border border-[#D46211]/30 rounded-xl px-3 py-2.5"
        >
          <Clock className="w-3.5 h-3.5 text-[#D46211] shrink-0" />
          <div className="text-[11px] font-bold text-[#D46211]">
            {formatDateLabel(value.scheduledDate)} · {selectedSlot.emoji} {selectedSlot.label}
          </div>
        </motion.div>
      )}
    </div>
  );
};
