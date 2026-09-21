export default function StartModal({ startMessage, fileInputRef, fileSelectHandler, startHandler, loadFileHandler, fileLoaded }) {    
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box">
            <h2 className="modal-title">CrossCompete</h2>
            
            <div className="rules-section">
              <h3>How to Play:</h3>
              <ul className="rules-list">
                <li><strong>Player vs. Player:</strong> Fill in as many correct words as you can before your turn ends.</li>
                <li><strong>Scoring:</strong> For each successful word, earn points based on the word's length.</li>
                <li><strong>Timer:</strong> Each player has 30 seconds per turn. The entire game is 5 minutes.</li>
                <li><strong>Turns:</strong> If you make an incorrect guess, your turn ends early. </li>
                <li><strong>Navigation:</strong> Click on clues to highlight words, or use arrow keys to move around.</li>
                <li><strong>Victory:</strong> The player with the most points when the timer runs out wins!</li>
              </ul>
            </div>
            
            <p className="modal-message">{startMessage}</p>
            
            <input
              type="file"
              ref={fileInputRef}
              accept=".puz"
              onChange={(event) => fileSelectHandler(event)}
              style={{ display: 'none' }}
            />
            <div className="modal-buttons">
              <button 
                className={`modal-btn ${!fileLoaded ? 'disabled' : ''}`} 
                onClick={() => fileLoaded && startHandler()}
                disabled={!fileLoaded}
              >
                Start Game
              </button>
              <button className="modal-btn" onClick={() => loadFileHandler()}>Load .puz File</button>
            </div>
          </div>
        </div>
    )
}

/*
(
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box">
            <p className="modal-message">Press start to begin the game.</p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".puz"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="modal-buttons">
              <button
                className="modal-btn"
                onClick={() => {
                  try { localStorage.setItem('startSeen', '1') } catch (e) {}
                  setShowStartModal(false)
                  setGameStarted(true)
                  setTurnTimerActive(true)
                  setTurnTimeLeft(10)
                  setTimeout(() => {
                    const el = document.querySelector(`.cell[data-row="${selected?.row}"][data-col="${selected?.col}"]`)
                    if (el) el.focus()
                  }, 0)
                }}
              >
                Start
              </button>
              <button
                className="modal-btn"
                onClick={handleLoadFile}
              >
                Load file
              </button>
            </div>
          </div>
        </div>
    )
*/