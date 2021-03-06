import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

const INFURA_API_KEY = process.env.INFURA || "";
const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN;


const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.7.0", settings: {} }],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545", //Make sure Ganache GUI is linked to this network
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    coverage: {
      url: "http://127.0.0.1:8555", // Coverage launches its own ganache-cli client (https://hardhat.org/plugins/solidity-coverage.html)
    },
  },
  etherscan: {  
     // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
   apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
