import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  receiver?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  page?: string;
}
