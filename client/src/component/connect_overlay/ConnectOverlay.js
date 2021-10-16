import React from 'react';
import { useConnection } from '../ConnectionProvider';
import './connect_overlay.scss'

function ConnectOverlay() {
    const { connectWallet } = useConnection()

    return (
        <div className="blur-connect">
            <button className="clickable center" onClick={connectWallet}>Connect</button>
        </div>
    );
}

export default ConnectOverlay;