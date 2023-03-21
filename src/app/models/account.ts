import { Transaction } from './transaction';

export class Account {
  id: number | null;
  userId: number;
  name: string;
  type: string;
  initialBalance: number;
  transactions: Array<Transaction>;
  constructor() {}
}
