// add code that allows computer to hold
// add code that allows anyone to play first
// fix bug when the two players have sum abov 21 ---- DONE
// number to track who has played ++ ----- DONE
// modify the computer stake  -----------DONE
//implement the stake function ----------DONE
// implement a get name stuff
//implement a end game stuff

import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, ABI } from "./constant.js";
let connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;

const Stake = document.getElementById("send");
Stake.onclick = stake;
const start = document.getElementById("start-game");
start.onclick = startGame;
const NewCard = document.getElementById("new-card");
NewCard.onclick = newCard;
const Hold = document.getElementById("hold-game");
Hold.onclick = hold;
let hasComputerPlayed = false;
let cards = [];
let sum = 0;
let total = 0;
let totalStake = 0;
let yourstake = 0;
let hasBlackJack = false;
let isAlive = true;
let computerHasBlackJack = false;
let isComputerAlive = false;
let message = "";
let winnerEl = document.getElementById("winner-el");
let messageEL = document.getElementById("display");
let sumEl = document.getElementById("sum-el");
let card = document.getElementById("cards");
let screen = document.getElementById("compD");
let playerMoney = document.getElementById("player-money");
let money = 1000;
let yourStake = document.getElementById("your-stake");
let computerStake = document.getElementById("computer-stake");
let totalWin = document.getElementById("total-win");
let hasStaked = false;
let hasGameEnded = true;
let isConnectedToWeb3 = false;
let playerr = {
  namee: "player",
  price: 890,
};
playerMoney.innerHTML += "$" + money;

/**WEB3 FUNCTIONS HERE */

async function connect() {
  if (window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "CONNECTED";
      Stake.innerHTML = "STAKE ETHER";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const Contract = new ethers.Contract(contractAddress, ABI, signer);
      const userBalance = await Contract.getUserBalance();
      console.log(ethers.utils.formatEther(userBalance));
      const balance = ethers.utils.formatEther(userBalance);
      playerMoney.innerHTML =
        "MONEY: " + parseFloat(balance).toFixed(2) + " Ether";
      isConnectedToWeb3 = true;
    } catch (error) {
      console.log(error);
    }
  }
}

async function web3stake() {
  if (window.ethereum !== "undefined") {
    try {
      let userStake = document.getElementById("stake").value;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const Contract = new ethers.Contract(contractAddress, ABI, signer);
      const totalBalance = await Contract.depositStake(
        ethers.utils.parseEther(userStake),
        {
          value: ethers.utils.parseEther(userStake),
        }
      );
      console.log(ethers.utils.formatEther(totalBalance));
    } catch (error) {
      console.log(error);
    }
  }
  hasStaked = true;
}
/**WEB3 FUNCTIONS END */

function getRandomCard() {
  let omo = Math.floor(Math.random() * 13) + 1;
  if (omo > 10) {
    return 10;
  } else if (omo === 11) {
    return 11;
  } else {
    return omo;
  }
}

function startGame() {
  if (hasStaked == false) {
    alert("HEY,YOU HAVENT PLACED ANY BET YET");
  } else if (hasGameEnded == false) {
    alert("PREVIOUS GAME HASNT ENDED");
  } else if (hasStaked == true && hasGameEnded == true) {
    isAlive = true;
    hasGameEnded = false;
    winnerEl.textContent = "GAME ON ";
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = firstCard + secondCard;
    renderGame();

    if (compSum > 15) {
      judge = Math.floor(Math.random() * 2);
      if (judge == 1) {
        setTimeout(computerHold, 1000);
      } else {
        setTimeout(firstDisplay, 3000);
      }
    } else {
      setTimeout(computerNew, 3000);
      setTimeout(firstDisplay, 3000);
    }
  }
  time();
}

function time() {
  setTimeout(computerGame, 3000);
  screen.innerHTML = "computer is playing";
}
function firstDisplay() {
  screen.innerHTML = "your turn";
}

