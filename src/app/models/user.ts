import { Account } from './account';

export class User {
  id: number | null;
  name: string | null;
  lastName: string | null;
  email: string;
  password: string;
  accounts: Array<Account>;
  constructor() {}
}
