class Cell {
    #occupant = null; // Private field

    constructor(index) {
        this.index = index;
        this.isRosette = false;
    }

    addOccupant(playerToken) {
        this.#occupant = playerToken;
    }

    getOccupant() {
        return this.#occupant;        
    }

    removeOccupant() {
        this.#occupant = null;
    }

    isOccupied() {
        return this.#occupant !== null;
    }
}

class Token {
    constructor(player, tokenId){
        // Private variables, do not handle these directly
        this._player = player;
        this._id = tokenId;
        this._isOnBoard = false;
        this._hasExited = false;
        this._occupiedCell = null;
    }

    get occupiedCell() {
        return this._occupiedCell;
    }

    set occupiedCell(cell) { // Use this to validate occupiedCell (ex. token.occupiedCell = cell;)
        if(cell) {
            this._occupiedCell = cell;
        } else {
            return;
        }
    }

    get tokenId() {
        return this._id;
    }

    get isOnBoard() {
        return this._isOnBoard;
    }

    get tokenPlayer() {
        return this._player;
    }

    // Use these helper functions to update Token data

    exit() { 
        this._hasExited = true;
    }

    reset() {
        this._isOnBoard = false;
        this._occupiedCell = null;
        this._hasExited = false;
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



// PlayerAPath = [5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 19, 18]
// PlayerBPath = [1, 2, 3, 4, 0, 9, 10, 11, 12, 13, 14, 15, 17, 16]