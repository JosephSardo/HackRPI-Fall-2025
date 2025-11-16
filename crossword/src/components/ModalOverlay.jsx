export default function ModalOverlay({ modalMessage, clickHandler }) {
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-box">
                <p className="modal-message">{modalMessage}</p>
                <button className="modal-btn" onClick={() => clickHandler()}>Start</button>
            </div>
        </div>
    )
}

/*
function ModalOverlay({ modalMessage }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-box">
        <p className="modal-message">{modalMessage}</p>
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
      </div>
    </div>
  )
}
*/