import React, { useEffect, useState } from 'react';
import AddOverlay from '../add_overlay/AddOverlay';
import { Box } from '../utils/Box';
import './navbar.scss'

function Navbar(props) {
    const { web3, accounts, appContract, setAddress } = props;
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        const navMenu = document.getElementsByClassName('nav-add-btn')[0];
        const l1 = document.getElementsByClassName('l1')[0];
        const l2 = document.getElementsByClassName('l2')[0];
        openMenu ? navMenu.classList.add('nav-add-btn-c') : navMenu.classList.remove('nav-add-btn-c');
        openMenu ? l1.classList.add('line-c') : l1.classList.remove('line-c');
        openMenu ? l2.classList.add('line-c') : l2.classList.remove('line-c');
        openMenu ? l1.classList.add('l1-c') : l1.classList.remove('l1-c');
        openMenu ? l2.classList.add('l2-c') : l2.classList.remove('l2-c');

        // For Add Poll Overlay
        // Slide Add screen
        const addPoll = document.getElementsByClassName('add-poll')[0];
        openMenu ? addPoll.classList.add('add-poll-c') : addPoll.classList.remove('add-poll-c');
        // Blur background
        const blurOverlay = document.getElementsByClassName('blur-overlay')[0];
        openMenu ? blurOverlay.classList.add('blur-overlay-c') : blurOverlay.classList.remove('blur-overlay-c');

        const titleField = document.getElementById('title-field');
        openMenu && setTimeout(() => { titleField.focus(); }, 300)

    }, [openMenu]);

    return (
        <div>
            <nav>
                <div className="logo">Pollz</div>
                <div className="nav-btn-flex">
                    <button className="clickable">Connect</button>
                    <Box width="20" />
                    <div className="nav-add-btn" onClick={() => { setOpenMenu(!openMenu) }}>
                        <div className="line l1"></div>
                        <div className="line l2"></div>
                    </div>
                </div>
            </nav>
            <AddOverlay web3={web3} accounts={accounts} appContract={appContract} setAddress={setAddress} setOpenMenu={setOpenMenu} />
        </div>
    );
}

export default Navbar;