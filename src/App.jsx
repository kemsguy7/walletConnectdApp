import React, { useState, useEffect } from 'react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useEnsName, 
  useBalance, 
  useChainId, 
  useChains, 
  useSwitchChain 
} from 'wagmi';

// ======== WalletOptions Component ========
function WalletOptions() {
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
        })
      );
      setReadyConnectors(results);
    };

    checkConnectors();
  }, [connectors]);

  const handleConnect = (connector) => {
    connect({ connector });
  };

  // If no wallets are found to be ready
  if (readyConnectors.length > 0 && readyConnectors.every(({ isReady }) => !isReady)) {
    return (
      <div className="text-center">
        <p className="mb-4 text-amber-600">No wallet extensions detected</p>
        <div className="space-y-2">
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-2 text-sm text-blue-600 underline hover:text-blue-800"
          >
            Install MetaMask
          </a>
          <a 
            href="https://www.coinbase.com/wallet/downloads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-2 text-sm text-blue-600 underline hover:text-blue-800"
          >
            Install Coinbase Wallet
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {readyConnectors.map(({ connector, isReady }) => (
        <button
          key={connector.uid}
          disabled={!isReady || (isPending && pendingConnector?.uid === connector.uid)}
          onClick={() => handleConnect(connector)}
          className={`
            w-full p-3 mb-3 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg
            ${isReady && !(isPending && pendingConnector?.uid === connector.uid) ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}
            ${isPending && pendingConnector?.uid === connector.uid ? 'animate-pulse bg-gray-100' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <span>{connector.name}</span>
            {!isReady && <span className="text-sm text-gray-500">(not detected)</span>}
            {isPending && pendingConnector?.uid === connector.uid && <span className="text-sm text-blue-500">Connecting...</span>}
          </div>
        </button>
      ))}
    </div>
  );
}

// ======== Account Component ========
function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();
  
  // Find current chain
  const currentChain = chains.find((chain) => chain.id === chainId);
  
  // Format address for display
  const displayAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Connected Wallet</h1>
        
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">{ensName || displayAddress}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Balance:</span>
              <span className="font-medium">
                {balance 
                  ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` 
                  : 'Loading...'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium">{currentChain?.name || 'Unknown'}</span>
            </div>
          </div>
          
          {/* Network Switcher */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="mb-2 font-medium text-gray-700">Switch Network</h3>
            <div className="grid grid-cols-2 gap-2">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => switchChain({ chainId: chain.id })}
                  disabled={chain.id === chainId}
                  className={`p-2 text-sm rounded-md transition-colors
                    ${chain.id === chainId 
                      ? 'bg-blue-100 text-blue-800 cursor-default' 
                      : 'bg-white hover:bg-gray-200 border border-gray-300'}`}
                >
                  {chain.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => disconnect()}
          className="w-full p-3 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

// ======== Main App Component ========
function App() {
  const { isConnected } = useAccount();

  // If connected, show account info
  if (isConnected) {
    return <Account />;
  }

  // Otherwise, show wallet connection options
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Connect Wallet</h1>
        <p className="mb-6 text-center text-gray-600">Please connect your wallet to continue</p>
        <WalletOptions />
      </div>
    </div>
  );
}

export default App;