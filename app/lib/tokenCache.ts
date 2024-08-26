// lib/tokenCache.ts
import { getSupportedTokens } from "@/app/lib/constants";
import EMA from "./ema.ts";
import { executeTransaction } from "./transaction.ts"

// let cachedTokens: any[] = [];
let cachedTokens: { supportedTokens: any[] } = { supportedTokens: [] };


let lastFetchTime = 0;

const solEma10 = new EMA(10);
const solEma20 = new EMA(20);
const solEma30 = new EMA(30);
const solEma40 = new EMA(40);


const ethEma10 = new EMA(10);
const ethEma20 = new EMA(20);
const ethEma30 = new EMA(30);
const ethEma40 = new EMA(40);


var currSolEma10Value;
var currSolEma20Value;
var currSolEma30Value;
var currSolEma40Value;


var currEthEma10Value;
var currEthEma20Value;
var currEthEma30Value;
var currEthEma40Value;

var percentageAllowedToSpendInOneTransaction : number = 0.01;

var solStrategyFlag = false;
var ethStrategyFLag = false;


async function fetchAndCacheSupportedTokens() {
  const now = Date.now();

  if (now - lastFetchTime > 60000) { // 60000 ms = 1 minute
    cachedTokens = await getSupportedTokens();
    lastFetchTime = now;

    if (cachedTokens!== null && cachedTokens.length !== 0) {
      const solPrice = cachedTokens[0].price;
      const ethPrice = cachedTokens[3].price;

      console.log("SOL Price:", solPrice);
      console.log("ETH Price:", ethPrice);

      currSolEma10Value = solEma10.momentValue(solPrice);
      currSolEma20Value = solEma20.momentValue(solPrice);
      currSolEma30Value = solEma30.momentValue(solPrice);
      currSolEma40Value = solEma40.momentValue(solPrice);

      currEthEma10Value = ethEma10.momentValue(ethPrice);
      currEthEma20Value = ethEma20.momentValue(ethPrice);
      currEthEma30Value = ethEma30.momentValue(ethPrice);
      currEthEma40Value = ethEma40.momentValue(ethPrice);

      console.log("EMA 10 for sol price is: ", currSolEma10Value);
      console.log("EMA 20 for sol price is: ", currSolEma20Value);
      

      // Case 1:
      if((currSolEma10Value >= currSolEma20Value) && solStrategyFlag) {
        // Step 1.1: USDC to SOL
        executeTransaction(cachedTokens[1], cachedTokens[0], percentageAllowedToSpendInOneTransaction);
        // Step 1.2: USDT to SOL 
        executeTransaction(cachedTokens[2], cachedTokens[0], percentageAllowedToSpendInOneTransaction);
      }

      // Case 2: 
      if(currEthEma10Value >= currEthEma20Value) {
        // Step 2.1: USDC to ETH 
        executeTransaction(cachedTokens[1], cachedTokens[3], percentageAllowedToSpendInOneTransaction);
        // Step 2.2: USDT to ETH 
        executeTransaction(cachedTokens[2], cachedTokens[3], percentageAllowedToSpendInOneTransaction);
      }

      // Case 3:
      if(currSolEma10Value < currSolEma10Value) {
        // Step 3.1: SOl to USDC 
        executeTransaction(cachedTokens[0], cachedTokens[1], 1); // If Sol is going down then sell all of it
      }

      // Case 4: 
      if(currEthEma10Value < currEthEma20Value) {
        // Step 3.2: ETH to USDC
        executeTransaction(cachedTokens[3], cachedTokens[1], 1); // If Eth is going down then sell all of it 
      }

      solEma10.nextValue(solPrice);
      solEma20.nextValue(solPrice);

      ethEma10.nextValue(ethPrice);
      ethEma20.nextValue(ethPrice);
    }

  }

  return cachedTokens;
}

// Start the interval to fetch tokens every 1 minute
setInterval(fetchAndCacheSupportedTokens, 60000);

// Immediately fetch tokens on startup
fetchAndCacheSupportedTokens();

export async function getCachedSupportedTokens(percentageAllowedToSpendInOneTransaction : number, tokenStrategy: number) {

  this.percentageAllowedToSpendInOneTransaction = percentageAllowedToSpendInOneTransaction;

  switch (tokenStrategy) {
    case 1:
        solStrategyFlag = true;
        ethStrategyFlag = false;
        break;
    case 2:
        ethStrategyFlag = true;
        solStrategyFlag = false;
        break;
    case 3:
        solStrategyFlag = true;
        ethStrategyFlag = true;
        break;
    case 4:
        solStrategyFlag = false;
        ethStrategyFlag = false;
        break;
    default:
        console.log("Unknown token strategy");
        break;
}

  return cachedTokens;
}

