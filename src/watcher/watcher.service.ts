import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { providers, Contract } from "ethers";
import { Transfer } from 'src/transfers/entities/transfer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WatcherService {
    private provider: providers.JsonRpcProvider;
    private contract: Contract;

    private readonly USDC_ADDRESS = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
    private readonly RPC_URL = 'https://api.avax.network/ext/bc/C/rpc';
    private readonly TRANSFER_EVENT = [
        {
          anonymous: false,
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
          ],
          name: 'Transfer',
          type: 'event',
        },
    ];

    constructor(
        @InjectRepository(Transfer)
        private readonly usdcTransactionRepository: Repository<Transfer>,
    ) {
        this.provider = new providers.JsonRpcProvider(this.RPC_URL);
        this.contract = new Contract(this.USDC_ADDRESS, this.TRANSFER_EVENT, this.provider);
    }

    async onModuleInit() {
        console.info('Listening for USDC transfers on Avalanche...');
        this.contract.on("Transfer", async (from, to, value, event) => {
          const block = await this.provider.getBlock(event.blockNumber);
          const transfer = new Transfer(from, to, value._hex, block.timestamp);
          await this.usdcTransactionRepository.save(transfer);
        });
    }
}
