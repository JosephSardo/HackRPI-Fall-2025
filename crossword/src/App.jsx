import Crossword from './classes/Crossword.js'
import AcrossClues from './components/AcrossClues.jsx'
import DownClues from './components/DownClues.jsx'
import Grid from './components/Grid.jsx'
import Confetti from './components/Confetti.jsx'
import ScoreWidget from './components/ScoreWidget.jsx'
import ModalOverlay from './components/ModalOverlay.jsx'
import StartModal from './components/StartModal.jsx'
import VictoryModal from './components/VictoryModal.jsx'
import * as gridNav from './logic/gridNavigation.js'
import { useState, useRef, useEffect } from 'react'
import './App.css'
      
const TURN_TIME = 20
const GAME_TIME = 300

export default function App() {
  // Grid states
  const [cells, setCells] = useState([])
  const [rows, setRows] = useState(0)
  const [cols, setCols] = useState(0)
  const [grid, setGrid] = useState(null)
  const [crossword, setCrossword] = useState(null)
  const [fileLoaded, setFileLoaded] = useState(false)

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
  const [timeLeft, setTimeLeft] = useState(GAME_TIME) // 10 minutes in seconds
  const [turnTimeLeft, setTurnTimeLeft] = useState(TURN_TIME) // 10 seconds per turn
  const [turnTimerActive, setTurnTimerActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Modal states
  const [showStartModal, setShowStartModal] = useState(false)
  const [countdown, setCountdown] = useState(null) // 3, 2, 1, or null
  const modalContinueRef = useRef(null)
  const [winModalPlayer, setWinModalPlayer] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [viewingSolution, setViewingSolution] = useState(false)
  const [feedbackType, setFeedbackType] = useState(null) // 'success' | 'error' | null
  const errorFeedbackTimeoutRef = useRef(null)

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
    // Reset file input
    event.target.value = ''
  }
  
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
  

  function parsePuzFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    fetch('http://127.0.0.1:5174/api/jsonify', {
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
    setTimeLeft(GAME_TIME)
    setTurnTimeLeft(TURN_TIME)
    setTurnTimerActive(false)
    setGameStarted(false)
    
    // Reset modal states
    setShowStartModal(false)
    setCountdown(null)
    setWinModalPlayer(null)
    setShowConfetti(false)
    setViewingSolution(false)
    setFeedbackType(null)
    if (errorFeedbackTimeoutRef.current) {
      clearTimeout(errorFeedbackTimeoutRef.current)
      errorFeedbackTimeoutRef.current = null
    }
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

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return
    
    if (countdown > 0) {
      // Play countdown sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Same tone for all countdown numbers
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      } catch (e) {
        console.log('Audio context not available')
      }
      
      // Continue countdown after 1 second
      setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else {
      // Countdown finished - play start sound and start the game
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Higher pitch for game start
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.8)
      } catch (e) {
        console.log('Audio context not available')
      }
      
      setCountdown(null)
      setGameStarted(true)
      setTurnTimerActive(true)
      setTurnTimeLeft(TURN_TIME)
      
      setTimeout(() => {
        const el = document.querySelector(`.cell[data-row="${selected?.row}"][data-col="${selected?.col}"]`)
        if (el) el.focus()
      }, 0)
    }
  }, [countdown, selected])

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
      
      // Play victory sound effect
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        
        // Create a triumphant fanfare sequence
        const notes = [
          { freq: 523.25, start: 0.0, duration: 0.3 },   // C5
          { freq: 659.25, start: 0.2, duration: 0.3 },   // E5
          { freq: 783.99, start: 0.4, duration: 0.3 },   // G5
          { freq: 1046.5, start: 0.6, duration: 0.5 },   // C6 (octave higher, triumphant)
          { freq: 783.99, start: 0.9, duration: 0.4 },   // G5 (resolution)
          { freq: 1046.5, start: 1.2, duration: 0.8 }    // C6 (final victory note)
        ]
        
        notes.forEach(note => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.start)
          gainNode.gain.setValueAtTime(0, audioContext.currentTime + note.start)
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + note.start + 0.05)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.start + note.duration)
          
          oscillator.start(audioContext.currentTime + note.start)
          oscillator.stop(audioContext.currentTime + note.start + note.duration)
        })
      } catch (e) {
        // Silently fail if audio context is not available
        console.log('Audio context not available')
      }
      
      // Stop turn timer when game ends
      setTurnTimerActive(false)
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

    // Pause game timer when start modal is open or when victory modal is shown
    if (showStartModal || winModalPlayer !== null) {
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, player1Score, player2Score, showStartModal, gameStarted])

  // Turn timer countdown effect
  useEffect(() => {
    if (!gameStarted) return
    if (!turnTimerActive || turnTimeLeft <= 0) {
      if (turnTimeLeft <= 0 && turnTimerActive) {
        // Time's up - switch players
        setActivePlayer(prev => !prev)
        
        // Play player switch sound effect
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          // Create a "whoosh" or "pass" sound - quick frequency sweep
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
          oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2)
          
          gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.2)
        } catch (e) {
          // Silently fail if audio context is not available
          console.log('Audio context not available')
        }
        
        setTurnTimeLeft(TURN_TIME) // Reset timer
        setTurnTimerActive(true) // Continue with new player's turn immediately
      }
      return
    }

    const timer = setInterval(() => {
      setTurnTimeLeft(prev => {
        const newTime = prev - 1
        
        // Play ticking sound for last 3 seconds
        if (newTime <= 3 && newTime > 0) {
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // High pitch tick
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
            
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.1)
          } catch (e) {
            // Silently fail if audio context is not available
            console.log('Audio context not available')
          }
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [turnTimeLeft, turnTimerActive, gameStarted])
  
  function handleCellClick(row, col) {
    if (showStartModal || winModalPlayer !== null || viewingSolution) return
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
    if (showStartModal || winModalPlayer !== null || viewingSolution) return
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

  function updateRowHighlight(row, col) {
    if (showStartModal || winModalPlayer !== null) return
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
    if (showStartModal || winModalPlayer !== null) return
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

  function handleClueClick(clueNumber, direction) {
    if (!crossword || !cells) return
    
    // Find the starting cell for this clue number
    let startCell = null
    for (const cell of cells) {
      if (cell.number === clueNumber && !cell.isBlack) {
        startCell = cell
        break
      }
    }
    
    if (!startCell) return
    
    const { row, col } = startCell
    
    // Set the direction and update highlights
    setDirection(direction)
    setSelected({ row, col })
    
    if (direction === 'across') {
      updateRowHighlight(row, col)
    } else {
      updateColHighlight(row, col)
    }
    
    // Focus the first cell after a brief delay to ensure DOM is updated
    setTimeout(() => {
      const el = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
      if (el) el.focus()
    }, 0)
  }

  function onFail(row, col, across) {
    setActivePlayer(prev => !prev)
    
    // Play player switch sound effect
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a "whoosh" or "pass" sound - quick frequency sweep
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (e) {
      // Silently fail if audio context is not available
      console.log('Audio context not available')
    }
    
    setTurnTimeLeft(TURN_TIME)

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

  function handleKeyEnter(row, col, ev) {
    if (gridNav.getCellByIndex(cells, row, col, cols)?.isBlack) return

    if(ev.key !== "Enter") {
      return
    }

    // Prevent auto-repeat from holding down Enter key
    if (ev.repeat) {
      return
    }

    // Show success feedback and play success sound
    setFeedbackType('success')
    
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
          // Show error feedback and play failure sound
          if (errorFeedbackTimeoutRef.current) {
            clearTimeout(errorFeedbackTimeoutRef.current)
          }
          setFeedbackType('error')
          
          // Play failure sound effect
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            // Create a descending failure tone
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime) // Start higher
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3) // Drop down
            
            gainNode.gain.setValueAtTime(0.12, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
            
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.3)
          } catch (e) {
            // Silently fail if audio context is not available
            console.log('Audio context not available')
          }
          
          errorFeedbackTimeoutRef.current = setTimeout(() => {
            onFail(row, startCol, true)
            setFeedbackType(null)
            errorFeedbackTimeoutRef.current = null
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
          // Show error feedback and play failure sound
          if (errorFeedbackTimeoutRef.current) {
            clearTimeout(errorFeedbackTimeoutRef.current)
          }
          setFeedbackType('error')
          
          // Play failure sound effect
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            // Create a descending failure tone
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime) // Start higher
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3) // Drop down
            
            gainNode.gain.setValueAtTime(0.12, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
            
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.3)
          } catch (e) {
            // Silently fail if audio context is not available
            console.log('Audio context not available')
          }
          
          errorFeedbackTimeoutRef.current = setTimeout(() => {
            onFail(startRow, col, false)
            setFeedbackType(null)
            errorFeedbackTimeoutRef.current = null
          }, 500) // 500ms delay for error flash
          return false
        }
      }
      for(let i = startRow; i < rows && !gridNav.getCellByIndex(cells, i, col, cols)?.isBlack; i++) {
        length++
        cells[gridNav.getCellIndex(i, col, cols)].mutable = false
      }
    }

    // Clear success feedback after animation completes
    setTimeout(() => {
      setFeedbackType(null)
    }, 800) // 800ms to match success animation duration

    if (activePlayer) {
      setPlayer1Score(prev => prev + length);
    }
    else {
      setPlayer2Score(prev => prev + length);
    }

    // Play success sound effect
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Create a pleasant success chime (major chord)
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } catch (e) {
      // Silently fail if audio context is not available
      console.log('Audio context not available')
    }
    
    // Check if puzzle is now complete
    if (checkPuzzleCompletion()) {
      // End the game immediately - puzzle is solved!
      setTurnTimerActive(false)
      
      // Determine winner based on current scores
      const finalPlayer1Score = activePlayer ? player1Score + length : player1Score
      const finalPlayer2Score = activePlayer ? player2Score : player2Score + length
      
      if (finalPlayer1Score > finalPlayer2Score) {
        setWinModalPlayer('Player 1')
      } else if (finalPlayer2Score > finalPlayer1Score) {
        setWinModalPlayer('Player 2')
      } else {
        setWinModalPlayer('Tie')
      }
      
      setShowConfetti(true)
      
      // Play victory sound
      setTimeout(() => {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          
          // Create a triumphant fanfare sequence
          const frequencies = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
          
          frequencies.forEach((freq, index) => {
            setTimeout(() => {
              const oscillator = audioContext.createOscillator()
              const gainNode = audioContext.createGain()
              
              oscillator.connect(gainNode)
              gainNode.connect(audioContext.destination)
              
              oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
              gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
              
              oscillator.start(audioContext.currentTime)
              oscillator.stop(audioContext.currentTime + 0.6)
            }, index * 200)
          })
        } catch (e) {
          console.log('Audio context not available')
        }
      }, 500)
    }
    
    return true
  }

  // Check if the entire puzzle is completed
  function checkPuzzleCompletion() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = gridNav.getCellByIndex(cells, r, c, cols)
        if (!cell?.isBlack && grid[r][c] !== cell.value) {
          return false // Found an empty or incorrect cell
        }
      }
    }
    return true // All cells are correctly filled
  }

  function handleCellKeyDown(row, col, ev) {
    if (showStartModal || viewingSolution) { ev.preventDefault(); return }
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
        // If cell is immutable, move cursor forward instead
        const next = direction === "down" ? gridNav.findNextInCol(cells, row, col, rows, cols) : gridNav.findNextInRow(cells, row, col, cols)
        const nextAvailable = direction === "down" ? !gridNav.getCellByIndex(cells, row + 1, col, cols)?.isBlack : !gridNav.getCellByIndex(cells, row, col + 1, cols)?.isBlack

        if (next && nextAvailable) {
          setSelected({ row: next.row, col: next.col })
          if (direction === "down") updateColHighlight(next.row, next.col)
          else updateRowHighlight(next.row, next.col)
          setTimeout(() => {
            const el = document.querySelector(`.cell[data-row="${next.row}"][data-col="${next.col}"]`)
            if (el) el.focus()
          }, 0)
        }
        ev.preventDefault()
        return
      }

      setCells(prev => {
        const updated = [...prev]
        gridNav.getCellByIndex(updated, row, col, cols).value = ev.key.toUpperCase()
        return updated
      })
      ev.preventDefault()
      // move focus according to current direction
      
      const next = direction === "down" ? gridNav.findNextInCol(cells, row, col, rows, cols) : gridNav.findNextInRow(cells, row, col, cols)
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



  return (
    <main className="app">
      {!showStartModal && (
        <>
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
            <div className={`grid ${feedbackType ? `feedback-${feedbackType}` : ''}`} role="grid" aria-label="Crossword grid" ref={gridRef} aria-hidden={showStartModal} style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              '--cell-font-size': `${Math.min(500 / cols, 500 / rows) * 0.45}px`
            }}>
              <Grid cells={cells} selected={selected} highlight={highlight} clickHandler={handleCellClick} doubleClickHandler={handleCellDoubleClick} keyDownHandler={handleCellKeyDown}/>
            </div>

            <aside className="clues" aria-label="Across Clues">
              <AcrossClues crossword={crossword} cells={cells} activeClue={currentAcrossClue} isActive={direction === 'across'} onClueClick={handleClueClick} />
            </aside>

            <aside className="clues" aria-label="Down Clues">
              <DownClues crossword={crossword} cells={cells} activeClue={currentDownClue} isActive={direction === 'down'} onClueClick={handleClueClick} />
            </aside>
          </div>
        </>
      )}
      
      {winModalPlayer && <VictoryModal 
        victoryMessage={winModalPlayer === 'Tie' ? '🤝 It\'s a Tie! 🤝' : `🎉 ${winModalPlayer} Wins! 🎉`}
        victoryScores={`${player1Score} - ${player2Score}`}
        playAgainHandler={resetGame}
        viewSolutionHandler={viewSolution}
      />}
      
      {showConfetti && <Confetti />}
      
      {countdown !== null && countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown-number">
            {countdown}
          </div>
        </div>
      )}
      
      {showStartModal && <StartModal 
        startMessage={fileLoaded ? "Press start to begin the game." : "Load a .puz file to get started."}
        fileInputRef={fileInputRef}
        fileSelectHandler={handleFileSelect}
        fileLoaded={fileLoaded}
        startHandler={() => {
          try { localStorage.setItem('startSeen', '1') } catch (e) {}
          setShowStartModal(false)
          setCountdown(3) // Start 3-second countdown
        }}
        loadFileHandler={handleLoadFile}
      />}
      
      
    </main>
  )
}
