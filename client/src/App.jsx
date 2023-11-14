import { useState,useEffect } from 'react'
import abi from "./contractJson/TicTacToe.json"
import { ethers } from 'ethers'
import './App.css'
import JoinGame from './components/JoinGame'
import PlayGame from './components/PlayGame'
import NewGame from './components/NewGame'
import WinnerList from './components/WinnerList'


function App() {
  const [state,setState]=useState({
    provider:null,
    signer:null,
    contract:null
  })
  const [account,setAccount]=useState('Not connected');
  useEffect(()=>{
    const template=async()=>{
   
      const contractAddres="0x87B96f997B257379A505D7ae51312bDe978AE6dB";
      const contractABI=abi.abi;
      //Metamask part
      //1. In order do transactions on goerli testnet
      //2. Metmask consists of infura api which actually help in connectig to the blockhain
      try{

        const {ethereum}=window;
        const account = await ethereum.request({
          method:"eth_requestAccounts"
        })

        window.ethereum.on("accountsChanged",()=>{
         window.location.reload()
        })
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum);//read the Blockchain
        const signer =  provider.getSigner(); //write the blockchain
        
        const contract = new ethers.Contract(
          contractAddres,
          contractABI,
          signer
        )
        console.log(contract)
      setState({provider,signer,contract});
       
      }catch(error){
        console.log(error)
      }
    }
    template();
  },[])
  return (
    <div >
      <small>Connected Account - {account[0]}</small>
      <p>stake amount is 24 wei</p>
      <JoinGame state={state} acc={account}></JoinGame>
      <NewGame state={state}></NewGame>
      <PlayGame state={state} acc={account}></PlayGame>
      
    </div>
  )
}

export default App