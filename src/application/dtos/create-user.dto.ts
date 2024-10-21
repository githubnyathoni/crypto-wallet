import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  password: string;
}
