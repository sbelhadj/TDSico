# TDSico
A simple ICO Ethereum DApp

The TDS want to raise some funds to create a platform to sell its media content.
Bootstrapping such a platform requires some investment upfront. So, instead of asking money from a Bank, TDS can rely on its large fan base to contribute to such a project.
We need:
-	An Effective way to raise funds (easy to use)?
-	A Transparent way:  Who owns what?
-	A solution that is available and scalable?
-	A Fully digitized solution: no friction with the current financial system.
The best solution is an ICO (Initial Coin Offering) DApp (Decentralized Application) that consists of a HTML/CSS/Javascript front-end and an ethereum smart contract back-end.

This application will allow users to own a share of the project as TDS Tokens that will be available via an ERC20 token smart contract
These TDS Tokens can also be of utility on the target platform: for example giving  access to media content.


Step 1 : Setting up the environment
Step 2 : Writing the Smart Contracts
Step 3 : Compiling and deploying(migrating) the Smart Contracts
Step 4 : Testing the Smart Contracts
Step 5 : Creating the Front-end
Step 6: Using the DApp


Setting up the environment:
Ubuntu version : 
sbelhadj@sbelhadj-VirtualBox:~/TDS/github/TDSico$ uname -a
Linux sbelhadj-VirtualBox 4.15.0-48-generic #51~16.04.1-Ubuntu SMP Fri Apr 5 12:01:12 UTC 2019 x86_64 x86_64 x86_64 GNU/Linux

Install NodeJs & npm : 
    sudo apt-get update
    curl -sL https://deb.nodesource.com/setup_7.x -o nodesource_setup.sh
    sudo bash nodesource_setup.sh
    sudo apt-get install nodejs
    node --version
    v7.10.1
    npm --version
    4.2.0


Install Ethereum node parity  from https://www.parity.io/ : 
    sudo dpkg -i parity_1.8.11_ubuntu_amd64.deb

    # This config should be placed in following path:
    #   ~/.local/share/io.parity.ethereum/config.toml 
    [parity]
    # Local Development Chain
    chain = "dev"

    [rpc]


Open an infura account:  https://infura.io/  and save your API Key


Install Metmask chrome extension : https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en


Now all you have to do is to checkout the application source code to a local directory and execute "npm install"
