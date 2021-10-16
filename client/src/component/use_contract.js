import { useState, useEffect } from "react";
import { getWeb3 } from "./use_web3";
import Application from "../contracts/Application.json";

const useContract = () => {
  const initialState = {
    web3: null,
    accounts: null,
    appContract: null,
    errors: null,
  };

  const [state, setstate] = useState(initialState);

  const initiate = async () => {
    if (state.web3) return;

    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const appContract = await createAppInstance(web3);

      setstate({ ...state, web3, accounts, appContract });
    } catch (e) {
      console.log("useContract Error ", e);
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

export default useContract;
