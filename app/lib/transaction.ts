import {SUPPORTED_TOKENS, TokenDetails} from "./tokens.ts"
import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import db from "@/app/db";


export async function executeTransaction( 
  baseAsset: TokenDetails,
  quoteAsset: TokenDetails,
  percentageAllowedToSpendInOneTransaction: number): void {
  

  // Step1: Check if we have enough balance to execute the trade, can be done by using useTokens.ts 
  // Step2: Call the api to get the quote 
  // Step3: Sign the transaction 


    const session = await getServerSession(authConfig);
    console.log(session)
    if (!session?.user) {
        return NextResponse.json({
            message: "You are not logged in"
        }, {
            status: 401
        })
    }

    const solWallet = await db.solWallet.findFirst({
        where: {
            userId: session.user.uid
        }
    })

    if (!solWallet) {
        return NextResponse.json({
            message: "Couldnt find associated solana wallet"
        }, {
            status: 401
        })
    }

    const address = solWallet.publicKey;

    // Step1
    const tokenBalanceData = await axios.get(`/api/tokens?address=${address}`);
    const tokenBalanceResponse = tokenBalanceData.data;
    console.log(`Token balance response is ${JSON.stringify(tokenBalanceResponse)}`);
  
    const balance = res.data.tokens[0].balance;

    const baseAmount = balance*percentageAllowedToSpendInOneTransaction;

    if(baseAmount <= 0) {
      console.log("Not enough balance");
      return;
    }
  
    // Step 2:
    const quoteResponseData = await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${Number(baseAmount) * (10 ** baseAsset.decimals)}&slippageBps=50`)
    const quoteResponse = quoteResponseData.data;

    // Step 3:
    
    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // quoteResponse from /quote api
            quoteResponse: data.quoteResponse,
            // user public key to be used for the swap
            userPublicKey: solWallet.publicKey,
            // auto wrap and unwrap SOL. default is true
            wrapAndUnwrapSol: true,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"
          })
        })
      ).json();

      console.log("Jup returned txn")

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const privateKey = getPrivateKeyFromDb(solWallet.privateKey)
      transaction.sign([privateKey]);
      const latestBlockHash = await connection.getLatestBlockhash();

      // Execute the transaction
      const rawTransaction = transaction.serialize()
      const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          maxRetries: 2
      });
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      });


      console.log(txid);
}

function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}

 





