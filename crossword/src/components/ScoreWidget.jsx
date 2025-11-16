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

/*
{showSwapModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box">
            <p className="modal-message">Players swapped — it's now {activePlayer ? 'Player 1' : 'Player 2'}'s turn.</p>
            <button
              ref={modalContinueRef}
              className="modal-btn"
              onClick={() => {
                setShowSwapModal(false)
                // Start turn timer immediately when player's turn begins
                setTurnTimerActive(true)
                setTurnTimeLeft(10)
                setTimeout(() => {
                  const el = document.querySelector(`.cell[data-row="${selected?.row}"][data-col="${selected?.col}"]`)
                  if (el) el.focus()
                }, 0)
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
*/