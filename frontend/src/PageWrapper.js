import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 40 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 }
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;