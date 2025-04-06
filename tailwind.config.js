export default {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                weather: {
                    clear: 'rgb(var(--weather-clear) / <alpha-value>)',
                    cloudy: 'rgb(var(--weather-cloudy) / <alpha-value>)',
                    rainy: 'rgb(var(--weather-rainy) / <alpha-value>)',
                    thunderstorm: 'rgb(var(--weather-thunderstorm) / <alpha-value>)'
                }
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '20px'
            }
        }
    }
}