import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { TotalTransferredDto } from './dto/total-transferred.dto';
import { TopAccountsDto } from './dto/top-accounts.dto';

describe('TransfersController', () => {
    let controller: TransfersController;
    let service: TransfersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransfersController],
            providers: [
                {
                    provide: TransfersService,
                    useValue: {
                        getTotalTransferred: jest.fn(),
                        getTopAccounts: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TransfersController>(TransfersController);
        service = module.get<TransfersService>(TransfersService);
    });

    describe('getTotalTransferred', () => {
        it('should return total transferred amount', async () => {
            const dto: TotalTransferredDto = { startDate: '2024-01-01', endDate: '2024-01-31' };
            const result = '10000';
            jest.spyOn(service, 'getTotalTransferred').mockResolvedValue(result);

            expect(await controller.getTotalTransferred(dto)).toBe(result);
            expect(service.getTotalTransferred).toHaveBeenCalledWith(dto.startDate, dto.endDate);
        });
    });

    describe('getTopAccounts', () => {
        it('should return top accounts by transaction volume', async () => {
            const dto: TopAccountsDto = { limit: 5 };
            const result = [{ account: '0x123', volume: 5000 }];
            jest.spyOn(service, 'getTopAccounts').mockResolvedValue(result);

            expect(await controller.getTopAccounts(dto)).toBe(result);
            expect(service.getTopAccounts).toHaveBeenCalledWith(dto.limit);
        });
    });
});