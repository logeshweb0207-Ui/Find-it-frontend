export default function Pagination({
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize,
    totalItems
}) {

    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (

        <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Result information */}

            <div className="text-sm text-zinc-400">

                Showing{" "}

                <span className="text-white font-semibold">

                    {totalItems === 0
                        ? 0
                        : ((currentPage - 1) * pageSize) + 1
                    }

                </span>

                {" "}to{" "}

                <span className="text-white font-semibold">

                    {Math.min(
                        currentPage * pageSize,
                        totalItems
                    )}

                </span>

                {" "}of{" "}

                <span className="text-white font-semibold">
                    {totalItems}
                </span>

            </div>


            {/* Controls */}

            <div className="flex items-center gap-2">

                {/* Rows per page */}

                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                >

                    <option value={10}>
                        10
                    </option>

                    <option value={25}>
                        25
                    </option>

                    <option value={50}>
                        50
                    </option>

                    <option value={100}>
                        100
                    </option>

                </select>


                {/* Previous */}

                <button
                    disabled={currentPage === 1}
                    onClick={() =>
                        setCurrentPage(
                            currentPage - 1
                        )
                    }
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Previous
                </button>


                {/* Page numbers */}

                <div className="flex items-center gap-1">

                    {pageNumbers.map((page) => (

                        <button
                            key={page}
                            onClick={() =>
                                setCurrentPage(page)
                            }
                            className={`
                                min-w-9
                                px-3
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold

                                ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                }
                            `}
                        >

                            {page}

                        </button>

                    ))}

                </div>


                {/* Next */}

                <button
                    disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                    }
                    onClick={() =>
                        setCurrentPage(
                            currentPage + 1
                        )
                    }
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Next
                </button>

            </div>

        </div>

    );
}