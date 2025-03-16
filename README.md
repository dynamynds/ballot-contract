# Ballot Contract Testing Guide

## Prerequisites
1. Node.js and npm installed
2. MetaMask wallet with Sepolia ETH
3. Alchemy account (free)

## Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your credentials:
```
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_metamask_private_key_without_0x
```

## Contract Details
- Network: Sepolia Testnet
- Contract Address: 0xc633F75e7fCB481a881d4e9F0B16F2677C652B99
- Chairperson Address: 0xe6eb68Cc142a0628A54fE707a0F67110aaDB0540

## Available Scripts

### 1. Query Current State
```bash
npx ts-node scripts/QueryResults.ts CONTRACT_ADDRESS
```

### 2. Request Voting Rights
Contact the chairperson (contract deployer) to give you voting rights. They need to run:
```bash
npx ts-node scripts/GiveRightToVote.ts CONTRACT_ADDRESS YOUR_ADDRESS
```

### 3. Cast a Vote
After receiving voting rights:
```bash
npx ts-node scripts/CastVote.ts CONTRACT_ADDRESS PROPOSAL_INDEX
```
- PROPOSAL_INDEX starts at 0

### 4. Delegate Your Vote
To delegate your vote to another address:
```bash
npx ts-node scripts/DelegateVote.ts CONTRACT_ADDRESS DELEGATE_ADDRESS
```

## Getting Sepolia ETH
You can get test ETH from:
- https://sepoliafaucet.com/
- https://sepolia-faucet.pk910.de/

## Current Proposals
1. Chocolate (index 0)
2. Vanilla (index 1)
3. Strawberry (index 2)

## Viewing on Etherscan
View contract and transactions at:
https://sepolia.etherscan.io/address/0xc633F75e7fCB481a881d4e9F0B16F2677C652B99
