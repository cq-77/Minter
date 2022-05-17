import React from 'react';
import { useState, useEffect} from 'react';
import { injected } from '../connectors';
import { useWeb3React } from '@web3-react/core';
import { Dropdown } from "reactstrap";

const Header = (props) => {

    const { active, account, activate, deactivate } = useWeb3React();
    const [isConnecting, setIsConnecting] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    useEffect(() => {
        injected
          .isAuthorized()
          .then((isAuthorized) => {
            if (isAuthorized && !active) {
                // activate(injected)
                connect()
            }
          })
      }, [])

    async function connect() {
        try{
            await activate(injected)
        }
        catch(ex){
            console.log(ex);
        }
    }

    async function disconnect() {
        try{
            deactivate();
        }
        catch(ex) {
            console.log(ex);
        }
    }

    const detectProvider = () => {
        let provider;
        if (window.ethereum) {
            provider = window.ethereum;
        }
        else if (window.web3) {
            provider = window.web3.currentProvider;
        }
        else {
            window.alert("No Ethereum browser detected! Check out MetaMask.");
        }
            return provider;
    };
    
    const onLoginHandler = async () => {
        const provider = detectProvider();

        if (provider) {
            if(provider !== window.ethereum) {
                 console.error("Not window.ethereum provider. Do you have multiple wallets installed ?");
            }
            setIsConnecting(true);
            await provider.request({
                method: "eth_requestAccounts",
            });
            setIsConnecting(false);
            props.onLogin(provider);
        } 
    };
    
       const toggle1 = () => {
        setDropdownOpen1(prevState => (
          !prevState
        ));
      }

      const onMouseEnter = () => {
        setDropdownOpen1( true );
      }
    
      const onMouseLeave = () => {
        setDropdownOpen1( false );
      }

        return(
            <div>
                <header className='stickyHeader'>
                    <div onClick={onLoginHandler && connect} className="login-btn" type="button">
                         {active ? <span onClick={disconnect}>Disconnect</span> : !isConnecting && <span>Connect</span> }
                    </div>
                    <Dropdown
                        className="d-inline-block"
                        onMouseOver={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        isOpen={dropdownOpen1}
                        toggle={toggle1}
                        style={{ position: 'relative', float: 'right' }}
                        >
                        {active ? <div className="accountNumber"><span>{account}</span></div> : null}
                    </Dropdown>
                </header>
            </div>
        )
}
export default Header