import { PaginationData } from "@/types/paginate";

export default function Pagination({ data, onChange }: { data: PaginationData, onChange: (page: number) => void }) {
    // Generate array of page numbers to display
    const generatePagination = () => {
        const pages = [];
        const maxPagesToShow = 5; // Show at most 5 page numbers

        if (data.total_pages <= maxPagesToShow) {
            // If we have 5 or fewer pages, show all of them
            for (let i = 1; i <= data.total_pages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of the middle section
            let startPage = Math.max(2, data.current_page - 1);
            let endPage = Math.min(data.total_pages - 1, data.current_page + 1);

            // Adjust if we're near the beginning
            if (data.current_page <= 3) {
                endPage = 4;
            }

            // Adjust if we're near the end
            if (data.current_page >= data.total_pages - 2) {
                startPage = data.total_pages - 3;
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < data.total_pages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(data.total_pages);
        }

        return pages;
    };

    const handlePageChange = (page: number | string) => {
        if (typeof page === 'number') {
            onChange(page);
        }
    };

    const pages = generatePagination();

    return (
        <div className="join">
            {/* Previous button */}
            <button
                className="join-item btn"
                onClick={() => data.current_page > 1 && onChange(data.current_page - 1)}
                disabled={data.current_page === 1}
            >
                Previous
            </button>

            {/* Page numbers */}
            {pages.map((page, index) => (
                typeof page === 'number' ? (
                    <button
                        key={index}
                        className={`join-item btn ${data.current_page === page ? 'btn-active' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ) : (
                    <button key={index} className="join-item btn btn-disabled">
                        {page}
                    </button>
                )
            ))}

            {/* Next button */}
            <button
                className="join-item btn"
                onClick={() => data.current_page < data.total_pages && onChange(data.current_page + 1)}
                disabled={data.current_page === data.total_pages}
            >
                Next
            </button>
        </div>
    );
}