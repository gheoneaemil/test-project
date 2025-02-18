import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { TransfersService } from './transfers.service';

describe('TransfersService', () => {
  let transfersService: TransfersService;
  let transferRepository: Repository<Transfer>;

  const mockTransferRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        { provide: getRepositoryToken(Transfer), useValue: mockTransferRepository },
      ],
    }).compile();

    transfersService = module.get<TransfersService>(TransfersService);
    transferRepository = module.get<Repository<Transfer>>(getRepositoryToken(Transfer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the total USDC transferred within a given period', async () => {
    const startDate = '2024-02-01';
    const endDate = '2024-02-10';
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ totalTransferred: '500000.00' }),
    };

    mockTransferRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await transfersService.getTotalTransferred(startDate, endDate);

    expect(mockTransferRepository.createQueryBuilder).toHaveBeenCalledWith('transfer');
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('SUM(transfer.amount)', 'totalTransferred');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'transfer.timestamp BETWEEN :startDate AND :endDate',
      { startDate, endDate }
    );
    expect(result).toEqual({ totalTransferred: '500000.00' });
  });

  it('should return the top accounts by transaction volume', async () => {
    const limit = 5;
    const mockResponse = [
      { account: '0x123...abc', totalVolume: '20000.50' },
      { account: '0x456...def', totalVolume: '15000.75' },
    ];
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue(mockResponse),
    };

    mockTransferRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const result = await transfersService.getTopAccounts(limit);

    expect(mockTransferRepository.createQueryBuilder).toHaveBeenCalledWith('transfer');
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('transfer.from', 'account');
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('SUM(transfer.amount)', 'totalVolume');
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('transfer.from');
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('totalVolume', 'DESC');
    expect(mockQueryBuilder.limit).toHaveBeenCalledWith(limit);
    expect(result).toEqual(mockResponse);
  });
});