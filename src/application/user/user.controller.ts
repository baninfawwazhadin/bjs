import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
      },
      required: ['username'],
    },
  })
  async testResponse(@Body('username') username: string, @Res() res: Response) {
    const result = await this.userService.getUsername(username);
    res.status(200).send(result);
  }
}
