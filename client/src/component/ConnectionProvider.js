import React, { useContext, useEffect, useState } from 'react';
import Application from "../contracts/Application.json";
import Web3 from "web3";

const ConnectionContext = React.createContext();

export function useConnection() {
    return useContext(ConnectionContext);
}

export function ConnectionProvider(props) {
    const [connectionState, setConnectionState] = useState({
        web3: null,
        networkName: 'Localhost',
        accounts: [],
        appContract: null,
        errors: null,
        poll: 'Home' // Not a part of connection but rather used for changing page
    });

    const initiate = async () => {
        if (connectionState.web3) return;

        try {
            // Use local web3 object by default before user connects metamask
            const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
            const web3 = new Web3(provider);

            const appContract = await createAppInstance(web3);

            setConnectionState({ ...connectionState, web3, appContract, networkName: 'Localhost' });
        } catch (e) {
            console.log("useConnection Error ", e);
            setConnectionState({ ...connectionState, errors: e });
        }
    };

    async function createAppInstance(web3) {
        if (web3) {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Application.networks[networkId];

            if (deployedNetwork) {
                const newInstance = new web3.eth.Contract(
                    Application.abi,
                    deployedNetwork.address
                );

                return newInstance;
            } else {
                throw "Use Correct Network";
            }
        }
    }

    useEffect(() => {
        initiate();

        // Detect metamask account change
        window.ethereum.on('accountsChanged', async function (_accounts) {
            const web3 = await getWeb3();
            const appContract = await createAppInstance(web3);
            setConnectionState({ ...connectionState, web3, accounts: _accounts, appContract });
        })

        // Detect metamask network change
        window.ethereum.on('networkChanged', function (networkId) {
            window.location.reload();
        });
    }, []);

    const connectWallet = async () => {
        try {
            // Get web3 injected by metamask
            const web3 = await getWeb3();

            const networkId = await web3.eth.net.getId();

            let networkName = "Private";

            // Set networkName for navbar
            switch (networkId) {
                case 1:
                    networkName = 'Mainnet';
                    break
                case 2:
                    networkName = 'Morden';
                    break
                case 3:
                    networkName = 'Ropsten';
                    break
                case 4:
                    networkName = 'Rinkeby';
                    break
                case 5:
                    networkName = 'Goerli';
                    break
                case 42:
                    networkName = 'Kovan';
                    break
                case 5777:
                    networkName = 'Localhost 7545';
                    break
                default:
                    networkName = 'Unknown';
            }

            const accounts = await web3.eth.getAccounts();

            const appContract = await createAppInstance(web3);

            setConnectionState({ ...connectionState, web3, networkName, accounts, appContract });
        } catch (e) {
            console.log("useConnection Error ", e);
            setConnectionState({ ...connectionState, errors: e });
        }
    }

    // Method for switching accounts programmatically
    const switchNetwork = async () => {
        // await window.ethereum.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: 1337 }],
        // });
    }

    return (
        <>
            <ConnectionContext.Provider value={{ connectionState, setConnectionState, connectWallet, switchNetwork }}>
                {props.children}
            </ConnectionContext.Provider>
        </>
    );
}

const getWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Accounts now exposed
            return web3;
        } catch (error) {
            throw error;
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        return web3;
    }
    // Fallback to localhost; use dev console port by default...
    else {
        const provider = new Web3.providers.HttpProvider(
            "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        return web3;
    }
}
