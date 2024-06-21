import { dbInstance as db } from '../../database';
import { User } from '../../app/types.ts/types';
import bcrypt from 'bcrypt';

class UserService {
  async createUser(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const [user] = await db
      .insertInto('User')
      .values({ username, email, password: hashedPassword, createdAt: now, updatedAt: now })
      .returning(['id', 'username', 'email', 'createdAt', 'updatedAt'])
      .execute() as unknown as User[];

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await db
      .selectFrom('User')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    
    return user as unknown as User | null;
  }

  async getUsers(): Promise<User[]> {
    const users = await db.selectFrom('User').selectAll().execute();
    return users as unknown as User[];
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}

export const userService = new UserService();
