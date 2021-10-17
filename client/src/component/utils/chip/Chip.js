import React from 'react';
import './chip.scss'

function Chip(props) {
    const copyAddress = async () => {
        await navigator.clipboard.writeText(props.content);
        // TODO: show copied effect
        console.log('Async: Copying to clipboard was successful!');
    }

    return (
        <div className="chip-container" onClick={copyAddress} style={{ backgroundColor: props.bgColor }} >
            <p className="chip-content" style={{ color: props.textColor }}>{props.content}</p>
        </div>
    );
}

export default Chip;