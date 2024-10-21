import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Max } from 'class-validator';

export class TopUpDto {
  @IsInt()
  @IsPositive()
  @Max(9999999, { message: 'Top-up amount must be less than 10.000.000' })
  @ApiProperty({
    example: 10000,
    description: 'Amount to be top up',
  })
  amount: number;
}
