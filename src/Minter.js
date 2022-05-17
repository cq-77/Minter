import { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Web3 from 'web3';
import Nft from '../src/abis/Nft.json';
import { LoadingOutlined } from '@ant-design/icons';
import { NFTStorage } from 'nft.storage';
import { Upload, Button, Card } from 'antd';
import 'antd/lib/button/style/css';
import '@google/model-viewer';
import {Link} from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { injected } from './connectors';

export const POLYGON_TESTNET_PARAMS = {
  chainId: '0x13881', // 80001
  chainName: 'Mumbai',
  nativeCurrency: {
    name: 'MATIC Token',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/']
}

export const RINKEBY_TESTNET_PARAMS = {
  chainId: '0x4',
  chainName: 'Rinkeby Test Network',
  nativeCurrency: {
    name: 'ETH',
    Symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  blockExplorerUrls:["https://rinkeby.etherscan.io"]
}

const Minter = ({gasPrice}) => {

    const [contract, setContract] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [nftName, setNftName] = useState("");
    const [description, setDescription] = useState("");
    const [minting, setMinting] = useState(false);
    const [status, setStatus] = useState("");
    const [tokenId, setTokenId] = useState(null);
    const [previewFileType, setFileType] = useState("");
    const [previewFileName, setFileName] = useState("");
    const [isMinted, setIsMinted] = useState(false);
    const [address, setAddress] = useState("");
    const [showAddress, setShowAddress] = useState(false);
    const [txHash, setTxHash] = useState("");
    const [recipient, setRecipient] = useState("");
    const [royalty, setRoyalty] = useState(0);
    const [showWalletInput, setShowWalletInput] = useState(false);
    const [networkSelected, setNetworkSelected] = useState(false);
    
    const { activate } = useWeb3React();

    const { ethers } = require('ethers')

    // API token for nft.storage. Please sign up and replace this with your own key from https://nft.storage/manage/
    const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQxZmYyZWFhNzI5Yzk0MTBENTdEMTVCY0IwYTJFMDFkRTI1YjA1MzciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MTk5NTkyMzI5MCwibmFtZSI6IlRyYWRlTWludC1ORlQifQ.wge-Vmc2a4xZS1VUrWj2XMbcqrG3-wFFcZIDN7w7lzE";

    const beforeUpload = (file, fileList) => {
        console.log(file, fileList);
        setFile(file);
        setFileType(file.type);
        setFileName(file.name); 
        setFilePreview(URL.createObjectURL(file));
        return false;
    } 

     const uploadButton = (
       <div>
          <IconContext.Provider value={{ size: '30px', style: { marginLeft: '220px', marginTop: '80px', color: 'white' } }}><AiOutlineCloudUpload /></IconContext.Provider>
       </div>
        
    );

    const previewImg = <img src={filePreview} style={{width: "100%"}}/>
    const previewVideo = <video width="100%" controls><source src={filePreview}/></video>
    const previewAudio = <audio controls className="previewAudio" src={filePreview}></audio>
    const previewModel = <model-viewer loading="eager" camera-controls auto-rotate src={filePreview} style={{width: "100%", height: "100%"}}></model-viewer>

    const overrideEventDefaults = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const handleOndragOver = event => {
      event.preventDefault();
    }

    const handleOndrop = event => {
      //prevent the browser from opening the image
      event.preventDefault(); 
      event.stopPropagation(); 
      //let's grab the image file
      let imageFile = event.dataTransfer.files[0];
      beforeUpload(imageFile);
  }
    
    const uploadView = (
    <label className="custom-file-upload"
    onDrop={handleOndrop}
    onDragEnter={overrideEventDefaults}
    onDragLeave={overrideEventDefaults}
    onDragOver={handleOndragOver}
    >
      <Upload
        name="avatar"
        accept=".jpg,.png,.gif,.svg,.mp4,.webm,.mp3,.wav,.ogg,.glb,.glt"
        listType="picture-card"
        className="fileUpload"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onDrop={handleOndrop}
        onDragEnter={overrideEventDefaults}
        onDragLeave={overrideEventDefaults}
        onDragOver={handleOndragOver}
      >
      </Upload>
      {!filePreview ? uploadButton : previewFileType.includes("image") ? previewImg : previewFileType.includes("video") ? previewVideo : previewFileType.includes("audio") ? previewAudio : previewFileName.endsWith('.glb') ? previewModel : <div><img src="assets/img/uploaderror.png" className="uploadError" /><p className="errorMessage">File format not supported.</p></div>}
    </label>
  );

    const mintEnabled = file != null && !!nftName && networkSelected == true || royalty > 0 && royalty <= 100;

    const addPolygonNetwork = async () => {
      try {
        const provider = await injected.getProvider()
        // rpc request to switch chain to an ethereum compatible chain
        await provider.request({ method: 'wallet_addEthereumChain', params: [POLYGON_TESTNET_PARAMS] })
        setNetworkSelected(true) 
      } catch (e) {
        console.log('Failed to switch to Polygon chain, Please check your internet connect reconnect again')
        console.log(e)
      }
    }

    const addEthNetwork = async () => {
      try {
        const provider = await injected.getProvider()
        // rpc request to switch chain to an ethereum compatible chain
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{chainId: '0x4'}] })
        setNetworkSelected(true)
      } catch (e) {
        console.log('Failed to switch to Ethereum chain, Please check your internet connect reconnect again')
        console.log(e)
      }
    }

    const mintNFT = async ({image, name, description, percentage, payout}) => {
      // First we use the nft.storage client library to add the image and metadata to IPFS / Filecoin
      console.log(percentage)
      const client = new NFTStorage({ token: NFT_STORAGE_KEY });
      setStatus("Uploading to nft.storage...")
      const metadata = await client.store({
        name,
        description,
        image,
        percentage,
        payout
      });
     setStatus(`Upload complete! Minting token with metadata URI: ${metadata.url}`);

      // the returned metadata.url has the IPFS URI we want to add.
      // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `mintToken` function
      const metadataURI = metadata.url.replace(/^ipfs:\/\//, "");

      const web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.getAccounts()

      const networkId = await web3.eth.net.getId()
      console.log(networkId)

      const networkData = Nft.networks[networkId]
      console.log(networkData)
      
      console.log(percentage)
      console.log(payout)
      
      if(networkData) {
        const abi = Nft.abi;
        const address = networkData.address;
        setAddress(address);
        console.log(address)
        const contract = new web3.eth.Contract(abi, address)
         setContract(contract);
        console.log(contract)

        try{
          const tx = {
            // this could be provider.addresses[0] if it exists
            from: accounts[0],
            // target address, this could be a smart contract address
            to: address,
            gasPrice: web3.eth.gas_price,
            // this encodes the ABI of the method and the arguements
            data: contract.methods.mintToken(accounts[0], metadataURI, payout, percentage).encodeABI()
          };
          setStatus("Blockchain transaction sent, waiting confirmation...");

          console.log(tx)

          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx],
          });
          setTxHash(txHash);
          console.log(txHash);

          setStatus("View your transaction and your token id on block explorer.")
          setIsMinted(true)
          setShowAddress(true)
          console.log("NFT minted to: ", address)

          // web3.eth.getTransactionReceipt(txHash).then(function(data){
          // // let tokenId = null;
          // let transaction = data;
          // console.log(transaction)
          // let logs = transaction.logs;
          // console.log(logs);
          // // tokenId = web3.utils.hexToNumber(logs[0].topics[3])
          // // setStatus(`Minted token with ID: ${tokenId}`)
          // // setIsMinted(true)
          // // setShowAddress(true)
          // // return tokenId;
          // });
        } catch (error) {
          <p style={{color: 'white'}}>{setStatus("Blockchain transaction failed.")}</p>
        }
      }
    } 

    const getRoyaltyData = async() => {

      const web3 = new Web3(window.ethereum)
      const abi = Nft.abi;
      const networkId = await web3.eth.net.getId()
      const networkData = Nft.networks[networkId]
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address)


      const royaltyData = await contract.methods.royaltyInfo(1, 10000).call();
      console.log(royaltyData)
    }  

    useEffect(() => {
      getRoyaltyData();
    }, [])
  

  async function connect() {
    try{
        await activate(injected)
        console.log(injected)
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
    }
    catch(ex){
        console.log(ex);
    }
  }

  const startMinting = async () => {
    console.log(`minting nft with name ${nftName}`);
    setMinting(true);

    await connect()

    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
 
    signer.getAddress().then(accounts => {
      mintNFT({
        contract,
        provider,
        accounts,
        gasPrice,
        setStatus,
        name: nftName,
        image: file,
        description,
        percentage: royalty,
        payout: recipient
      }).then(newTokenId => {
        setMinting(false);
        console.log('minting complete');
        setTokenId(newTokenId);
      })
    });
  }

  const mintButton = (
    <Button type="primary" className='mint-button' disabled={!mintEnabled} onClick={startMinting}>
      {minting ? <LoadingOutlined/> : "Mint"}
    </Button>
  )

  const handleChange = (e) => {
    setShowWalletInput(true)
    setRoyalty(e.target.value)
    console.log(e.target.value)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(txHash);
  }

  const handleKeyPress = (e) => {
    const character = e.key;
    const characterNum = Number(character);
    if (character === 'Backspace') return;
    if (characterNum >= 0 && characterNum <= 9) {
      if (e.target.value && e.target.value.length) {
        return
      }
      else if (characterNum === 0) {
        e.preventDefault()
      }
    }
    else {
      e.preventDefault()
    }
    console.log(e.target.value)
  }

    return(
      <div>
        <div className="minter-form">
            <form>
                <h5>Create New NFTs</h5>
                <label className="mint-label">Image, Video, Audio, or 3D Model</label><br/>
                <label className="small-label">File types supported: [JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLT]</label>
                <br/>
                {uploadView}
                <br/>
                <label className="mint-label">Blockchain : </label>
                <br/>
                <div className='chain-options'>
                  <div className='eth'>
                       <input type="radio" id="eth-text" name="chain_options" value="4" onChange={() => addEthNetwork()} />
                       <label for="eth-text">Ethereum</label>
                  </div>
                  <div className='polygon'>
                      <input type="radio" id="polygon-text" name="chain_options" value="80001" onChange={() => addPolygonNetwork()}  />
                      <label for="polygon-text">Polygon</label>
                  </div>
                </div>
                <label className="mint-label">Name : </label>
                <br/>
                <input
                    type="text"
                    className="input-text form-control my-2"
                    placeholder="Nft Name"
                    onChange={e => {setNftName(e.target.value)}}
                />
                <label className="mint-label">Description : </label>
                <textarea
                    className="/*minter-form-textarea*/ minter-textarea form-control my-2"
                    placeholder="Provide a detailed explanation of your item"
                    rows={10}
                    defaultValue=""
                    onChange={e => {setDescription(e.target.value)}}
                />
                <label className='mint-label'>Creator Earnings : </label><br/>
                <label className='small-label'>Percentage fee</label><br/>
                <input type="number" className='royalty-input' placeholder='e.g. 1, 3, 5, 10...' onKeyDown={handleKeyPress} onWheel={(e) => e.target.blur()} onChange={(e) => handleChange(e)}></input>
                {royalty > 100 ? <p className='percentage-error'>Total percentage cannot exceed 100%</p> : null}
                {
                  showWalletInput == true && royalty > 0 && royalty <= 100 ? 
                  (<><label className='mint-label'>Your payout wallet address: </label><br />
                  <input type="text" className='royalty-input' placeholder='Please enter an address, e.g. 0x2bc5...' onChange={(e) => {setRecipient(e.target.value)}}></input>
                  </>)
                  : null
                }
                <br/><br/>
                {mintButton}
            </form>
            <br/>
            <p style={{color: 'white'}}>{status}</p>
            <br/>
            <div className='hash-container' style={{position: 'center', color: 'white'}}>
              {showAddress ? <div style={{width: '280px'}}>Copy Transaction Hash: </div> : null}     
              {showAddress ? <button className="hash-holder" onClick={copy} style={{color: 'black'}}>{txHash.substring(0,6) + "..." + txHash.slice(txHash.length - 4)}</button>  : null}
            </div>
            <br/>
            {/* {isMinted ? <Link to="/NFTViewer" className='view-nft-link'>View your NFT</Link> : null} */}
        </div>
        </div>
    )
}
export default Minter






