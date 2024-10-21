import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Username of the sender',
  })
  sender?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'hermione',
    description: 'Username of the receiver',
  })
  receiver?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '2024-10-10',
    description: 'Start date filter',
  })
  start_date?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '2024-10-20',
    description: 'End date filter',
  })
  end_date?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number for pagination',
  })
  page?: string;
}
