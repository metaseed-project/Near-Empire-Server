import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot, crustTypes } from '@crustio/type-definitions';

// WS address of Crust chain
const chain_ws_url = "ws://127.0.0.1:9933";

// Connect to chain
const api = new ApiPromise({
    provider: new WsProvider(chain_ws_url),
    typesBundle: typesBundleForPolkadot,
});