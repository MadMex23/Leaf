export class Transaction {
  id: number | null;
  userId: number;
  accountId: number;
  type: string;
  amount: number;
  description: string;
  date: string;

  constructor() {}
}
