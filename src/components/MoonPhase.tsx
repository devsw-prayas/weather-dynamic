import React from 'react';

export type MoonPhase =
    | 'new_moon'
    | 'waxing_crescent'
    | 'first_quarter'
    | 'waxing_gibbous'
    | 'full_moon'
    | 'waning_gibbous'
    | 'last_quarter'
    | 'waning_crescent';

const MOON_PHASES: Record<MoonPhase, { label: string; emoji: string }> = {
    new_moon: { label: 'New Moon', emoji: '🌑' },
    waxing_crescent: { label: 'Waxing Crescent', emoji: '🌒' },
    first_quarter: { label: 'First Quarter', emoji: '🌓' },
    waxing_gibbous: { label: 'Waxing Gibbous', emoji: '🌔' },
    full_moon: { label: 'Full Moon', emoji: '🌕' },
    waning_gibbous: { label: 'Waning Gibbous', emoji: '🌖' },
    last_quarter: { label: 'Last Quarter', emoji: '🌗' },
    waning_crescent: { label: 'Waning Crescent', emoji: '🌘' },
};

interface MoonPhaseOverlayProps {
    selectedPhase: MoonPhase;
}

const MoonPhaseOverlay: React.FC<MoonPhaseOverlayProps> = ({ selectedPhase }) => {
    return (
        <div className="grid grid-cols-8 gap-4 w-full px-4">
            {Object.entries(MOON_PHASES).map(([key, { emoji, label }]) => {
                const isSelected = key === selectedPhase;
                return (
                    <div
                        key={key}
                        className={`
              p-4 rounded-xl h-[490px] flex flex-col items-center justify-center
              transition-all hover:bg-white/10
              ${isSelected ? 'dark-glass' : 'glass'}
            `}
                    >
                        <span className="text-2xl">{emoji}</span>
                        <p className="text-xs text-center mt-1 opacity-90">{label}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default MoonPhaseOverlay;
