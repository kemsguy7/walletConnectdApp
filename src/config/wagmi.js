import { mainnet, sepolia, lisk, liskSepolia, base, polygon, meterTestnet } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';

// Create the Wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia, lisk, liskSepolia, base, polygon, meterTestnet],
  connectors: [],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [lisk.id]: http(),
    [liskSepolia.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [meterTestnet.id]: http(),
  },
});
