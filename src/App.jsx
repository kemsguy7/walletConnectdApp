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

import NetworkModal from './components/NetworkModal';
import Account from './components/Account';
import WalletModal from './components/WalletModal';

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

      {/* Modals */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />

      <NetworkModal isOpen={isNetworkModalOpen} onClose={() => setIsNetworkModalOpen(false)} />
    </div>
  );
}

export default App;
