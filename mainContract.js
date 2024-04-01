//alert("js connected")
import {ethers} from "./ethers-5.6.esm.min.js"
import {mainContractAddress,mainContractABI,numberOfGoalscontractAddress, numberOfGoalABI} from "./constant.js"

let connectEl = document.getElementById("connect_Button")
connectEl.onclick = connect
let balanceEl = document.getElementById("balance_el")
let returnFirstOwnerEl = document.getElementById("firstOwner")
returnFirstOwnerEl.onclick = returnFirstOwner;
let returnAllOwnersEl = document.getElementById("allOwners")
returnAllOwnersEl.onclick = returnAllOwners
let contractNameEl = document.getElementById("contractName")
let createCWOLEl = document.getElementById("create_contract")
createCWOLEl.onclick = createCWOL
let returntotalCWOLCreatedEl = document.getElementById("return_CWOL_totalNUMBER")
returntotalCWOLCreatedEl.onclick = returnTotalCWOLCreated
let retrunNOGCreatedEl = document.getElementById("return_NOG_totalNumber")
retrunNOGCreatedEl.onclick = retrunTotalNOGCreated
let returnCWOLEl = document.getElementById("return_CWOL")
returnCWOLEl.onclick = returnCWOL


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

async function returnFirstOwner() {
    if(window.ethereum !== "undefined"){
        try{
        const firstOwner =await mainContract.returnFirstOwner()
        console.log(firstOwner)
        }catch(error){
            console.log(error)
        }
    }
}

async function returnAllOwners() {
    if(window.ethereum !== "undefined") {
        try{
            const allOwners = await mainContract.returnOnlyOwner()
            console.log(allOwners)
        }catch(error){
            console.log(error)
        }
    }
}
async function createCWOL() {
    if (window.ethereum !== "undefined") {
        try {
            let string1;
            let string2;
            string1 = await mainContract.create_CWOL_contract(contractNameEl.value);
            console.log("contractName " + string1);
            string2 = await mainContract.returnCWOL_name(contractNameEl.value);
            console.log("contractAddress: "+ string2);
        } catch (error) {
            console.log(error);
        }
    }
}

let totalNumberOfCWOL = await  mainContract.returnLengthOfCWOL();
async function returnTotalCWOLCreated() {
    if(window.ethereum !== "undefined") {
        try{
     
      console.log(totalNumber.toNumber())
        }catch(error){
            console.log(error)
        }
    }
}
async function retrunTotalNOGCreated() {
   if(window.ethereum !== "undefined"){
    try{
        let totalNumber = await mainContract.returnNOGLength();
        console.log(totalNumber.toNumber())
    }catch(error){
        console.log(error)
    }
   }
}
async function returnCWOL() {
    if (window.ethereum !== "undefined") {
        try {
            let allCWOL = [];
            for (let i = 0; i < totalNumberOfCWOL; i++) { // Corrected loop condition
                allCWOL.push(await mainContract._courseWinOrLoseArray(i));
            }
            console.log(allCWOL);
        } catch(error) {
            console.log(error);
        }
    }
}

