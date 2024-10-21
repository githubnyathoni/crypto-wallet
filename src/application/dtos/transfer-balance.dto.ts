import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransferBalanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the receiver',
  })
  to_username: string;

  @IsNumber()
  @Min(1, { message: 'transfer amount must be positive' })
  @ApiProperty({
    example: 10000,
    description: 'Amount to be transferred',
  })
  amount: number;
}
