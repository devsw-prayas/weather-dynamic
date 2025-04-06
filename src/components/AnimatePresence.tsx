import React, { useEffect, useState } from 'react';

interface AnimatePresenceProps {
    show: boolean;
    children: React.ReactNode;
}

export const AnimatePresence: React.FC<AnimatePresenceProps> = ({
                                                                    show,
                                                                    children,
                                                                }) => {
    const [shouldRender, setShouldRender] = useState(show);

    useEffect(() => {
        if (show) setShouldRender(true);
    }, [show]);

    if (!shouldRender) return null;

    return (
        <div className={show ? 'animate-fade' : 'animate-fade-out'}>
            {children}
        </div>
    );
};