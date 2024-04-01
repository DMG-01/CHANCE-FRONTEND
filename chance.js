import { ethers } from "./ethers-5.6.esm.min.js";
//import { numberOfGoalscontractAddress, numberOfGoalABI } from "./constant"
import { numberOfGoalscontractAddress, numberOfGoalABI } from "./constant.js";
//alert("button connected");

let connect_button = document.getElementById("connect_button");
connect_button.onclick = connect;
let balanceDisplay = document.getElementById("balance_button");
let checkOwner = document.getElementById("check");
checkOwner.onclick = check;
let ownerDisplay = document.getElementById("owner_display");
//let CWOLDisplay = document.getElementById("CWOL_lenght");
//let returnButton = document.getElementById("return_all_contractsLength");
//returnButton.onclick = returnAllLength;
let createEl = document.getElementById("create")
createEl.onclick = create
let createInp = document.getElementById("text")


const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(numberOfGoalscontractAddress, numberOfGoalABI, signer);

async function connect() {
  // alert("button connected")
  if (window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connect_button.innerHTML = "CONNECTED!";
      const balance = await contract.returnUserEtherBalance();
      console.log(ethers.utils.formatEther(balance));
      balanceDisplay.innerHTML =
        "BALANCE:" +
        parseFloat(ethers.utils.formatEther(balance)).toFixed(2) +
        "Ether";
    } catch (error) {
      console.log("error");
    }
  }
}

async function check() {
  if (window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      let isOwner = await contract.callStatic.checkIsOwner(address);
      console.log(isOwner);
      const isOwnerResult = isOwner ? "true" : "false";
      ownerDisplay.innerHTML = `OWNER: ${isOwnerResult}`;
    } catch (error) {
      console.log(error);
    }
  }
}

async function create() {
    if(window.ethereum !== "undefined") {
        try {
           let isLocked = await contract.returnIsGameLocked()
           console.log(isLocked)
        } catch(error) {
            console.log(error);
        }
    }
}

/*
async function returnAllLength() {
  if (window.ethereum !== "undefined") {
    try {
      const lengthOfCWOL = await contract.returnLengthOfOwnersArray();
      console.log(lengthOfCWOL)
    } catch (error) {
      console.log(error);
    }
  }
}
*/
