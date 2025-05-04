import PageLayout from "@/layouts/PageLayout";
import SelectGroup from "@/components/SelectGroup/SelectGroup";
import BookCardGrid, { BookCardGridSkeleton } from "@/components/BookCardGrid/BookCardGrid";
import { bookService } from "@/api/bookService";
import { BookFilterParams } from "@/types/book";
import { categoryService } from "@/api/categoryService";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination/Pagination";
import { PaginationData } from "@/types/paginate";
import { useState, useEffect, useCallback } from "react";
import { authorService } from "@/api/authorService";
import { useSearchParams } from "react-router-dom";

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState<BookFilterParams>({
        page: parseInt(searchParams.get('page') || '1'),
        size: parseInt(searchParams.get('size') || '20'),
        category_id: searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined,
        author_id: searchParams.get('author_id') ? parseInt(searchParams.get('author_id')!) : undefined,
        rating_star: searchParams.get('rating_star') ? parseInt(searchParams.get('rating_star')!) : undefined,
        sort_by: (searchParams.get('sort_by') as BookFilterParams['sort_by']) || 'on_sale',
    });

    const ratingOptions = [
        { name: "1 Star", value: "1" },
        { name: "2 Stars", value: "2" },
        { name: "3 Stars", value: "3" },
        { name: "4 Stars", value: "4" },
        { name: "5 Stars", value: "5" },
    ];

    const { data: books, isLoading, isError } = useQuery({
        queryKey: ['books', filters],
        queryFn: () => bookService.getBooks(filters),
        retry: false,
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryService.getCategories(),
        retry: false,
    });

    const { data: authors } = useQuery({
        queryKey: ['authors'],
        queryFn: () => authorService.getAuthors(),
        retry: false,
    });

    const [paginationData, setPaginationData] = useState<PaginationData>({
        current_page: filters.page || 1,
        total_pages: 20,
    });

    const updatePaginationData = useCallback(() => {
        if (books?.data?.meta) {
            const { page, total_pages } = books.data.meta;
            setPaginationData({
                current_page: page,
                total_pages: total_pages,
            });
        }
    }, [books]);

    useEffect(() => {
        updatePaginationData();
    }, [updatePaginationData]);

    const updateUrlParams = useCallback(() => {
        const newParams = new URLSearchParams();

        if (filters.page && filters.page > 1) newParams.set('page', filters.page.toString());
        if (filters.size && filters.size !== 20) newParams.set('size', filters.size.toString());
        if (filters.category_id) newParams.set('category_id', filters.category_id.toString());
        if (filters.author_id) newParams.set('author_id', filters.author_id.toString());
        if (filters.rating_star) newParams.set('rating_star', filters.rating_star.toString());
        if (filters.sort_by && filters.sort_by !== 'on_sale') newParams.set('sort_by', filters.sort_by);

        setSearchParams(newParams);
    }, [filters, setSearchParams]);

    useEffect(() => {
        updateUrlParams();
    }, [updateUrlParams]);

    const handleCategoryChange = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        const categoryId = parseInt(e.currentTarget.value);
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            category_id: prev.category_id === categoryId ? undefined : categoryId,
            page: 1,
        }));
    }, []);

    const handleAuthorChange = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        const authorId = parseInt(e.currentTarget.value);
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            author_id: prev.author_id === authorId ? undefined : authorId,
            page: 1,
        }));
    }, []);

    const handleRatingChange = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        const rating = parseInt(e.currentTarget.value);
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            rating_star: prev.rating_star === rating ? undefined : rating,
            page: 1,
        }));
    }, []);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            sort_by: e.target.value as BookFilterParams['sort_by'],
            page: 1,
        }));
    }, []);

    const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            size: parseInt(e.target.value),
            page: 1,
        }));
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            page,
        }));
    }, []);

    const displayInfo = useCallback(() => {
        const totalBooks = books?.data?.meta?.total || 0;
        const currentPage = paginationData.current_page;
        const pageSize = filters.size || 20;
        const startItem = totalBooks === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalBooks);

        return { totalBooks, startItem, endItem };
    }, [books?.data?.meta?.total, paginationData.current_page, filters.size]);

    const { totalBooks, startItem, endItem } = displayInfo();

    // if (isLoading) return <PageLayout pageTitle="Loading...">Loading...</PageLayout>;

    return (
        <PageLayout pageTitle="Books">
            <div className="flex justify-between gap-4">
                <aside className="flex flex-col gap-4 w-48">
                    <SelectGroup
                        header="Category"
                        options={categories?.data.map((category) => ({
                            name: category.category_name,
                            value: category.id.toString()
                        })) ?? []}
                        onClick={handleCategoryChange}
                        selectedValue={filters.category_id?.toString()}
                    />
                    <SelectGroup
                        header="Author"
                        options={authors?.data.map((author) => ({
                            name: author.author_name,
                            value: author.id.toString()
                        })) ?? []}
                        onClick={handleAuthorChange}
                        selectedValue={filters.author_id?.toString()}
                    />
                    <SelectGroup
                        header="Rating"
                        options={ratingOptions}
                        onClick={handleRatingChange}
                        selectedValue={filters.rating_star?.toString()}
                    />
                </aside>
                <main className="flex-1">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                            <p>Showing {startItem}-{endItem} of {totalBooks} books</p>
                            <div className="flex gap-2">
                                <select
                                    id="sort"
                                    name="sort"
                                    value={filters.sort_by || 'on_sale'}
                                    onChange={handleSortChange}
                                    className="select"
                                >
                                    <option value="on_sale">Sort by: On Sale</option>
                                    <option value="popularity">Sort by: Popularity</option>
                                    <option value="price_asc">Sort by price: Low to high</option>
                                    <option value="price_desc">Sort by price: High to low</option>
                                </select>
                                <select
                                    id="size"
                                    name="size"
                                    value={filters.size || 20}
                                    onChange={handleSizeChange}
                                    className="select w-auto"
                                >
                                    <option value={5}>Show 5</option>
                                    <option value={10}>Show 10</option>
                                    <option value={15}>Show 15</option>
                                    <option value={20}>Show 20</option>
                                    <option value={25}>Show 25</option>
                                </select>
                            </div>
                        </div>
                        {
                            isLoading ? (
                                <BookCardGridSkeleton />
                            ) :
                                isError ? (
                                    <p className="text-center text-2xl">No books found.</p>
                                ) :
                                    (
                                        <>
                                            <BookCardGrid books={books?.data?.data || []} className="py-4" />
                                            <div className="flex justify-center">
                                                <Pagination data={paginationData} onChange={handlePageChange} />
                                            </div>
                                        </>
                                    )
                        }
                    </div>
                </main>
            </div>
        </PageLayout>
    );
}
