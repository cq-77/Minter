import { React, useEffect } from 'react';
import NftCard from './NftCard';

const NftCollections = ({ nfts }) => {

    return (
        <div className='nft-container'>
            {nfts.map((nft, i) => {
                if(nft.metadata) return <NftCard nft={nft} key={i}  />
            })}
        </div> 
    )

}
export default NftCollections