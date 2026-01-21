export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export interface Transaction {
  _id?: string;
  id?: string;
  name: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  userId: string;
  createdAt?: string | Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface CreateTransactionRequest {
  name: string;
  type: TransactionType;
  amount: number;
  userId: string;
}

export interface UpdateTransactionRequest {
  name?: string;
  type?: TransactionType;
  amount?: number;
  status?: TransactionStatus;
}
