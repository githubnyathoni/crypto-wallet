import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TransferBalanceDto {
  @IsString()
  @IsNotEmpty()
  to_username: string;

  @IsNumber()
  @Min(1, { message: 'transfer amount must be positive' })
  amount: number;
}
