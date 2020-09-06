import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface AccountStatement {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): AccountStatement {
    return { transactions: this.transactions, balance: this.getBalance() };
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((total, transaction) => {
      if (transaction.type === 'income') {
        return total + transaction.value;
      }
      return total;
    }, 0);

    const outcome = this.transactions.reduce((total, transaction) => {
      if (transaction.type === 'outcome') {
        return total + transaction.value;
      }

      return total;
    }, 0);

    return { income, outcome, total: income - outcome };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const balanceTotal = this.getBalance().total;

    if (type === 'outcome') {
      if (balanceTotal - value < 0) {
        throw Error('The outcome value is not available');
      }
    }
    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
