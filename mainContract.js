//alert("js connected")
import {ethers} from "./ethers-5.6.esm.min.js"
import {mainContractAddress,mainContractABI,numberOfGoalscontractAddress, numberOfGoalABI, courseWinOrLoseABI} from "./constant.js"

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
let allCWOL = [];


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
            if (error.code === -32603 && error.data.originalError.message === 'execution reverted') {
                console.log("Error: Restricted function call - Only main owner can call this function");
            } else {
                console.log(error);
            }
        }
    }
}

let totalNumberOfCWOL = await  mainContract.returnLengthOfCWOL();
async function returnTotalCWOLCreated() {
    if(window.ethereum !== "undefined") {
        try{
     
      console.log(totalNumberOfCWOL.toNumber())
        }catch(error){
            console.log(error)
        }
    }
}
async function retrunTotalNOGCreated() {
   if(window.ethereum !== "undefined"){
    try{
        let totalNumberOfCWOL = await mainContract.returnNOGLength();
        console.log(totalNumberOfCWOL.toNumber())
    }catch(error){
        console.log(error)
    }
   }
}
let encapulateCWOLaddresses = []
let deployedCWOLcontracts = []

async function returnCWOL() {
    if (window.ethereum !== "undefined") {
        try {
            for (let i = 0; i < totalNumberOfCWOL; i++) {
                let CWOLaddress = await mainContract._courseWinOrLoseArray(i);
                encapulateCWOLaddresses.push(CWOLaddress);
                let newContract = new ethers.Contract(CWOLaddress, courseWinOrLoseABI, signer);
                deployedCWOLcontracts.push(newContract);
                let contractName = await newContract.returnContractName();
                console.log(`Contract at address ${CWOLaddress} has name: ${contractName}`);
            }
        } catch(error) {
            console.log(error);
        }
    }
}

let returnCWOLNamesEl = document.getElementById("return_CWOL_NAMES")
returnCWOLNamesEl.onclick = showAllCWOLName

async function showAllCWOLName() {
    if(window.ethereum !== "undefined") {
        try{
            for(let i = 0; i < totalNumberOfCWOL; i++ ){
             console.log(await deployedCWOLaddresses[i].returnContractName())
            // console.log(names)
            }
        }catch(error) {
            console.log(error)
        }
    }
}
let addOwnerEl = document.getElementById("addOwner")
addOwnerEl.onclick =  addOwners

async function addOwners() {
    try {
         // Get the input value for the new owner address
         let newOwnerEl = document.getElementById("newOwnerInput").value;
 
         // Call the addOwner function with the new owner address
         await mainContract.addOwner( ""+ newOwnerEl + "");
         addOwnerEl.value = " "
    } catch(error) {
         console.log(error);
    }
 }
let removeOwnerEl = document.getElementById("removeOwner")
removeOwnerEl.onclick = removeOwner

async function removeOwner() {

    try {
        let ownerAddress = document.getElementById("newOwnerInput").value
      await mainContract.removeOwner("" + ownerAddress +"")
      ownerAddress.value = ""
    }catch(error){
        console.log(error)
    }
 }
 let returnProtocolCutEl = document.getElementById("returnProtocolCut")
 returnProtocolCutEl.onclick = returnProtocolCutofCWOL
 async function returnProtocolCutofCWOL() {
     try {
        for(let i = 0 ; i < totalNumberOfCWOL; i++) {
            let contract =await  mainContract._courseWinOrLoseArray(i)
            let newContract = new ethers.Contract(contract,courseWinOrLoseABI,signer)
            let protocolCut = await newContract.returnProtocolCut()
            console.log(`the protocol cut of contract of address ${contract} is ${protocolCut}`)
        }
     }catch(error){
        console.log(error)
     }
 }
 