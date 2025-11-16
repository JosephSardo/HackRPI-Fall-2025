export default function VictoryOverlay({ victoryMessage, victoryScores, playAgainHandler, viewSolutionHandler }) {
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="victory-modal">
            <p className="victory-message">{victoryMessage}</p>
            <p className="victory-scores">{victoryScores}</p>
            <div className="victory-buttons">
              <button className="modal-btn replay-btn" onClick={() => playAgainHandler()}>Play Again</button>
              <button className="modal-btn solution-btn" onClick={() => viewSolutionHandler()}>View Solution</button>
            </div>
          </div>
        </div>
    )
}

/*
(
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="victory-modal">
            <p className="victory-message">
              {winModalPlayer === 'Tie' ? '🤝 It\'s a Tie! 🤝' : `🎉 ${winModalPlayer} Wins! 🎉`}
            </p>
            <p className="victory-scores">{player1Score}-{player2Score}</p>
            <div className="victory-buttons">
              <button
                className="modal-btn replay-btn"
                onClick={resetGame}
              >
                Play Again
              </button>
              <button
                className="modal-btn solution-btn"
                onClick={viewSolution}
              >
                View Solution
              </button>
            </div>
          </div>
        </div>
    )
*/