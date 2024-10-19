export interface TopTransactions {
  username: string;
  amount: number;
}

export interface TransactionsFilter {
  sender?: string;
  receiver?: string;
  start_date?: string;
  end_date?: string;
  page?: string;
}

export interface DailyTransaction {
  date: string;
  total_amount: number;
}

export interface DetailTransaction {
  sender: string;
  receiver: string;
  amount: number;
  created: Date;
}
export interface TransactionsResponse {
  daily_transaction: DailyTransaction[];
  detail_transactions: DetailTransaction[];
  has_more: boolean;
}
