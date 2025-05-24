const GameBoard = (function Board () {
    const BOARD_SIZE = 20;
    const board = [];

    const initBoard = () => {
        for(let i = 0; i < BOARD_SIZE; i++) {
            const cell = new Cell(i);

            // Mark Rosettes at indices
            if ([4, 8, 14].includes(i)) {
                cell.isRosette = true;
            }

            board.push(cell);
        }
    }

})();

class Cell {
    #occupant = null; // Private field

    constructor(index) {
        this.index = index;
        this.isRosette = false;
    }

    addOcupant(playerToken) {
        this.#occupant = playerToken;
    }

    getValue() {
        return this.#occupant;
    }

    removeOccupant() {
        this.#occupant = null;
    }

    isOccupied() {
        return this.#occupant !== null;
    }
}