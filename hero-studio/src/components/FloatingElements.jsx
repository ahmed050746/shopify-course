import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeDollarSign,
  Boxes,
  Package,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";

const reveal = {
  hidden: { opacity: 0, y: 12, scale: 0.92 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.08 * i,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function floatLoop(duration, delay = 0) {
  return {
    y: [-7, 7],
    transition: {
      duration,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay,
    },
  };
}

const ICONS = [
  {
    Icon: Store,
    label: "Shopify",
    className: "left-[5%] top-[16%]",
    accent: "#FF7343",
    delay: 0,
  },
  {
    Icon: ShoppingBag,
    label: "Products",
    className: "right-[5%] top-[14%]",
    accent: "#c4b5fd",
    delay: 0.12,
  },
  {
    Icon: Truck,
    label: "Shipping",
    className: "left-[3.5%] top-[40%]",
    accent: "#fb923c",
    delay: 0.22,
  },
  {
    Icon: Package,
    label: "Orders",
    className: "right-[3.5%] top-[38%]",
    accent: "#a78bfa",
    delay: 0.32,
  },
  {
    Icon: BadgeDollarSign,
    label: "Sales",
    className: "left-[8%] bottom-[30%]",
    accent: "#FF8A5B",
    delay: 0.4,
  },
  {
    Icon: Boxes,
    label: "Fulfillment",
    className: "right-[7%] bottom-[28%]",
    accent: "#ddd6fe",
    delay: 0.5,
  },
];

export default function FloatingElements({ show }) {
  const reduceMotion = useReducedMotion();
  if (!show && !reduceMotion) return null;

  return (
    <>
      {ICONS.map((item, index) => (
        <IconChip
          key={item.label}
          {...item}
          visible={show || reduceMotion}
          index={index}
        />
      ))}
    </>
  );
}

function IconChip({ Icon, label, className, accent, delay, visible, index }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      custom={index}
      className={`pointer-events-none absolute z-20 hidden md:block ${className}`}
      aria-hidden
    >
      <motion.div
        animate={reduceMotion ? undefined : floatLoop(5.6 + index * 0.3, delay)}
        className="relative flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0c0c12]/55 py-1.5 pl-1.5 pr-4 backdrop-blur-md"
        style={{
          boxShadow: `0 0 0 1px ${accent}33, 0 10px 28px -12px ${accent}88, 0 16px 40px -20px rgba(0,0,0,0.8)`,
        }}
      >
        <motion.span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${accent} 42%, ${accent}99 100%)`,
            boxShadow: `0 0 18px ${accent}aa`,
          }}
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.06, 1], boxShadow: [`0 0 12px ${accent}66`, `0 0 22px ${accent}cc`, `0 0 12px ${accent}66`] }
          }
          transition={{
            duration: 2.4 + index * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon className="h-[18px] w-[18px] text-[#1a1020]" strokeWidth={2.25} />
        </motion.span>
        <span className="text-[13px] font-semibold tracking-tight text-white">{label}</span>
      </motion.div>
    </motion.div>
  );
}
