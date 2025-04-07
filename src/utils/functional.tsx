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

export const getLocationGradient = (condition: string) => {
    switch(condition){
        case "thunderstorm": return "from-yellow-400 to-purple-700";
        case "clear": return "from-white to-blue-100";
        case "rainy":  return "from-cyan-100 to-white";
        case "snowy":  return "from-sky-400 to-blue-900";
        case "partly-cloudy": return "from-white to-sky-300";
        case "cloudy": return "from-white to-gray-300";
        case "foggy": return "from-white to-slate-400";
    }
    return "from-slate-400 to-slate-700";
};

// utils/functional.ts
export function getTextColorByCondition(condition: string): string {
    switch (condition.toLowerCase()) {
        case 'clear':
            return 'text-yellow-300';
        case 'cloudy':
            return 'text-gray-300';
        case 'rainy':
            return 'text-blue-300';
        case 'snowy':
            return 'text-sky-500';
        case 'thunderstorm':
            return 'text-purple-300';
        case 'foggy':
            return 'text-gray-400';
        case 'partly-cloudy':
            return 'text-sky-300';
        default:
            return 'text-white';
    }
}


export function getAQILevelIcon(aqi: number): string {

    // AQI level mapping with icons
    if (aqi < 50) return '🌿 🟢'; // Good
    if (aqi < 100) return '🌤️ 🟡'; // Moderate
    if (aqi < 150) return '🌫️ 🟠'; // Unhealthy for Sensitive Groups
    if (aqi < 200) return '☠️ 🟣'; // Very Unhealthy
    if (aqi > 200)return '💀 🟥'; // Hazardous

    return '❓'; // Fallback
}

export const getTempColorGradient = (temp: number): string => {
    if (temp <= -10) return 'from-blue-200 to-blue-500';          // Freezing
    if (temp <= 0) return 'from-cyan-300 to-blue-400';            // Cold
    if (temp <= 10) return 'from-sky-300 to-indigo-400';          // Cool
    if (temp <= 20) return 'from-emerald-300 to-teal-400';        // Mild
    if (temp <= 30) return 'from-yellow-300 to-orange-400';       // Warm
    if (temp <= 40) return 'from-orange-400 to-red-500';          // Hot
    return 'from-red-600 to-pink-600';                            // Very Hot
};

export const getAlertGradient = (condition: string) => {
    switch (condition) {
        case "thunderstorm":
            return "from-yellow-400 via-red-600 to-purple-800"; // piercing against violet bg
        case "clear":
            return "from-red-600 via-yellow-400 to-red-700";    // dramatic against blue/sky
        case "rainy":
            return "from-orange-500 via-red-600 to-pink-600";   // hot tones over cool bg
        case "snowy":
            return "from-red-500 via-fuchsia-600 to-purple-700"; // vivid on white/light blue
        case "partly-cloudy":
            return "from-red-600 via-yellow-400 to-orange-500"; // warm clash on pale bg
        case "cloudy":
            return "from-red-500 via-orange-500 to-yellow-400"; // fiery pop on gray tones
        case "foggy":
            return "from-red-600 via-rose-500 to-amber-500";    // vibrant glow on muted fog
    }
    return "from-red-600 via-yellow-500 to-red-700"; // default alert tone
};

export const getAlertTextColor = (condition: string) => {
    switch (condition) {
        case "thunderstorm":
            return "text-indigo-900"; // deep tone to contrast pink/purple
        case "clear":
            return "text-blue-900";   // strong against pale sky blues
        case "rainy":
            return "text-slate-900";  // deep neutral for misty tones
        case "snowy":
            return "text-gray-900";   // sharp on light blues/whites
        case "partly-cloudy":
            return "text-sky-900";    // darker blue for contrast
        case "cloudy":
            return "text-zinc-900";   // effective on grays
        case "foggy":
            return "text-slate-900";  // heavy tone for clarity
    }
    return "text-gray-900"; // safe fallback for light bg
};


export const getWeatherDescriptionTextColor = (condition: string) => {
    switch (condition) {
        case "thunderstorm":
            return "text-yellow-100"; // glows against purples
        case "clear":
            return "text-white"; // pops against sky gradients
        case "rainy":
            return "text-blue-100"; // smooth visibility on indigo/gray blends
        case "snowy":
            return "text-blue-800"; // balances against soft blues/whites
        case "partly-cloudy":
            return "text-sky-100"; // readable on transition blends
        case "cloudy":
            return "text-gray-100"; // works over medium greys
        case "foggy":
            return "text-slate-200"; // clear on hazy gray-blues
    }
    return "text-neutral-100"; // fallback for neutral readability
};

export const getOverlayButtonTextColor = (condition: string): string => {
    switch (condition) {
        case "clear":
            return "text-yellow-300";
        case "partly-cloudy":
            return "text-sky-300";
        case "cloudy":
            return "text-gray-300";
        case "rainy":
            return "text-cyan-300";
        case "snowy":
            return "text-blue-200";
        case "foggy":
            return "text-slate-200";
        case "thunderstorm":
            return "text-pink-400";
        default:
            return "text-neutral-300";
    }
};

export const getGridTitleColor = (condition: string, isNight: boolean): string => {
    switch (condition) {
        case "clear":
            return isNight ? "text-blue-300" : "text-yellow-300";
        case "partly-cloudy":
            return isNight ? "text-indigo-300" : "text-sky-500";
        case "cloudy":
            return isNight ? "text-gray-300" : "text-gray-500";
        case "rainy":
            return isNight ? "text-blue-300" : "text-cyan-300";
        case "snowy":
            return isNight ? "text-blue-100" : "text-sky-400"; // snowy = top-left light
        case "foggy":
            return isNight ? "text-slate-300" : "text-slate-500";
        case "thunderstorm":
            return isNight ? "text-pink-300" : "text-pink-400";
        default:
            return "text-neutral-300";
    }
};

export const getGridDescriptionColor = (condition: string, isNight: boolean): string => {
    switch (condition) {
        case "clear":
            return isNight ? "text-blue-100" : "text-yellow-100";
        case "partly-cloudy":
            return isNight ? "text-indigo-100" : "text-sky-100";
        case "cloudy":
            return isNight ? "text-gray-200" : "text-gray-200";
        case "rainy":
            return isNight ? "text-blue-100" : "text-cyan-100";
        case "snowy":
            return isNight ? "text-blue-50" : "text-sky-300"; // snowy = inverse gradient
        case "foggy":
            return isNight ? "text-slate-200" : "text-slate-100";
        case "thunderstorm":
            return isNight ? "text-pink-100" : "text-pink-200";
        default:
            return "text-neutral-200";
    }
};


