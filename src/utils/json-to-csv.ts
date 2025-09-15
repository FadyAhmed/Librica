// Define the interface for the Book and User objects
export interface Book {
  title: string;
  author: string;
}

export interface User {
  name: string;
  email: string;
}

// Define the interface for a single Borrower object
export interface Borrower {
  id: String;
  borrowedAt: String;
  returnedAt: String;
  dueDate: String;
  book_title: String;
  book_author: String;
  user_name: String;
  user_email: String;
}

// A utility function to convert JSON data into a CSV string.
export function jsonToCsv(borrowers: Borrower[]): string {
  if (!borrowers || borrowers.length === 0) {
    return "";
  }

  // Define the headers for the CSV file
  const headers = [
    "Borrower ID",
    "Borrowed At",
    "Returned At",
    "Due Date",
    "Book Title",
    "Book Author",
    "User Name",
    "User Email",
  ].join(",");

  // Map each borrower object to a CSV row
  const rows = borrowers.map((borrower) => {
    // Handle potential missing 'returnedAt' value
    const returnedAt = borrower.returnedAt || "";

    return [
      borrower.id,
      borrower.borrowedAt,
      returnedAt,
      borrower.dueDate,
      borrower.book_title,
      borrower.book_author,
      borrower.user_name,
      borrower.user_email,
    ]
      .map((value) => {
        // Ensure commas and quotes in values are handled correctly for CSV format
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
}
