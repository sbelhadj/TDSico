
truffle unbox webpack

// need to create and infura account https://infura.io


// install dependencies
npm install solc -S -D
npm install truffle-hdwallet-provider -S -D
npm install jquery -S -D
npm install node-waves -S -D
npm install popper.js -S -D
npm install bootstrap -S -D

//Install .env for environment variable management
npm install --save dotenv 
//Install a great linter and style enforcer for solidity (You can also use that globally)
npm install --save-dev solium


// start the front end application
npm run dev

// If you want to work with a local Ethereum node like Parity
parity --config dev-insecure --jsonrpc-cors "*"
parity --geth // so we can start mist with partity
// 2 other Ethereum Wallets
mist
ethereumWallet


// compile and deploy using truffle
truffle compile --all
truffle migrate --reset
truffle migrate --network ropsten --reset

// deploy source code to git
gitk

