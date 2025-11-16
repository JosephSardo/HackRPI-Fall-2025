import { useEffect, useRef } from 'react'

export default function AcrossClues({ crossword, cells, activeClue, isActive }) {
  const activeRefs = useRef({})

  useEffect(() => {
    if (isActive && activeClue && activeRefs.current[activeClue]) {
      activeRefs.current[activeClue].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeClue, isActive])

  if (!cells || cells.length === 0) return null

  const across = []

  // build across clues
  crossword.hints.across.forEach(hint => across.push(hint))

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

/*
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
*/