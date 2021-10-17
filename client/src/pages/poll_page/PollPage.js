import React, { useEffect, useState } from 'react';
import { useConnection } from '../../component/ConnectionProvider';
import ConnectOverlay from '../../component/ConnectOverlay';
import formatError from '../../component/format_error';
import { Box } from '../../component/utils/Box';
import Loading from '../../component/utils/loading/Loading';
import Poll from '../../contracts/Poll.json';
import './poll_page.scss';

function PollPage() {
    const { connectionState, setConnectionState } = useConnection();
    const { web3, accounts, poll } = connectionState;

    // Contract instance
    const [polc, setpolc] = useState(null);
    const [error, seterror] = useState({ vote: null, announce: null });
    const [isLoading, setLoading] = useState(false);

    // To avoid sending multiple transactions while one is already sent
    const [isTransaction, setTransaction] = useState(false);

    //Currently Selected Option
    const [pollData, setPollData] = useState(poll);
    const [voteOption, setvoteOption] = useState(null);

    // Only to fetch list of options. Rest of the data comes from HomePage overview
    async function fetchData() {
        const pollContract = await new web3.eth.Contract(Poll.abi, poll.pollAddress);
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
                console.log('1')
                let tempList = [];
                for (let i = 0; i < poll.nOptions; i++) {
                    let option = await pollContract.methods.results(i).call();
                    tempList.push(option);
                }
                console.log('2')

                // Get winner
                const winner = await pollContract.methods.getWinner().call();
                console.log('3')

                poll.winner = winner;
                poll.optionList = tempList;
                console.log(poll.optionList)
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
        seterror({})
        if (voteOption == null) {
            seterror({ vote: "Please select an option" });
            return;
        }
        try {
            // To avoid sending multiple transactions
            if (!isTransaction) {
                setTransaction(true);

                await polc.methods
                    .vote(voteOption)
                    .send({ from: accounts[0] });

                setConnectionState({ ...connectionState, poll: 'Home' });

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
        seterror({})
        try {
            // To avoid sending multiple transactions
            if (!isTransaction) {
                setTransaction(true);

                const transaction = await polc.methods
                    .announceResult()
                    .send({ from: accounts[0] });

                const event = transaction.events.ResultAnnounced.returnValues;

                //TODO: show snackbar 
                console.log('Winner is ' + event.winnerOption.name + ' with ' + event.winnerOption.count + ' votes');

                setTransaction(false);
            }
        } catch (error) {
            setTransaction(false);
            console.log("Error", formatError(error));
            seterror({ announce: formatError(error) });
        }
    }

    if (!web3 || isLoading) {
        return <Loading page="poll" />;
    }

    return (
        <div className="container">
            {/* If a transaction is already sent */}
            {isTransaction && <div className="blur-bg" style={{ zIndex: 3 }}>
                <Loading />
            </div>}
            {/* If not connected to metamask */}
            {accounts.length === 0 && <ConnectOverlay />}

            <Box height="40" />

            <h2 className="heading">{pollData.title}</h2>

            <Box height="30" />

            <p className="description">{pollData.description}</p>

            <Box height="40" />
            {!pollData.isResultAnnounced ?
                <div>
                    <div className="options-parent">
                        {pollData.optionList && pollData.optionList.map((name, index) => (
                            <div
                                key={index}
                                className={
                                    voteOption === index ? "options-div selected" : "options-div clickable"
                                }
                                onClick={() => setvoteOption(index)}
                            >
                                {name}
                            </div>
                        ))}
                    </div>

                    <Box height="40" />

                    <button className="clickable " onClick={handleVote}>
                        Vote
                    </button>
                    {error.vote && <div className="error-field">{error.vote}</div>}

                    <Box height="30" />

                    {accounts.length > 0 && pollData._owner === accounts[0] &&
                        <button className="clickable " onClick={handleAnnounce}>
                            Announce
                        </button>
                    }
                    {error.announce && <div className="error-field">{error.announce}</div>}
                </div>
                : <div>
                    {pollData.optionList && pollData.optionList.map((option, idx) => <div key={idx}>
                        <p>{option.name}<span>{'    ' + option.count}</span></p>
                    </div>)}
                </div>}
        </div>
    );
}

export default PollPage;

