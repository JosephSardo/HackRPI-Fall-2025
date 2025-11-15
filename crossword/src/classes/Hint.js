export default class Hint {
    constructor(clue, number, row, col) {
        this.clue = clue
        this.number = number
        this.row = row
        this.col = col 
    }

    static fromList(hintList) {
        return hintList.map(hint => new Hint(...hint))
    }
} 