import { useState, useEffect } from "react";
import { getWeb3 } from "./use_web3";

const useContract = (contract) => {
  const initialState = {
    web3: null,
    accounts: null,
    contract: null,
  };

  const [state, setstate] = useState(initialState);

  const initiate = async () => {
    if (state.web3) return;

    const web3 = await getWeb3();

    const accounts = await web3.eth.getAccounts();

    const contract = await createInstance(web3);

    setstate({ ...state, web3, accounts, contract });
  };

  useEffect(() => {
    initiate();
  });

  async function createInstance(web3) {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = contract.networks[networkId];

      console.log(contract.networks);

      const newInstance = new web3.eth.Contract(
        contract.abi,
        deployedNetwork.address
      );

      return newInstance;
    }
  }

  return state;
};

export default useContract;
