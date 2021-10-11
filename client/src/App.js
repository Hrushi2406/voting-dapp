import React, { useState, useEffect } from "react";
import useContract from "./component/use_contract";
import HomePage from "./pages/home/Home";
import PollPage from "./pages/poll/Poll";
import Navbar from "./component/navbar/Navbar";

function App() {
  const { web3, accounts, appContract, errors } = useContract();

  // Contract address for poll page
  const [address, setAddress] = useState('Home');

  if (errors) {
    alert(errors);
    return <div></div>;
  }

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div>
      <Navbar web3={web3} accounts={accounts} appContract={appContract} setAddress={setAddress} />
      {address == 'Home' ?
        <HomePage web3={web3} accounts={accounts} appContract={appContract} setAddress={setAddress} /> :
        <PollPage web3={web3} accounts={accounts} address={address} setAddress={setAddress} />
      }
    </div>
  );

}

export default App;
