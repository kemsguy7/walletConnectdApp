import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useEnsName, useBalance, useChainId, useChains } from 'wagmi';
import NetworkBadge from './NetworkBadge';

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

export default Account;
