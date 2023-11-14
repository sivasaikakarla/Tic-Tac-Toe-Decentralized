require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

MUMBAI_URL=process.env.MUMBAI_URL;
MUMBAI_KEY=process.env.MUMBAI_KEY;

module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_URL, // Provide the Sepolia testnet URL in your .env file
      accounts: [process.env.PRIVATE_KEY], // Provide your private key in the .env file
    },
  },
};
