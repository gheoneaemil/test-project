import { Test, TestingModule } from '@nestjs/testing';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

describe('TransfersController', () => {
  let transfersController: TransfersController;
  let transfersService: TransfersService;

  const mockTransfersService = {
    getTotalTransferred: jest.fn(),
    getTopAccounts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfersController],
      providers: [{ provide: TransfersService, useValue: mockTransfersService }],
    }).compile();

    transfersController = module.get<TransfersController>(TransfersController);
    transfersService = module.get<TransfersService>(TransfersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return total USDC transferred in the given period', async () => {
    const startDate = '2024-02-01';
    const endDate = '2024-02-10';
    const mockResponse = { totalTransferred: '500000.00' };

    mockTransfersService.getTotalTransferred.mockResolvedValue(mockResponse);

    const result = await transfersController.getTotalTransferred({ startDate, endDate });

    expect(mockTransfersService.getTotalTransferred).toHaveBeenCalledWith(startDate, endDate);
    expect(result).toEqual(mockResponse);
  });

  it('should return top accounts by transaction volume', async () => {
    const limit = 5;
    const mockResponse = [
      { account: '0x123...abc', totalVolume: '20000.50' },
      { account: '0x456...def', totalVolume: '15000.75' },
    ];

    mockTransfersService.getTopAccounts.mockResolvedValue(mockResponse);

    const result = await transfersController.getTopAccounts({ limit });

    expect(mockTransfersService.getTopAccounts).toHaveBeenCalledWith(limit);
    expect(result).toEqual(mockResponse);
  });
});