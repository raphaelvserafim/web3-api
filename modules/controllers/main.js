const W3 = require("../model/w3");

class Main {


  static async newWallet(ctx) {
    try {

      const password = ctx?.request?.body?.password;

      if (!password) {
        throw new Error('Enter a password');
      }

      const w3 = new W3({ networkName: "BLAST", isTestnet: true });

      const createWallet = await w3.createWallet(password);

      ctx.body = createWallet;

    } catch (error) {
      ctx.body = { status: false, message: error.message };
    }

  }

  static async privateKey(ctx) {
    try {
      const { password, address } = ctx?.request?.body;

      if (!password) {
        throw new Error('Enter a password');
      }

      if (!address) {
        throw new Error('Enter a address');
      }

      const w3 = new W3({ networkName: "BLAST", isTestnet: true });

      const { privateKey } = await w3.privateKey(address, password);

      ctx.body = { status: true, privateKey, message: "Attention be careful with your private key" };

    } catch (error) {
      ctx.body = { status: false, message: error.message };
    }

  }
};

module.exports = Main;