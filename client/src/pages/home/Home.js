import React, { useEffect, useState } from 'react';
import { Box } from '../../component/utils/Box';
import './home.scss';

function HomePage(props) {
    const { web3, accounts, appContract, setAddress } = props;

    const [isLoading, setLoading] = useState(false);

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
                const poll = await appContract.methods.getPollOverview(i, accounts[0]).call();
                tempList.push(poll);
            }
            setPollList(tempList);

            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [appContract]);

    if (isLoading) {
        return <div>Loading contract data</div>;
    }

    return (
        <div className="container">
            {/* {accounts !== undefined ? 'Hi ' + accounts[0] : 'Connect'} */}
            <Box height="40" />

            <div className='heading'>Here are all the polls</div>

            <Box height="30" />

            <div className="poll-grid">
                {pollList.map((poll, idx) =>
                    <div key={idx} className="poll-card clickable">
                        <h3>{poll.title}</h3>
                        <p>{poll.description}</p>
                        <p>{poll._owner}</p>
                        <p>{poll.isResultAnnounced.toString()}</p>
                        <p>{poll.totalVotes}</p>
                        <p>{poll.hasUserVoted.toString()}</p>
                    </div>
                )}
            </div>

            <Box height="30" />
        </div>
    );
}

export default HomePage;
