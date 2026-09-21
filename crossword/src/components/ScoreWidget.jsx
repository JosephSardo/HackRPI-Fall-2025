export default function ScoreWidget({ activePlayer, player1Score, player2Score, turnTimeLeft, turnTimerActive, timeLeft }) {
    return (
        <div className="score-widget">
            <div className={`score-display ${activePlayer ? 'active' : ''}`}>
                <span className="score-label">Player 1 Score:</span>
                <span className="score-value">{player1Score}</span>
            </div>
            
            <div className="score-display turn-timer">
                <span className="score-label">Turn Time:</span>
                <span className={`score-value ${turnTimeLeft <= 3 ? 'urgent' : ''}`}>
                {turnTimerActive ? turnTimeLeft : '--'}
                </span>
            </div>
            
            <div className="score-display timer-display">
                <span className="score-label">Game Time:</span>
                <span className={`score-value timer-value ${timeLeft < 60 ? 'urgent' : ''}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
            </div>
            
            <div className={`score-display ${!activePlayer ? 'active' : ''}`}>
                <span className="score-label">Player 2 Score:</span>
                <span className="score-value">{player2Score}</span>
            </div>
        </div>
    )
}