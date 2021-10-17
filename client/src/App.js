import React from "react";
import HomePage from "./pages/home_page/HomePage";
import PollPage from "./pages/poll_page/PollPage";
import Navbar from "./component/navbar/Navbar";
import Loading from "./component/utils/loading/Loading";
import { useConnection } from "./component/ConnectionProvider";
import SwitchNetwork from "./component/SwitchNetwork";

function App() {

  const { connectionState } = useConnection();

  const { web3, poll, errors } = connectionState;

  // Mostly due to wrong network
  if (errors) {
    console.log(errors);
    return <SwitchNetwork />;
  }

  // Loading animation while webpage loads contract data
  if (!web3) {
    return <Loading page="app" />;
  }

  return (
    <div>
      <Navbar />
      {/* If poll object from global state contains a poll's data, load PollPage else HomePage */}
      {poll === 'Home' ?
        <HomePage /> :
        <PollPage />
      }
    </div>
  );

}

export default App;