async function renderGame() {
  card.textContent = "CARDS:";
  for (let i = 0; i < cards.length; i++) {
    card.textContent += cards[i] + ",";
   
  }
  sumEl.textContent = "sum:" + sum;
  if (sum <= 20) {
    message = "do you want a new card";
    hasBlackJack = false;
    isAlive = true;
  } else if (sum === 21) {
    message = "you've got black jack";
    hasBlackJack = true;
    isAlive = true;
    hasGameEnded = true;
    hasStaked = false;
    winnerEl.textContent = "YOU WON!!!!!!!!!!!!!";
    if (isConnectedToWeb3 == true) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, ABI, signer);
        await Contract.winGame();
        const userBalance = await Contract.getUserBalance();
        const balance = ethers.utils.formatEther(userBalance);
        playerMoney.innerHTML =
          "MONEY: " + parseFloat(balance).toFixed(2) + " Ether";
      } catch (error) {
        console.log(error);
      }
    } else {
      money = money + total;
      playerMoney.innerHTML = "MONEY:$" + money;
    }
    setTimeout(reload, 5000);
  } else {
    message = "you are out of the game";
    hasBlackJack = false;
    isAlive = false;
    hasGameEnded = true;
    hasStaked = false;
    if (isConnectedToWeb3 == true) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, ABI, signer);
        await Contract.loseGame();
        const userBalance = await Contract.getUserBlance();
        balance = ethers.utils.formatEther(userBalance);
        playerMoney.innerHTML =
          "MONEY: " + parseFloat(balance).toFixed(2) + " Ether";
      } catch (error) {
        console.log(error);
      }
    }
    setTimeout(reload, 5000);
  }
  messageEL.textContent = message;
}

function newCard() {
  if (isAlive === true && hasBlackJack === false && hasComputerPlayed == true) {
    let NEW = getRandomCard();
    sum += NEW;
    cards.push(NEW);
    renderGame();
    setTimeout(computerNew, 2000);
    setTimeout(firstDisplay, 2000);
    //computerNew()
  }
}

// computer Game code is here
let computerCards = [];
let computerSum = 0;

let compSum = document.getElementById("computer-sum");
let compCards = document.getElementById("computer-cards");

function computerGame() {
  let computerCard1 = getRandomCard();
  let computerCard2 = getRandomCard();
  computerCards = [computerCard1, computerCard2];
  computerSum = computerCard1 + computerCard2;
  hasComputerPlayed = true;
  computerGameRender();
}

