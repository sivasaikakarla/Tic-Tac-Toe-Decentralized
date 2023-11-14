import React from "react";
import {ethers} from 'ethers'

function WinnerList(props){

    const state=props.state
    const acc=props.acc
    const { contract } = state;

    const [winnerlist, setWinnerlist] = useState([]);

    useEffect(() => {
        async function fetchData() {
          const winners = await contract.winners();
          setWinnerlist(winners);
        }
        fetchData();
      }, [contract]);
    return(
        <div>
            {winnerlist}
        </div>
    )
}

export default WinnerList;