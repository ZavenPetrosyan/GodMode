import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { TokenConfig } from '../interfaces/token-config.interface';

const TOKEN_PRESETS: TokenConfig[] = [
    {
        network: 'mainnet',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        threshold: 500,
        classification: 'GodMode',
    },
];

@Injectable()
export class WalletService {
    async classifyWallet(address: string): Promise<{ [key: string]: string }> {
        let provider;
        try {
            provider = new ethers.InfuraProvider('mainnet', 'fbfb7c83541245f5bec272546fcaeec3');
        } catch (err) {
            throw new HttpException('Unsupported network', HttpStatus.BAD_REQUEST);
        }

        const classifications: { [key: string]: string } = {};

        for (const token of TOKEN_PRESETS) {
            const balance = await provider.getBalance(address);
            const etherValue = ethers.formatUnits(balance, "ether");
            if (Math.floor(Number(etherValue)) > token.threshold) {
                classifications['Classification'] = 'GodMode';
                classifications['Token'] = token.address;
                classifications['Threshold'] = etherValue;
                classifications['ABI'] = 'ERC-20';
            } else {
                classifications['Classification'] = 'Normal';
                classifications['Token'] = token.address;
                classifications['Threshold'] = etherValue;
                classifications['ABI'] = 'ERC-20';
            }
        }

        return classifications;
    }
}
