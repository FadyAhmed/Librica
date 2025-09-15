export interface ReturnedBorrowers {
  id: string;
  borrowedAt: Date;
  returnedAt: Date | null;
  dueDate: Date;
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    quantity: number;
    shelfLocation: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
