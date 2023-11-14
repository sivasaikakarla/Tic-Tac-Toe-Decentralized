import React from "react";

function NewGame(props){
    const state=props.state

    const newGame = async (event) => {
        event.preventDefault();
        const {contract}=state;

        const stake=await contract.stake();

        const amounts = document.querySelector("#amountt").value;
        
        // console.log(amounts)
        // console.log("X")
        // console.log(stake)

        if(stake==amounts){
            const st=await contract.startNewGame({value:amounts});
            await st.wait();
            alert("New Game Started")
        }else{
            alert("Incorrect Stake Amount")
        }
    }
    return(
        <div>
         <form onSubmit={newGame}>
            <div className="inputbox">
                <input id="amountt"></input>
                <input type="submit" value="StartNewGame"  disabled={!state.contract}/>
            </div>
         </form>
        </div>
    )
}

export default NewGame;