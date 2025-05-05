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
import { useTranslation } from "react-i18next";

export default function Shop() {
    const { t } = useTranslation("shop");
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
        { name: t("rating_options.stars_value", { value: "1", text: t("rating_options.star") }), value: "1" },
        { name: t("rating_options.stars_value", { value: "2", text: t("rating_options.stars") }), value: "2" },
        { name: t("rating_options.stars_value", { value: "3", text: t("rating_options.stars") }), value: "3" },
        { name: t("rating_options.stars_value", { value: "4", text: t("rating_options.stars") }), value: "4" },
        { name: t("rating_options.stars_value", { value: "5", text: t("rating_options.stars") }), value: "5" },
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
                filterTexts.push(`${t("filters.category")}: ${category.category_name}`);
            }
        }

        // Add author filter text if present
        if (filters.author_id && authors?.data) {
            const author = authors.data.find(auth => auth.id === filters.author_id);
            if (author) {
                filterTexts.push(`${t("filters.author")}: ${author.author_name}`);
            }
        }

        // Add rating filter text if present
        if (filters.rating_star) {
            const ratingOption = ratingOptions.find(opt => parseInt(opt.value) === filters.rating_star);
            if (ratingOption) {
                filterTexts.push(`${t("filters.rating")}: ${ratingOption.name}`);
            }
        }

        // Join all filter texts with commas
        const filterText = filterTexts.length > 0 ? `${t("filters.filtered_by", { type: "", value: filterTexts.join(', ') })}` : '';
        setCurrentTitleTrailing(filterText);
    }, [filters, categories?.data, authors?.data, ratingOptions, t]);

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

    if (isLoading) return <PageLayout pageTitle={t("page_status.loading")}>{t("page_status.loading")}</PageLayout>;

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
        <PageLayout pageTitle={t("page_title")} titleChildren={currentTitleTrailing}>
            {/* Desktop layout (hidden on mobile) */}
            <div className="hidden md:flex justify-between gap-4">
                <aside className="flex flex-col gap-4 w-48">
                    <div className="flex gap-2">
                        <h3 className="font-bold text-2xl">{t("filters.filter_by")}</h3>
                    </div>
                    <SelectGroup
                        header={t("filters.category")}
                        options={categories?.data?.map((category) => ({
                            name: category.category_name,
                            value: category.id.toString()
                        })) ?? []}
                        onClick={handleCategoryChange}
                        selectedValue={filters.category_id?.toString()}
                    />
                    <SelectGroup
                        header={t("filters.author")}
                        options={authors?.data?.map((author) => ({
                            name: author.author_name,
                            value: author.id.toString()
                        })) ?? []}
                        onClick={handleAuthorChange}
                        selectedValue={filters.author_id?.toString()}
                    />
                    <SelectGroup
                        header={t("filters.rating")}
                        options={ratingOptions}
                        onClick={handleRatingChange}
                        selectedValue={filters.rating_star?.toString()}
                    />
                </aside>
                <main className="flex-1">
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <p>{t("pagination.showing")} {startItem}-{endItem} {t("pagination.of")} {totalBooks} {t("pagination.books")}</p>
                            <div className="flex gap-2">
                                <select
                                    id="sort"
                                    name="sort"
                                    value={filters.sort_by || 'on_sale'}
                                    onChange={handleSortChange}
                                    className="select"
                                >
                                    <option value="on_sale">{t("filters.sort")}: {t("sort_options.on_sale")}</option>
                                    <option value="popularity">{t("filters.sort")}: {t("sort_options.popularity")}</option>
                                    <option value="price_asc">{t("sort_options.price_low_high")}</option>
                                    <option value="price_desc">{t("sort_options.price_high_low")}</option>
                                </select>
                                <select
                                    id="size"
                                    name="size"
                                    value={filters.size || 20}
                                    onChange={handleSizeChange}
                                    className="select w-auto"
                                >
                                    <option value={5}>{t("display_options.show_value", { value: 5 })}</option>
                                    <option value={10}>{t("display_options.show_value", { value: 10 })}</option>
                                    <option value={15}>{t("display_options.show_value", { value: 15 })}</option>
                                    <option value={20}>{t("display_options.show_value", { value: 20 })}</option>
                                    <option value={25}>{t("display_options.show_value", { value: 25 })}</option>
                                </select>
                            </div>
                        </div>
                        {
                            isLoading ? (
                                <BookCardGridSkeleton items={filters.size || 20} />
                            ) :
                                isError ? (
                                    <p className="text-center text-2xl">{t("no_books_found")}</p>
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
                                {t("filters.category")}
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <div className="max-h-[40vh] overflow-y-auto">
                                    <ul className="menu menu-sm p-2">
                                        <li>
                                            <a
                                                className={filters.category_id === undefined ? "active" : ""}
                                                onClick={() => handleMobileCategoryChange("")}
                                            >
                                                {t("filters.all_categories")}
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
                                {t("filters.author")}
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <div className="max-h-[40vh] overflow-y-auto">
                                    <ul className="menu menu-sm p-2">
                                        <li>
                                            <a
                                                className={filters.author_id === undefined ? "active" : ""}
                                                onClick={() => handleMobileAuthorChange("")}
                                            >
                                                {t("filters.all_authors")}
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
                                {t("filters.rating")}
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <ul className="menu menu-sm p-2">
                                    <li>
                                        <a
                                            className={filters.rating_star === undefined ? "active" : ""}
                                            onClick={() => handleMobileRatingChange("")}
                                        >
                                            {t("filters.any_rating")}
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
                                {t("filters.sort")}
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
                                <ul className="menu menu-sm p-2">
                                    <li>
                                        <a
                                            className={filters.sort_by === 'on_sale' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'on_sale' } } as any)}
                                        >
                                            {t("sort_options.on_sale")}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={filters.sort_by === 'popularity' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'popularity' } } as any)}
                                        >
                                            {t("sort_options.popularity")}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={filters.sort_by === 'price_asc' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'price_asc' } } as any)}
                                        >
                                            {t("sort_options.price_low_high")}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className={filters.sort_by === 'price_desc' ? "active" : ""}
                                            onClick={() => handleSortChange({ target: { value: 'price_desc' } } as any)}
                                        >
                                            {t("sort_options.price_high_low")}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-outline">
                                {t("display_options.show")} {filters.size}
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded-box">
                                <ul className="menu menu-sm p-2">
                                    {[5, 10, 15, 20, 25].map(size => (
                                        <li key={size}>
                                            <a
                                                className={filters.size === size ? "active" : ""}
                                                onClick={() => handleSizeChange({ target: { value: size.toString() } } as any)}
                                            >
                                                {t("display_options.show_value", { value: size })}
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
                                    {t("filters.clear_all")}
                                </button>
                            )}
                        </div>
                    )}

                    <p className="text-sm pb-2">{t("pagination.showing")} {startItem}-{endItem} {t("pagination.of")} {totalBooks} {t("pagination.books")}</p>
                </div>

                {
                    isLoading ? (
                        <BookCardGridSkeleton />
                    ) :
                        isError ? (
                            <p className="text-center text-2xl">{t("no_books_found")}</p>
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
