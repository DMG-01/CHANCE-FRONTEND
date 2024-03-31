import {ethers} from "./ethers-5.6.esm.min.js"
//import { contractAddress, ABI } from "./constant"
import { contractAddress,ABI } from "./constant.js"
alert("button connected")

let connect_button = document.getElementById("connect_button")
connect_button.onclick = connect
let balanceDisplay = document.getElementById("balance_button")
let checkOwner = document.getElementById("check")
checkOwner.onclick = check
let ownerDisplay = document.getElementById("owner_display")



const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer =  provider.getSigner()
          const contract = new ethers.Contract(contractAddress,ABI,signer);

async function connect()  {
   // alert("button connected")
    if(window.ethereum !== "undefined"){
        try{
          await  window.ethereum.request( {method : "eth_requestAccounts" });
          connect_button.innerHTML = "CONNECTED!"
          const balance = await contract.returnUserEtherBalance();
          console.log(ethers.utils.formatEther(balance))
          balanceDisplay.innerHTML = "BALANCE:" + parseFloat(ethers.utils.formatEther(balance)).toFixed(2) + "Ether";   
        }catch(error){
            console.log("error")

        }
    }
}

async function check() {
    if(window.ethereum !== "undefined") {
        try{
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const address = accounts[0]
      let isOwner = await contract.callStatic.checkIsOwner(address);
      console.log(isOwner);
      const isOwnerResult = isOwner ? "true": "false"
      ownerDisplay.innerHTML = `OWNER: ${isOwnerResult}`

        }catch(error){
            console.log(error)
        }
    }
}