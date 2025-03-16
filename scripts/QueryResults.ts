import { createPublicClient, http, hexToString } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
});

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Contract address not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  
  if (!contractAddress) 
    throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address format");

  // Get the chairperson
  const chairperson = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "chairperson",
  });
  console.log("Chairperson:", chairperson);

  // Get the winning proposal
  const winningProposal = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winningProposal",
  });
  console.log("\nWinning proposal index:", winningProposal);

  // Get the winning proposal name
  const winnerName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
  }) as `0x${string}`;
  console.log("Winning proposal name:", hexToString(winnerName, { size: 32 }));

  // Try to get proposals (will try first few indices)
  console.log("\nProposals:");
  try {
    for (let i = 0; i < 10; i++) {
      try {
        const proposal = await publicClient.readContract({
          address: contractAddress,
          abi,
          functionName: "proposals",
          args: [BigInt(i)],
        }) as any[];
        console.log(`Proposal ${i}:`, {
          name: hexToString(proposal[0] as `0x${string}`, { size: 32 }),
          voteCount: proposal[1],
        });
      } catch (e) {
        // Stop when we can't find more proposals
        break;
      }
    }
  } catch (e) {
    console.log("Could not fetch all proposals");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 