import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TotalTransferredDto } from './dto/total-transferred.dto';
import { TopAccountsDto } from './dto/top-accounts.dto';
import { TransfersService } from './transfers.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('USDC Transfers')
@Controller('transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService) {}

    @Get('total-transferred')
    @ApiOperation({ summary: 'Fetch total USDC transferred within a time interval' })
    @ApiQuery({ name: 'startDate', required: true, type: String })
    @ApiQuery({ name: 'endDate', required: true, type: String })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getTotalTransferred(@Query() query: TotalTransferredDto): Promise<string | 0> {
        return this.transfersService.getTotalTransferred(query.startDate, query.endDate);
    }

    @Get('top-accounts')
    @ApiOperation({ summary: 'Fetch top accounts by transaction volume' })
    @ApiQuery({ name: 'limit', required: true, type: Number })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getTopAccounts(@Query() query: TopAccountsDto) {
        return this.transfersService.getTopAccounts(query.limit);
    }
}
