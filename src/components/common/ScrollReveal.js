import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const directionVariants = {
  up:    { hidden: { opacity: 0, y: 32 },    visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -32 },   visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 },    visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },            visible: { opacity: 1 } },
};

export default function ScrollReveal({ children, direction = 'up', delay = 0, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  const variants = directionVariants[direction] || directionVariants.up;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}
