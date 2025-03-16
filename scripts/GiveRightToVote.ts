import { createPublicClient, http, createWalletClient } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});
const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
const chairperson = createWalletClient({
  account,
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  const voterAddress = parameters[1] as `0x${string}`;
  
  if (!contractAddress || !voterAddress) 
    throw new Error("Contract address and voter address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress) || !/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
    throw new Error("Invalid address format");

  console.log("Giving right to vote to:", voterAddress);
  const hash = await chairperson.writeContract({
    address: contractAddress,
    abi,
    functionName: "giveRightToVote",
    args: [voterAddress],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 