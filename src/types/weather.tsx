export interface Location {
    city: string;
    country: string;
    timezone: string;
    lat: number;
    lon: number;
}

export interface WeatherCondition {
    main: string;
    description: string;
    icon: string;
    condition: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm' | 'foggy' | 'partly-cloudy';
}

export interface CurrentWeather {
    temp: number;
    feels_like: number;
    precip: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    sunrise: number;
    sunset: number;
    humidity: number;
    pressure: number;
    dew_point: number;
    dt: number;
    aqi: number;
    weather: WeatherCondition;
}

export interface HourlyForecast {
    dt: number;
    temp: number;
    precip: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    humidity: number;
    pressure: number;
    dew_point: number;
    pop: number;
    weather: WeatherCondition;
}

export interface DailyForecast {
    dt: number;
    temp: { min: number; max: number };
    precip: number;
    wind_speed_max: number;
    wind_gust_max: number;
    sunrise: number;
    sunset: number;
    humidity_min: number;
    humidity_max: number;
    pressure: number;
    moon_phase: string;
    summary: string;
    weather: WeatherCondition;
}

export interface WeatherAlert {
    title: string;
    description: string;
}

export interface WeatherData {
    location: Location;
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    alerts: WeatherAlert[];
    pollen: string;
    last_updated: number;
}