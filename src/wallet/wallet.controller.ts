import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('classify')
  async classifyWallet(@Body() body: { address: string, network: string }): Promise<any> {
    const { address, network } = body;

    // Validate input here if necessary

    const classifications = await this.walletService.classifyWallet(address, network);

    return {
      success: true,
      data: classifications,
    };
  }
}


// import { Controller, Get, Query } from '@nestjs/common';
// import { WalletService } from './wallet.service';

// @Controller('wallet')
// export class WalletController {
//     constructor(private readonly walletService: WalletService) { }

//     @Get()
//     async getClassification(
//         @Query('address') address: string,
//         @Query('network') network: string,
//     ) {
//         // validate inputs
//         if (!address || !network) {
//             throw new Error('Invalid input');
//         }

//         // call service to get classifications
//         const classifications = await this.walletService.getClassification(
//             address,
//             network,
//         );

//         return classifications;
//     }
// }
