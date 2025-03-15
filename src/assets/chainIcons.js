import BaseLogo from '../assets/BaseLogo.png';
import MeterLogo from '../assets/MeterLogo.jpeg';

const chainIconsMap = {
  // Mainnet - Ethereum
  1: {
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    name: 'Ethereum',
  },
  // Sepolia
  11155111: {
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    name: 'ETH Sepolia',
  },
  // Lisk
  4202: {
    icon: 'https://cryptologos.cc/logos/lisk-lsk-logo.svg',
    name: 'Lisk Mainnet',
  },
  // Lisk Sepolia
  4201: {
    icon: 'https://cryptologos.cc/logos/lisk-lsk-logo.svg',
    name: 'Lisk Sepolia',
  },
  // Base
  8453: {
    icon: BaseLogo,
    name: 'Base',
  },
  // Polygon
  137: {
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    name: 'Polygon',
  },
  // Meter Testnet
  83: {
    icon: MeterLogo,
    name: 'Meter Testnet',
  },
};

// Error handling wrapper
const getChainIcon = (chainId) => {
  const chain = chainIconsMap[chainId];
  return chain?.icon || 'https://cryptologos.cc/logos/default-logo.svg';
};

export default chainIconsMap;
