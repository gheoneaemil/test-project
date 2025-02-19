import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatcherService } from './watcher.service';
import { Transfer } from '../transfers/entities/transfer.entity';
import { BigNumber } from 'ethers';

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({
        getBlock: jest.fn().mockResolvedValue({ timestamp: 1700000000 }),
      })),
    },
    Contract: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
    })),
  };
});

describe('WatcherService', () => {
  let watcherService: WatcherService;
  let transferRepository: Repository<Transfer>;

  const mockTransferRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatcherService,
        {
          provide: getRepositoryToken(Transfer),
          useValue: mockTransferRepository,
        },
      ],
    }).compile();

    watcherService = module.get<WatcherService>(WatcherService);
    transferRepository = module.get<Repository<Transfer>>(
      getRepositoryToken(Transfer),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(watcherService).toBeDefined();
  });

  it('should set up contract event listener on init', async () => {
    const mockOn = jest.fn();
    (watcherService['contract'].on as jest.Mock).mockImplementation(mockOn);

    await watcherService.onModuleInit();

    expect(mockOn).toHaveBeenCalledWith('Transfer', expect.any(Function));
  });

  it('should save a transfer event to the repository', async () => {
    const from = '0x123';
    const to = '0x456';
    const amount = BigNumber.from('10');
    const event = { blockNumber: 100 };
    const createdAt = new Date('2023-11-14T22:13:20.000Z');

    const mockOn: any = jest.fn((eventName: string, callback: Function) => {
      if (eventName === 'Transfer') {
        callback(from, to, amount, event); // Simulating event triggering
      }
    });

    // Replace the `on` method with our mock
    watcherService['contract'].on = mockOn;

    // Simulate the contract's `on` method invocation
    await watcherService.onModuleInit();

    expect(mockTransferRepository.save).toHaveBeenCalledWith({
      amount: '10',
      from,
      createdAt,
      to,
    });
  });

  it('should save a transfer event to the repository with the maximum amount', async () => {
    const from = '0x123';
    const to = '0x456';
    const amount = BigNumber.from(
      '999999999999999999999999999999999999999999999999999999999999999999999999999999',
    );
    const event = { blockNumber: 100 };
    const createdAt = new Date('2023-11-14T22:13:20.000Z');

    const mockOn: any = jest.fn((eventName: string, callback: Function) => {
      if (eventName === 'Transfer') {
        callback(from, to, amount, event); // Simulating event triggering
      }
    });

    // Replace the `on` method with our mock
    watcherService['contract'].on = mockOn;

    // Simulate the contract's `on` method invocation
    await watcherService.onModuleInit();

    expect(mockTransferRepository.save).toHaveBeenCalledWith({
      amount:
        '999999999999999999999999999999999999999999999999999999999999999999999999999999',
      from,
      createdAt,
      to,
    });
  });
});
