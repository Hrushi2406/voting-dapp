import React from 'react';

function Box(props) {
    return (
        <div style={{ height: props.height + 'px', width: props.width + 'px' }}></div>
    );
}

export { Box };