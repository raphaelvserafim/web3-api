const NETWORKS = {
  BITCOIN: { NAME: "Bitcoin", MAIN: "https://blockchain.info", TEST: "https://testnet.blockchain.info" },
  ETHEREUM: { NAME: "Ethereum", MAIN: "https://mainnet.infura.io/v3", TEST: "https://rinkeby.infura.io/v3" },
  BSC: { NAME: "Binance Smart Chain", MAIN: "https://bscscan.com", TEST: "https://testnet.bscscan.com" },
  POLYGON: { NAME: "Polygon", MAIN: "https://polygonscan.com", TEST: "https://mumbai.polygonscan.com" },
  SOLANA: { NAME: "Solana", MAIN: "https://explorer.solana.com", TEST: "https://testnet.solana.com" },
  CARDANO: { NAME: "Cardano", MAIN: "https://cardanoscan.io", TEST: "https://testnet.cardanoscan.io" },
  BLAST: { NAME: "Blast", MAIN: "", TEST: "https://sepolia.blast.io" },

};

module.exports = NETWORKS;
