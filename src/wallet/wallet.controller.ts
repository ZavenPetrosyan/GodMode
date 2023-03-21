import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('classify')
  async classifyWallet(@Body() body: { address: string }): Promise<any> {
    const { address } = body;

    // Validate input here if necessary

    const classifications = await this.walletService.classifyWallet(address);

    return {
      success: true,
      data: classifications,
    };
  }
}