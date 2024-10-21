import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'password',
    description: 'Password of the user',
  })
  password: string;
}
