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
import { Filter } from "lucide-react";

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTitleTrailing, setCurrentTitleTrailing] = useState<string>('');
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

    // Function to update the filter text based on current filters
    const updateFilterText = useCallback(() => {
        const filterTexts = [];

        // Add category filter text if present
        if (filters.category_id && categories?.data) {
            const category = categories.data.find(cat => cat.id === filters.category_id);
            if (category) {
                filterTexts.push(`Category: ${category.category_name}`);
            }
        }

        // Add author filter text if present
        if (filters.author_id && authors?.data) {
            const author = authors.data.find(auth => auth.id === filters.author_id);
            if (author) {
                filterTexts.push(`Author: ${author.author_name}`);
            }
        }

        // Add rating filter text if present
        if (filters.rating_star) {
            const ratingOption = ratingOptions.find(opt => parseInt(opt.value) === filters.rating_star);
            if (ratingOption) {
                filterTexts.push(`Rating: ${ratingOption.name}`);
            }
        }

        // Join all filter texts with commas
        const filterText = filterTexts.length > 0 ? `Filtered by ${filterTexts.join(', ')}` : '';
        setCurrentTitleTrailing(filterText);
    }, [filters, categories?.data, authors?.data, ratingOptions]);

    // Update filter text whenever filters or data changes
    useEffect(() => {
        updateFilterText();
    }, [updateFilterText]);

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

    // This component is no longer used since we've redesigned the mobile filters
    // Keeping it for reference in case we need to revert
    const _UnusedMobileFilterDropdown = ({
        title,
        options,
        selectedValue,
        onChange
    }: {
        title: string,
        options: { name: string, value: string }[],
        selectedValue?: string,
        onChange: (value: string) => void
    }) => {
        return (
            <div className="dropdown dropdown-bottom w-full">
                <div tabIndex={0} role="button" className="btn btn-outline w-full justify-between">
                    <span>{title}</span>
                    <span>{selectedValue ? options.find(opt => opt.value === selectedValue)?.name : 'All'}</span>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
                    <li>
                        <a
                            className={selectedValue === undefined ? "active" : ""}
                            onClick={() => onChange("")}
                        >
                            All
                        </a>
                    </li>
                    {options.map((option) => (
                        <li key={option.value}>
                            <a
                                className={selectedValue === option.value ? "active" : ""}
                                onClick={() => onChange(option.value)}
                            >
                                {option.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // Handler for mobile filter changes
    const handleMobileCategoryChange = (value: string) => {
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            category_id: value ? parseInt(value) : undefined,
            page: 1,
        }));
    };

    const handleMobileAuthorChange = (value: string) => {
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            author_id: value ? parseInt(value) : undefined,
            page: 1,
        }));
    };

    const handleMobileRatingChange = (value: string) => {
        setFilters((prev: BookFilterParams) => ({
            ...prev,
            rating_star: value ? parseInt(value) : undefined,
            page: 1,
        }));
    };

    return (
        <PageLayout pageTitle="Books" titleChildren={currentTitleTrailing}>
            {/* Desktop layout (hidden on mobile) */}
            <div className="hidden md:flex justify-between gap-4">
                <aside className="flex flex-col gap-4 w-48">
                    <SelectGroup
                        header="Category"
                        options={categories?.data?.map((category) => ({
                            name: category.category_name,
                            value: category.id.toString()
                        })) ?? []}
                        onClick={handleCategoryChange}
                        selectedValue={filters.category_id?.toString()}
                    />
                    <SelectGroup
                        header="Author"
                        options={authors?.data?.map((author) => ({
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
                        <div className="flex justify-between items-center mb-4">
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

            {/* Mobile layout (hidden on md and larger screens) */}
            <div className="md:hidden">
                <div className="mb-4">
                    {/* Mobile filter chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className={`btn btn-sm ${filters.category_id ? 'btn-primary' : 'btn-outline'}`}>
                                Category
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <div className="max-h-[40vh] overflow-y-auto">
                                    <ul className="menu menu-sm p-2">
                                        <li>
                                            <a
                                                className={filters.category_id === undefined ? "active" : ""}
                                                onClick={() => handleMobileCategoryChange("")}
                                            >
                                                All Categories
                                            </a>
                                        </li>
                                        {categories?.data?.map((category) => (
                                            <li key={category.id}>
                                                <a
                                                    className={filters.category_id === category.id ? "active" : ""}
                                                    onClick={() => handleMobileCategoryChange(category.id.toString())}
                                                >
                                                    <span className="truncate">{category.category_name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className={`btn btn-sm ${filters.author_id ? 'btn-primary' : 'btn-outline'}`}>
                                Author
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <div className="max-h-[40vh] overflow-y-auto">
                                    <ul className="menu menu-sm p-2">
                                        <li>
                                            <a
                                                className={filters.author_id === undefined ? "active" : ""}
                                                onClick={() => handleMobileAuthorChange("")}
                                            >
                                                All Authors
                                            </a>
                                        </li>
                                        {authors?.data?.map((author) => (
                                            <li key={author.id}>
                                                <a
                                                    className={filters.author_id === author.id ? "active" : ""}
                                                    onClick={() => handleMobileAuthorChange(author.id.toString())}
                                                >
                                                    <span className="truncate">{author.author_name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className={`btn btn-sm ${filters.rating_star ? 'btn-primary' : 'btn-outline'}`}>
                                Rating
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <ul className="menu menu-sm p-2">
                                    <li>
                                        <a
                                            className={filters.rating_star === undefined ? "active" : ""}
                                            onClick={() => handleMobileRatingChange("")}
                                        >
                                            Any Rating
                                        </a>
                                    </li>
                                    {ratingOptions.map((option) => (
                                        <li key={option.value}>
                                            <a
                                                className={filters.rating_star === parseInt(option.value) ? "active" : ""}
                                                onClick={() => handleMobileRatingChange(option.value)}
                                            >
                                                {option.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-outline">
                                Sort
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <ul className="menu menu-sm p-2">
                                    <li>
                                        <a
                                            className={filters.sort_by === 'on_sale' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'on_sale' } } as any)}
                                        >
                                            On Sale
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={filters.sort_by === 'popularity' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'popularity' } } as any)}
                                        >
                                            Popularity
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={filters.sort_by === 'price_asc' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'price_asc' } } as any)}
                                        >
                                            Price: Low to High
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={filters.sort_by === 'price_desc' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'price_desc' } } as any)}
                                        >
                                            Price: High to Low
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-outline">
                                Show {filters.size}
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box">
                                <ul className="menu menu-sm p-2">
                                    {[5, 10, 15, 20, 25].map(size => (
                                        <li key={size}>
                                            <a
                                                className={filters.size === size ? "active" : ""}
                                                onClick={() => handleSizeChange({ target: { value: size.toString() } } as any)}
                                            >
                                                Show {size}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Active filters display */}
                    {(filters.category_id || filters.author_id || filters.rating_star) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {filters.category_id && categories?.data && (
                                <div className="badge badge-primary gap-1">
                                    {categories.data.find(c => c.id === filters.category_id)?.category_name}
                                    <button className="btn btn-xs btn-circle btn-ghost" onClick={() => handleMobileCategoryChange("")}>×</button>
                                </div>
                            )}
                            {filters.author_id && authors?.data && (
                                <div className="badge badge-primary gap-1">
                                    {authors.data.find(a => a.id === filters.author_id)?.author_name}
                                    <button className="btn btn-xs btn-circle btn-ghost" onClick={() => handleMobileAuthorChange("")}>×</button>
                                </div>
                            )}
                            {filters.rating_star && (
                                <div className="badge badge-primary gap-1">
                                    {ratingOptions.find(r => parseInt(r.value) === filters.rating_star)?.name}
                                    <button className="btn btn-xs btn-circle btn-ghost" onClick={() => handleMobileRatingChange("")}>×</button>
                                </div>
                            )}
                            {(filters.category_id || filters.author_id || filters.rating_star) && (
                                <button
                                    className="btn btn-xs btn-outline"
                                    onClick={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            category_id: undefined,
                                            author_id: undefined,
                                            rating_star: undefined,
                                            page: 1
                                        }));
                                    }}
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-sm pb-2">Showing {startItem}-{endItem} of {totalBooks} books</p>
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
                                    <BookCardGrid books={books?.data?.data || []} className="py-2" />
                                    <div className="flex justify-center mt-4">
                                        <Pagination data={paginationData} onChange={handlePageChange} />
                                    </div>
                                </>
                            )
                }
            </div>
        </PageLayout>
    );
}
