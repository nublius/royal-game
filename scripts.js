class Cell {
    #occupant = null; // Private field

    constructor(index) {
        this.index = index;
        this.isRosette = false;
        this.isExit = false;
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
        const occupant = this.#occupant;
        this.#occupant = null;

        if (occupant) {
            occupant.occupiedCell = null;
        }
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
        if (cell !== null && !(cell instanceof Cell)) {
            console.warn("set occupiedCell: argument is not a cell instance");
            return;
        }
        this.#occupiedCell = cell;
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
        this.#isOnBoard = false;
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
    const BOARD_SIZE = 22;
    const board = [];

    const initBoard = () => {
        for(let i = 0; i < BOARD_SIZE; i++) {
            const cell = new Cell(i);

            // Mark Rosettes at indices
            if ([4, 8, 11, 17, 19].includes(i)) {
                cell.isRosette = true;
            }
            if ([20, 21].includes(i)) {
                cell.isExit = true;
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

    let winner = null;
    let activePlayer;
    const board = GameBoard.getBoard();

    const players = [
        new Player(playerOneName),
        new Player(playerTwoName)
    ];  

    players[0].path = [1, 2, 3, 4, 0, 9, 10, 11, 12, 13, 14, 15, 16, 17, 20];
    players[1].path = [5, 6, 7, 8, 0, 9, 10, 11, 12, 13, 14, 15, 18, 19, 21];

    const chooseFirstActivePlayer = () => {
        let playerOneRoll, playerTwoRoll;

        do {
            playerOneRoll = Dice.roll();
            playerTwoRoll = Dice.roll();
        } while (playerOneRoll === playerTwoRoll);

        activePlayer = playerOneRoll > playerTwoRoll ? players[0] : players[1];
    };

    const switchPlayerTurn = () => {
        if(activePlayer) {
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
            activePlayer.diceRoll = 0;
        } else {
            console.warn("Warning, chooseFirstActivePlayer not initialized.");
        }
    };

    const startGame = () => {
        winner = null;

        players[0].initTokens('A');
        players[1].initTokens('B');

        chooseFirstActivePlayer();
        console.log(`Starting game with ${activePlayer.name}`);
    };

    const getSymbol = (index) => {
        if(board[index].isOccupied) {
            return board[index].getOccupant().tokenId;
        } else if(!board[index].isOccupied) {
            return "  ";
        }
    };

    const printBoard = () => {
        console.log(`                       
                    ______________
                     |${getSymbol(4)}||${getSymbol(0)}||${getSymbol(8)}|
                    ______________
                     |${getSymbol(3)}||${getSymbol(9)}||${getSymbol(7)}|
                    ______________
                     |${getSymbol(2)}||${getSymbol(10)}||${getSymbol(6)}|
                    ______________
                     |${getSymbol(1)}||${getSymbol(11)}||${getSymbol(5)}|
                         ____
                         |${getSymbol(12)}|
                         ____
                         |${getSymbol(13)}|
                    ______________
                     |${getSymbol(17)}||${getSymbol(14)}||${getSymbol(19)}|
                    ______________
                     |${getSymbol(16)}||${getSymbol(15)}||${getSymbol(18)}|
        `)
    };

    const getActivePlayer = () => activePlayer;

    const playerRoll = () => {
        if(activePlayer && activePlayer.diceRoll === 0) {
            const currentRoll = Dice.roll()
            activePlayer.diceRoll = currentRoll;
            console.log(`${activePlayer.name} rolled a ${currentRoll}`);
            if(currentRoll === 0) {
                console.log("Next player's turn");
                switchPlayerTurn();
            }
        } else {
            console.warn("activePlayer not set, or rolled more than once");
        }
    };

    const checkWin = () => {
        const playerOneTokens = players[0].getAvailableTokens();
        const playerTwoTokens = players[1].getAvailableTokens();

        if(playerOneTokens.length === 0) {
            winner = players[0]
        } else if(playerTwoTokens.length === 0) {
            winner = players[1];
        } else {
            return;
        }

        console.log(`${winner.name}} has cleared all of their tokens! ${winner.name} wins!`);
        GameBoard.resetBoard();
        activePlayer = null;
    }

    const moveToken = (tokenId) => {
        let steps = activePlayer.diceRoll;
        const targetToken = activePlayer.getAvailableTokens().find(t => t.tokenId === tokenId);
        let currentIndex = null;
        let currentCell = null;

        if(steps === 0) {
            console.warn("Not rolled yet! Roll by: GameController.playerRoll();");
            return;
        }

        if(targetToken.isOnBoard) { // If cell is on board
            currentIndex = activePlayer.path.indexOf(targetToken.occupiedCell.index);
            currentCell = targetToken.occupiedCell;
        } else {
            currentIndex = -1;
        }

        const targetIndex = currentIndex + steps;
        const targetCellIndex = activePlayer.path[targetIndex];
        const targetCell = GameBoard.getCell(targetCellIndex);

        if (targetCellIndex === undefined) {
            console.warn("Invalid move: Exceeds player's path.");
            return;
        }

        if (targetCellIndex > GameBoard.getBoard().length - 1) {
            console.log("Exceeds board bounds. Try a different token.") 
                return;
        }

        if(targetCell.isOccupied && targetCell.getOccupant().tokenPlayer === activePlayer.name) {
            console.log("Cell is already taken by active player.");
            return;
        }

        if(targetCell.isRosette && targetCell.isOccupied) {
            console.log("Cannot put token on occupied rosette.");
            return;
        }

        if(targetCell.isOccupied) {
            targetCell.getOccupant().reset();
            targetCell.removeOccupant();
        }

        if(currentCell !== null) {
            currentCell.removeOccupant();
        }

        targetToken.isOnBoard = true;
        targetToken.occupiedCell = targetCell;
        targetCell.addOccupant(targetToken);

        printBoard();

        if(targetCell.isRosette) {
            console.log("Landed on a rosette. Roll again!");
            activePlayer.diceRoll = 0;
        } else if(targetCell.isExit) {
            console.log(`${activePlayer.name}'s ${targetToken.tokenId} token has exited the board.`);
            switchPlayerTurn();
            console.log(`${activePlayer.name}'s turn!`);
            activePlayer.diceRoll = 0;
            targetToken.exit();
            targetCell.removeOccupant();
        } else {
            switchPlayerTurn();
            console.log(`${activePlayer.name}'s turn!`);
            activePlayer.diceRoll = 0;
        }

        checkWin();
    }

    return {
        getActivePlayer,
        startGame,
        printBoard,
        playerRoll,
        moveToken,
    }
})();

const DisplayController = (function Controller () {

    const initDipslay = () => {
        
    }

})();

