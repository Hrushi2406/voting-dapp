import { useState, useEffect } from "react";
import Application from "../contracts/Application.json";
import Web3 from "web3";

export const getWeb3 = async () => {
  // new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  // window.addEventListener("load", async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    // console.log("DAPP BROWSER");
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
    // console.log("Injected web3 detected.");
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
  // });
}


//Web 3 Hook
const useWeb3 = () => {
  const initialState = {
    web_3: null,
    appContract: null,
    errors: null,
  };

  const [state, setstate] = useState(initialState);

  const initiate = async () => {
    if (state.web_3) return state;

    try {
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:7545"
      );
      const web3 = new Web3(provider);

      const appContract = await createAppInstance(web3);

      setstate({ ...state, web_3: web3, appContract });
    } catch (e) {
      console.log("useWeb3 Error ", e);
      setstate({ ...state, errors: e });
    }
  };

  useEffect(() => {
    initiate();
  });

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

  return state;
};

export default useWeb3;
