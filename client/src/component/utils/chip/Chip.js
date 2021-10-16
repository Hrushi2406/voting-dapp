import React from 'react';
import './chip.scss'

function Chip(props) {
    const copyAddress = async () => {
        await navigator.clipboard.writeText(props.content);
        // TODO: show copied effect
        console.log('Async: Copying to clipboard was successful!');
    }

    return (
        <div onClick={copyAddress} style={{ backgroundColor: props.color }} className={"chip-container " + props.class}>
            <p className="chip-content">{props.content}</p>
        </div>
    );
}

export default Chip;