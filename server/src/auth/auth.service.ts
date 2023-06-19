import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const foundUser = await this.userService.findOne(email);
    const passwordIsValid = await argon2.verify(foundUser.password, password);

    if (foundUser && passwordIsValid) {
      return foundUser;
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async login(user: IUser) {
    const { id, email } = user;
    const token = this.jwtService.sign({ id, email });

    return { id, email, token };
  }
}
