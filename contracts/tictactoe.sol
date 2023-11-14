// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract TicTacToe {
    address public player1;
    address public player2;
    address public currentPlayer;
    address public winner;
    uint8 public turn;
    uint8 public stake;
    
    uint8[3][3] public board;

    event MoveMade(address indexed player, uint8 row, uint8 col);
    event GameOver(address indexed winner, uint amountWon);
    event NewGameStarted();

    modifier onlyPlayers() {
        require(msg.sender == player1 || msg.sender == player2, "Only players can interact.");
        _;
    }

    modifier notOver() {
        require(winner == address(0), "The game is already over.");
        _;
    }

    constructor(uint8 _stake) {
        require(_stake > 0, "Stake must be greater than 0");
        stake = _stake;
    }

    function joinGame() public payable {
        require(player2 == address(0), "The game is full.");
        require(msg.sender != player1, "You cannot play against yourself.");
        require(msg.value == stake, "Incorrect stake amount");

        if (player1 == address(0)) {
            player1 = msg.sender; 
            currentPlayer = player1; 
        } else {
            player2 = msg.sender; 
        }
    }

    function makeMove(uint8 row, uint8 col) public onlyPlayers notOver {
        require(board[row][col] == 0, "Invalid move.");
        require(msg.sender == currentPlayer, "It's not your turn.");

        if (msg.sender == player1) {
            board[row][col] = 1;
        } else {
            board[row][col] = 2;
        }

        emit MoveMade(msg.sender, row, col);
        checkWinner(row, col);
        turn++;

        currentPlayer = (currentPlayer == player1) ? player2 : player1;
    }

    function checkWinner(uint8 row, uint8 col) internal {
        uint8 player = board[row][col];

        if (checkRow(row, player) || checkColumn(col, player) || (row == col && checkDiagonal(1, player)) || (row + col == 2 && checkDiagonal(-1, player)) || turn == 9) {
            winner = (turn == 9) ? address(1) : msg.sender;
            if (winner != address(0)) {
                // Transfer the stake to the winner
                (bool success, ) = payable(winner).call{value: address(this).balance}("");
                require(success, "Transfer failed.");
                emit GameOver(winner, stake);
            }
        }
    }

    function checkRow(uint8 row, uint8 player) internal view returns (bool) {
        return board[row][0] == player && board[row][1] == player && board[row][2] == player;
    }

    function checkColumn(uint8 col, uint8 player) internal view returns (bool) {
        return board[0][col] == player && board[1][col] == player && board[2][col] == player;
    }

    function checkDiagonal(int8 direction, uint8 player) internal view returns (bool) {
        if (direction == 1) {
            return board[0][0] == player && board[1][1] == player && board[2][2] == player;
        } else {
            return board[0][2] == player && board[1][1] == player && board[2][0] == player;
        }
    }

    function getBoard() public view returns (uint8[3][3] memory) {
        return board;
    }

    function startNewGame() public payable{
        winner = address(0);
        turn = 0;
        player1=address(0);
        player2=address(0);
        currentPlayer=address(0);

        // Clear the board
        for (uint8 i = 0; i < 3; i++) {
            for (uint8 j = 0; j < 3; j++) {
                board[i][j] = 0;
            }
        }

        joinGame();

        emit NewGameStarted();
    }
}
