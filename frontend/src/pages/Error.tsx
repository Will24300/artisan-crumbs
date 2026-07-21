import React from "react";
import { Link, useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ArrowLeft,
  ShoppingBag,
  MessageSquare,
  User,
  Cookie,
  Compass,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const rawError = useRouteError();

  let errorMessage = "The page you are looking for might have been removed, renamed, or is temporarily unavailable.";
  let errorCode = "404";
  let errorTitle = "Oops! This Page Crumbled Away";

  if (isRouteErrorResponse(rawError)) {
    errorCode = String(rawError.status);
    errorTitle = rawError.statusText || errorTitle;
    errorMessage = rawError.data?.message || errorMessage;
  } else if (rawError instanceof Error) {
    errorMessage = rawError.message;
    errorCode = "500";
    errorTitle = "Something Went Wrong in the Oven";
  }

  const quickLinks = [
    {
      title: "Explore Shop",
      description: "Browse our fresh artisan breads & delicious pastries.",
      path: "/shop",
      icon: ShoppingBag,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Contact Us",
      description: "Need help or have questions about your order?",
      path: "/contact",
      icon: MessageSquare,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      title: "My Account",
      description: "Manage your bakery profile and order history.",
      path: "/account",
      icon: User,
      color: "bg-amber-600/10 text-amber-700 dark:text-amber-300",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-stone-800 dark:text-stone-100 transition-colors duration-300">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Animated Visual & Error Code */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-block"
        >
          {/* Glowing Background Ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D46211]/20 via-amber-500/20 to-orange-400/20 blur-3xl rounded-full scale-125 -z-10" />

          <div className="relative flex items-center justify-center space-x-3">
            <span className="text-8xl md:text-9xl font-black text-[#D46211] tracking-tighter drop-shadow-sm select-none">
              {errorCode.charAt(0) || "4"}
            </span>

            {/* Bouncing Cookie Icon representing the middle '0' */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative flex items-center justify-center bg-gradient-to-br from-[#D46211] to-amber-600 text-white p-5 rounded-full shadow-lg border-4 border-amber-100 dark:border-stone-800"
            >
              <Cookie className="w-12 h-12 md:w-16 md:h-16 animate-pulse" />
              <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-yellow-300 animate-spin-slow" />
            </motion.div>

            <span className="text-8xl md:text-9xl font-black text-[#D46211] tracking-tighter drop-shadow-sm select-none">
              {errorCode.charAt(2) || "4"}
            </span>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-[#D46211] dark:text-orange-300 border border-orange-200 dark:border-orange-900">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Error {errorCode}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {errorTitle}
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
            {errorMessage}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          {/* Main "Go to Home" Button */}
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#D46211] to-amber-600 hover:from-[#c2560d] hover:to-amber-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#D46211] focus:ring-offset-2 dark:focus:ring-offset-stone-900"
          >
            <Home className="w-5 h-5" />
            <span>Go to Home</span>
          </Link>

          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-base font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-full shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Helpful Links Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="pt-8 border-t border-stone-200 dark:border-stone-800/80"
        >
          <div className="flex items-center justify-center space-x-2 text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Compass className="w-4 h-4" />
            <span>Or explore popular destinations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, idx) => {
              const IconComp = link.icon;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex flex-col items-center p-5 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 hover:border-[#D46211]/50 dark:hover:border-[#D46211]/50 shadow-sm hover:shadow-md transition-all text-center group"
                >
                  <div className={`p-3 rounded-full mb-3 ${link.color} transition-transform group-hover:scale-110`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#D46211] dark:group-hover:text-amber-400 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {link.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ErrorPage;

