// src/services/weatherService.ts
import axios from 'axios';
import { WeatherData, WeatherCondition } from '../types/weather';

const API_KEY = '70e9836aa3264f19a0f155628250704'; // Replace this, you brave soul!
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes
let lastFetch: { data: WeatherData; timestamp: number } | null = null;

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
        if (lastFetch && Date.now() - lastFetch.timestamp < CACHE_DURATION) {
            console.log('Cached data to the rescue!');
            return lastFetch.data;
        }

        const response = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=yes`,
            { timeout: 10000 }
        );
        const data = response.data;

        const mapCondition = (description: string): WeatherCondition['condition'] => {
            const desc = description.toLowerCase();
            const conditions: Record<string, WeatherCondition['condition']> = {
                thunder: 'thunderstorm',
                rain: 'rainy',
                shower: 'rainy',
                snow: 'snowy',
                fog: 'foggy',
                mist: 'foggy',
                cloud: 'cloudy',
                clear: 'clear',
            };
            for (const key in conditions) {
                if (desc.includes(key)) return conditions[key];
            }
            return 'partly-cloudy'; // Default
        };

        const getIcon = (condition: WeatherCondition['condition'], dt: number, sunrise: number, sunset: number): string => {
            const isDay = dt > sunrise && dt < sunset;
            return {
                clear: isDay ? '01d' : '01n',
                cloudy: isDay ? '03d' : '03n',
                rainy: isDay ? '10d' : '10n',
                snowy: isDay ? '13d' : '13n',
                thunderstorm: isDay ? '11d' : '11n',
                foggy: isDay ? '50d' : '50n',
                'partly-cloudy': isDay ? '02d' : '02n',
            }[condition] || '01d';
        };

        const weatherData: WeatherData = {
            location: {
                city: data.location.name,
                country: data.location.country,
                lat: data.location.lat,
                lon: data.location.lon,
                timezone: data.location.tz_id,
            },
            current: {
                dt: Math.floor(new Date(data.current.last_updated_epoch * 1000).getTime() / 1000),
                temp: data.current.temp_c,
                feels_like: data.current.feelslike_c,
                precip: data.current.precip_mm,
                wind_speed: data.current.wind_kph,
                wind_deg: data.current.wind_degree,
                wind_gust: data.current.gust_kph || 0,
                sunrise: Math.floor(new Date(data.forecast.forecastday[0].astro.sunrise).getTime() / 1000),
                sunset: Math.floor(new Date(data.forecast.forecastday[0].astro.sunset).getTime() / 1000),
                humidity: data.current.humidity,
                pressure: data.current.pressure_mb,
                dew_point: data.current.dewpoint_c,
                aqi: data.current.air_quality['us-epa-index'] || 0,
                uv_index: data.current.uv,
                weather: {
                    main: data.current.condition.text.split(' ')[0],
                    description: data.current.condition.text,
                    icon: getIcon(mapCondition(data.current.condition.text), Math.floor(new Date(data.current.last_updated_epoch * 1000).getTime() / 1000),
                        Math.floor(new Date(data.forecast.forecastday[0].astro.sunrise).getTime() / 1000),
                        Math.floor(new Date(data.forecast.forecastday[0].astro.sunset).getTime() / 1000)),
                    condition: mapCondition(data.current.condition.text),
                },
            },
            hourly: data.forecast.forecastday[0].hour.map((hour: any) => ({
                dt: hour.time_epoch,
                temp: hour.temp_c,
                precip: hour.precip_mm,
                wind_speed: hour.wind_kph,
                wind_deg: hour.wind_degree,
                wind_gust: hour.gust_kph || 0,
                humidity: hour.humidity,
                pressure: hour.pressure_mb,
                dew_point: hour.dewpoint_c,
                pop: hour.chance_of_rain / 100,
                uv_index: hour.uv,
                weather: {
                    main: hour.condition.text.split(' ')[0],
                    description: hour.condition.text,
                    icon: getIcon(mapCondition(hour.condition.text), hour.time_epoch * 1000,
                        Math.floor(new Date(data.forecast.forecastday[0].astro.sunrise).getTime() / 1000),
                        Math.floor(new Date(data.forecast.forecastday[0].astro.sunset).getTime() / 1000)),
                    condition: mapCondition(hour.condition.text),
                },
            })),
            daily: data.forecast.forecastday.map((day: any) => ({
                dt: day.date_epoch,
                temp: { min: day.day.mintemp_c, max: day.day.maxtemp_c },
                precip: day.day.totalprecip_mm,
                wind_speed_max: day.day.maxwind_kph,
                wind_gust_max: day.day.maxwind_kph * 1.2,
                sunrise: Math.floor(new Date(day.astro.sunrise).getTime() / 1000),
                sunset: Math.floor(new Date(day.astro.sunset).getTime() / 1000),
                humidity_min: day.day.avghumidity - 5,
                humidity_max: day.day.avghumidity,
                pressure: day.day.avgvis_mb || 1013,
                moon_phase: day.astro.moon_phase,
                summary: day.day.condition.text,
                uv_index: day.day.uv,
                weather: {
                    main: day.day.condition.text.split(' ')[0],
                    description: day.day.condition.text,
                    icon: getIcon(mapCondition(day.day.condition.text), day.date_epoch * 1000,
                        Math.floor(new Date(day.astro.sunrise).getTime() / 1000),
                        Math.floor(new Date(day.astro.sunset).getTime() / 1000)),
                    condition: mapCondition(day.day.condition.text),
                },
            })),
            alerts: data.alerts.alert.map((alert: any) => ({
                title: alert.event,
                description: alert.desc,
            })),
            pollen: 'Moderate',
            last_updated: data.current.last_updated_epoch,
        };

        lastFetch = { data: weatherData, timestamp: Date.now() };
        console.log('Fresh weather data synced:', weatherData.current.weather.condition);
        return weatherData;
    } catch (error) {
        console.error('WeatherAPI failed:', error);
        if (lastFetch) {
            console.warn('Using stale cache, you survivor!');
            return lastFetch.data;
        }
        throw new Error('No data—API key or internet might be drunk!');
    }
}

interface LocationResult {
    name: string;
    lat: number;
    lon: number;
    displayName: string;
}

export async function getCityCoordinates(
    cityName: string,
    returnFirstResultOnly: true
): Promise<{ lat: number; lon: number } | null>;
export async function getCityCoordinates(
    cityName: string,
    returnFirstResultOnly?: false
): Promise<LocationResult[]>;

export async function getCityCoordinates(
    cityName: string,
    returnFirstResultOnly = false
) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(cityName)}&limit=5&addressdetails=1`
        );

        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();
        const results = data.map((result: any) => ({
            name: result.address.city || result.address.town || result.address.village,
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            displayName: result.display_name,
        }));

        return returnFirstResultOnly
            ? results[0] ? { lat: results[0].lat, lon: results[0].lon } : null
            : results;

    } catch (error) {
        console.error('Geocoding error:', error);
        return returnFirstResultOnly ? null : [];
    }
}