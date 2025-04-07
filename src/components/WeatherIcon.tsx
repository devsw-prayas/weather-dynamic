import React from 'react';

// Separate icons for day and night where applicable
const WEATHER_ICONS = {
    clear: {
        day: '/icons/day.svg',
        night: '/icons/night.svg',
    },
    cloudy: {
        day: '/icons/cloudy-day-3.svg',
        night: '/icons/cloudy-night-3.svg',
    },
    rainy: {
        day: '/icons/rainy-7.svg',
        night: '/icons/rainy-7.svg',
    },
    snowy: {
        day: '/icons/snowy.svg',
        night: '/icons/snowy.svg',
    },
    thunderstorm: {
        day: '/icons/thunder.svg',
        night: '/icons/thunder.svg',
    },
    foggy: {
        day: '/icons/fog.svg',
        night: '/icons/fog.svg',
    },
    'partly-cloudy': {
        day: '/icons/cloudy-day-1.svg',
        night: '/icons/cloudy-night-1.svg',
    },
} as const;

type WeatherCondition = keyof typeof WEATHER_ICONS;

interface WeatherIconProps {
    condition: WeatherCondition;
    className?: string;
    isNight?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
                                                            condition,
                                                            className = 'text-4xl',
                                                            isNight = false,
                                                        }) => {
    const iconSet = WEATHER_ICONS[condition] || WEATHER_ICONS.clear;
    const displayIcon = isNight ? iconSet.night : iconSet.day;

    const isEmoji = !displayIcon.endsWith('.svg');

    return isEmoji ? (
        <span className={`${className} drop-shadow-lg`}>{displayIcon}</span>
    ) : (
        <img
            src={displayIcon}
            alt={condition}
            className={`${className} drop-shadow-lg`}
            draggable={false}
        />
    );
};
