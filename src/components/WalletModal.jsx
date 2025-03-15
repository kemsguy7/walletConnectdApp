import React, { useState, useEffect } from 'react';
import { useConnect } from 'wagmi';

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

export default WalletModal;
