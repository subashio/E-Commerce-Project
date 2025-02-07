import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import React from "react";
import { Link } from "react-router-dom";
import confrimAnimation from "../assets/confirm.json";
import tickAnimation from "../assets/tick.json";

export default function SuccessPage() {
  const [bgColor, setBgColor] = React.useState("bg-white");

  // Change background color after animations
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setBgColor("bg-gradient-to-t from-green-500 to-green-200");
    }, 2000); // Delay matches the total animation duration
    return () => clearTimeout(timer);
  }, []);

  const slideDownVariant = {
    hidden: { opacity: 0, y: -10 }, // Start slightly above with 0 opacity
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut", delay: 1.4 },
    }, // Slide into view
  };
  const buttonVariant = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 1.4 } },
  };

  return (
    <section
      className={`mt-28 h-[90vh] overflow-hidden ${bgColor} transition-colors duration-500`}
    >
      <div
        className={`h-full gap-2 rounded-lg transition-colors duration-500 ${bgColor} flex flex-col items-center justify-center`}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { duration: 0.6, delay: 0.8 },
          }}
        >
          <Lottie
            loop={false}
            animationData={tickAnimation}
            className="h-28 w-28"
          />
        </motion.div>
        <motion.h1
          variants={slideDownVariant}
          initial="hidden"
          animate="visible"
          className="-mt-6 text-center text-2xl font-bold"
        >
          Order Placed
        </motion.h1>

        <Lottie
          className="mt-0 h-[50vh]"
          loop={true}
          animationData={confrimAnimation}
        />
        <motion.div
          variants={buttonVariant}
          initial="hidden"
          animate="visible"
          className="flex w-full items-center justify-center gap-14"
        >
          {/* Button 2 */}
          <Link
            to="/shop"
            className={cn(
              "!rounded-lg bg-secondary px-4 py-2 text-secondary-foreground shadow hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary/20",
              buttonVariants({ variant: "secondary" }),
            )}
          >
            Continue Shopping
          </Link>
          {/* Button 1 */}
          <Link
            to="/profile-page/order-details"
            className={cn(
              "!absoluterounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground shadow hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20",
              buttonVariants({ variant: "default" }),
            )}
          >
            View Order
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
