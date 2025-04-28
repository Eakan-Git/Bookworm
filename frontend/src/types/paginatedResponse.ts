interface PaginationMeta {
    total: number;
    page: number;
    total_pages: number;
    size?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
