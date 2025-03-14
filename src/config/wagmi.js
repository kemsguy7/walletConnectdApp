import { mainnet, base, optimism, polygon, arbitrum } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors';

// Create the Wagmi config
export const config = createConfig({
  chains: [mainnet, base, optimism, polygon, arbitrum],
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'My Web3 App',
    }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});