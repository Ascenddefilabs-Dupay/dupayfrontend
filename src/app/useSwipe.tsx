// useSwipe.ts
import { useEffect } from 'react';

const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            const touchStartX = e.touches[0].clientX;

            const handleTouchMove = (e: TouchEvent) => {
                const touchEndX = e.touches[0].clientX;

                if (touchStartX - touchEndX > 50) {
                    onSwipeLeft();
                    removeEventListeners();
                } else if (touchEndX - touchStartX > 50) {
                    onSwipeRight();
                    removeEventListeners();
                }
            };

            const removeEventListeners = () => {
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', removeEventListeners);
            };

            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', removeEventListeners);
        };

        window.addEventListener('touchstart', handleTouchStart);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
        };
    }, [onSwipeLeft, onSwipeRight]);
};

export default useSwipe;
