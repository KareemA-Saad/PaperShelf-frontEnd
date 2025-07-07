export interface Review {
    reviewId: string;
    bookId: string;
    bookTitle: string;
    coverImage?: string;
    author:string,
    user: { name: string };
    rating: number;
    text: string;
    createdAt: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
}