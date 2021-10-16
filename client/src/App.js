import React from "react";
import HomePage from "./pages/home_page/HomePage";
import PollPage from "./pages/poll_page/PollPage";
import Navbar from "./component/navbar/Navbar";
import Loading from "./component/utils/loading/Loading";
import { useConnection } from "./component/ConnectionProvider";

function App() {

  const { connectionState } = useConnection();

  const { web3, poll, errors } = connectionState;

  if (errors) {
    alert(errors);
    return <div></div>;
  }

  if (!web3) {
    return <Loading page="app" />;
  }

  return (
    <div>
      <Navbar />
      {poll === 'Home' ?
        <HomePage /> :
        <PollPage />
      }
    </div>
  );

}

export default App;