async function computerGameRender() {
  compCards.textContent = "CARDS:";
  for (let i = 0; i < computerCards.length; i++) {
    compCards.textContent += computerCards[i] + ",";
  }
  // this is for the array
  compSum.innerHTML = "SUM:" + computerSum;

  if (computerSum <= 20) {
    computerHasBlackJack = false;
    isComputerAlive = true;
  } else if (computerSum === 21 && sum < 21) {
    computerHasBlackJack = true;
    isComputerAlive = true;
    hasGameEnded = true;
    if (isConnectedToWeb3 == true) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, ABI, signer);
        await Contract.loseGame();
        const userBalance = await Contract.getUserBlance();
        balance = ethers.utils.formatEther(userBalance);
        playerMoney.innerHTML =
          "MONEY: " + parseFloat(balance).toFixed(2) + " Ether";
      } catch (error) {
        console.log(error);
      }
      setTimeout(reload, 5000);
    }
    winnerEl.textContent = "YOU LOST!!!!!!!!!!!!!!!!!!!";
    //money = money - total
    playerMoney.innerHTML = "MONEY:$" + money;
    setTimeout(reload, 5000);
    hasStaked = false;
  } else if (sum === 21 && computerSum < 21) {
    computerHasBlackJack = false;
    isComputerAlive = false;
    hasGameEnded = true;
    draw();
    winnerEl.textContent = "YOU WON!!!!!!!!!!!!!";
    hasBlackJack = true;
    hasStaked = false;
    if (isConnectedToWeb3 == true) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, ABI, signer);
        await Contract.winGame();
        const userBalance = await Contract.getUserBlance();
        balance = ethers.utils.formatEther(userBalance);
        playerMoney.innerHTML =
          "MONEY: " + parseFloat(balance).toFixed(2) + " Ether";
      } catch (error) {
        console.log(error);
      }
      setTimeout(reload, 5000);
    } else {
      money = money + total;
      playerMoney.innerHTML = "MONEY:$" + money;
    }
    setTimeout(reload, 5000);
  } else if (computerSum > 21 && sum < 21) {
    computerHasBlackJack = false;
    isComputerAlive = false;
    hasGameEnded = true;
    winnerEl.textContent = "YOU WON!!!!!!!!!!!!!";
    hasBlackJack = true;
    if (isConnectedToWeb3 == true) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, ABI, signer);
        await Contract.winGame();
        const userBalance = await Contract.getUserBalance();
        let balance = ethers.utils.formatEther(userBalance);
        playerMoney.innerHTML =
          "MONEY: " + parseFloat(balance).toFixed(2) + " Ether";
      } catch (error) {
        console.log(error);
      }
      setTimeout(reload, 5000);
    } else {
      money = money + total;
      playerMoney.innerHTML = "MONEY:$" + money;
      setTimeout(reload, 5000);
    }
  }
}
function computerNew() {
  if (isComputerAlive === true && computerHasBlackJack === false) {
    let compNewCard = getRandomCard();
    computerSum += compNewCard;
    computerCards.push(compNewCard);
    computerGameRender();
    hasComputerPlayed = true;
  }
}
function reload() {
  //location.reload();
  sumEl.textContent = "sum:";
  totalWin.innerHTML = "YOUR-STAKE: $";
  cards = [];
  card.textContent = "CARDS:";
  for (let i = 0; i < cards.length; i++) {
    card.textContent += cards[i] + ",";
  }

  computerCards = [];
  computerSum = 0;
  compCards.textContent = "CARDS:";
  for (let i = 0; i < computerCards.length; i++) {
    compCards.textContent += computerCards[i] + ",";
  }
  compSum.innerHTML = "SUM:" + computerSum;
  messageEL.textContent = "";
  winnerEl.textContent = "";
  document.getElementById("stake").value = "";
  yourStake.innerHTML = "YOUR-STAKE : $";
  computerStake.innerHTML = "COMPUTER-STAKE:$";

  hasStaked = false;
}
/*  function winner(){
        if (computerSum < 22 && sum > 21 || computerSum > 21 && sum < 22 ){
            winnerEl.textContent = "YOU WON !!!!!!!!!!!!!!!"
        }        
    }*/
function draw() {
  if (computerSum > 21 && sum > 21) {
    winnerEl.textContent = "DRAW, PLAY AGAIN";
  }
}
function hold() {
  computerNew();
}

//STAKE CODE

function web2stake() {
  yourstake = document.getElementById("stake").value;
  if (yourstake > money) {
    alert("INSUFFICIENT BALANCE!");
  } else if (yourstake < 0) {
    alert("INVALID STAKE");
  } else {
    money = money - yourstake;
    let first = Math.floor(Math.random() * yourstake + 1);
    total = parseInt(yourstake) + first;
    // alert(total)
    computerStake.innerHTML += first;
    yourStake.innerHTML = "YOUR-STAKE : $" + yourstake;
    playerMoney.innerHTML = "MONEY:$" + money;

    totalWin.innerHTML = "TOTAL: $" + total;
    hasStaked = true;
  }
}

function stake() {
  if (isConnectedToWeb3 == true) {
    web3stake();
  } else {
    web2stake();
  }
}

function computerHold() {
  hasComputerPlayed = true;
}
