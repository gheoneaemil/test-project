import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class TopAccountsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Prevent excessive queries
  limit: number;
}
