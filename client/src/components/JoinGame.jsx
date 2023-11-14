import React from "react";
import {ethers} from 'ethers'

function JoinGame(props){

    const state=props.state
    const acc=props.acc

    const joinGame = async (event) => {
        event.preventDefault();
        const { contract } = state;
        // const { account } = acc;
      
        const player1Address = await contract.player1(); // Retrieve player1's address from the contract
        const player2Address = await contract.player2(); // Retrieve player2's address from the contract
        const stake=await contract.stake();
        const amounts = document.querySelector("#amount").value;
        // console.log(amounts)
        // const stakeInWei = ethers.utils.parseUnits(amounts, 'wei');
        if(stake==amounts){
          if (player1Address.toLowerCase() === acc[0] && player2Address==='0x0000000000000000000000000000000000000000') {
            alert("You cannot play against yourself.");
          } else if (player2Address !== '0x0000000000000000000000000000000000000000') {
            alert('The game is already full.');
          } else {
            const tx = await contract.joinGame({value:amounts});
            await tx.wait();
            alert('You have successfully joined the game.');
          }
        }else{
          alert("Incorrect Stake Amount")
        }
      }

    return(
        <div>
         <form onSubmit={joinGame}>
            <div className="inputbox">
                <input id="amount"></input>
                <input type="submit" value="JoinGame"  disabled={!state.contract}/>
            </div>
         </form>
        </div>
    )
}

export default JoinGame;