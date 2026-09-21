import * as gridNav from '../logic/gridNavigation.js'

export default function Grid({ cells, selected, highlight, clickHandler, doubleClickHandler, keyDownHandler }) {
    return <>
        {cells.map(cell => {
            const key = gridNav.getCellKey(cell.row, cell.col)
            const isSelected = selected?.row === cell.row && selected?.col === cell.col
            const isHighlighted = highlight.includes(key)
            const isImmutable = !cell.mutable
            return (
                <div
                key={key}
                data-row={cell.row}
                data-col={cell.col}
                className={`cell ${cell.isBlack ? 'black' : ''} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'row-highlight' : ''} ${isImmutable ? 'mutable' : ''}`}
                role={cell.isBlack ? 'presentation' : 'gridcell'}
                tabIndex={cell.isBlack ? -1 : 0}
                onClick={() => clickHandler(cell.row, cell.col)}
                onDoubleClick={() => doubleClickHandler(cell.row, cell.col)}
                onKeyDown={(ev) => keyDownHandler(cell.row, cell.col, ev)}
                >
                {cell.number ? <span className="num">{cell.number}</span> : null}
                {cell.value}
                </div>
            ) 
        })}
    </>
}