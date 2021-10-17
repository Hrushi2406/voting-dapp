import React, { useEffect, useState } from 'react';
import AddPoll from '../add_poll/AddPoll';
import { useConnection } from '../ConnectionProvider';
import { Box } from '../utils/Box';
import Chip from '../utils/chip/Chip';
import './navbar.scss'

function Navbar() {
    const { connectionState, setConnectionState, connectWallet } = useConnection();
    const { web3, accounts, appContract, networkName } = connectionState;
    // To toggle Add Poll Page
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        // Add button nimation
        const navMenu = document.getElementsByClassName('nav-add-btn')[0];
        const l1 = document.getElementsByClassName('l1')[0];
        const l2 = document.getElementsByClassName('l2')[0];
        openMenu ? navMenu.classList.add('nav-add-btn-c') : navMenu.classList.remove('nav-add-btn-c');
        openMenu ? l1.classList.add('line-c') : l1.classList.remove('line-c');
        openMenu ? l2.classList.add('line-c') : l2.classList.remove('line-c');
        openMenu ? l1.classList.add('l1-c') : l1.classList.remove('l1-c');
        openMenu ? l2.classList.add('l2-c') : l2.classList.remove('l2-c');

        // For Add Poll Overlay
        // Slide from left Add screen
        const addPoll = document.getElementsByClassName('add-poll')[0];
        openMenu ? addPoll.classList.add('add-poll-c') : addPoll.classList.remove('add-poll-c');

        // Blur background when Add overlay moves to left
        const blurOverlay = document.getElementsByClassName('blur-overlay')[0];
        openMenu ? blurOverlay.classList.add('blur-overlay-c') : blurOverlay.classList.remove('blur-overlay-c');

        // Focus on title field
        const titleField = document.getElementById('title-field');
        openMenu && setTimeout(() => { titleField.focus(); }, 300)

    }, [openMenu]);

    return (
        <div>
            <nav>
                <div className="logo"
                    onClick={() => { setOpenMenu(false); setConnectionState({ ...connectionState, poll: 'Home' }) }}
                >
                    Pollz
                </div>
                <div className="nav-btn-flex">
                    <Chip bgColor="var(--bg-color)" textColor="black" content={networkName} />

                    <Box width="20" />

                    {accounts.length > 0 ? <Chip bgColor="var(--primary)" textColor="white" content={accounts[0]} /> : <button className="clickable" onClick={() => { connectWallet() }}>Connect</button>}

                    <Box width="20" />

                    <div className="nav-add-btn" onClick={() => { setOpenMenu(!openMenu) }}>
                        <div className="line l1"></div>
                        <div className="line l2"></div>
                    </div>
                </div>
            </nav>
            <AddPoll web3={web3} accounts={accounts} appContract={appContract} openMenu={openMenu} setOpenMenu={setOpenMenu} />
        </div>
    );
}

export default Navbar;