<<<<<<< HEAD
import Crossword from './classes/Crossword.js'
import AcrossClues from './components/AcrossClues.jsx'
import DownClues from './components/DownClues.jsx'
import Grid from './components/Grid.jsx'
import Confetti from './components/Confetti.jsx'
import ScoreWidget from './components/ScoreWidget.jsx'
import ModalOverlay from './components/ModalOverlay.jsx'
import StartModal from './components/StartModal.jsx'
import VictoryModal from './components/VictoryModal.jsx'
=======
import AcrossClues from './components/AcrossClues.jsx'
import DownClues from './components/DownClues.jsx'
import Grid from './components/Grid.jsx'
import { SAMPLE_CROSSWORD } from './data/sampleCrossword.js'
>>>>>>> ca83e0d7bf0430b2abb7f8a58b6a22afb3cec8f6
import * as gridNav from './logic/gridNavigation.js'
import { useState, useRef, useEffect, useMemo } from 'react'
import './App.css'
      
export default function App() {
  // Grid states
  const [cells, setCells] = useState([])
  const [rows, setRows] = useState(0)
  const [cols, setCols] = useState(0)
  const [grid, setGrid] = useState(null)
  const [crossword, setCrossword] = useState(null)
<<<<<<< HEAD
  const [fileLoaded, setFileLoaded] = useState(false)
=======
>>>>>>> ca83e0d7bf0430b2abb7f8a58b6a22afb3cec8f6

  // Navigation states
  const [selected, setSelected] = useState(null)
  // highlight holds keys of currently highlighted cells (row or column)
  const [highlight, setHighlight] = useState([])
  // direction: 'across' | 'down'
  const [direction, setDirection] = useState('across')
  
  // Clue states
  const [currentAcrossClue, setCurrentAcrossClue] = useState(null)
  const [currentDownClue, setCurrentDownClue] = useState(null)
  
  // Player states
  const [activePlayer, setActivePlayer] = useState(true) // true for Player 1, false for Player 2
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  
  // Time states
  const [timeLeft, setTimeLeft] = useState(11) // 10 minutes in seconds
  const [turnTimeLeft, setTurnTimeLeft] = useState(10) // 10 seconds per turn
  const [turnTimerActive, setTurnTimerActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Modal states
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [showStartModal, setShowStartModal] = useState(false)
  const modalContinueRef = useRef(null)
  const [winModalPlayer, setWinModalPlayer] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [viewingSolution, setViewingSolution] = useState(false)
  const [feedbackType, setFeedbackType] = useState(null) // 'success' | 'error' | null

  const gridRef = useRef(null)
  const fileInputRef = useRef(null)

  // Callback function for Load file button
  function handleLoadFile() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle file selection
  function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file && file.name.toLowerCase().endsWith('.puz')) {
      console.log('Selected .puz file:', file.name)
      parsePuzFile(file)
    }
<<<<<<< HEAD
    // Reset file input
    event.target.value = ''
  }
