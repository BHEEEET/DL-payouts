import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const rpc = "https://api.mainnet-beta.solana.com";
const umi = createUmi(rpc).use(dasApi());

const fetchAssets = async () => {
    try {
      const assets = await umi.rpc.getAssetsByGroup({
        groupKey: 'collection',
        groupValue: '9HdPsLjMBUW8fQTp314kg4LoiqGxQqvCxKk6uhHttjVp',
      });
  
      console.log(JSON.stringify(assets.items, null, 2));
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };
  
// Call the async function
fetchAssets();
