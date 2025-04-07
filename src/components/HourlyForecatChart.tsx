import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    LabelList,
} from 'recharts';
import { HourlyForecast, WeatherCondition } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastChartProps {
    data: HourlyForecast[];
    sunrise: number;
    sunset: number;
}

interface ChartDataItem {
    time: string;
    temp: number;
    icon: WeatherCondition['condition'];
    isNight: boolean;
}

interface CustomDotProps {
    cx?: number;
    cy?: number;
    payload?: ChartDataItem;
}

const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
};

const isNightTime = (timestamp: number, sunrise: number, sunset: number): boolean => {
    return timestamp < sunrise || timestamp > sunset;
};

const CustomDot: React.FC<CustomDotProps> = ({ cx = 0, cy = 0, payload }) => {
    if (!payload) return null;

    return (
        <g>
            <foreignObject
                x={cx - 15}
                y={cy + 20}
                width={30}
                height={30}
                style={{ overflow: 'visible' }}
            >
                <div className="flex justify-center w-full h-full">
                    <WeatherIcon
                        condition={payload.icon}
                        isNight={payload.isNight}
                        className="text-xl"
                    />
                </div>
            </foreignObject>
        </g>
    );
};

const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ data, sunrise, sunset }) => {
    const chartData: ChartDataItem[] = data.slice(0, 24).map((hour) => ({
        time: formatHour(hour.dt),
        temp: Math.round(hour.temp),
        icon: hour.weather.condition,
        isNight: isNightTime(hour.dt, sunrise, sunset),
    }));

    const temps = data.slice(0, 5).flatMap(hour => [hour.temp]);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const padding = 20;
    const yDomain: [number, number] = [
        Math.floor(minTemp - padding),
        Math.ceil(maxTemp + padding)
    ];

    return (
        <div className="w-full h-[500px] overflow-x-auto px-2">
            <div className="w-[1440px] h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
                        <XAxis
                            dataKey="time"
                            tick={{ fill: 'white', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />
                        <YAxis
                            domain={yDomain}
                            tick={{ fill: 'white', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#4fd1c5"
                            strokeWidth={3}
                            dot={<CustomDot />}
                            activeDot={{ r: 8 }}
                        >
                            <LabelList
                                dataKey="temp"
                                position="top"
                                fill="#fff"
                                offset={10}
                                dy={-14}
                                fontSize={14}
                            />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HourlyForecastChart;