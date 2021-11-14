import React, { useEffect, useState } from "react";
import Chip from "../../component/utils/chip/Chip";
import { Box } from "../../component/utils/Box";
import "./home_page.scss";
import Loading from "../../component/utils/loading/Loading";
import { useConnection } from "../../component/ConnectionProvider";
import { useNavigate } from "react-router-dom";
import StatusChip from "./components/status_chip";

function HomePage() {
  const { connectionState, setConnectionState } = useConnection();
  const { accounts, appContract } = connectionState;

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  // List of polls for home page
  const [pollList, setPollList] = useState([]);

  async function fetchData() {
    if (appContract != null) {
      setLoading(true);

      // Fetch number of polls
      const nPolls = await appContract.methods.nPolls().call();

      // Fetch all polls overview
      let tempList = [];
      for (let i = 0; i < nPolls; i++) {
        const poll = await appContract.methods
          .getPollOverview(
            i,
            accounts.length > 0
              ? accounts[0]
              : process.env.REACT_APP_RINKEBY_CONTRACT_ADDRESS
          )
          .call();
        poll.index = i;
        tempList.push(poll);
      }
      tempList = tempList.sort((a, b) => (a.isResultAnnounced ? 1 : -1));

      setPollList(tempList);

      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // On accounts changed Refetch
  useEffect(() => {
    fetchData();
  }, [accounts]);

  if (isLoading) {
    return <Loading page="home" />;
  }

  return (
    <div className="container">
      {/* {accounts !== undefined ? 'Hi ' + accounts[0] : 'Connect'} */}
      <Box height="40" />

      <div className="heading">All Polls </div>

      <Box height="40" />

      {pollList.length !== 0 ? (
        <div className="poll-grid">
          {pollList.map((poll, idx) => (
            <div
              key={idx}
              className="card-div clickable"
              onClick={() => {
                setConnectionState({ ...connectionState, poll: poll });
                setTimeout(() => {
                  navigate("/" + poll.index);
                }, 150);
              }}
            >
              <div className="space-between">
                <h4>{poll.title}</h4>
                <StatusChip
                  bgColor={poll.isResultAnnounced ? "red" : "green"}
                  text={poll.isResultAnnounced ? "Ended" : "Live"}
                />
              </div>
              <p>
                {poll.description.length >= 100
                  ? poll.description.slice(0, 100) + "..."
                  : poll.description}
              </p>
              <div className="space-between">
                <h6>{poll.totalVotes} people voted</h6>
                {poll.hasUserVoted ? (
                  <div className="voted-color"></div>
                ) : (
                  <React.Fragment></React.Fragment>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-polls">No polls</div>
      )}

      <Box height="30" />
    </div>
  );
}

export default HomePage;
