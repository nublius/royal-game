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
  #player;
  #id;
  #isOnBoard = false;
  #hasExited = false;
  #occupiedCell = null;

  constructor(player, tokenId) {
    this.#player = player;
    this.#id = tokenId;
  }

  get occupiedCell() {
    return this.#occupiedCell;
  }

  set occupiedCell(cell) {
    if (cell) {
      this.#occupiedCell = cell;
    }
    // else do nothing
  }

  get tokenId() {
    return this.#id;
  }

  get isOnBoard() {
    return this.#isOnBoard;
  }

  set isOnBoard(value) {
    this.#isOnBoard = value;
  }

  get tokenPlayer() {
    return this.#player;
  }

  get hasExited() {
    return this.#hasExited;
  }

  exit() {
    this.#hasExited = true;
  }

  reset() {
    this.#isOnBoard = false;
    this.#occupiedCell = null;
    this.#hasExited = false;
  }
}

class Player {
    constructor(name) {
        this.name = name;
        this.tokenArray = [];
    }

    initTokens(value) {
        this.tokenArray = [];
        for(let i = 0; i < 7; i++) {
            const id = `${value}${i + 1}`;
            const newToken = new Token(this.name, id);
            this.tokenArray.push(newToken);
        }
    }

    resetTokens() {
        for(let i = 0; i < this.tokenArray.length; i++) {
            this.tokenArray[i].reset();
        }
    }

    getAvailableTokens() {
        return this.tokenArray.filter(token => token.isOnBoard && !token.hasExited);
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

    const resetBoard = () => {
        board.length = 0;
        initBoard();
    }

    initBoard();

    return {
        getBoard: () => board,
        getCell: (index) => board[index],
        resetBoard
    };

})();



// PlayerAPath = [5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 19, 18]
// PlayerBPath = [1, 2, 3, 4, 0, 9, 10, 11, 12, 13, 14, 15, 17, 16]

const playerA = new Player("Alice");
playerA.initTokens("A");

// Mark token as on board and not exited
playerA.tokenArray[0].isOnBoard = true;

console.log(playerA.getAvailableTokens().length === 1);

playerA.tokenArray[0].exit();

console.log(playerA.getAvailableTokens().length === 0);

playerA.resetTokens();

console.log(playerA.tokenArray.every(t => !t.isOnBoard && !t.hasExited)); // true


