interface PaginationMeta {
    total: number;
    page: number;
    size: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
