import React, { useEffect, useState } from 'react';
import formatError from '../../component/format_error';
import Poll from '../../contracts/Poll.json';
import './poll.scss';

function PollPage(props) {
    const { web3, address, accounts } = props;

    let pollContract = null;
    const [error, seterror] = useState("");
    const [isLoading, setLoading] = useState(false);

    // Program data
    const [programData, setProgramData] = useState({
        title: "",
        description: "",
        nOptions: 0,
        optionList: [],
    });
    //Currently Selected Option
    const [voteOption, setvoteOption] = useState();

    async function fetchData() {
        pollContract = await new web3.eth.Contract(Poll.abi, address);

        if (pollContract != null) {
            setLoading(true);
            // Set Title and Description
            const title = await pollContract.methods.title().call();
            const description = await pollContract.methods.description().call();
            const nOptions = await pollContract.methods.nOptions().call();
            const maxVotes = await pollContract.methods.maxVotes().call();
            const maxVotesIndex = await pollContract.methods.maxVotesIndex().call();

            // Set options
            let tempList = [];
            for (let i = 0; i < nOptions; i++) {
                let option = await pollContract.methods.optionCounts(i).call();
                option.index = i;
                tempList.push(option);
            }

            console.log(
                "MAX VOTES " + maxVotes + " FOR " + tempList[maxVotesIndex].name
            );

            setProgramData({
                title: title,
                description: description,
                nOptions: nOptions,
                optionList: tempList,
            });
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [pollContract]);

    const handleSubmit = async () => {
        try {
            if (await checkIfUserAlreadyVoted()) {
                seterror("User has already voted for this program");
                setTimeout(() => seterror(""), 2500);
                return;
            }

            let result = await pollContract.methods
                .vote(voteOption)
                .send({ from: accounts[0] });

            console.log("Result", result);
        } catch (error) {
            console.log("Error", formatError(error));
            seterror(formatError(error));
        }
    };

    const checkIfUserAlreadyVoted = async () => {
        if (!web3) return;
        try {
            return await pollContract.methods.voters(accounts[0]).call();
        } catch (error) {
            console.log("Error ", error);
        }
    };

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    if (isLoading) {
        return <div>Loading contract data</div>;
    }
    return (
        <div className="container">
            <h2>{programData.title}</h2>
            <h5>{programData.description}</h5>
            <h5>Voting account {accounts[0]}</h5>

            <div className="spacer"></div>

            <div className="options-parent">
                {programData.optionList.map((option, index) => (
                    <div
                        key={index}
                        className={
                            voteOption === index ? "options-div selected" : "options-div"
                        }
                        onClick={() => setvoteOption(index)}
                    >
                        <h5>{option.name}</h5>
                    </div>
                ))}
            </div>

            <div className="spacer"></div>

            <button className="clickable " onClick={handleSubmit}>
                Vote
            </button>

            <h4 style={{ color: "red" }}>{error}</h4>
        </div>
    );
}

export default PollPage;

