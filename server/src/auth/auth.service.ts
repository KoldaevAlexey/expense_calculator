import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    const foundUser = await this.userService.findOne(email);
    const passwordIsValid = await argon2.verify(foundUser.password, password);

    if (foundUser && passwordIsValid) {
      return foundUser;
    }

    throw new UnauthorizedException('Invalid email or password');
  }
}
