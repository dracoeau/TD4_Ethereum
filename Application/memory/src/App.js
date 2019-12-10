import React, { Component } from 'react';
// import web3 library to interract with blockchain
import Web3 from 'web3'
import './App.css';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config'

// Use Component function to load all blockchain data
class App extends Component {
	async componentWillMount(){
		await this.isEthereumBrowser()
		await this.loadBlockchainData()
	}
	
	async isEthereumBrowser() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethreum)
			await window.ethereum.enable()
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert('Metamask or non ethereum browser extension detected !')
		}
	}
	
	async loadBlockchainData() {
		// Connect to the blockchain, passing as well URL to ganache
		const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
		// Ensuite on recupere le compte qui est actuellement connecté et enregistre l'état de l'objet pour pouvoir suivre l'évolution du composant
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })
		const lastBlock = await web3.eth.getBlockNumber()
		this.setState({ last_block: lastBlock })
		const chainId = await web3.eth.getChainId()
		this.setState({ chainId: chainId })
		const ERC721 = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
		this.setState({ ERC721 })
		const nameToken = await ERC721.methods.name().call()
		this.setState({ nameToken })
		const totalTokenNumber = await ERC721.methods.counterToken().call()
		this.setState({ totalTokenNumber })
	}
	
	constructor(props) {
		super(props)
		this.state = {
			account: '',
			last_block: 0,
			chainId: 0,
			ERC721: null,
			nameToken: '',
			totalTokenNumber: 0
		}
	}
	
	render(){
		return (
			<div className="container">
				<h1>Bienvenue</h1>
				<p>Your account : {this.state.account}</p>
				<p>Your last block number : {this.state.last_block}</p>
				<p>Your chainId : {this.state.chainId}</p>
				<p>Your token registry name : {this.state.nameToken}</p>
				<p>Your total token number : {this.state.totalTokenNumber}</p>
			</div>
		);
	}
}

export default App;
