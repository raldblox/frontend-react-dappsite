import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { networks } from "./network";
import { ethers } from "ethers";

const Metamask = () => {
  const [account, setAccount] = useState("");
  const [chain, setChain] = useState("");
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");
  const [connecting, setConnecting] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const connectMetamask = async () => {
    setConnecting(true);
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask.");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const bal = await provider.getBalance(accounts[0]);
      const balanceInEther = ethers.utils.formatEther(bal);
      setBalance(balanceInEther);
      setConnecting(false);
    } catch (error) {
      console.log(error);
      setConnecting(false);
    }
  };

  const checkMetamask = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const bal = await provider.getBalance(accounts[0]);
      const balanceInEther = ethers.utils.formatEther(bal);
      setBalance(balanceInEther);
      setAccount(account);
    } else {
      console.log("No authorized account found");
    }

    const chainId = await ethereum.request({ method: "eth_chainId" });
    setChain(chainId);
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);

    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  useEffect(() => {
    checkMetamask();
  }, []);

  return (
    <>
      <Button   onClick={handleShow} variant={account ? "outline-success" : "outline-secondary" }>
        WEB3 WALLET
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>HOLA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong>Account: </strong>
          {account.slice(0, 15)}...{account.slice(-15)}
          <br />
          <strong>Balance: </strong>
          {balance}
          <br />
          <strong>Network: </strong>
          {network}
          <br />
          <strong>Chain ID: </strong>
          {chain}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          {account ? (
            <Button variant="success">Connected</Button>
          ) : (
            <Button variant="warning" onClick={connectMetamask}>
              {connecting ? (
                <>
                  Connecting <Spinner animation="border" size="sm" />
                </>
              ) : (
                "Connect Metamask "
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Metamask;
