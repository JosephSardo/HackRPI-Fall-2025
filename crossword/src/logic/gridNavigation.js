export const getCellKey = (row, col) => `${row}-${col}`

export const getCellIndex = (row, col, cols) => row * cols + col

export const getCellByIndex = (cells, row, col, cols) => cells[getCellIndex(row, col, cols)]

export function findNextOpenCellAcross(cells, row, col, rows, cols) {
    // same row
    for (let cc = col + 1; cc < cols; cc++) {
      const cell = getCellByIndex(cells, row, cc, cols)
      if (cell && !cell.isBlack) return { row: row, col: cc }
    }
    
    // following rows
    for (let rr = row + 1; rr < rows; rr++) {
      for (let cc = 0; cc < cols; cc++) {
        const cell = getCellByIndex(cells, rr, cc, cols)
        if (cell && !cell.isBlack) return { row: rr, col: cc }
      }
    }
    return null
}

export function findNextOpenCellDown(cells, row, col, rows, cols) {
    // below in same column
    for (let rr = row + 1; rr < rows; rr++) {
      const cell = getCellByIndex(cells, rr, col, cols)
      if (cell && !cell.isBlack) return { row: rr, col: col }
    }
    // if no open cells below, find the topmost open cell in the next columns to the right
    for (let cc = col + 1; cc < cols; cc++) {
      for (let rr = 0; rr < rows; rr++) {
        const cell = getCellByIndex(cells, rr, cc, cols)
        if (cell && !cell.isBlack) return { row: rr, col: cc }
      }
    }
    // fallback: next open cell in row-major order
    return findNextOpenCellAcross(row, col)
} 

export function findPrevOpenCell(cells, row, col, cols) {
    // left in same row
    for (let cc = col - 1; cc >= 0; cc--) {
      const cell = getCellByIndex(cells, row, cc, cols)
      if (cell && !cell.isBlack) return { row: row, col: cc, mutable: getCellByIndex(cells, row, cc, cols).mutable }
    }
    // previous rows: search from right to left for the first open cell
    for (let rr = row - 1; rr >= 0; rr--) {
      for (let cc = cols - 1; cc >= 0; cc--) {
        const cell = getCellByIndex(cells, rr, cc, cols)
        if (cell && !cell.isBlack) return { row: rr, col: cc, mutable: getCellByIndex(cells, rr, cc, cols).mutable }
      }
    }
    return null
}

export function findPrevOpenCellUp(cells, row, col, rows, cols) {
    // above in same column
    for (let rr = row - 1; rr >= 0; rr--) {
      const cell = getCellByIndex(cells, rr, col, cols)
      if (cell && !cell.isBlack) return { row: rr, col: col, mutable: getCellByIndex(cells, rr, col, cols).mutable }
    }
    // previous columns: search from right to left and bottom to top for the first open cell
    for (let cc = col - 1; cc >= 0; cc--) {
      for (let rr = rows - 1; rr >= 0; rr--) {
        const cell = getCellByIndex(cells, rr, cc, cols)
        if (cell && !cell.isBlack) return { row: rr, col: cc, mutable: getCellByIndex(cells, rr, cc, cols).mutable }
      }
    }
    return null
}

export function findNextInRow(cells, row, col, cols) {
    for (let cc = col + 1; cc < cols; cc++) {
      const cell = getCellByIndex(cells, row, cc, cols)
      if (cell && !cell.isBlack) return { row: row, col: cc }
    }
    return null
}

export function findPrevInRow(cells, row, col, cols) {
    for (let cc = col - 1; cc >= 0; cc--) {
      const cell = getCellByIndex(cells, row, cc, cols)
      if (cell && !cell.isBlack) return { row: row, col: cc }
    }
    return null
}

export function findNextInCol(cells, row, col, rows, cols) {
    for (let rr = row + 1; rr < rows; rr++) {
      const cell = getCellByIndex(cells, rr, col, cols)
      if (cell && !cell.isBlack) return { row: rr, col: col }
    }
    return null
}

export function findPrevInCol(cells, row, col, cols) {
    for (let rr = row - 1; rr >= 0; rr--) {
      const cell = getCellByIndex(cells, rr, col, cols)
      if (cell && !cell.isBlack) return { row: rr, col: col }
    }
    return null
}

