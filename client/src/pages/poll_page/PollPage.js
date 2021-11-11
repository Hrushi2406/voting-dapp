import React, { useEffect, useState } from "react";
import { useConnection } from "../../component/ConnectionProvider";
import ConnectOverlay from "../../component/ConnectOverlay";
import formatError from "../../component/format_error";
import { Box } from "../../component/utils/Box";
import Loading from "../../component/utils/loading/Loading";
import Poll from "../../contracts/Poll.json";
import "./poll_page.scss";
import { useNavigate, useNavigationType } from "react-router-dom";

function PollPage() {
  const { connectionState, setConnectionState } = useConnection();
  const { web3, accounts, poll } = connectionState;
  const navigate = useNavigate();

  // Contract instance
  const [polc, setpolc] = useState(null);
  const [error, seterror] = useState({ vote: null, announce: null });
  const [isLoading, setLoading] = useState(false);
  const [resultList, setresultList] = useState([]);

  // To avoid sending multiple transactions while one is already sent
  const [isTransaction, setTransaction] = useState(false);

  //Currently Selected Option
  const [pollData, setPollData] = useState(poll);
  const [voteOption, setvoteOption] = useState(null);

  // Only to fetch list of options. Rest of the data comes from HomePage overview
  async function fetchData() {
    const pollContract = await new web3.eth.Contract(
      Poll.abi,
      poll.pollAddress
    );

    setpolc(pollContract);

    if (pollContract != null) {
      setLoading(true);

      if (!poll.isResultAnnounced) {
        // Set options
        let tempList = [];
        for (let i = 0; i < poll.nOptions; i++) {
          let option = await pollContract.methods.getOption(i).call();
          tempList.push(option);
        }

        poll.optionList = tempList;
        setPollData(poll);
      } else {
        // Set results
        let tempList = [];
        for (let i = 0; i < poll.nOptions; i++) {
          let option = await pollContract.methods.results(i).call();
          tempList.push(option);
        }

        // Get winner
        const winner = await pollContract.methods.getWinner().call();

        poll.winner = winner.name;
        poll.optionList = tempList;

        const list = poll.optionList.sort((a, b) =>
          a.count > b.count ? -1 : 1
        );
        setresultList(list);
        setPollData(poll);
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetch only optionList when coming from HomePage.
    // If coming from AddOverlay, all the information is already there
    if (!poll.optionList) {
      fetchData();
    }
  }, []);

  // Vote
  const handleVote = async () => {
    seterror({});
    if (voteOption == null) {
      seterror({ vote: "Please select an option" });
      return;
    }
    try {
      // To avoid sending multiple transactions
      if (!isTransaction) {
        setTransaction(true);

        await polc.methods.vote(voteOption).send({ from: accounts[0] });

        setConnectionState({ ...connectionState, poll: { ...poll, hasUserVoted: true, totalVotes: poll.totalVotes + 1 } });

        setTransaction(false);
      }
    } catch (error) {
      setTransaction(false);
      console.log("Error", formatError(error));
      seterror({ vote: formatError(error) });
    }
  };

  // Announce Result
  const handleAnnounce = async () => {
    seterror({});
    if (poll.totalVotes == 0) {
      seterror({ announce: "No one has voted yet" });
      return;
    }
    try {
      // To avoid sending multiple transactions
      if (!isTransaction) {
        setTransaction(true);

        const transaction = await polc.methods
          .announceResult()
          .send({ from: accounts[0] });

        const event = transaction.events.ResultAnnounced.returnValues;

        //TODO: show snackbar
        console.log(
          "Winner is " +
          event.winnerOption.name +
          " with " +
          event.winnerOption.count +
          " votes"
        );
        // setConnectionState({ ...connectionState, poll: { ...poll, isResultAnnounced: true } });
        poll.isResultAnnounced = true;

        let tempList = [];
        for (let i = 0; i < poll.nOptions; i++) {
          let option = await polc.methods.results(i).call();
          tempList.push(option);
        }

        // Get winner
        const winner = await polc.methods.getWinner().call();

        poll.winner = winner.name;
        poll.optionList = tempList;

        const list = poll.optionList.sort((a, b) =>
          a.count > b.count ? -1 : 1
        );
        setresultList(list);
        setPollData(poll);

        setTransaction(false);
      }
    } catch (error) {
      setTransaction(false);
      console.log("Error", formatError(error));
      seterror({ announce: formatError(error) });
    }
  };

  if (!web3 || isLoading) {
    return <Loading page="poll" />;
  }

  return (
    <div className="container">
      {/* If a transaction is already sent */}
      {isTransaction && (
        <div className="blur-bg" style={{ zIndex: 3 }}>
          <Loading />
        </div>
      )}
      {/* If not connected to metamask */}
      {accounts.length === 0 && <ConnectOverlay />}

      <Box height="40" />

      <p
        className="text-btn"
        onClick={() => {
          navigate("/", { replace: true });
        }}
      >
        ← Back to Home
      </p>

      <Box height="20" />

      <div className="space-between">
        <h2 className="heading">{pollData.title}</h2>
        <p className="creator">Created by {pollData._owner}</p>
      </div>

      <Box height="10" />

      <p className="description">{pollData.description}</p>

      <Box height="20" />
      {!pollData.isResultAnnounced ? (
        <div>
          <div className="options-grid">
            {pollData.optionList &&
              pollData.optionList.map((name, index) => (
                <div
                  key={index}
                  className={
                    voteOption === index
                      ? "options-div selected"
                      : "options-div clickable"
                  }
                  onClick={() => setvoteOption(index)}
                >
                  {name}
                </div>
              ))}
          </div>

          <Box height="40" />
          <div className="flex">
            <button
              className="clickable btn "
              disabled={voteOption == null || poll.hasUserVoted}
              onClick={handleVote}
            >
              {poll.hasUserVoted ? "Already Voted" : "Vote"}
            </button>

            {accounts.length > 0 && pollData._owner === accounts[0] && (
              <button className="clickable btn " onClick={handleAnnounce}>
                Announce
              </button>
            )}
          </div>

          <Box height="10" />
          {error.vote && (
            <div className="error-field " style={{ textAlign: "center" }}>
              {error.vote}
            </div>
          )}

          <Box height="30" />

          <Box height="10" />
          {error.announce && (
            <div className="error-field " style={{ textAlign: "center" }}>
              {error.announce}
            </div>
          )}
        </div>
      ) : (
        <React.Fragment>
          <h6 className="winner-text">Winner is {poll.winner}</h6>
          <Box height="20" />
          <div className="results-grid">
            {pollData.optionList &&
              resultList.map((option, idx) => (
                <div className="result-card" key={idx}>
                  <h1>{idx + 1}</h1>
                  <Box height="30" />
                  <div className="space-between">
                    <p>{option.name}</p>
                    <h6>{option.count} Votes</h6>
                  </div>
                </div>
              ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default PollPage;
