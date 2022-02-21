/* eslint-disable node/no-extraneous-import */
import {Keyring} from '@polkadot/keyring';
import {KeyringPair} from '@polkadot/keyring/types';

// Seeds of account
const seeds = "XXXX";

const kr = new Keyring({
    type: 'sr25519',
});

// krp will be used in sending transaction
const krp = kr.addFromUri(seeds);

// (async()=>{
//     // placeOrder();
// })();

async function placeOrder(api: ApiPromise, krp: KeyringPair, fileCID: string, fileSize: number, tip: number) {
    // Determine whether to connect to the chain
    await api.isReadyOrError;
    // Generate transaction
    const pso = api.tx.market.placeStorageOrder(fileCID, fileSize, tip);
    // Send transaction, for 'sendTx()' please refer https://github.com/crustio/crust-demo/blob/main/sample-store-demo/src/utils.ts
    const txRes = JSON.parse(JSON.stringify((await sendTx(krp, pso))));
    return JSON.parse(JSON.stringify(txRes));
}