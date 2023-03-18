import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { TokenConfig } from '../interfaces/token-config.interface';

const TOKEN_PRESETS: TokenConfig[] = [
    {
        network: 'Ethereum Mainnet',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        threshold: 500,
    },
];

@Injectable()
export class WalletService {
    async classifyWallet(address: string, network: string): Promise<{ [key: string]: string }> {
        let provider;
        try {
            provider = new ethers.InfuraProvider(network);
        } catch (err) {
            throw new HttpException('Unsupported network', HttpStatus.BAD_REQUEST);
        }

        const balancePromises = TOKEN_PRESETS.map(async (token) => {
            const contract = new ethers.Contract(token.address, ['function balanceOf(address) view returns (uint256)'], provider);
            const balance = await contract.balanceOf(address);
            return { address: token.address, isGodMode: balance.gte(token.threshold) };
        });

        const balances = await Promise.all(balancePromises);

        const classifications = {};
        balances.forEach((balance) => {
            classifications[balance.address] = balance.isGodMode ? 'GodMode' : 'Not GodMode';
        });

        return classifications;
    }
}


// import { Injectable } from '@nestjs/common';
// import { ethers } from 'ethers';

// @Injectable()
// export class WalletService {
//   private readonly tokens = [
//     {
//       network: 'mainnet',
//       tokenAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
//       threshold: 500,
//       abi: [
//         'function balanceOf(address) view returns (uint256)',
//       ],
//       classification: 'GodMode',
//     },
//     // add more tokens here
//   ];

//   async getClassification(address: string, network: string) {
//     // validate network
//     if (network !== 'mainnet') {
//       throw new Error('Invalid network');
//     }

//     // create etherjs provider
//     const provider = ethers.getDefaultProvider(network);

//     // create wallet instance
//     const wallet = new ethers.Wallet(address, provider);

//     // get classifications for each token
//     const classifications = await Promise.all(
//       this.tokens.map(async (token) => {
//         const contract = new ethers.Contract(token.tokenAddress, token.abi, provider);
//         const balance = await contract.balanceOf(wallet.address);

//         return {
//           tokenAddress: token.tokenAddress,
//           classification: balance.gte(token.threshold) ? token.classification : 'Not GodMode',
//         };
//       }),
//     );

//     return classifications;
//   }
// }
