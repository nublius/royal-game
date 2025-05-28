class Cell {
    #occupant = null; // Private field

    constructor(index) {
        this.index = index;
        this.isRosette = false;
    }

    addOccupant(playerToken) {
        if(playerToken instanceof Token) {
            this.#occupant = playerToken;
        } else {
            console.warn("addOccupant: argument is not a token instance");
        }
    }

    getOccupant() {
        return this.#occupant;        
    }

    removeOccupant() {
        this.#occupant = null;
    }

    get isOccupied() {
        return this.#occupant !== null;
    }
}

class Token {
    #player; // Private field
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
        } else {
            console.warn("set occupiedCell: argument is not a cell instance");
        }
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
    #name; // Private field
    #tokenArray = [];
    #diceRoll = 0;

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    set diceRoll(score) {
        this.#diceRoll = score;
    }

    get diceRoll() {
        return this.#diceRoll;
    }

    initTokens(value) {
        this.#tokenArray = [];
        for (let i = 0; i < 7; i++) {
        const id = `${value}${i + 1}`;
        const newToken = new Token(this.#name, id);
        this.#tokenArray.push(newToken);
        }
    }

    resetTokens() {
        for (let i = 0; i < this.#tokenArray.length; i++) {
        this.#tokenArray[i].reset();
        }
    }

    getAvailableTokens() {
        return this.#tokenArray.filter(token => !token.hasExited);
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

    return {
        getBoard: () => board,
        getCell: (index) => board[index],
        resetBoard,
        initBoard
    };

})();

const Dice = (function Die(){
    let die = [0, 0, 0, 0];

    const roll = () => {
        return die.reduce((sum) => {
            return sum + Math.round(Math.random());
        }, 0);
    };

    return { roll };
})();

const GameController = (function Controller (playerOneName = "Player One", playerTwoName = "Player Two") {
    GameBoard.resetBoard();

    let gameOver = false;
    let winner = null;
    let activePlayer;
    const board = GameBoard.getBoard();

    const players = [
        new Player(playerOneName),
        new Player(playerTwoName)
    ];  

    players[0].path = [1, 2, 3, 4, 0, 9, 10, 11, 12, 13, 14, 15, 17, 16];
    players[1].path = [5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 19, 18];

    const chooseFirstActivePlayer = () => {
        let playerOneRoll, playerTwoRoll;

        do {
            playerOneRoll = Dice.roll();
            playerTwoRoll = Dice.roll();
        } while (playerOneRoll === playerTwoRoll);

        activePlayer = playerOneRoll > playerTwoRoll ? players[0] : players[1];
   }

    const switchPlayerTurn = () => {
        if(activePlayer) {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
        } else {
            console.warn("Warning, chooseFirstActivePlayer not initialized.");
        }
    }

    const startGame = () => {
        players[0].initTokens('A');
        players[1].initTokens('B');

        chooseFirstActivePlayer();
        console.log(`Starting game with ${activePlayer.name}`);
    }

    const getSymbol = (index) => {
        if(board[index].isOccupied) {
            if(board[index].getOccupant().tokenPlayer === "Player One") {
                return "O";
            } else if(board[index].getOccupant().tokenPlayer === "Player Two") {
                return "X";
            }
        } else if(!board[index].isOccupied) {
            return " ";
        }
    }

    const printBoard = () => {
        console.log(`                       
                     _________
                     |${getSymbol(4)}||${getSymbol(0)}||${getSymbol(8)}|
                     _________
                     |${getSymbol(3)}||${getSymbol(9)}||${getSymbol(7)}|
                     _________
                     |${getSymbol(2)}||${getSymbol(10)}||${getSymbol(6)}|
                     _________
                     |${getSymbol(1)}||${getSymbol(11)}||${getSymbol(5)}|
                        ___
                        |${getSymbol(12)}|
                        ___
                        |${getSymbol(13)}|
                     _________
                     |${getSymbol(17)}||${getSymbol(14)}||${getSymbol(19)}|
                     _________
                     |${getSymbol(16)}||${getSymbol(15)}||${getSymbol(18)}|
        `)
    }

    const getActivePlayer = () => activePlayer;

    const playerRoll = () => {
        if(activePlayer) {
            activePlayer.diceRoll = 0;
            const currentRoll = Dice.roll()
            activePlayer.diceRoll = currentRoll;
            console.log(`${activePlayer.name} rolled a ${currentRoll}`);
        } else {
            console.warn("activePlayer not set!");
        }
    }

    const moveToken = (tokenId) => {
        if(activePlayer.diceRoll === 0) {
            console.warn("Player roll not set yet! Do: GameController.playerRoll();");
            return;
        }

    }

    return {
        getActivePlayer,
        startGame,
        printBoard,
        playerRoll,
    }
})();

// PlayerAPath = [5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 19, 18]
// PlayerBPath = [1, 2, 3, 4, 0, 9, 10, 11, 12, 13, 14, 15, 17, 16]