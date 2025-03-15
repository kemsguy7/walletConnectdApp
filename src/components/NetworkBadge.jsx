import chainIconsMap from '../assets/chainIcons';

function NetworkBadge({ chainId, name }) {
  const chainInfo = chainIconsMap[chainId] || { icon: null, name: name || 'Unknown' };

  return (
    <div className='flex items-center space-x-2 bg-[#192231] px-3 py-1 rounded-full shadow-lg'>
      {chainInfo.icon && <img src={chainInfo.icon} alt={chainInfo.name} className='w-4 h-4' />}
      <span className='text-sm font-medium text-white'>{chainInfo.name}</span>
    </div>
  );
}
export default NetworkBadge;
