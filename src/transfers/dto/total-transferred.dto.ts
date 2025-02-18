import { IsISO8601, IsNotEmpty } from 'class-validator';

export class TotalTransferredDto {
  @IsISO8601() // Ensures valid ISO date format (YYYY-MM-DD or full timestamp)
  @IsNotEmpty()
  startDate: string;

  @IsISO8601()
  @IsNotEmpty()
  endDate: string;
}
