class Cell {
    #occupant = null; // Private field

    constructor(index) {
        this.index = index;
        this.isRosette = false;
    }

    addOccupant(playerToken) {
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

const GameBoard = (function Board () {
    const BOARD_SIZE = 20;
    const board = [];

    const initBoard = () => {
        for(let i = 0; i < BOARD_SIZE; i++) {
            const cell = new Cell(i);

            // Mark Rosettes at indices
            if ([4, 8, 11, 17, 19].includes(i)) {
                cell.isRosette = true;
            }

            board.push(cell);
        }
    };

    initBoard();

    return {
        getBoard: () => board,
        getCell: (index) => board[index],
        resetBoard: () => {
            board.length = 0;
            initBoard();
        }
    };

})();

// PlayerAPath = [8, 7, 6, 5, 0, 9, 10, 11, 12, 13, 14, 15, 19, 18]
// PlayerBPath = [4, 3, 2, 1, 0, 9, 10, 11, 12, 13, 14, 15, 17, 16]
