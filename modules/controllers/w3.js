const Web3 = require('web3').Web3

const ERC20 = require("../constants/erc20")

const NETWORKS = require("../constants/networks")

class W3 {
  eth;
  erc20;

  constructor(data) {
    if (!data || !data.networkName || !data.isTestnet) {
      throw new Error('networkName and isTestnet are mandatory');
    }

    const { networkName, isTestnet, erc20 } = data;

    if (!NETWORKS[networkName]) {
      throw new Error('Network Name ' + networkName + ' not found');
    }

    const network = isTestnet ? NETWORKS[networkName].TEST : NETWORKS[networkName].MAIN;
    const web3 = new Web3(network);
    this.eth = web3.eth;

    if (erc20) {
      this.erc20 = ERC20[erc20];
    }
  }


  async encrypt(key, password) {
    return await this.eth.accounts.encrypt(key, password);
  }

  async decrypt(keystore, password) {
    return await this.eth.accounts.decrypt(keystore, password);
  }

  async createWallet(password) {
    try {
      const newAccount = this.eth.accounts.create();
      const { address, privateKey } = newAccount;
      if (privateKey && address) {
        const keystore = await this.encrypt(privateKey, password);
        console.log(keystore);
      }

      return { status: true, address: address }
    } catch (error) {
      return { status: false, message: error.message }
    }
  }


  async addTokenToWallet(walletAddress, tokenAddress) {
    try {
      const contract = new this.eth.Contract(this.erc20, tokenAddress);
      const symbol = await contract.methods.symbol().call();
      const decimals = await contract.methods.decimals().call();

      await this.eth.personal.importRawKey(tokenAddress, '');
      const result = await this.eth.personal.addToken(walletAddress, tokenAddress, symbol, decimals);
      return { status: true, result, symbol, decimals };
    } catch (error) {
      console.error('Erro ao adicionar token à carteira:', error);
      return { status: false, message: error.message };
    }
  }


};

module.exports = W3