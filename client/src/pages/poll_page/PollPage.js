import React, { useEffect, useState } from 'react';
import { useConnection } from '../../component/ConnectionProvider';
import ConnectOverlay from '../../component/connect_overlay/ConnectOverlay';
import formatError from '../../component/format_error';
import { Box } from '../../component/utils/Box';
import Loading from '../../component/utils/loading/Loading';
import Poll from '../../contracts/Poll.json';
import './poll_page.scss';

function PollPage() {
    const { connectionState, setConnectionState } = useConnection();
    const { web3, accounts, poll } = connectionState;

    let pollContract = null;
    const [polc, setpolc] = useState(null);
    const [error, seterror] = useState("");
    const [isLoading, setLoading] = useState(false);

    //Currently Selected Option
    const [pollData, setPollData] = useState(poll);
    const [voteOption, setvoteOption] = useState();

    async function fetchData() {
        pollContract = await new web3.eth.Contract(Poll.abi, poll.pollAddress);
        setpolc(pollContract);

        if (pollContract != null) {
            setLoading(true);

            // const nOptions = await pollContract.methods.nOptions().call();

            // Set options
            let tempList = [];
            for (let i = 0; i < poll.nOptions; i++) {
                let option = await pollContract.methods.getOption(i).call();
                tempList.push(option);
            }

            poll.optionList = tempList;
            setPollData(poll);

            setLoading(false);
        }
    }

    useEffect(() => {
        if (!poll.optionList) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (!poll.optionList) {
            fetchData();
        }
    }, [accounts]);

    const handleVote = async () => {
        try {
            await polc.methods
                .vote(voteOption)
                .send({ from: accounts[0] });

            setConnectionState({ ...connectionState, poll: 'Home' });

        } catch (error) {
            console.log("Error", formatError(error));
            seterror(formatError(error));
        }
    };

    const handleAnnounce = async () => {
        try {
            const transaction = await polc.methods
                .announceResult()
                .send({ from: accounts[0] });

            console.log(transaction);

            const event = transaction.events.ResultAnnounced.returnValues;

            //TODO: show snackbar 
            console.log('Winner is ' + event.winnerOption.name + ' with ' + event.winnerOption.count + ' votes');

        } catch (error) {
            console.log("Error", formatError(error));
            seterror(formatError(error));
        }
    }

    if (!web3 || isLoading) {
        return <Loading page="poll" />;
    }

    return (
        <div className="container">
            {accounts.length === 0 && <ConnectOverlay />}

            <Box height="40" />

            <h2 className="heading">{pollData.title}</h2>

            <Box height="30" />

            <p className="description">{pollData.description}</p>

            <Box height="40" />

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

            <h4 style={{ color: "red" }}>{error}</h4>

            <Box height="30" />

            {accounts.length > 0 && pollData._owner === accounts[0] && <button className="clickable " onClick={handleAnnounce}>
                Announce
            </button>}
        </div>
    );
}

export default PollPage;

