import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface DynamicBackgroundProps {
    condition: string;
    sunrise: number;
    sunset: number;
    currentTime: number;
    children: React.ReactNode;
}

const getBlendOpacity = (now: number, sunrise: number, sunset: number): number => {
    // Sharp shift at sunrise and sunset—no gradual hour-long fade
    if (now < sunrise) return 0; // Before sunrise: full night
    if (now >= sunrise && now < sunset) return 1; // Between sunrise and sunset: full day
    if (now >= sunset) return 0; // After sunset: full night
    return 0; // Default to night (shouldn’t hit this, but safety first)
};

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ condition, sunrise, sunset, currentTime, children }) => {
    const controlsDay = useAnimation();
    const controlsNight = useAnimation();
    const dayClass = `weather-bg-${condition}`;
    const nightClass = `weather-bg-${condition}-night`;

    useEffect(() => {
        let animationFrameId: number;

        const updateOpacity = () => {
            const opacity = getBlendOpacity(currentTime, sunrise, sunset);

            // Your OG 0.5s smooth fades—still snappy and untouched
            controlsDay.start({ opacity, transition: { duration: 0.5, ease: 'linear' } });
            controlsNight.start({ opacity: 1 - opacity, transition: { duration: 0.5, ease: 'linear' } });

            animationFrameId = requestAnimationFrame(updateOpacity);
        };

        updateOpacity();

        return () => cancelAnimationFrame(animationFrameId);
    }, [condition, sunrise, sunset, currentTime, controlsDay, controlsNight]);

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <motion.div
                key={`${nightClass}-bg`}
                className={`absolute inset-0 ${nightClass}`}
                initial={{ opacity: 1 }}
                animate={controlsNight}
            />
            <motion.div
                key={`${dayClass}-bg`}
                className={`absolute inset-0 ${dayClass}`}
                initial={{ opacity: 0 }}
                animate={controlsDay}
            />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};

export default DynamicBackground;