=======

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, player1Score, player2Score, showSwapModal, showStartModal, gameStarted])

  // Turn timer countdown effect
  useEffect(() => {
    if (!gameStarted) return
    if (!turnTimerActive || turnTimeLeft <= 0) {
      if (turnTimeLeft <= 0 && turnTimerActive) {
        // Time's up - switch players
        setActivePlayer(prev => !prev)
        setTurnTimeLeft(10) // Reset timer
        setTurnTimerActive(false) // Stop timer until next action
        setShowSwapModal(true) // Show swap notification
      }
      return
    }

    const timer = setInterval(() => {
      setTurnTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [turnTimeLeft, turnTimerActive, gameStarted])
>>>>>>> ca83e0d7bf0430b2abb7f8a58b6a22afb3cec8f6
  
  function initializeGrid(crossword) {
    console.log('initializeGrid called with:', crossword)
    console.log('crossword.rows:', crossword.rows)
    console.log('crossword.cols:', crossword.cols) 
    console.log('crossword.grid:', crossword.grid)
    
    const isBlack = (row, col) => crossword.grid[row] && crossword.grid[row][col] === '#' 
    const newCells = []
    let hintIndex = 0
    
    for (let row = 0; row < crossword.rows; row++) {
      for (let col = 0; col < crossword.cols; col++) {
        let thisIndex = 0
        if (!isBlack(row, col)) {
          if (row === 0 || isBlack(row - 1, col)) { // check if this can be the start of a down word
            hintIndex++
            thisIndex = hintIndex
          } else if (col === 0 || isBlack(row, col - 1)) { // check if this can be the start of an accross word
            hintIndex++
            thisIndex = hintIndex
          }
        }

        const black = isBlack(row, col)
        newCells.push({
          row: row,
          col: col,
          value: '',
          isBlack: black,
          mutable: true,
          number: thisIndex,
        })
      }
    } 
    
    setRows(crossword.rows)
    setCols(crossword.cols)
    setGrid(crossword.grid)
    setCrossword(crossword)
    setCells(newCells)
  }
  
<<<<<<< HEAD

  function parsePuzFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    fetch('http://127.0.0.1:5173/api/jsonify', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(crosswordData => {
      initializeGrid(new Crossword(crosswordData.grid, crosswordData.across, crosswordData.down))
      setFileLoaded(true)
    })
    .catch(error => console.error('Error:', error))
  }

  // Function to show the completed board with solution
  function viewSolution() {
    if (!crossword) return
    
    const solutionCells = [...cells]
    for (let row = 0; row < crossword.rows; row++) {
      for (let col = 0; col < crossword.cols; col++) {
        const cellIndex = row * crossword.cols + col
        if (cellIndex < solutionCells.length && !solutionCells[cellIndex].isBlack) {
          solutionCells[cellIndex].value = crossword.grid[row][col]
        }
      }
    }
    setCells(solutionCells)
    setViewingSolution(true)
    setWinModalPlayer(null) // Close the modal
  }

  // Function to go back from solution view
  function backFromSolution() {
    setViewingSolution(false)
    // Show the win modal again
    const winner = player1Score > player2Score ? 'Player 1' : 
                   player2Score > player1Score ? 'Player 2' : 'Tie'
    setWinModalPlayer(winner)
  }

  // Reset function to restore website to default state
  function resetGame() {
    // Reset grid states
    setCells([])
    setRows(0)
    setCols(0)
    setGrid(null)
    setCrossword(null)
    
    // Reset navigation states
    setSelected(null)
    setHighlight([])
    setDirection('across')
    
    // Reset clue states
    setCurrentAcrossClue(null)
    setCurrentDownClue(null)
    
    // Reset player states
    setActivePlayer(true)
    setPlayer1Score(0)
    setPlayer2Score(0)
    
    // Reset time states
    setTimeLeft(11)
    setTurnTimeLeft(10)
    setTurnTimerActive(false)
    setGameStarted(false)
    
    // Reset modal states
    setShowSwapModal(false)
    setShowStartModal(false)
    setWinModalPlayer(null)
    setShowConfetti(false)
    setViewingSolution(false)
    setFeedbackType(null)
    setFileLoaded(false)
    
    // Reinitialize the grid
    setTimeout(() => {
      initializeGrid(crossword)
      setShowStartModal(true)
    }, 100)
  }
  
  // Initialize grid on mount
  useEffect(() => {
    setShowStartModal(true)
  }, [])

  // Timer countdown effect
  useEffect(() => {
    if (!gameStarted) return
    if (timeLeft <= 0) {
      // Determine winner based on scores
      let winner
      if (player1Score > player2Score) {
        winner = 'Player 1'
      } else if (player2Score > player1Score) {
        winner = 'Player 2'
      } else {
        winner = 'Tie'
      }
      setWinModalPlayer(winner)
      setShowConfetti(true)
      // Stop turn timer when game ends
      setTurnTimerActive(false)
      // Close swap modal if it's open
      setShowSwapModal(false)
      // Clear highlights and selected cell when game ends
      setHighlight([])
      setSelected(null)
      // Remove focus highlight from any focused cell
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur()
      }
      // Stop confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000)
      return
    }

    // Pause game timer when swap or start modal is open
    if (showSwapModal || showStartModal) {
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, player1Score, player2Score, showSwapModal, showStartModal, gameStarted])

  // Turn timer countdown effect
  useEffect(() => {
    if (!gameStarted) return
    if (!turnTimerActive || turnTimeLeft <= 0) {
      if (turnTimeLeft <= 0 && turnTimerActive) {
        // Time's up - switch players
        setActivePlayer(prev => !prev)
        setTurnTimeLeft(10) // Reset timer
        setTurnTimerActive(false) // Stop timer until continue button is pressed
        setShowSwapModal(true) // Show swap notification
      }
      return
    }

    const timer = setInterval(() => {
      setTurnTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [turnTimeLeft, turnTimerActive, gameStarted])
  
=======
>>>>>>> ca83e0d7bf0430b2abb7f8a58b6a22afb3cec8f6
  function handleCellClick(row, col) {
    if (showSwapModal || showStartModal || winModalPlayer !== null || viewingSolution) return
    if (gridNav.getCellByIndex(cells, row, col, cols)?.isBlack) return
    setSelected({ row: row, col: col })
    // Respect current direction: if we're in 'down' mode, keep it and update column highlight.
    if (direction === "down") {
      updateColHighlight(row, col)
    } else {
      // Default to across selection
      setDirection("across")
      updateRowHighlight(row, col)
    }
    // focus the DOM element after selection
    setTimeout(() => {
      const el = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
      if (el) el.focus()
    }, 0)
  }

  function handleCellDoubleClick(row, col) {
    if (showSwapModal || showStartModal || winModalPlayer !== null || viewingSolution) return
    if (gridNav.getCellByIndex(cells, row, col, cols)?.isBlack) return
    // toggle direction: if currently down, switch back to across
    if (direction === "down") {
      setDirection("across")
      setSelected({ row: row, col: col })
      updateRowHighlight(row, col)
      setTimeout(() => {
        const el = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
        if (el) el.focus()
      }, 0)
      return
    }

    // otherwise enter down mode
    setDirection("down")
    setSelected({ row: row, col: col })
    updateColHighlight(row, col)
    setTimeout(() => {
      const el = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
      if (el) el.focus()
    }, 0)
  }

<<<<<<< HEAD
  function updateRowHighlight(row, col) {
    // Find contiguous non-black cells in the row
    let left = col
    while (left > 0 && !gridNav.getCellByIndex(cells, row, left - 1, cols)?.isBlack) {
      left -= 1
    }

    let right = col
    while (right < cols - 1 && !gridNav.getCellByIndex(cells, row, right + 1, cols)?.isBlack) {
      right += 1
    }

    const highlighted = []
    for (let i = left; i <= right; i++) {
      highlighted.push(gridNav.getCellKey(row, i))
    }
    setHighlight(highlighted)
    // Update current across clue number
    const startCell = gridNav.getCellByIndex(cells, row, left, cols)
    setCurrentAcrossClue(startCell?.number || null)
  }

  function updateColHighlight(row, col) {
    if (showSwapModal || showStartModal || winModalPlayer !== null) return
    let top = row
    while (top - 1 >= 0 && !gridNav.getCellByIndex(cells, top - 1, col, cols)?.isBlack) {
      top -= 1
    }

    let bottom = row
    while (bottom + 1 < rows && !gridNav.getCellByIndex(cells, bottom + 1, col, cols)?.isBlack) {
      bottom += 1
    }

    const highlighted = []
    for (let i = top; i <= bottom; i++) {
      highlighted.push(gridNav.getCellKey(i, col))
    }
    setHighlight(highlighted)
    // Update current down clue number
    const startCell = gridNav.getCellByIndex(cells, top, col, cols)
    setCurrentDownClue(startCell?.number || null)
  }

  function onFail(row, col, across) {
    if (across) {
      for (let i = col; !gridNav.getCellByIndex(cells, row, i, cols).isBlack; i++) {
        setCells(prev => {
          const updated = [...prev]
          if (gridNav.getCellByIndex(updated, row, i, cols).mutable) {
            gridNav.getCellByIndex(updated, row, i, cols).value = ""
          }
          return updated
        })
      }
      return
    }
    // down
    for (let i = row; !gridNav.getCellByIndex(cells, i, col, cols).isBlack; i++) {
      setCells(prev => {
        const updated = [...prev]
        if (gridNav.getCellByIndex(updated, i, col, cols).mutable) {
          gridNav.getCellByIndex(updated, i, col, cols).value = ""
        }
        return updated
      })
    }

  }

=======
>>>>>>> ca83e0d7bf0430b2abb7f8a58b6a22afb3cec8f6
  function handleKeyEnter(row, col, ev) {
    if (gridNav.getCellByIndex(cells, row, col, cols)?.isBlack) return

    if(ev.key !== "Enter") {
      return
    }

    // Prevent auto-repeat from holding down Enter key
    if (ev.repeat) {
      return
    }

    // Show success feedback before switching players
    setFeedbackType('success')
    setTurnTimerActive(false) // Stop timer until continue button is pressed
    
    // Delay player switch and modal to show feedback
    setTimeout(() => {
      setActivePlayer(prev => !prev)
      setShowSwapModal(true)
      setFeedbackType(null)
    }, 800) // 800ms delay for celebration

    let length = 0
    if (direction === "across") {
      let startCol = 0
      for (let i = col; i >= 0; i--) {
        if (gridNav.getCellByIndex(cells, row, i, cols)?.isBlack) {
          startCol = i + 1
          break
        }
      }
      
      for (let i = startCol; i < cols &&  !gridNav.getCellByIndex(cells, row, i, cols)?.isBlack; i++) {
        if (grid[row][i] !== gridNav.getCellByIndex(cells, row, i, cols).value) {
          // Show error feedback before clearing
          setFeedbackType('error')
          setTimeout(() => {
            onFail(row, startCol, true)
            setFeedbackType(null)
          }, 500) // 500ms delay for error flash
          return false
        }
      }
      for (let i = startCol; i < cols && !gridNav.getCellByIndex(cells, row, i, cols)?.isBlack; i++) {
        length++
        cells[gridNav.getCellIndex(row, i, cols)].mutable = false
      }
    } else { // direction === down
      let startRow = 0
      for (let i = row; i >= 0; i--) {
        if (gridNav.getCellByIndex(cells, i, col, cols)?.isBlack) {
          startRow = i + 1
          break
        }
      }

      for(let i = startRow; i < rows && !gridNav.getCellByIndex(cells, i, col, cols)?.isBlack; i++) {
        if (grid[i][col] !== gridNav.getCellByIndex(cells, i, col, cols).value) {
          // Show error feedback before clearing
          setFeedbackType('error')
          setTimeout(() => {
            onFail(startRow, col, false)
            setFeedbackType(null)
          }, 500) // 500ms delay for error flash
          return false
        }
      }
      for(let i = startRow; i < rows && !gridNav.getCellByIndex(cells, i, col, cols)?.isBlack; i++) {
        length++
        cells[gridNav.getCellIndex(i, col, cols)].mutable = false
      }
    }

    if (activePlayer) {
      setPlayer1Score(prev => prev + length);
    }
    else {
      setPlayer2Score(prev => prev + length);
    }
    return true
  }

  function handleCellKeyDown(row, col, ev) {
    if (showSwapModal || showStartModal || viewingSolution) { ev.preventDefault(); return }
    if (gridNav.getCellByIndex(cells, row, col, cols)?.isBlack) return

    handleKeyEnter(row, col, ev)
    
    // If arrow pressed that is opposite of current direction, switch modes
    if ((ev.key === "ArrowUp" || ev.key === "ArrowDown") && direction === "across") {
      // First press of Up/Down while in across: switch to vertical mode but do not move.
      setDirection("down")
      updateColHighlight(row, col)
      ev.preventDefault()
      return
    }

    if ((ev.key === "ArrowLeft" || ev.key === "ArrowRight") && direction === "down") {
      // First press of Left/Right while in down: switch to across mode but do not move.
      setDirection("across")
      updateRowHighlight(row, col)
      ev.preventDefault()
      return
    }

    // Arrow key navigation (only in the active direction)
    if (ev.key === "ArrowLeft" && direction === "across") {
      const prev = gridNav.findPrevInRow(cells, row, col, cols)
      if (prev) {
        setSelected({ row: prev.row, col: prev.col })
        updateRowHighlight(prev.row, prev.col)
        setTimeout(() => {
          const el = document.querySelector(`.cell[data-row="${prev.row}"][data-col="${prev.col}"]`)
          if (el) el.focus()
        }, 0)
      }
      ev.preventDefault()
      return
    }

    if (ev.key === "ArrowRight" && direction === "across") {
      const next = gridNav.findNextInRow(cells, row, col, cols)
      if (next) {
        setSelected({ row: next.row, col: next.col })
        updateRowHighlight(next.row, next.col)
        setTimeout(() => {
          const el = document.querySelector(`.cell[data-row="${next.row}"][data-col="${next.col}"]`)
          if (el) el.focus()
        }, 0)
      }
      ev.preventDefault()
      return
    }

    if (ev.key === "ArrowUp" && direction === "down") {
      const prev = gridNav.findPrevInCol(cells, row, col, cols)
      if (prev) {
        setSelected({ row: prev.row, col: prev.col })
        updateColHighlight(prev.row, prev.col)
        setTimeout(() => {
          const el = document.querySelector(`.cell[data-row="${prev.row}"][data-col="${prev.col}"]`)
          if (el) el.focus()
        }, 0)
      }
      ev.preventDefault()
      return
    }

    if (ev.key === "ArrowDown" && direction === "down") {
      const next = gridNav.findNextInCol(cells, row, col, rows, cols)
      if (next) {
        setSelected({ row: next.row, col: next.col })
        updateColHighlight(next.row, next.col)
        setTimeout(() => {
          const el = document.querySelector(`.cell[data-row="${next.row}"][data-col="${next.col}"]`)
          if (el) el.focus()
        }, 0)
      }
      ev.preventDefault()
      return
    }

    if (ev.key === "Backspace" || ev.key === "Delete") {
      
      const curVal = gridNav.getCellByIndex(cells, row, col, cols).value
      if (curVal) {
        if (!gridNav.getCellByIndex(cells, row, col, cols)?.mutable) {
          return
        }
        // If current cell has a value, clear it
        setCells(prev => {
          const updated = [...prev]
          gridNav.getCellByIndex(updated, row, col, cols).value = ''
          return updated
        })
        ev.preventDefault()
        return
      }

      // If current cell is empty, move focus back one cell according to direction
      const prev = direction === "down" ? gridNav.findPrevOpenCellUp(cells, row, col, rows, cols) : gridNav.findPrevOpenCell(cells, row, col, cols)
      if (prev) {
        // clear the previous cell as part of the backspace action
        if (!prev.mutable) {
          return
        }

        setCells(prevCells => {
          const updated = [...prevCells]
          gridNav.getCellByIndex(updated, prev.row, prev.col, cols).value = ''
          return updated
        })
        setSelected({ row: prev.row, col: prev.col })
        if (direction === "down") updateColHighlight(prev.row, prev.col)
        else updateRowHighlight(prev.row, prev.col)
        setTimeout(() => {
          const el = document.querySelector(`.cell[data-row="${prev.row}"][data-col="${prev.col}"]`)
          if (el) el.focus()
        }, 0)
      }
      ev.preventDefault()
      return
    }

    if (/^[a-zA-Z]$/.test(ev.key)) {
      if (!gridNav.getCellByIndex(cells, row, col, cols).mutable) {
        return
      }

      setCells(prev => {
        const updated = [...prev]
        gridNav.getCellByIndex(updated, row, col, cols).value = ev.key.toUpperCase()
        return updated
      })
      ev.preventDefault()
      // move focus according to current direction
      
      const next = direction === "down" ? gridNav.findNextOpenCellDown(cells, row, col, rows, cols) : gridNav.findNextOpenCellAcross(cells, row, col, rows, cols)
      const nextAvailabe = direction === "down" ? !gridNav.getCellByIndex(cells, row + 1, col, cols)?.isBlack : !gridNav.getCellByIndex(cells, row, col + 1, cols)?.isBlack

      if (next && nextAvailabe) {
        // update selection and highlight
        setSelected({ row: next.row, col: next.col })
        if (direction === "down") updateColHighlight(next.row, next.col)
        else updateRowHighlight(next.row, next.col)
        // focus DOM element after React updates
        setTimeout(() => {
          const el = document.querySelector(`.cell[data-row="${next.row}"][data-col="${next.col}"]`)
          if (el) el.focus()
        }, 0)
      }
    }
  }

  function updateRowHighlight(row, col) {
    // Find contiguous non-black cells in the row
    let left = col
    while (left > 0 && !gridNav.getCellByIndex(cells, row, left - 1, cols)?.isBlack) {
      left -= 1
    }

    let right = col
    while (right < cols - 1 && !gridNav.getCellByIndex(cells, row, right + 1, cols)?.isBlack) {
      right += 1
    }

    const highlighted = []
    for (let i = left; i <= right; i++) {
      highlighted.push(gridNav.getCellKey(row, i))
    }
    setHighlight(highlighted)
    // Update current across clue number
    const startCell = gridNav.getCellByIndex(cells, row, left, cols)
    setCurrentAcrossClue(startCell?.number || null)
  }

  function updateColHighlight(row, col) {
    if (showSwapModal || showStartModal || winModalPlayer !== null) { ev.preventDefault(); return }
    let top = row
    while (top - 1 >= 0 && !gridNav.getCellByIndex(cells, top - 1, col, cols)?.isBlack) {
      top -= 1
    }

    let bottom = row
    while (bottom + 1 < rows && !gridNav.getCellByIndex(cells, bottom + 1, col, cols)?.isBlack) {
      bottom += 1
    }

    const highlighted = []
    for (let i = top; i <= bottom; i++) {
      highlighted.push(gridNav.getCellKey(i, col))
    }
    setHighlight(highlighted)
    // Update current down clue number
    const startCell = gridNav.getCellByIndex(cells, top, col, cols)
    setCurrentDownClue(startCell?.number || null)
  }

  function onFail(row, col, across) {
    if (across) {
      for (let i = col; !gridNav.getCellByIndex(cells, row, i, cols).isBlack; i++) {
        setCells(prev => {
          const updated = [...prev]
          if (gridNav.getCellByIndex(updated, row, i, cols).mutable) {
            gridNav.getCellByIndex(updated, row, i, cols).value = ""
          }
          return updated
        })
      }
      return
    }
    // down
    for (let i = row; !gridNav.getCellByIndex(cells, i, col, cols).isBlack; i++) {
      setCells(prev => {
        const updated = [...prev]
        if (gridNav.getCellByIndex(updated, i, col, cols).mutable) {
          gridNav.getCellByIndex(updated, i, col, cols).value = ""
        }
        return updated
      })
    }

  }

  useEffect(() => {
    if (showSwapModal) {
      // focus the Continue button so keyboard users can proceed
      setTimeout(() => {
        if (modalContinueRef.current) modalContinueRef.current.focus()
      }, 0)
    }
  }, [showSwapModal])

  return (
    <main className="app">
      {/* Player Headers */}
      <div className="player-headers">
        <h2 
          className={`player-header ${activePlayer ? 'active' : ''}`}
        >
          Player 1
        </h2>
        <h2 
          className={`player-header ${!activePlayer ? 'active' : ''}`}
        >
          Player 2
        </h2>
      </div>
      
      <ScoreWidget activePlayer={activePlayer} player1Score={player1Score} player2Score={player2Score} turnTimeLeft={turnTimeLeft} turnTimerActive={turnTimerActive} timeLeft={timeLeft}/>
      
      <div className="controls">
        {viewingSolution && (
          <button
            className="back-btn"
            onClick={backFromSolution}
          >
            ← Back to Results
          </button>
        )}
      </div>
      <div className="board">
        <div className={`grid ${feedbackType ? `feedback-${feedbackType}` : ''}`} role="grid" aria-label="Crossword grid" ref={gridRef} aria-hidden={showSwapModal || showStartModal} style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}>
          <Grid cells={cells} selected={selected} highlight={highlight} clickHandler={handleCellClick} doubleClickHandler={handleCellDoubleClick} keyDownHandler={handleCellKeyDown}/>
        </div>
        
        <aside className="clues" aria-label="Across Clues">
          <AcrossClues crossword={crossword} cells={cells} activeClue={currentAcrossClue} isActive={direction === 'across'} />
        </aside>

        <aside className="clues" aria-label="Down Clues">
          <DownClues crossword={crossword} cells={cells} activeClue={currentDownClue} isActive={direction === 'down'} />
        </aside>
      </div>
      
      {winModalPlayer && <VictoryModal 
        victoryMessage={winModalPlayer === 'Tie' ? '🤝 It\'s a Tie! 🤝' : `🎉 ${winModalPlayer} Wins! 🎉`}
        victoryScores={`${player1Score} - ${player2Score}`}
        playAgainHandler={resetGame}
        viewSolutionHandler={viewSolution}
      />}
      
      {showConfetti && <Confetti />}
      
      {showStartModal && <StartModal 
        startMessage={fileLoaded ? "Press start to begin the game." : "Load a .puz file to get started."}
        fileInputRef={fileInputRef}
        fileSelectHandler={handleFileSelect}
        fileLoaded={fileLoaded}
        startHandler={() => {
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
        loadFileHandler={handleLoadFile}
      />}
      
      {showSwapModal && <ModalOverlay 
        modalMessage={`Players swapped — it's now ${activePlayer ? 'Player 1' : 'Player 2'}'s turn.`}
        clickHandler = {() => {
          setShowSwapModal(false)
          // Start turn timer only when continue button is pressed
          setTurnTimerActive(true)
          setTurnTimeLeft(10)
          setTimeout(() => {
            const el = document.querySelector(`.cell[data-row="${selected?.row}"][data-col="${selected?.col}"]`)
            if (el) el.focus()
          }, 0)
      }} />}      
    </main>
  )
}
<<<<<<< HEAD
=======

function ClueLists({ cells, activeClue, isActive }) {
  const activeRefs = useRef({})

  useEffect(() => {
    if (isActive && activeClue && activeRefs.current[activeClue]) {
      activeRefs.current[activeClue].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeClue, isActive])

  if (!cells || cells.length === 0) return null

  const across = []

  // build across clues
  SAMPLE_CROSSWORD['hints']['across'].forEach(hint => across.push(hint))

  return (
    <div className="clue-lists">
      <div className="clue-group">
        <h3>Across</h3>
        <ul>
          {across.sort((a, b) => a.number - b.number).map(item => (
            <li 
              key={`a-${item.number || `${item.row}-${item.col}`}`}
              className={isActive && item.number === activeClue ? 'active-clue' : ''}
              ref={el => { if (item.number) activeRefs.current[item.number] = el }}
            >
              <strong>{item.number}</strong> {item.clue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function DownClues({ cells, activeClue, isActive }) {
  const activeRefs = useRef({})

  useEffect(() => {
    if (isActive && activeClue && activeRefs.current[activeClue]) {
      activeRefs.current[activeClue].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeClue, isActive]) 

  if (!cells || cells.length === 0) return null

  const down = []

  // build down clues
  for (const hint in SAMPLE_CROSSWORD['hints']['down']) {
    down.push(SAMPLE_CROSSWORD['hints']['down'][hint])
  }
  
  return (
    <div className="clue-lists">
      <div className="clue-group">
        <h3>Down</h3>
        <ul>
          {down.sort((a, b) => a.number - b.number).map(item => (
            <li 
              key={`d-${item.number || `${item.row}-${item.col}`}`}
              className={isActive && item.number === activeClue ? 'active-clue' : ''}
              ref={el => { if (item.number) activeRefs.current[item.number] = el }}
            >
              <strong>{item.number}</strong> {item.clue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Confetti() {
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

export default App
>>>>>>> ca83e0d7bf0430b2abb7f8a58b6a22afb3cec8f6
