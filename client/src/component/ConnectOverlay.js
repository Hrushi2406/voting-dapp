import React from 'react';
import { useConnection } from './ConnectionProvider';

function ConnectOverlay() {
    const { connectWallet } = useConnection()

    return (
        <div className="blur-bg">
            <button className="clickable center" onClick={connectWallet}>Connect</button>
        </div>
    );
}

export default ConnectOverlay;