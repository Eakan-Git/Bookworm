interface PaginationMeta {
    total: number;
    page: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
