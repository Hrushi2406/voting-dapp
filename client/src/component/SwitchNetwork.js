import React from 'react';
import { useConnection } from './ConnectionProvider';
import { Box } from './utils/Box';

function SwitchNetwork(props) {
    const { switchNetwork } = useConnection()

    return (
        <div className="blur-bg">
            <p>{props.msg}</p>
            {/* <p>You are using wrong network. Switch to Localhost 7545</p> */}
            <Box height="20" />
            {/* <button className="clickable center-item" onClick={switchNetwork}>Switch Network</button> */}
        </div>
    );
}

export default SwitchNetwork;