import React, { useEffect, useState } from 'react';
import { useConnection } from '../ConnectionProvider';
import ConnectOverlay from '../connect_overlay/ConnectOverlay';
import { Box } from '../utils/Box';
import './add_overlay.scss';
import './textfield.scss';

function AddOverlay(props) {
    const { connectionState, setConnectionState } = useConnection();
    const { accounts, appContract } = connectionState;
    const { openMenu, setOpenMenu } = props;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [optionList, setOptionList] = useState(["Yay", "Nah"]);
    const [error, setError] = useState({ title: null, description: null, optionIndex: null });

    useEffect(() => {
        // Set default values for options
        Array.from(document.getElementsByClassName('option-field')).map((element, idx) => {
            element.setAttribute('value', optionList[idx]);
            return null;
        });
    }, []);

    const handleCreate = async () => {
        var t = false, d = false, o = -1;
        if (title === "") {
            t = true;
        }
        if (description === "") {
            d = true;
        }
        for (var i = 0; i < optionList.length; i++) {
            if (optionList[i] === "") {
                o = i;
                break;
            }
        }
        if (t || d || o != -1) {
            setError({ title: t === true && 'Title Empty', description: d === true && 'Description Empty', optionIndex: o });
            return;
        }

        try {
            // Deploy poll contract
            const transaction = await appContract.methods.createPoll(title, description, optionList).send({ from: accounts[0] });

            // Access logs from transaction
            const event = transaction.events.PollCreated.returnValues;

            //TODO: show snackbar 
            console.log('Poll contract deployed at ' + event.pollAddress + ' by ' + event.ownerAddress);

            // Close Add Poll overlay
            setOpenMenu(false);

            // Redirect to that poll page
            setConnectionState({
                ...connectionState,
                poll: {
                    pollAddress: event.pollAddress,
                    title,
                    description,
                    _owner: accounts[0],
                    nOptions: optionList.length,
                    totalVotes: 0,
                    hasUserVoted: false,
                    isResultAnnounced: false,
                    optionList: optionList
                }
            });

        } catch (err) {
            console.log('Error while creating poll contract', err);
        }
    }

    return (
        <div>
            <div className="blur-overlay"></div>
            <div className="add-poll">
                {openMenu && accounts.length === 0 && <ConnectOverlay />}

                <Box height="100" />

                <h2 className="heading">Add Poll</h2>

                <Box height="30" />
                <div className="textfield">
                    <p className="label">Title</p>
                    <input
                        type="text"
                        id="title-field"
                        className="textbox"
                        placeholder="Poll Title"
                        onChange={(event) => { setTitle(event.target.value); setError({ ...error, title: null }) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleCreate() } }} required
                    />
                </div>
                {error.title && <div className="error-field">{error.title}</div>}

                <Box height="10" />

                <div className="textfield">
                    <p className="label">Description</p>
                    <textarea
                        className="textarea"
                        placeholder="What's this poll about ?"
                        onChange={(event) => { setDescription(event.target.value); setError({ ...error, description: null }) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleCreate() } }} required
                    />
                </div>
                {error.description && <div className="error-field">{error.description}</div>}


                <Box height="10" />

                <p className="label">Options</p>

                <Box height="5" />

                {optionList.map((element, idx) =>
                    <div key={idx}>
                        <div className="option-flex">
                            <div className="option-no">{String.fromCharCode(65 + idx)}</div>
                            <input
                                className="option-field"
                                type="text"
                                placeholder={"Option " + (idx + 1)}
                                onChange={(event) => {
                                    let tempList = optionList;
                                    tempList[idx] = event.target.value
                                    setOptionList(tempList);
                                    setError({ ...error, optionIndex: error.optionIndex === idx ? -1 : error.optionIndex })
                                }}
                                required
                            />
                            {/* {console.log(idx, error)} */}
                            {<div className='delete-option' onClick={() => {
                                setOptionList(optionList.splice(idx, 1));
                                console.log('After deleting ', idx, ' ', optionList)
                            }}>X</div>}
                            {/* {error.optionIndex === idx ? <div className="error-field">Empty Option</div> : '....F'} */}
                        </div>

                        {idx === (optionList.length - 1) &&
                            <div className="option-flex disabled">
                                <div className="option-no">{String.fromCharCode(65 + idx + 1)}</div>
                                <input
                                    className="option-field-d"
                                    type="text"
                                    placeholder={"Add Option"}
                                    onClick={() => {
                                        console.log('clicked')
                                        let tempList = optionList;
                                        tempList.push('Option ' + (optionList.length + 1));
                                        setOptionList(tempList);
                                        console.log(optionList);
                                    }}
                                />
                            </div>
                        }
                    </div>
                )}

                <Box height="20" />

                <button className="clickable" onClick={handleCreate}>Create</button>
            </div>
        </div>
    );
}

export default AddOverlay;
