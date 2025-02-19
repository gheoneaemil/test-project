import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TotalTransferredDto } from './dto/total-transferred.dto';
import { TopAccountsDto } from './dto/top-accounts.dto';
import { TransfersService } from './transfers.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('USDC Transfers')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get('total-transferred')
  @ApiOperation({
    summary: 'Fetch total USDC transferred within a time interval',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiResponse({
    status: 200,
    description:
      'A stringified number will be returned, represending the ' +
      'total amount of USDC transferred within the time interval provided',
  })
  @ApiResponse({
    status: 400,
    description:
      'One or many of the following error messages will appear:   ' +
      "'endDate should not be empty', 'endDate must be a valid ISO 8601 date string', " +
      "'startDate should not be empty', 'startDate must be a valid ISO 8601 date string'",
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTotalTransferred(
    @Query() query: TotalTransferredDto,
  ): Promise<string | 0> {
    return this.transfersService.getTotalTransferred(
      query.startDate,
      query.endDate,
    );
  }

  @Get('top-accounts')
  @ApiOperation({ summary: 'Fetch top accounts by transaction volume' })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description:
      'A list of accounts({ account: string, totalVolume: string }) will be returned. The length of the list will be equal to the provided limit.',
  })
  @ApiResponse({
    status: 400,
    description:
      'One or many of the following error messages will appear:   ' +
      "'limit must not be greater than 100', 'limit must not be less than 1', " +
      "'limit must be an integer number'",
  })
  @ApiResponse({ status: 400 })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTopAccounts(@Query() query: TopAccountsDto) {
    return this.transfersService.getTopAccounts(query.limit);
  }
}
