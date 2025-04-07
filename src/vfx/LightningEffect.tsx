
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const LightningFlash = () => {
    const controls = useAnimation();

    useEffect(() => {
        let timeoutId: number;

        const flash = () => {
            controls.set({ opacity: 0 }); // reset

            controls.start({
                opacity: [0, 1, 0],
                transition: {
                    duration: 0.5,
                    times: [0, 0.4, 1],
                    ease: "easeInOut",
                },
            });

            // Random delay between 100ms and 1000ms (0.1s - 1s)
            const delay = Math.random() * 4000 + 3000;
            timeoutId = window.setTimeout(flash, delay);
        };

        flash();
        return () => clearTimeout(timeoutId);
    }, [controls]);

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none bg-white z-50 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={controls}
        />
    );
};

export default LightningFlash;
