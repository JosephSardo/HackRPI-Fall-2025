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