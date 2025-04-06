import { useState, useEffect } from 'react';

export const useAnimation = (initialVisible = false) => {
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [isMounted, setIsMounted] = useState(initialVisible);

    useEffect(() => {
        if (isVisible) {
            setIsMounted(true);
        } else {
            const timer = setTimeout(() => setIsMounted(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return {
        isVisible,
        isMounted,
        show: () => setIsVisible(true),
        hide: () => setIsVisible(false),
        toggle: () => setIsVisible(v => !v)
    };
};