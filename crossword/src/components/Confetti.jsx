import { useMemo } from 'react'

export default function Confetti() {
    const pieces = useMemo(() => {
        return Array.from({ length: 120 }, (_, i) => {
            const drift = (Math.random() - 0.5) * 400 // -200px to +200px horizontal drift
            const rotation = Math.random() * 720 + 360 // 360-1080 degrees
            const duration = 2 + Math.random() * 2 // 2-4 seconds
            const delay = Math.random() * 1 // 0-1 second delay
            const size = 0.8 + Math.random() * 1.2 // 0.8x to 2x size multiplier
            
            return (
            <div
                key={`confetti-${i}`}
                className="confetti-piece"
                style={{
                left: `${Math.random() * 120 - 10}%`, // -10% to 110% (overflow for edge effect)
                '--drift': `${drift}px`,
                '--rotation': `${rotation}deg`,
                '--size': size,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                }}
            />
            )
        })
    }, []) // Empty dependency array ensures pieces are created only once

    return <div className="confetti">{pieces}</div>
}