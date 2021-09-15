import React, { useState } from "react";
import Voting from "./contracts/Voting.json";
import "./App.css";
import useContract from "./component/use_contract";
import formateError from "./component/format_error";

function App() {
  const { web3, contract, accounts } = useContract(Voting);

  const [error, seterror] = useState("");

  //CURRENTLY SELECTED OPTION
  const [voteOption, setvoteOption] = useState();

  const handleSubmit = async () => {
    try {
      if (checkIfUserAlreadyVoted()) {
        seterror("User has already voted for this program");
        setTimeout(() => seterror(""), 2500);
        return;
      }

      let result = await contract.methods
        .vote(voteOption === 0)
        .send({ from: accounts[0] });

      console.log("Result", result);
    } catch (error) {
      formateError(error);
    }
  };

  const checkIfUserAlreadyVoted = async () => {
    if (!web3) return;
    try {
      return await contract.methods.voters(accounts[0]).call();
    } catch (error) {
      console.log("Error ", error);
    }
  };

  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h2>Title of Voting</h2>
      <h5>Voting account {accounts[0]}</h5>

      <div className="spacer"></div>

      <div className="options-parent">
        <div
          className={voteOption === 0 ? "options-div selected" : "options-div"}
          onClick={() => setvoteOption(0)}
        >
          <h5>Option 1</h5>
        </div>

        <div
          className={voteOption === 1 ? "options-div selected" : "options-div"}
          onClick={() => setvoteOption(1)}
        >
          <h5>Option 2</h5>
        </div>
      </div>

      <div className="spacer"></div>

      <button className="btn " onClick={handleSubmit}>
        Vote
      </button>

      <h4 style={{ color: "red" }}>{error}</h4>
    </div>
  );
}

export default App;

// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await useWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.runExample);
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`
//       );
//       console.error(error);
//     }
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>Good to Go!</h1>
//         <p>Your Truffle Box is installed and ready.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 42</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }

// export default App;
