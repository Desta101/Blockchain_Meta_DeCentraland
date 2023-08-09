import React from 'react';
import styled from 'styled-components';
import { MAIN, OWNER, GUEST, MAP, WALLET } from '../constants/pages';

const NavBarContainer = styled.div`
    position: relative;
    background-image: linear-gradient(to left top, #00b2e8, #0057b8, #007da3, #000561);
    background-attachment: fixed;
    font-family: Verdana;
    border-bottom: 2px solid #ffffff;
    height: 100px;
    width: 100%;
    color: #ffffff;
`;


const Title = styled.div`
    text-shadow: 2px 2px 8px #2d008f;
    font-size: 40px;
    font-weight: bold;
    margin-right: 40px;
    cursor: pointer;
    font-family: 'Verdana';
`;

const NavBarLinks = styled.div`
    position: relative;
    top: 50%;
    margin-left: 30px;
    transform: translate(0, -50%);
    display: flex;
    flex-direction: row;
    font-family: Verdana;
    text-align: center;
`;

const Button = styled.div`
    margin-top: 10px;
    margin-left: 70px;
    font-size: 28px;
    font-family: Verdana;
    cursor: pointer;

    &:hover {
        text-shadow: 2px 2px 4px #00c0c0;
    }
`;

function Navbar({ page, setPage, setOwnerPage, setGame }) {
    const renderOwnerButtons = () => {
        if (page === OWNER) {
            return (
                <>
                    <Button onClick={() => setOwnerPage(MAP)}>Map</Button>
                    <Button onClick={() => setOwnerPage(WALLET)}>My Wallet</Button>
                </>
            )
        } else if (page === GUEST) {
            return (
                <Button onClick={() => setGame(undefined)}>Map</Button>
            )
        }
    }

    return (
        <NavBarContainer>
            <NavBarLinks>
                <Title onClick={() => setPage(MAIN)}>Mishael & Desta IO</Title>
                {renderOwnerButtons()}
            </NavBarLinks>
        </NavBarContainer>
    );
}

export default Navbar;