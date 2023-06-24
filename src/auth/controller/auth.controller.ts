import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
// import axios from 'axios';

@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github')
  oauthGithub(@Query('code') code: string) {
    return this.authService.oauthGithub(code);
  }
}
