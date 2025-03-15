import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useBalance,
  useChainId,
  useChains,
  useSwitchChain,
} from 'wagmi';

// Chain Icons Map
const chainIconsMap = {
  // Mainnet - Ethereum
  1: {
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
    name: 'Ethereum',
  },
  // Sepolia
  11155111: {
    icon: 'https://ethereum.org/static/61f6c9c28e9c0d4f3c8685111bb0b537/3bf79/sepolia.png',
    name: 'Sepolia',
  },
  // Lisk
  4202: {
    icon: 'https://cryptologos.cc/logos/lisk-lsk-logo.svg',
    name: 'Lisk',
  },
  // Lisk Sepolia
  4201: {
    icon: 'https://cryptologos.cc/logos/lisk-lsk-logo.svg',
    name: 'Lisk Sepolia',
  },
  // Base
  8453: {
    icon: 'https://cryptologos.cc/logos/base-logo.svg',
    name: 'Base',
  },
  // Polygon
  137: {
    icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    name: 'Polygon',
  },
  // Meter Testnet
  83: {
    icon: 'https://www.meter.io/assets/images/meter-logo.svg',
    name: 'Meter Testnet',
  },
  // WMC Testnet
  1402: {
    icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg', // Placeholder
    name: 'WMC Testnet',
  },
};

// ======== NetworkBadge Component ========
function NetworkBadge({ chainId, name }) {
  const chainInfo = chainIconsMap[chainId] || { icon: null, name: name || 'Unknown' };

  return (
    <div className='flex items-center space-x-2 bg-[#192231] px-3 py-1 rounded-full shadow-lg'>
      {chainInfo.icon && <img src={chainInfo.icon} alt={chainInfo.name} className='w-4 h-4' />}
      <span className='text-sm font-medium text-white'>{chainInfo.name}</span>
    </div>
  );
}

