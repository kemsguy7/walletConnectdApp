import { useChainId, useChains, useSwitchChain } from 'wagmi';
import chainIconsMap from '../assets/chainIcons';
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

export default NetworkModal;
