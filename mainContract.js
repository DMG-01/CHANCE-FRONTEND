//alert("js connected")
import {ethers} from "./ethers-5.6.esm.min.js"
import {mainContractAddress,mainContractABI,numberOfGoalscontractAddress, numberOfGoalABI} from "./constant.js"

let connectEl = document.getElementById("connect_Button")
connectEl.onclick = connect
let balanceEl = document.getElementById("balance_el")


const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const mainContract = new ethers.Contract(mainContractAddress,mainContractABI,signer)
const numberOfGoalsContract = new ethers.Contract(numberOfGoalscontractAddress,numberOfGoalABI,signer)

async function connect() {
if(window.ethereum !== "undefined") {
    try{
    await window.ethereum.request({method : "eth_requestAccounts"})
    connectEl.innerHTML = "CONNECTED!"
    const balance = await numberOfGoalsContract.returnUserEtherBalance();
      console.log(ethers.utils.formatEther(balance));
      const userBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(2)
    balanceEl.innerHTML = `BALANCE: ${userBalance} ether`

    }catch(error) {
        console.log(error)
    }
}
}