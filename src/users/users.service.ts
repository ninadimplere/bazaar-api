import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      username: 'john',
      password: bcrypt.hashSync('changeme', 10),
    },
  ];

  async findOneByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
