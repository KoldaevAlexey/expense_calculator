import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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

    return null;
  }
}
