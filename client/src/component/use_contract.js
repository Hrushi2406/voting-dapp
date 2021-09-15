import { useState, useEffect } from "react";
import useWeb3, { getWeb3 } from "./use_web3";

const useContract = (contract) => {
  const [web3, setweb3] = useState();

  const [instance, setinstance] = useState();

  const initiate = async () => {
    let a = await getWeb3();

    setweb3(a);
    createInstance();
  };

  console.log("Something");

  useEffect(() => {
    initiate();
    // if (!instance) createInstance();
  }, []);

  async function createInstance() {
    if (web3) {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = contract.networks[networkId];

      const newInstance = new web3.eth.Contract(
        contract.abi,
        deployedNetwork && deployedNetwork.address
      );

      setinstance(newInstance);
    }
  }

  return { web3, instance };
};

export default useContract;
