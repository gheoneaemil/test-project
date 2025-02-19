import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { Repository } from 'typeorm';
import { Transfer } from './entities/transfer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockTransferRepository = {
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  }),
};

describe('TransfersService', () => {
  let service: TransfersService;
  let transferRepository: Repository<Transfer>;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: getRepositoryToken(Transfer),
          useValue: mockTransferRepository,
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    transferRepository = module.get<Repository<Transfer>>(getRepositoryToken(Transfer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTotalTransferred', () => {
    it('should return the total transferred amount', async () => {
      const mockTotal = { totalTransferred: '1000' };
      mockTransferRepository.createQueryBuilder().getRawOne.mockResolvedValue(mockTotal);

      const result = await service.getTotalTransferred('2024-01-01', '2024-01-31');
      expect(result).toBe('1000');
      expect(mockTransferRepository.createQueryBuilder).toHaveBeenCalledWith('transfer');
    });

    it('should return 0 when no records exist', async () => {
      mockTransferRepository.createQueryBuilder().getRawOne.mockResolvedValue(null);

      const result = await service.getTotalTransferred('2024-01-01', '2024-01-31');
      expect(result).toBe(0);
    });

    it('should return 0 and handle errors', async () => {
      mockTransferRepository.createQueryBuilder().getRawOne.mockRejectedValue(new Error('DB error'));
      const result = await service.getTotalTransferred('2000-01-01', '2000-01-31');
      expect(result).toBe(0);
    });
  });

  describe('getTopAccounts', () => {
    it('should return the top accounts sorted by volume', async () => {
      const mockTopAccounts = [
        { account: 'user1', totalVolume: '5000' },
        { account: 'user2', totalVolume: '3000' },
      ];
      mockTransferRepository.createQueryBuilder().getRawMany.mockResolvedValue(mockTopAccounts);

      const result = await service.getTopAccounts(2);
      expect(result).toEqual(mockTopAccounts);
    });

    it('should return an empty array when no records exist', async () => {
      mockTransferRepository.createQueryBuilder().getRawMany.mockResolvedValue([]);

      const result = await service.getTopAccounts(2);
      expect(result).toEqual([]);
    });

    it('should return an empty array and handle errors', async () => {
      mockTransferRepository.createQueryBuilder().getRawMany.mockRejectedValue(new Error('DB error'));

      const result = await service.getTopAccounts(2);
      expect(result).toEqual([]);
    });
  });
});