// ======== WalletModal Component ========
function WalletModal({ isOpen, onClose }) {
  const { connectors, connect, isPending, pendingConnector } = useConnect();
  const [readyConnectors, setReadyConnectors] = useState([]);

  useEffect(() => {
    // Check which connectors are ready on component mount
    const checkConnectors = async () => {
      const results = await Promise.all(
        connectors.map(async (connector) => {
          try {
            // Try to get provider to check if connector is ready
            const provider = await connector.getProvider().catch(() => null);
            return { connector, isReady: !!provider };
          } catch (e) {
            console.log(`Error checking connector ${connector.name}:`, e);
            return { connector, isReady: false };
          }
        }),
      );
      setReadyConnectors(results);
    };

    if (isOpen) {
      checkConnectors();
    }
  }, [connectors, isOpen]);

  const handleConnect = (connector) => {
    connect({ connector });
    onClose();
  };

  if (!isOpen) return null;

  // Popular wallet options for users who don't have wallets installed
  const popularWalletOptions = [
    { name: 'MetaMask', url: 'https://metamask.io/download/' },
    { name: 'Coinbase Wallet', url: 'https://www.coinbase.com/wallet/downloads' },
    { name: 'Brave Browser', url: 'https://brave.com/download/' },
    { name: 'Trust Wallet', url: 'https://trustwallet.com/download' },
  ];

  // If no wallets are found to be ready
  if (readyConnectors.length === 0 || readyConnectors.every(({ isReady }) => !isReady)) {
    return (
      <div className='fixed inset-0 flex items-center justify-center z-50'>
        <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' onClick={onClose}></div>
        <div className='relative max-w-md w-full mx-4'>
          <div className='p-[1px] rounded-2xl bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] shadow-[0_0_15px_rgba(126,63,242,0.5)]'>
            <div className='bg-[#0B1322] p-6 rounded-2xl'>
              <h2 className='text-2xl font-bold text-white mb-4'>No Wallet Extensions Detected</h2>
              <p className='mb-6 text-amber-400'>
                To interact with Web3 applications, you'll need a browser extension wallet. Here are
                some popular options:
              </p>
              <div className='space-y-4'>
                {popularWalletOptions.map((wallet) => (
                  <a
                    key={wallet.name}
                    href={wallet.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center p-3 text-white bg-[#192231] hover:bg-[#232B3A] rounded-lg border border-[#7E3FF2] transition-colors duration-300'
                  >
                    <img src={wallet.icon} alt={wallet.name} className='w-8 h-8 mr-3' />
                    Install {wallet.name}
                  </a>
                ))}
              </div>
              <div className='mt-4 p-3 bg-[#192231] rounded-lg border border-[#00F0FF]'>
                <p className='text-white text-sm'>
                  After installing a wallet, you may need to refresh this page to connect.
                </p>
              </div>
              <button
                onClick={onClose}
                className='mt-6 py-2 px-4 w-full bg-[#232B3A] text-white rounded-lg border border-white hover:bg-[#2D3748] transition-colors duration-300'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#0E1629] via-[#0B1322] to-[#131B2E]'>
        {/* Beautiful animated background */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -inset-[10%] opacity-30'>
            <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-[#7E3FF2] rounded-full mix-blend-screen filter blur-3xl animate-blob'></div>
            <div className='absolute top-3/4 left-1/3 w-96 h-96 bg-[#00F0FF] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000'></div>
            <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-[#FF1ACD] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000'></div>
          </div>
        </div>

        <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' onClick={onClose}></div>
        <div className='relative max-w-md w-full mx-4'>
          <div className='p-[1px] rounded-2xl bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] shadow-[0_0_15px_rgba(126,63,242,0.5)]'>
            <div className='bg-[#0B1322] p-6 rounded-2xl'>
              <h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] mb-4'>
                Connect Wallet
              </h2>
              <p className='mb-6 text-gray-300'>Choose your preferred wallet to connect:</p>

              <div className='space-y-3'>
                {readyConnectors.map(({ connector, isReady }) => (
                  <button
                    key={connector.uid}
                    disabled={!isReady || (isPending && pendingConnector?.uid === connector.uid)}
                    onClick={() => handleConnect(connector)}
                    className={`
                    w-full p-4 font-medium text-white transition-all duration-300 
                    bg-[#192231] border border-transparent rounded-lg flex items-center justify-between
                    ${
                      isReady && !(isPending && pendingConnector?.uid === connector.uid)
                        ? 'hover:bg-[#232B3A] hover:border-[#00F0FF] hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                        : 'opacity-50 cursor-not-allowed'
                    }
                    ${
                      isPending && pendingConnector?.uid === connector.uid
                        ? 'border-[#7E3FF2] bg-[#232B3A] shadow-[0_0_15px_rgba(126,63,242,0.3)]'
                        : ''
                    }
                  `}
                  >
                    <div className='flex items-center'>
                      <img
                        src={`${connector.icon}`}
                        alt={connector.name}
                        className='w-8 h-8 mr-3'
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXdhbGxldCI+PHBhdGggZD0iTTIwIDEyVjhhMiAyIDAgMCAwLTItMkg2YTIgMiAwIDAgMC0yIDJ2MTJhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0ydi00Ii8+PHBhdGggZD0iTTIwIDEyaC00YTIgMiAwIDAgMCAwIDRoNHYtNFoiLz48L3N2Zz4=';
                        }}
                      />
                      <span>{connector.name}</span>
                    </div>
                    <div>
                      {!isReady && <span className='text-sm text-gray-400'>(not detected)</span>}
                      {isPending && pendingConnector?.uid === connector.uid && (
                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#00F0FF]'></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={onClose}
                className='mt-6 py-2 px-4 w-full bg-[#232B3A] text-white rounded-lg border border-white hover:bg-[#2D3748] transition-colors duration-300'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======== Account Component ========
function Account({ onOpenNetworkModal }) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const chains = useChains();
  const { connector } = useAccount();

  // Find current chain
  const currentChain = chains.find((chain) => chain.id === chainId);

  // Format address for display
  const displayAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // Show a small notification
      const notification = document.createElement('div');
      notification.className =
        'fixed bottom-4 right-4 bg-[#232B3A] text-white py-2 px-4 rounded-lg shadow-lg z-50';
      notification.textContent = 'Address copied to clipboard';
      document.body.appendChild(notification);

      // Remove after 2 seconds
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
    }
  };

  // Create a shimmer effect for the gradient border
  const [isShimmering, setIsShimmering] = useState(false);

  useEffect(() => {
    // Add shimmer effect periodically
    const shimmerInterval = setInterval(() => {
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 1500);
    }, 8000);

    return () => clearInterval(shimmerInterval);
  }, []);

  return (
    <div className='w-full max-w-md'>
      <div className='relative rounded-2xl overflow-hidden transition-all duration-500'>
        <div
          className={`p-[1px] absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] ${
            isShimmering ? 'animate-pulse' : ''
          } shadow-[0_0_15px_rgba(126,63,242,0.3)]`}
        ></div>
        <div className='relative p-6 bg-[#0B1322] rounded-2xl shadow-inner'>
          <h1 className='mb-6 text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD]'>
            Connected Wallet
          </h1>

          <div className='space-y-5'>
            {/* Network Badge */}
            <div className='flex justify-center mb-4'>
              {currentChain && <NetworkBadge chainId={currentChain.id} name={currentChain.name} />}
            </div>

            {/* Wallet Info */}
            <div className='p-[1px] rounded-xl bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD]'>
              <div className='p-4 bg-[#192231] rounded-xl'>
                <div className='flex justify-between mb-3'>
                  <span className='text-gray-400'>Address:</span>
                  <div className='flex items-center'>
                    <span className='font-medium text-white'>{ensName || displayAddress}</span>
                    <button
                      onClick={copyToClipboard}
                      className='ml-2 text-[#00F0FF] hover:text-white transition-colors duration-300'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className='flex justify-between mb-3'>
                  <span className='text-gray-400'>Balance:</span>
                  <span className='font-medium text-white'>
                    {balance
                      ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
                      : 'Loading...'}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-400'>Network:</span>
                  <span className='font-medium text-white'>{currentChain?.name || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex flex-col space-y-3'>
              <button
                onClick={onOpenNetworkModal}
                className='w-full p-3 font-medium text-white transition-all duration-300 bg-[#192231] border border-[#00F0FF] rounded-lg hover:bg-[#232B3A] hover:shadow-[0_0_10px_rgba(0,240,255,0.15)] hover:scale-[1.02]'
              >
                Switch Network
              </button>

              <button
                onClick={() => disconnect()}
                className='w-full p-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-[#7E3FF2] to-[#FF1ACD] rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(126,63,242,0.4)] hover:scale-[1.02]'
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======== NetworkModal Component ========
function NetworkModal({ isOpen, onClose }) {
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='absolute inset-0 bg-black/80 backdrop-blur-sm' onClick={onClose}></div>
      <div className='relative max-w-md w-full mx-4'>
        <div className='p-[1px] rounded-2xl bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] shadow-[0_0_15px_rgba(126,63,242,0.5)]'>
          <div className='bg-[#0B1322] p-6 rounded-2xl'>
            <h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] mb-4'>
              Switch Network
            </h2>
            <p className='mb-6 text-gray-300'>
              Select the blockchain network you want to connect to:
            </p>

            <div className='grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar'>
              {chains.map((chain) => {
                const chainInfo = chainIconsMap[chain.id] || { icon: null, name: chain.name };

                return (
                  <button
                    key={chain.id}
                    onClick={() => {
                      switchChain({ chainId: chain.id });
                      onClose();
                    }}
                    disabled={chain.id === chainId}
                    className={`
                      p-4 rounded-xl transition-all duration-300 flex items-center justify-between
                      ${
                        chain.id === chainId
                          ? 'bg-[#192231] border-2 border-[#00F0FF] text-white cursor-default shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'bg-[#192231] border border-gray-700 text-white hover:border-[#7E3FF2] hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(126,63,242,0.2)]'
                      }
                    `}
                  >
                    <div className='flex items-center'>
                      {chainInfo.icon && (
                        <img
                          src={chainInfo.icon}
                          alt={chainInfo.name}
                          className='w-6 h-6 mr-3'
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <span className='font-medium'>{chainInfo.name}</span>
                    </div>
                    {chain.id === chainId && (
                      <span className='flex items-center text-[#00F0FF]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className='mt-6 py-2 px-4 w-full bg-[#232B3A] text-white rounded-lg border border-white hover:bg-[#2D3748] transition-colors duration-300'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======== Main App Component ========

function App() {
  const { isConnected } = useAccount();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#0E1629] via-[#0B1322] to-[#131B2E]'>
      {/* Beautiful animated background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -inset-[10%] opacity-30'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-[#7E3FF2] rounded-full mix-blend-screen filter blur-3xl animate-blob'></div>
          <div className='absolute top-3/4 left-1/3 w-96 h-96 bg-[#00F0FF] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000'></div>
          <div className='absolute top-1/3 right-1/4 w-96 h-96 bg-[#FF1ACD] rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000'></div>
        </div>
      </div>

      {/* Neuromorphic container styling */}
      <div className='relative z-10 w-full max-w-md'>
        <div className='bg-gradient-to-br from-[#151F38] to-[#0C1220] p-8 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04),_0_-4px_25px_-10px_rgba(255,255,255,0.05)]'>
          {/* If connected, show account info */}
          {isConnected ? (
            <Account onOpenNetworkModal={() => setIsNetworkModalOpen(true)} />
          ) : (
            <div className='w-full'>
              <div className='relative rounded-2xl overflow-hidden'>
                <div className='p-[1px] absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD] shadow-[0_0_15px_rgba(126,63,242,0.5)]'></div>
                <div className='relative p-6 bg-[#0D1526]/90 backdrop-blur-sm rounded-2xl shadow-[inset_1px_1px_0.5px_rgba(255,255,255,0.1)]'>
                  <h1 className='mb-2 text-3xl font-bold text-center'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#7E3FF2] via-[#00F0FF] to-[#FF1ACD]'>
                      Web3 Wallet
                    </span>
                  </h1>
                  <p className='mb-8 text-center text-gray-300'>Connect your wallet to continue</p>

                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    className='w-full p-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-[#7E3FF2] to-[#FF1ACD] rounded-lg hover:opacity-90 hover:shadow-[0_0_15px_rgba(126,63,242,0.4),_inset_0_0_0_1px_rgba(255,255,255,0.15)] hover:scale-[1.02]'
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0b1322;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7e3ff2, #00f0ff);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7e3ff2, #ff1acd);
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Modals */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />

      <NetworkModal isOpen={isNetworkModalOpen} onClose={() => setIsNetworkModalOpen(false)} />
    </div>
  );
}

export default App;
