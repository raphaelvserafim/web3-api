const W3 = require("../model/w3");

class Main {


  static async newWallet(ctx) {
    try {
      const { networkName, isTestnet, password } = ctx?.request?.body;

      if (!password) {
        throw new Error('Enter a password');
      }

      const w3 = new W3({ networkName, isTestnet });

      const createWallet = await w3.createWallet(password);

      ctx.body = createWallet;

    } catch (error) {
      ctx.body = { status: false, message: error.message };
    }

  }

  static async privateKey(ctx) {
    try {
      const { networkName, isTestnet, password, address } = ctx?.request?.body;

      if (!password) {
        throw new Error('Enter a password');
      }

      if (!address) {
        throw new Error('Enter a address');
      }

      const w3 = new W3({ networkName, isTestnet });

      const { privateKey } = await w3.privateKey(address, password);

      ctx.body = { status: true, privateKey, message: "Attention be careful with your private key" };

    } catch (error) {
      ctx.body = { status: false, message: error.message };
    }

  }

  static async sendTransaction(ctx) {
    try {

      const { networkName, isTestnet, erc20, address, password, addressFrom, contract, amount } = ctx?.request?.body;


      const w3 = new W3({ networkName, isTestnet, erc20 });

      const response = await w3.sendTransaction(password, address, addressFrom, amount, contract);

      ctx.body = response;

    } catch (error) {
      console.error(error);

      ctx.body = { status: false, message: error.message };
    }
  }

  static async addTokenToWallet(ctx) {
    try {
      const { networkName, isTestnet, erc20, address, contract } = ctx?.request?.body;

      const w3 = new W3({ networkName, isTestnet, erc20 });

      return await w3.addTokenToWallet(address, contract)

    } catch (error) {
      ctx.body = { status: false, message: error.message };
    }
  }
};

module.exports = Main;