import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TotalTransferredDto } from './dto/total-transferred.dto';
import { TopAccountsDto } from './dto/top-accounts.dto';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService) {}

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

}
