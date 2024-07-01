import { Connection, PublicKey, GetVersionedTransactionConfig } from '@solana/web3.js';
import moment from 'moment'

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const config: GetVersionedTransactionConfig = {
    maxSupportedTransactionVersion: 2
}
const signaturesArray: string[] = [];
const batchSize = 10;
const delayMs = 5000;

// Helper function to create a delay using setTimeout
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTransactionHistory(accountAddress: string) {
    const publicKey = new PublicKey(accountAddress);

    try {
        const sigs = await connection.getSignaturesForAddress(publicKey);

        // Convert blockTime to a formatted date string using moment
        const signaturesWithFormattedBlockTime = sigs.map(tx => {
            signaturesArray.push(tx.signature)

            let blockTimeFormatted: string | null = null;
            if (tx.blockTime !== null && tx.blockTime !== undefined) {
                blockTimeFormatted = moment.unix(tx.blockTime).format("YYYY-MM-DD HH:mm:ss");
            }
            return {
                ...tx,
                blockTime: blockTimeFormatted,
            };

            
        });

        const sigsFinal = JSON.stringify(signaturesArray)
        
        // Step 4: Fetch transaction history in batches
        const numBatches = Math.ceil(sigsFinal.length / batchSize);
        const allTransactions: any[] = [];

        for (let i = 0; i < numBatches; i++) {
            const start = i * batchSize;
            const end = (i + 1) * batchSize;
            const batchSignatures = signaturesArray.slice(start, end);

            if (batchSignatures.length > 0) {
                const batchTransactions = await connection.getTransactions(batchSignatures, config);
                allTransactions.push(...batchTransactions);
                await delay(delayMs); // Add delay between batches
            }
        }

        // Step 5: Log all transactions fetched
        console.log(JSON.stringify(allTransactions, null, 2));
        
    } catch (error) {
        console.error('Error fetching transaction history:', error);
    }
}

const accountAddress = 'FAEYozsZVkxhXwG1HnVJn58Ks3dff31zjtA8b3KezFJ6';
getTransactionHistory(accountAddress);
