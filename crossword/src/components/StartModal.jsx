export default function StartModal({ startMessage, fileInputRef, fileSelectHandler, startHandler, loadFileHandler, fileLoaded }) {    
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-box">
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
                Start
              </button>
              <button className="modal-btn" onClick={() => loadFileHandler()}>Load file</button>
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