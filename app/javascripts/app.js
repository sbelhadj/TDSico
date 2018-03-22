// Import the page's CSS. Webpack will know what to do with it.
import "../css/app.css";
import "../css/all-themes.css";
import "../css/materialize.css";
import "../css/style.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
//import $ from 'jquery';
import bootstrap from 'bootstrap';
import Waves from 'node-waves';
import admin from '../../app/javascripts/admin.js'

/*
 * When you compile and deploy your TDSicoContract contract,
 * truffle stores the abi and deployed address in a json
 * file in the build directory. We will use this information
 * to setup a TDSicoContract abstraction. We will use this abstraction
 * later to create an instance of the TDSicoContract contract.
 */

import TDSicoContract_artifacts from '../../build/contracts/TDSicoContract.json'
import TDSicoToken_artifacts from '../../build/contracts/TDSicoToken.json'

var TDSicoContract = contract(TDSicoContract_artifacts);
var TDSicoToken = contract(TDSicoToken_artifacts);

let investors = {}
let tokenPrice = 0.001;


/* The user enters the total no. of tokens to buy. We calculate the total cost and send it in
 * the request. We have to send the value in Wei. So, we use the toWei helper method to convert
 * from Ether to Wei.
 */

window.buyTokens = function() {
  let tokensToBuy = $("#buy1").val();
  let price = tokensToBuy * tokenPrice;
  $("#buy-msg").html("Purchase order has been submitted. Please wait.");
  TDSicoContract.deployed().then(function(contractInstance) {
    contractInstance.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}).then(function(result) {
      $("#buy-msg").html("");
      // result is an object with the following values:
      //
      // result.tx      => transaction hash, string
      // result.logs    => array of decoded events that were triggered within this transaction
      // result.receipt => transaction receipt object, which includes gas used
      $("#result-tx").html("Transaction Hash :" + result.tx);
      //$("#result-receipt").html("Transaction Receipt :" + result.receipt);      
      // We can loop through result.logs to see if we triggered the Transfer event.
      for (var i = 0; i < result.logs.length; i++) {
        var log = result.logs[i];
        console.log(log.event)
        //if (log.event == "Transfer") {
          // We found the event!
         // break;
        //}
      }
  }).catch(function(err) {
      // There was an error! Handle it.
      console.log("error");
    })
  }); 
}

window.buyTokensWithEther = function() {
  let ethersToSend = $("#buy2").val();
  $("#buy-msg").html("Purchase order has been submitted. Please wait.");
  TDSicoContract.deployed().then(function(contractInstance) {
    contractInstance.buy({value: web3.toWei(ethersToSend, 'ether'), from: web3.eth.accounts[0]}).then(function(result) {
      $("#buy-msg").html("");       
      $("#result-tx").html("Transaction Hash : " + result.tx);
   }).catch(function(err) {
      // There was an error! Handle it.
      console.log("error");
    })
  }); 
}

window.lookupInvestorInfo = function() {
  let address = $("#investor-info").val();
  TDSicoToken.deployed().then(function(contractInstance) {
    contractInstance.balanceOf(address).then(function(v) {
      $("#tokens-bought").html("Total Tokens bought: " + (v/1.0e+18).toString());
    });
  });
}

/* Fetch the total TDS tokens, TDS tokens available for sale and the price of
 * each token and display in the UI
 */
function populateTDSTokenData() {
  TDSicoContract.deployed().then(function(contractInstance) {
   contractInstance.tokenCreationCap().then(function(v) {
      $("#tokens-total").html((v/1.0e+18).toString());
    });
   contractInstance.totalSupply().then(function(v) {
      $("#tokens-sold").html((Math.round(v/1.0e+18)).toString());
    });
    contractInstance.tokenExchangeRate().then(function(v) {
      $("#token-cost").html((v).toString() + " tokens = 1 Ether");
    });  
   contractInstance.ethFundDeposit().then(function(v) {
      $("#ico-owner-address").html(v.toString());
      web3.eth.getBalance(v.toString(), function(error, result) {
      $("#contract-balance").html(web3.fromWei(result.toString()) + " Ether");
      });      
    });
   
   $("#ico-contract-contract-address").html(contractInstance.address.toString());

   contractInstance.icoAddress().then(function(v) {
      $("#ico-token-contract-address").html(v.toString());
    });    
   });
}



/* We now fetch the investor list from the blockchain and populate the array.
 * Once we fetch the investors, we setup the table in the UI 
 * with all the investors and the TDS tokens they have.
 */
function populateInvestors() {
  TDSicoToken.deployed().then(function(contractInstance) {
    contractInstance.allInvestors.call().then(function(investorArray) {
      for(let i=0; i < investorArray.length; i++) {
        investors[investorArray[i]] = "investor-" + i;
      }
      setupInvestorRows();
      populateInvestorBalances();
    });
  });
}

function populateInvestorBalances() {
  let investorAddresses = Object.keys(investors);
  for (var i = 0; i < investorAddresses.length; i++) {
    let addr = investorAddresses[i];
    TDSicoToken.deployed().then(function(contractInstance) {
      contractInstance.balanceOf(addr).then(function(v) {
        $("#" + investors[addr]).html((v/1.0e+18).toString());
      });
    });
  }
}

function setupInvestorRows() {
  $("#investor-rows").empty();
  Object.keys(investors).forEach(function (investor) { 
    $("#investor-rows").append("<tr><td>" + investor + "</td><td id='" + investors[investor] + "'></td></tr>");
  });
}


$( document ).ready(function() {
  // Is there is an injected web3 instance?
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  TDSicoContract.setProvider(web3.currentProvider);
  TDSicoToken.setProvider(web3.currentProvider);
  populateTDSTokenData();
  populateInvestors();


  TDSicoContract.deployed().then(contractInstance => {  
    var event = contractInstance.LogCreateICO(function(error, result) {
    if (!error)
         //let { args: { from, to, val } } = result
        console.log("From: " + result.args.from)
        console.log("To: " + result.args.to)
        console.log("TDS Tokens : " + result.args.val/1.0e+18)
        $("#events-msg").html("From:" + result.args.from + "<br>" + "To:" + result.args.to + "<br>" + "TDS Tokens: " + result.args.val/1.0e+18 + "<br><br>");
          populateTDSTokenData();
          populateInvestors();
    });
  });
});
