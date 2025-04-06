export const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    if (aqi <= 300) return 'bg-purple-500';
    return 'bg-gray-900';
};

export const degreesToDirection = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(deg / 22.5) % 16];
};

// utils/gradients.ts

export const getLocationGradient = (condition: string) => {
    const lc = condition.toLowerCase();

    if (lc.includes("thunderstorm")) return "from-yellow-400 to-purple-700";
    if (lc.includes("clear")) return "from-blue-400 to-sky-500";
    if (lc.includes("rain")) return "from-indigo-400 to-blue-700";
    if (lc.includes("snow")) return "from-blue-100 to-blue-300";
    if (lc.includes("cloud")) return "from-gray-300 to-gray-500";
    return "from-slate-400 to-slate-700";
};
