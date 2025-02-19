# Architecture Design Document

## 1. Overview

This document outlines the architecture for a backend service that interacts with the Avalanche blockchain. The system will is implemented using NestJS and will connect to an Avalanche RPC node to query USDC transfers following the ERC-20 token standard.

## 2. System Architecture

### 2.1 High-Level Design

The system consists of the following core components:

- **NestJS Backend Service**: A Node.js-based service using the NestJS framework to handle blockchain interactions.
- **Avalanche RPC Node Connection**: Integration with Avalanche C-Chain via an RPC public node.
- **USDC Transactions Tracker Service**: A service that tracks and stores USDC transfer events based on ERC-20 contract specifications.
- **PostgreSQL Database**: For storing transactions in real-time.
- **REST API**: Exposes endpoints for querying USDC transactions.

### 2.2 Component Diagram

![Architecture Diagram](./docs/SolutionDiagram.jpeg.jpeg)

## 3. Implementation Details

### 3.1 Technology Stack

- **Backend Framework**: NestJS (TypeScript)
- **Blockchain Interaction**: ethers.js
- **Database**: PostgreSQL
- **RPC Provider**: Avalanche Public RPC Node

### 3.2 Watcher Service

This service will establish a connection with the Avalanche C-Chain via an RPC node and listen for USDC transfer events.

#### Key Responsibilities:

- Connect to the Avalanche blockchain using ethers.js.
```typescript
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
```

- Fetch USDC transfers using event filters.
```typescript
  this.contract.on("Transfer", async (from, to, value, event) => {
    const block = await this.provider.getBlock(event.blockNumber);
    const transfer = new Transfer(from, to, value._hex, block.timestamp);
    await this.usdcTransactionRepository.save(transfer);
  });
```

- Expose REST API endpoints for clients to query transactions.
```typescript
  @Get('total-transferred')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTotalTransferred(@Query() query: TotalTransferredDto) {
      return this.transfersService.getTotalTransferred(query.startDate, query.endDate);
  }

  @Get('top-accounts')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTopAccounts(@Query() query: TopAccountsDto) {
      return this.transfersService.getTopAccounts(query.limit);
  }
```

### 3.3 API Endpoints

| Method | Endpoint                                                      | Description                                                            |
| ------ | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| GET    | `/total-transferred?startDate=dateString&endDate=dateString`  | Fetch total transferred amounds of USDC in a time interval             |
| GET    | `/top-accounts?limit=number`                                  | Fetch a list of the most USDC transactioning accounts                  |

## 4. Deployment Considerations

- **Security**: Protect API endpoints with authorization.
- **Reliability**: Use multiple RPC nodes for redundancy.
- **Environment Variables**: As a deploy procedure it is recommended to store external URLs or sensitive data inside .env files. In this case we could store the RPC provider URL.  

## 5. Conclusion

This architecture ensures efficient interaction with the Avalanche blockchain, allowing seamless querying of USDC transfer events. 
