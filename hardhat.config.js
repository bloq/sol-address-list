require('@nomiclabs/hardhat-truffle5')
require('solidity-coverage')
require('hardhat-deploy')

var config = require('config')

const {DEPLOYMENT_ACCOUNT_KEY} = process.env

const accounts = DEPLOYMENT_ACCOUNT_KEY ? [DEPLOYMENT_ACCOUNT_KEY] : undefined
const {provider: url} = config

module.exports = {
  networks: {
    localhost: {
      saveDeployments: true
    },
    hardhat: {
      saveDeployments: true
    },
    ropsten: {
      url,
      chainId: 3,
      gas: 7000000,
      accounts
    },
    kovan: {
      url,
      chainId: 42,
      gas: 5000000,
      accounts
    },
    etc: {
      url,
      chainId: 1,
      gas: 6000000,
      accounts
    },
    xdai: {
      url,
      chainId: 100,
      gas: 6000000,
      accounts
    },
    mainnet: {
      url,
      chainId: 1,
      gas: 6000000,
      accounts
    },
    avalanche: {
      url,
      chainId: 43114,
      gas: 8000000,
      accounts
    },
    arbitrum: {
      url,
      chainId: 42161,
      gas: 8000000,
      accounts
    }
  },
  namedAccounts: {
    deployer: 0
  },
  solidity: '0.8.3'
}
