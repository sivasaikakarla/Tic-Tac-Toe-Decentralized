import React from 'react';
import { useState,useEffect } from 'react';

function PlayGame(props) {
    const state = props.state
    const acc = props.acc
    const { contract } = state;


    const [gridData, setGridData] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ]);
      
      const [currentTurn, setCurrentTurn] = useState(0);
      const [currentPlayer, setcurrentPlayer] = useState('');
      const [winner,setWinner]=useState('')
      const [player1Address, setPlayer1Address] = useState('');
      const [player2Address, setPlayer2Address] = useState('');
      const [board, setBoard] = useState([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);
      const [loading, setLoading] = useState(true);
      function convertBoardToGrid(board) {
        return board.map((row) =>
          row.map((cell) => {
            if (cell === 1) return "X";
            else if (cell === 2) return "O";
            else return "";
          })
        );
      }
      
      // const [gridData, setGridData] = useState(convertBoardToGrid(board));
      useEffect(() => {
        async function fetchData() {
          const currentTurnValue = await contract.turn();
          setCurrentTurn(currentTurnValue);

          // const CurrentPlayer=await contract.CurrentPlayer();
          // setcurrentPlayer(CurrentPlayer)
    
          const player1 = await contract.player1();
          setPlayer1Address(player1);
    
          const player2 = await contract.player2();
          setPlayer2Address(player2);

          const Board=await contract.getBoard();
          setBoard(Board)
          //console.log(board)

          setGridData(convertBoardToGrid(Board))
          // console.log(gridData)

          const Winner=await contract.winner()
          setWinner(Winner)

          setLoading(false);
          
          // contract.events.GameOver()
          // .on('data', (event) => {
          //   const winner = event.returnValues.winner;
          //   const amountWon = event.returnValues.amountWon;
          //   console.log(`Game Over! Winner: ${winner}, Amount Won: ${amountWon}`);
          //   // Update your UI or state as needed
          // })
          // .on('error', (error) => {
          //   console.error('Error:', error);
          // });
          
        }
        fetchData();
      }, [contract]);


    //   useEffect(() => {
    //     console.log('acc[0]: ',acc[0]);
    //      // Log the value when acc[0] changes
    //     console.log('player1Address: ', player1Address.toLowerCase());
    //   }, [acc[0]]);
    //  console.log(currentTurn === ((player2Address && acc[0] && player2Address.toLowerCase() === acc[0])? 0 : 1))
    // console.log(currentTurn%2)
    // console.log(acc[0],player2Address)
     // console.log(gridData)

     const handleBoxClick = async (row, col) => {
        // const newGridData = [...gridData];
        if((currentTurn %2)==0){
            // newGridData[row][col] = `X`;
            const tx = await contract.makeMove(row,col);
            
            await tx.wait();
            
            alert('You have completed Your turn.');
        }else if((currentTurn %2)==1){
            // newGridData[row][col] = `O`;
            const tx = await contract.makeMove(row,col);
            
            await tx.wait();
            alert('You have completed Your turn.');

        }
        // setGridData(newGridData);
      };


      return (
        <div>
      {loading ? (
        <p>Loading player data...</p>
      ) : (
        <div>
        <h1>
          {winner !=="0x0000000000000000000000000000000000000000"
            ? winner.toLocaleLowerCase() === acc[0]
              ? "You won the Game"
              : "You lost the Game"
            : ((currentTurn % 2) ===
              (player1Address && acc[0] && player1Address.toLowerCase() === acc[0]
                ? 0
                : 1)
            ? "Your Turn"
            : (currentTurn % 2) ===
              (player2Address && acc[0] && player2Address.toLowerCase() === acc[0]
                ? 0
                : 1)
            ? "Opponent's Turn"
            : "Unknown Turn")}
        </h1>

          <h2>Click a box to make your move</h2>
          <div className="grid">
            {gridData.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((value, colIndex) => (
                  <div
                    key={colIndex}
                    className="box"
                    onClick={() => handleBoxClick(rowIndex, colIndex)}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
      );
}

export default PlayGame;

// .then(receipt => {
//   console.log("Transaction receipt:", receipt);

//   // Check if the transaction was successful
//   if(winner !=="0x0000000000000000000000000000000000000000"){
//     if (receipt.status === true) {
//         console.log("Transfer to winner was successful.");
//     } else {
//         console.error("Transfer to winner failed.");
//     }
//   }
// })
// .catch(error => {
//   console.error("Transaction error:", error);
// });