/*
 const getCellKey = (row, col) => `${row}-${col}`
 const getCellIndex = (row, col) => row * cols + col
 const getCellByIndex = (row, col) => cells[getCellIndex(row, col)]

// Find the next open (non-black) cell to the right; if none in row, search subsequent rows
 function findNextOpenCell(r, c) {
    // same row
    for (let cc = c + 1; cc < SAMPLE_CROSSWORD['cols']; cc++) {
      const cell = cells[getCellIndex(r, cc)]
      if (cell && !cell.isBlack) return { row: r, col: cc }
    }
    // following rows
    for (let rr = r + 1; rr < SAMPLE_CROSSWORD['rows']; rr++) {
      for (let cc = 0; cc < SAMPLE_CROSSWORD['cols']; cc++) {
        const cell = cells[getCellIndex(rr, cc)]
        if (cell && !cell.isBlack) return { row: rr, col: cc }
      }
    }
    return null
  }

 function findNextOpenCellDown(r, c) {
    // below in same column
    for (let rr = r + 1; rr < SAMPLE_CROSSWORD['rows']; rr++) {
      const cell = cells[getCellIndex(rr, c)]
      if (cell && !cell.isBlack) return { row: rr, col: c }
    }
    // If no open cells below, find the topmost open cell in the next columns to the right
    for (let cc = c + 1; cc < SAMPLE_CROSSWORD['cols']; cc++) {
      for (let rr = 0; rr < SAMPLE_CROSSWORD['rows']; rr++) {
        const cell = cells[getCellIndex(rr, cc)]
        if (cell && !cell.isBlack) return { row: rr, col: cc }
      }
    }
    // fallback: next open cell in row-major order
    return findNextOpenCell(r, c)
  }

 function findPrevOpenCell(r, c) {
    // left in same row
    for (let cc = c - 1; cc >= 0; cc--) {
      const cell = cells[getCellIndex(r, cc)]
      if (cell && !cell.isBlack) return { row: r, col: cc, mutable: cells[getCellIndex(r, cc)].mutable }
    }
    // previous rows: search from right to left for the first open cell
    for (let rr = r - 1; rr >= 0; rr--) {
      for (let cc = SAMPLE_CROSSWORD['cols'] - 1; cc >= 0; cc--) {
        const cell = cells[getCellIndex(rr, cc)]
        if (cell && !cell.isBlack) return { row: rr, col: cc, mutable: cells[getCellIndex(rr, cc)].mutable }
      }
    }
    return null
  }

 function findPrevOpenCellUp(r, c) {
    // above in same column
    for (let rr = r - 1; rr >= 0; rr--) {
      const cell = cells[getCellIndex(rr, c)]
      if (cell && !cell.isBlack) return { row: rr, col: c, mutable: cells[getCellIndex(rr, c)].mutable }
    }
    // previous columns: search from right to left and bottom to top for the first open cell
    for (let cc = c - 1; cc >= 0; cc--) {
      for (let rr = SAMPLE_CROSSWORD['rows'] - 1; rr >= 0; rr--) {
        const cell = cells[getCellIndex(rr, cc)]
        if (cell && !cell.isBlack) return { row: rr, col: cc, mutable: cells[getCellIndex(rr, cc)].mut }
      }
    }
    return null
  }

  // Arrow helpers (strictly within the same row/column)
 function findNextInRow(r, c) {
    for (let cc = c + 1; cc < SAMPLE_CROSSWORD['cols']; cc++) {
      const cell = cells[getCellIndex(r, cc)]
      if (cell && !cell.isBlack) return { row: r, col: cc }
    }
    return null
  }

 function findPrevInRow(r, c) {
    for (let cc = c - 1; cc >= 0; cc--) {
      const cell = cells[getCellIndex(r, cc)]
      if (cell && !cell.isBlack) return { row: r, col: cc }
    }
    return null
  }

 function findNextInCol(r, c) {
    for (let rr = r + 1; rr < SAMPLE_CROSSWORD['rows']; rr++) {
      const cell = cells[getCellIndex(rr, c)]
      if (cell && !cell.isBlack) return { row: rr, col: c }
    }
    return null
  }

 function findPrevInCol(r, c) {
    for (let rr = r - 1; rr >= 0; rr--) {
      const cell = cells[getCellIndex(rr, c)]
      if (cell && !cell.isBlack) return { row: rr, col: c }
    }
    return null
  }
*/