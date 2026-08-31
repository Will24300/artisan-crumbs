import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  X,
  Building2,
  DollarSign,
  Smartphone,
  Sparkles,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentDetails: {
    paymentMethod: string;
    paymentStatus: "paid" | "pending";
    transactionId: string;
  }) => Promise<void>;
  grandTotal: number;
  fulfillmentType: "delivery" | "pickup";
  initialMethod?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  grandTotal,
  fulfillmentType,
  initialMethod = "card",
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>(initialMethod);
  
  // Card Form State
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Processing Animation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Card Brand Detection
  const getCardBrand = (number: string) => {
    const clean = number.replace(/\s+/g, "");
    if (/^4/.test(clean)) return "VISA";
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return "MASTERCARD";
    if (/^3[47]/.test(clean)) return "AMEX";
    if (/^6(?:011|5)/.test(clean)) return "DISCOVER";
    return null;
  };

  // Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: "" }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: "" }));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(raw);
    if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: "" }));
  };

  // Client Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (selectedMethod === "card") {
      if (!cardName.trim()) errs.cardName = "Cardholder name is required";
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 15) errs.cardNumber = "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = "MM/YY format required";
      if (cvc.length < 3) errs.cvc = "Valid CVC required";
      if (!zipCode.trim()) errs.zipCode = "ZIP / Postal Code required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Checkout Processing
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === "card" && !validateForm()) return;

    setIsProcessing(true);
    setProcessingStep("Connecting to payment gateway...");

    try {
      if (selectedMethod === "card") {
        await new Promise((r) => setTimeout(r, 600));
        setProcessingStep("Verifying card credentials...");
        await new Promise((r) => setTimeout(r, 700));
        setProcessingStep("Encrypting authorization & token...");
        await new Promise((r) => setTimeout(r, 800));
      } else if (selectedMethod === "paypal") {
        await new Promise((r) => setTimeout(r, 800));
        setProcessingStep("Authenticating PayPal Express session...");
        await new Promise((r) => setTimeout(r, 900));
      } else {
        await new Promise((r) => setTimeout(r, 500));
        setProcessingStep("Confirming order payment status...");
      }

      setProcessingStep("Finalizing transaction...");
      await new Promise((r) => setTimeout(r, 500));

      const mockTxnId =
        selectedMethod !== "cash"
          ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          : "";

      setIsSuccess(true);
      await new Promise((r) => setTimeout(r, 600));

      await onPaymentSuccess({
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === "cash" ? "pending" : "paid",
        transactionId: mockTxnId,
      });

      // Reset
      setIsProcessing(false);
      setIsSuccess(false);
      onClose();
    } catch {
      setIsProcessing(false);
      setIsSuccess(false);
      setErrors({ general: "Payment authorization failed. Please try again." });
    }
  };

  if (!isOpen) return null;

  const cardBrand = getCardBrand(cardNumber);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-stone-800"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#D46211]/10 text-[#D46211]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                  Secure Checkout
                </h3>
                <p className="text-xs text-gray-500 dark:text-stone-400">
                  256-Bit SSL Encrypted Transaction
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-stone-200 rounded-xl hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Amount Highlight */}
          <div className="bg-[#FFF4EB] dark:bg-[#D46211]/10 px-6 py-3.5 flex items-center justify-between border-b border-[#D46211]/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D46211]">
              Total Due ({fulfillmentType === "pickup" ? "Pickup" : "Delivery"})
            </span>
            <span className="text-lg font-bold font-mono text-[#D46211]">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Body */}
          <div className="p-6">
            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      Payment Approved!
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                      Generating your bakery order receipt...
                    </p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-[#D46211]/20 border-t-[#D46211] animate-spin flex items-center justify-center" />
                      <Lock className="w-6 h-6 text-[#D46211] absolute inset-0 m-auto" />
                    </div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                      Processing Payment
                    </h4>
                    <p className="text-xs font-mono text-gray-500 dark:text-stone-400 animate-pulse">
                      {processingStep}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-5">
                {/* Method Selector Tabs */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-stone-400 mb-2.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("card")}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        selectedMethod === "card"
                          ? "border-[#D46211] bg-[#D46211]/5 text-[#D46211] shadow-sm"
                          : "border-gray-200 dark:border-stone-800 text-gray-600 dark:text-stone-400 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod("paypal")}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        selectedMethod === "paypal"
                          ? "border-[#D46211] bg-[#D46211]/5 text-[#D46211] shadow-sm"
                          : "border-gray-200 dark:border-stone-800 text-gray-600 dark:text-stone-400 hover:border-gray-300"
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span>PayPal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod("cash")}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        selectedMethod === "cash"
                          ? "border-[#D46211] bg-[#D46211]/5 text-[#D46211] shadow-sm"
                          : "border-gray-200 dark:border-stone-800 text-gray-600 dark:text-stone-400 hover:border-gray-300"
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Pay on {fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</span>
                    </button>
                  </div>
                </div>

                {errors.general && (
                  <div className="p-3 text-xs bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
                    {errors.general}
                  </div>
                )}

                {/* Card Fields */}
                {selectedMethod === "card" && (
                  <div className="space-y-3.5">
                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-stone-300 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => {
                          setCardName(e.target.value);
                          if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: "" }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-stone-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D46211] ${
                          errors.cardName ? "border-red-500" : "border-gray-200 dark:border-stone-700"
                        }`}
                      />
                      {errors.cardName && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.cardName}</p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-stone-300 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4000 0000 0000 0000"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className={`w-full pl-3.5 pr-16 py-2.5 rounded-xl border text-sm font-mono bg-gray-50 dark:bg-stone-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D46211] ${
                            errors.cardNumber ? "border-red-500" : "border-gray-200 dark:border-stone-700"
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {cardBrand ? (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-stone-700 text-gray-800 dark:text-stone-200">
                              {cardBrand}
                            </span>
                          ) : (
                            <CreditCard className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {errors.cardNumber && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry, CVC, Zip Grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-stone-300 mb-1">
                          Expires
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={handleExpiryChange}
                          className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono bg-gray-50 dark:bg-stone-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D46211] ${
                            errors.expiry ? "border-red-500" : "border-gray-200 dark:border-stone-700"
                          }`}
                        />
                        {errors.expiry && (
                          <p className="text-[10px] text-red-500 mt-0.5">{errors.expiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-stone-300 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cvc}
                          onChange={handleCvcChange}
                          className={`w-full px-3 py-2.5 rounded-xl border text-sm font-mono bg-gray-50 dark:bg-stone-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D46211] ${
                            errors.cvc ? "border-red-500" : "border-gray-200 dark:border-stone-700"
                          }`}
                        />
                        {errors.cvc && (
                          <p className="text-[10px] text-red-500 mt-0.5">{errors.cvc}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-stone-300 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="10001"
                          value={zipCode}
                          onChange={(e) => {
                            setZipCode(e.target.value);
                            if (errors.zipCode) setErrors((prev) => ({ ...prev, zipCode: "" }));
                          }}
                          className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-gray-50 dark:bg-stone-800/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D46211] ${
                            errors.zipCode ? "border-red-500" : "border-gray-200 dark:border-stone-700"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-[10px] text-red-500 mt-0.5">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Option */}
                {selectedMethod === "paypal" && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                      <Smartphone className="w-5 h-5" />
                      <span>PayPal One-Touch Checkout</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-stone-400">
                      Click below to authorize simulated payment with your saved PayPal account.
                    </p>
                  </div>
                )}

                {/* Cash Option */}
                {selectedMethod === "cash" && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                      <Building2 className="w-5 h-5" />
                      <span>Pay on {fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-stone-400">
                      {fulfillmentType === "pickup"
                        ? "Pay cash or card when collecting your order at our bakery counter."
                        : "Pay cash to the delivery driver upon receipt."}
                    </p>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#D46211] hover:bg-[#b8530e] text-white font-bold rounded-2xl shadow-lg shadow-[#D46211]/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {selectedMethod === "cash"
                      ? `Confirm Order ($${grandTotal.toFixed(2)})`
                      : `Authorize & Pay $${grandTotal.toFixed(2)}`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-stone-500">
                  <Sparkles className="w-3.5 h-3.5 text-[#D46211]" />
                  <span>Test Mode: Simulated Instant Payment Authorization</span>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
