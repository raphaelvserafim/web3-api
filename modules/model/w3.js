const Web3 = require('web3').Web3

const ERC20 = require("../constants/erc20")

const NETWORKS = require("../constants/networks")

const Keystore = require("./keystore");
class W3 {
  web3;
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
    this.web3 = web3;
    this.eth = this.web3.eth;

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

  async privateKey(address, password) {
    const keystore = await Keystore.load(address);
    const decrypt = await this.decrypt(keystore, password);
    return decrypt;
  }

  async createWallet(password) {
    try {
      const newAccount = this.eth.accounts.create();
      const { address, privateKey } = newAccount;
      if (privateKey && address) {
        const keystore = await this.encrypt(privateKey, password);
        await Keystore.save(address, keystore);
      }
      return { status: true, address: address }
    } catch (error) {
      return { status: false, message: error.message }
    }
  }

  async sendTransaction(password, address, addressFrom, amount, contractAddress) {

    try {

      const tokenAmountWei = this.web3.utils.toWei(amount.toString(), 'ether');

      const contract = new this.eth.Contract(this.erc20, contractAddress);

      const senderTokenBalance = await contract.methods.balanceOf(address).call();


      if (senderTokenBalance < tokenAmountWei) {
        throw new Error(`Sender's balance is insufficient to send the desired tokens.`);

      }

      const balanceInWei = await this.eth.getBalance(address);
      const balanceInEther = this.web3.utils.fromWei(balanceInWei, 'ether');

      const gasLimit = BigInt(2000000);

      const gasPrice = BigInt(await this.eth.getGasPrice());


      const nonce = await this.eth.getTransactionCount(address);

      const encodedData = contract.methods.transfer(addressFrom, tokenAmountWei).encodeABI();

      const transactionObject = {
        nonce: nonce,
        to: contractAddress,
        gas: gasLimit,
        gasPrice: gasPrice,
        data: encodedData
      };


      const { privateKey } = await this.privateKey(address, password);

      const signedTransaction = await this.eth.accounts.signTransaction(transactionObject, privateKey);

      const serializedTx = signedTransaction.rawTransaction;

      return new Promise((resolve, reject) => {
        this.eth.sendSignedTransaction(serializedTx)
          .on('transactionHash', function (hash) {
            resolve({ status: true, message: 'Transaction sent', hash });
          })
          .on('receipt', function (receipt) {
            console.log('Transação confirmada! Recibo:', receipt);
          })
          .on('error', function (error) {
            reject({ status: false, message: error.message });
          });
      });


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