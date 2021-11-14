import React from 'react';
import './chip.scss'

function Chip(props) {
    const copyAddress = async () => {
        await navigator.clipboard.writeText(props.content);
        console.log('Async: Copying to clipboard was successful!');
    }

    return (
        <div className="chip-container clickable" style={{ backgroundColor: props.bgColor }}
            onClick={() => {
                if (props.content[0] === '0') {
                    copyAddress()
                    // TODO: show copied effect
                    setTimeout(() => {
                        window.open('https://faucet.rinkeby.io/', '_blank')
                    }, 250)
                } else {
                    window.open('https://rinkeby.etherscan.io/address/0x0b4209D4572Bbbdc5886B9848bAb96879D3a582c', '_blank')
                }
            }}
        >
            <p className="chip-content" style={{ color: props.textColor }}>{props.content}</p>
        </div>
    );
}

export default Chip;