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
import { DailyForecast, WeatherCondition } from '../types/weather';

interface DailyForecastChartProps {
    data: DailyForecast[];
}

interface ChartDataItem {
    day: string;
    minTemp: number;
    maxTemp: number;
    icon: WeatherCondition['condition'];
    timestamp: number;
}

const formatDay = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
};

const DailyForecastChart: React.FC<DailyForecastChartProps> = ({ data }) => {
    const chartData: ChartDataItem[] = data.slice(0, 5).map((day) => ({
        day: formatDay(day.dt),
        minTemp: Math.round(day.temp.min),
        maxTemp: Math.round(day.temp.max),
        icon: day.weather.condition,
        timestamp: day.dt,
    }));

    const temps = data.slice(0, 5).flatMap(day => [day.temp.min, day.temp.max]);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const padding = 20;
    const yDomain: [number, number] = [
        Math.floor(minTemp - padding),
        Math.ceil(maxTemp + padding)
    ];

    return (
        <div className="w-full h-[510px] overflow-x-auto px-2">
            <div className="w-[985px] h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

                        <XAxis
                            dataKey="day"
                            tick={{ fill: 'white', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
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
                            dataKey="maxTemp"
                            stroke="#f56565"
                            strokeWidth={3}
                            dot={{ r: 5, fill: 'white', stroke: '#f56565', strokeWidth: 2 }}
                        >
                            <LabelList dataKey="maxTemp" position="top" fill="#fff" fontSize={14} dy={-10} />
                        </Line>

                        <Line
                            type="monotone"
                            dataKey="minTemp"
                            stroke="#63b3ed"
                            strokeWidth={3}
                            dot={{ r: 5, fill: 'white', stroke: '#63b3ed', strokeWidth: 2 }}
                        >
                            <LabelList dataKey="minTemp" position="bottom" fill="#fff" fontSize={14} dy={10} />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DailyForecastChart;
