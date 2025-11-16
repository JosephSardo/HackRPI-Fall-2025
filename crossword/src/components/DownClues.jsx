import { useEffect, useRef } from 'react'

export default function DownClues({ crossword, cells, activeClue, isActive }) {
  const activeRefs = useRef({})

  useEffect(() => {
    if (isActive && activeClue && activeRefs.current[activeClue]) {
      activeRefs.current[activeClue].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeClue, isActive]) 

  if (!cells || cells.length === 0) return null

  const down = []

  // build down clues
  crossword.hints.down.forEach(hint => down.push(hint))
  
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

/*
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
*/