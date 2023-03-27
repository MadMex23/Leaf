import { Account } from './account';

export class User {
  id: number | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  accounts: Array<Account> | null;
  constructor() {}
}
