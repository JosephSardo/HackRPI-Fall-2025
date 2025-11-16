export default class Crossword {
    constructor(grid, acrossHints, downHints) {
        this.grid = grid
        this.hints = {
            across: acrossHints,
            down: downHints
        }
        this.rows = grid.length
        this.cols = grid[0].length
    }  
    
    static fromJSON(json) {
        const { grid, hints } = json
        return new Crossword(
            grid,
            hints.across || [],
            hints.down || []
        )
    }
}