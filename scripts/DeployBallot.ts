import { createPublicClient, http, createWalletClient } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

// Initialize the clients
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
const deployer = createWalletClient({
  account,
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

async function main() {
  // Get proposals from command line
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");

  console.log("Deploying Ballot contract with proposals:");
  proposals.forEach((proposal, index) => {
    console.log(`Proposal ${index + 1}: ${proposal}`);
  });

  // Deploy contract
  console.log("\nDeploying from address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });

  // Convert proposals to bytes32 array
  const proposalBytes = proposals.map((prop) => {
    // Pad the string to 32 bytes
    const bytes = new TextEncoder().encode(prop);
    const padded = new Uint8Array(32);
    padded.set(bytes);
    return `0x${Buffer.from(padded).toString("hex")}` as `0x${string}`;
  });

  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [proposalBytes],
  });

  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  if (!receipt.contractAddress) {
    throw new Error("Contract deployment failed - no contract address");
  }
  
  console.log("Contract deployed to:", receipt.contractAddress);
  console.log("\nVerify on Etherscan:");
  console.log(`https://sepolia.etherscan.io/address/${receipt.contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 