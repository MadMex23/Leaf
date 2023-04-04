export class Transaction {
  id: number | null;
  accountId: number;
  type: string;
  amount: number;
  description: string;
  date: string;

  constructor() {}
}
