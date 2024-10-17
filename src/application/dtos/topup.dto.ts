import { IsInt, IsPositive, Max } from 'class-validator';

export class TopUpDto {
  @IsInt()
  @IsPositive()
  @Max(10000000, { message: 'Top-up amount must be less than 10.000.000' })
  amount: number;
}
