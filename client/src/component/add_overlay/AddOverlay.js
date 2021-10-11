import React, { useEffect, useState } from 'react';
import { Box } from '../utils/Box';
import './add_overlay.scss';
import './textfield.scss';

function AddOverlay(props) {
    const { web3, accounts, appContract, setAddress, setOpenMenu } = props;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["Yay", "Nah"]);

    useEffect(() => {
        // Set default values for options
        Array.from(document.getElementsByClassName('option-field')).map((element, idx) => {
            element.setAttribute('value', options[idx]);
        });
    }, []);

    const handleCreate = async () => {
        if (title === "") {
            alert('Title Empty');
            return;
        }
        if (description === "") {
            alert('Description Empty');
            return;
        }
        for (var option in options) {
            if (option === "") {
                alert('Option Empty');
                return;
            }
        }
        // try {
        // Deploy poll contract
        const transaction = await appContract.methods.createPoll(title, description, options).send({ from: accounts[0] });

        // Access logs from transaction
        const event = transaction.events.PollCreated.returnValues;

        //TODO: show snackbar 
        console.log('Poll contract deployed at ' + event.pollAddress + ' by ' + event.ownerAddress);

        // Close Add Poll overlay
        setOpenMenu(false);

        // Redirect to that poll page
        setAddress(event.pollAddress);

        // } catch (err) {
        //     console.log('Error while creating poll contract', err);
        // }
    }

    return (
        <div>
            <div className="blur-overlay"></div>
            <div className="add-poll">
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
                        onChange={(event) => { setTitle(event.target.value) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleCreate() } }} required
                    />
                </div>

                <Box height="10" />

                <div className="textfield">
                    <p className="label">Description</p>
                    <textarea
                        className="textarea"
                        placeholder="What's this poll about ?"
                        onChange={(event) => { setDescription(event.target.value) }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { handleCreate() } }} required
                    />
                </div>

                <Box height="10" />

                <p className="label">Options</p>

                <Box height="5" />

                {options.map((element, idx) =>
                    <div key={idx}>
                        <div className="option-flex">
                            <div className="option-no">{String.fromCharCode(65 + idx)}</div>
                            <input
                                className="option-field"
                                type="text"
                                placeholder={"Option " + (idx + 1)}
                                onChange={(event) => {
                                    let tempList = options;
                                    tempList[idx] = event.target.value
                                    setOptions(tempList);
                                }}
                                required
                            />
                        </div>
                        <Box height="10" />
                    </div>
                )}

                <Box height="20" />

                <button className="clickable" onClick={handleCreate}>Create</button>
            </div>
        </div>
    );
}

export default AddOverlay;
