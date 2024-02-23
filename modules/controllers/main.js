const W3 = require("../controllers/w3");

class Main {

  static async newWallet(ctx) {
    try {
      const w3 = new W3({ networkName: "BLAST", isTestnet: true });

      const createWallet = await w3.createWallet("123");

      ctx.body = createWallet;

    } catch (error) {
      ctx.body = { status: false, message: error.message };
    }

  }
};

module.exports = Main;