import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import WorldContract from './contracts/World.json';
import world from './map.json';
import getWeb3 from './getWeb3';
import Main from './pages/main';
import Navbar from './components/navbar';
import Owner from './pages/owner';
import Guest from './pages/guest';
import { OWNER, GUEST, MAP } from './constants/pages';

const GlobalStyle = createGlobalStyle`
  body {
    background-image: linear-gradient(to right bottom, #f0f0f0, #e0e0e0, #d0d0d0, #c0c0c0, #b0b0b0);
    background-attachment: fixed;
    color: #000000;
    margin: 0;
    transition: all 0.25s linear;

    @media (prefers-color-scheme: dark) {
      background-image: linear-gradient(to right bottom, #808080, #696969, #505050, #303030, #000000);
      color: #ffffff;
    }
  }

  input,
  select {
    border: 1px solid #000000;
    width: 100%;
    padding: 12px;
    color: #000000;
    font-size: 15px;
    font-family: Verdana;

    @media (prefers-color-scheme: dark) {
      border: 1px solid #ffffff;
      color: #ffffff;
    }
  }

  select {
    color: #000000;

    @media (prefers-color-scheme: dark) {
      color: #ffffff;
    }
  }

  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    border: none;
  }
`;


function App() {
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [map, setMap] = useState([]);
  const [page, setPage] = useState(undefined);
  const [ownerPage, setOwnerPage] = useState(MAP);
  const [game, setGame] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = WorldContract.networks[networkId];
        const contract = new web3.eth.Contract(
          WorldContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setContract(contract);
      } catch (error) {
        console.log('Failed to load web3, accounts, or contract.');
        console.error(error);
      }
    }
    init();
  }, []);

  const updateMap = async () => {
    if (typeof web3 === 'undefined' || typeof contract === 'undefined') {
      return;
    }

    const owner = await contract.methods.owner().call();
    const map = [];
    const size = Math.sqrt(world.length);

    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push({ ...world[i * size + j], owner });
      }
      map.push(row);
    }

    const numOfTokens = await contract.methods.getTokensCount().call();
    if (numOfTokens > 0) {
      const response = await contract.methods.getMap().call();
      const owners = response[0];
      const tokens = response[1];

      for (let i = 0; i < numOfTokens; i++) {
        map[tokens[i].row][tokens[i].col].tokenId = Number(tokens[i].tokenId);
        map[tokens[i].row][tokens[i].col].owner = owners[i];
        map[tokens[i].row][tokens[i].col].game = tokens[i].game;
        map[tokens[i].row][tokens[i].col].price = Number(tokens[i].price);
      }
    }

    setMap(map);
  }

  useEffect(updateMap, [web3, contract]);

  useEffect(() => {
    setOwnerPage(MAP);
    setGame(undefined);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case OWNER: 
        return (<Owner web3={web3} contract={contract} map={map} updateMap={updateMap} ownerPage={ownerPage} />);
      case GUEST: 
        return (<Guest map={map} game={game} setGame={setGame} />);
      default:
        return (<Main setPage={setPage} />);
    }
  }

  return (
    <>
      <GlobalStyle />
      <Navbar page={page} setPage={setPage} setOwnerPage={setOwnerPage} setGame={setGame} />
      {renderPage()}
    </>
  );
}

export default App;