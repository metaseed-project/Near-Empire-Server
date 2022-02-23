const nearAPI = require("near-api-js");
const { PRIVATE_KEY } = require("./core/config");

const { KeyPair, connect, keyStores, WalletConnection } = nearAPI;

let contract = undefined;
const accountId = "phoneiostest.testnet";

const init = async () => {
    const keyStore = new keyStores.InMemoryKeyStore();

    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await keyStore.setKey("testnet", accountId, keyPair);

    const config = {
        networkId: "testnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
    const near = await connect(config);

    const account = await near.account(accountId);

    // const response = await account.state();
    // console.log(response);

    const contractId = "nearspacecontract.testnet";
    contract = new nearAPI.Contract(account, contractId, {
        //   viewMethods: ["Nft_mint"],
        changeMethods: ["nft_mint"],
        sender: account,
    });
};

const mintNft = async (name, counter, receiver_id) => {
    if (!contract) {
        await init();
    }
    const meta = {
        token_id: counter.toString(),
        receiver_id: receiver_id,
        token_metadata: {
            title: name,
            description: "description",
            media: planetDict[name],
        },
    };
    await contract.nft_mint({
        args: meta,
        gas: "300000000000000",
        amount: "8040000000000000000000",
    });
};

const planetDict = {
    "Adhara": "https://bafkreibjkgvmp64zghhluec73bwtk53vc6rpk6kpngafc6z365k7xeykua.ipfs.dweb.link/",
    "HAT-P-2": "https://bafkreieocsukicdqtpcy54in7zbb7h5bmg5e2f3cd7eoji2uhpgd4iuw5a.ipfs.dweb.link/",
    "Merga": "https://afkreiga2pa4uxrgorzh5n5inodle6b2444idpqwjeafjqdd5a6o3rdoae.ipfs.dweb.link/",
    "Phact": "https://bafkreicqjvx37do4joq5tu2gj7xuzinwsctrvxo7nppwchfil5rcdayc3i.ipfs.dweb.link/",
    "Rikki": "https://bafkreiatyikg7k7c44ipuc6324zfjo6asnk5caqzmzai2xdcm3t4ztibvy.ipfs.dweb.link/",
}

// const test = async () => {
//     await mintNft("Rikki", 92192190219013, "somebalance2.testnet");
// };
// test();

module.exports = { mintNft };