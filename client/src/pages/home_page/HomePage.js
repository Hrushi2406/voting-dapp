import React, { useEffect, useState } from 'react';
import Chip from '../../component/utils/chip/Chip';
import { Box } from '../../component/utils/Box';
import './home_page.scss';
import Loading from '../../component/utils/loading/Loading';
import { useConnection } from '../../component/ConnectionProvider';

function HomePage() {
    const { connectionState, setConnectionState } = useConnection();
    const { accounts, appContract } = connectionState;

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
                const poll = await appContract.methods.getPollOverview(i, accounts.length > 0 ? accounts[0] : "0x0000000000000000000000000000000000000000").call();
                poll.index = i;
                tempList.push(poll);
            }
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

            <div className='heading'>Here are all the polls</div>

            <Box height="40" />

            {pollList.length !== 0 ?
                <div className="poll-grid">
                    {pollList.map((poll, idx) =>
                        <div key={idx} className="poll-card clickable" onClick={() => { setConnectionState({ ...connectionState, poll: poll }) }}>
                            <h3 className="title">{poll.title}</h3>
                            <p className="description">{poll.description}</p>
                            <div className="chip-flex">
                                {/* <Chip bgColor='var(--primary)' textColor="white" content={poll._owner} />
                                <Box width="10" /> */}
                                <Chip bgColor={poll.isResultAnnounced ? 'red' : 'green'} textColor="white" content={poll.isResultAnnounced ? 'Ended' : 'Live'} />
                            </div>
                            <p className="description">{poll.totalVotes} have voted</p>
                            {poll.hasUserVoted ? <p className="voted">You have already voted</p> : poll.isResultAnnounced ? <p className="declared">Results declared</p> : <div className="vote-div">Vote</div>}
                        </div>
                    )}
                </div>
                : <div className="no-polls">No polls</div>}

            <Box height="30" />
        </div>
    );
}

export default HomePage;
