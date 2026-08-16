import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";

import {
    MdHistory,
    MdRefresh,
    MdSearch,
    MdClose,
    MdCalendarToday,
} from "react-icons/md";


// ================================================================
// API
// ================================================================

const API = "http://localhost:5000/api";


// ================================================================
// HISTORY PAGE
// ================================================================

export default function History() {

    // ============================================================
    // STATE
    // ============================================================

    const [lottery, setLottery] = useState("kerala");

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);


    // ============================================================
    // LOAD HISTORY
    // ============================================================

    const loadHistory = async () => {

        setLoading(true);
        setError("");

        try {

            const updateEndpoint =
                lottery === "kerala"
                    ? `${API}/update`
                    : `${API}/dear/update`;

            const resultsEndpoint =
                lottery === "kerala"
                    ? `${API}/results`
                    : `${API}/dear/results`;


            /*
             * Update is best-effort.
             * Even when the external lottery API is unavailable,
             * we still load the saved backend results.
             */

            try {

                await fetch(updateEndpoint);

            } catch (updateError) {

                console.warn(
                    "History update unavailable. Loading saved results.",
                    updateError
                );

            }


            const response =
                await fetch(resultsEndpoint);


            if (!response.ok) {

                throw new Error(
                    `History request failed (${response.status}).`
                );

            }


            const json =
                await response.json();


            const items =
                Array.isArray(json?.items)
                    ? json.items
                    : [];


            setData(items);


            if (!items.length) {

                setError(
                    "No history records found."
                );

            }

        } catch (err) {

            console.error(
                "History loading error:",
                err
            );

            setData([]);

            setError(
                err?.message ||
                "Unable to load history."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // LOAD WHEN LOTTERY CHANGES
    // ============================================================

    useEffect(() => {

        loadHistory();

    }, [lottery]);


    // ============================================================
    // SEARCH
    // ============================================================

    const filteredData = useMemo(() => {

        const query =
            search.trim().toLowerCase();


        if (!query) {
            return data;
        }


        return data.filter((item) => {

            const ticket =
                String(
                    item?.first?.ticket ??
                    ""
                );


            const date =
                String(
                    item?.draw_date ??
                    item?.date ??
                    ""
                );


            const time =
                String(
                    item?.time ??
                    ""
                );


            return (
                ticket
                    .toLowerCase()
                    .includes(query) ||
                date
                    .toLowerCase()
                    .includes(query) ||
                time
                    .toLowerCase()
                    .includes(query)
            );

        });

    }, [
        data,
        search
    ]);


    // ============================================================
    // SORT NEWEST FIRST
    // ============================================================

    const sortedData = useMemo(() => {

        return [...filteredData].sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a?.draw_date ??
                        a?.date ??
                        0
                    ).getTime();


                const dateB =
                    new Date(
                        b?.draw_date ??
                        b?.date ??
                        0
                    ).getTime();


                if (
                    Number.isNaN(dateA) ||
                    Number.isNaN(dateB)
                ) {

                    return 0;

                }


                return dateB - dateA;

            }
        );

    }, [
        filteredData
    ]);


    // ============================================================
    // DATE FORMAT
    // ============================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return String(value);
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // ============================================================
    // NUMBER
    // ============================================================

    const getTicket = (item) => {

        return (
            item?.first?.ticket ??
            "-"
        );

    };


    // ============================================================
    // YEAR
    // ============================================================

    const getYear = (item) => {

        const value =
            item?.draw_date ??
            item?.date;


        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "-";
        }


        return date.getFullYear();

    };


    // ============================================================
    // OPEN DETAILS
    // ============================================================

    const openDetails = (item) => {

        setSelectedItem(item);

    };


    // ============================================================
    // CLEAR SEARCH
    // ============================================================

    const clearSearch = () => {

        setSearch("");

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Layout>

            <div className="
                w-full
                min-w-0
                max-w-full
                overflow-x-hidden
            ">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="
                    flex
                    flex-col
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                    gap-5
                    mb-6
                ">

                    <div className="
                        min-w-0
                    ">

                        <p className="
                            text-xs
                            sm:text-sm
                            uppercase
                            tracking-[0.18em]
                            font-semibold
                            text-blue-400
                        ">
                            Historical Results
                        </p>


                        <h1 className="
                            mt-1
                            text-2xl
                            sm:text-3xl
                            lg:text-4xl
                            font-bold
                            text-white
                        ">
                            History
                        </h1>


                        <p className="
                            mt-2
                            max-w-3xl
                            text-sm
                            text-slate-400
                        ">
                            Review previous lottery results
                            and search historical winning numbers.
                        </p>

                    </div>


                    {/* Controls */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-3
                        w-full
                        xl:w-auto
                        xl:min-w-[360px]
                    ">


                        <select
                            value={lottery}
                            onChange={(e) =>
                                setLottery(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                bg-zinc-900
                                border
                                border-zinc-700
                                rounded-xl
                                px-3
                                py-3
                                text-sm
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        >

                            <option value="kerala">
                                Kerala
                            </option>

                            <option value="dear">
                                Dear
                            </option>

                        </select>


                        <button
                            type="button"
                            onClick={loadHistory}
                            disabled={loading}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                            "
                        >

                            <MdRefresh
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            {loading
                                ? "Loading..."
                                : "Refresh"}

                        </button>

                    </div>

                </div>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <div className="
                    mb-6
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-3
                    sm:p-4
                ">

                    <div className="
                        relative
                        w-full
                    ">

                        <MdSearch className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-zinc-500
                            text-xl
                        " />


                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search ticket, date or draw time..."
                            className="
                                w-full
                                bg-zinc-800
                                border
                                border-zinc-700
                                rounded-xl
                                pl-10
                                pr-10
                                py-3
                                text-sm
                                text-white
                                outline-none
                                focus:border-blue-500
                            "
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={clearSearch}
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-zinc-500
                                    hover:text-white
                                "
                            >

                                <MdClose />

                            </button>

                        )}

                    </div>


                    <div className="
                        mt-3
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                    ">

                        <p className="
                            text-xs
                            text-zinc-500
                        ">

                            Showing{" "}

                            <span className="
                                font-semibold
                                text-zinc-300
                            ">
                                {filteredData.length}
                            </span>{" "}

                            of{" "}

                            <span className="
                                font-semibold
                                text-zinc-300
                            ">
                                {data.length}
                            </span>{" "}

                            records

                        </p>


                        <p className="
                            text-xs
                            text-zinc-600
                        ">
                            {lottery === "kerala"
                                ? "Kerala Lottery"
                                : "Dear Lottery"
                            }
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="
                        mb-6
                        rounded-xl
                        border
                        border-red-900
                        bg-red-950/40
                        px-4
                        py-3
                        text-sm
                        text-red-300
                    ">

                        {error}

                    </div>

                )}


                {/* ==================================================
                    SUMMARY
                ================================================== */}

                <div className="
                    grid
                    grid-cols-2
                    lg:grid-cols-3
                    gap-3
                    mb-6
                ">

                    <HistorySummary
                        title="Total Records"
                        value={data.length}
                        icon={
                            <MdHistory />
                        }
                        color="text-blue-400"
                    />


                    <HistorySummary
                        title="Visible Records"
                        value={
                            filteredData.length
                        }
                        icon={
                            <MdSearch />
                        }
                        color="text-cyan-400"
                    />


                    <HistorySummary
                        title="Latest Year"
                        value={
                            sortedData.length > 0
                                ? getYear(
                                    sortedData[0]
                                )
                                : "-"
                        }
                        icon={
                            <MdCalendarToday />
                        }
                        color="text-emerald-400"
                    />

                </div>


                {/* ==================================================
                    HISTORY TABLE
                ================================================== */}

                <div className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    overflow-hidden
                    min-w-0
                ">


                    {/* Header */}

                    <div className="
                        px-4
                        sm:px-5
                        py-4
                        border-b
                        border-zinc-800
                    ">

                        <h2 className="
                            text-lg
                            sm:text-xl
                            font-bold
                            text-white
                        ">
                            Historical Results
                        </h2>


                        <p className="
                            mt-1
                            text-xs
                            text-zinc-500
                        ">
                            Latest available results first
                        </p>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="
                            p-12
                            text-center
                            text-slate-400
                        ">

                            Loading history...

                        </div>

                    )}


                    {/* Empty */}

                    {!loading &&
                        !sortedData.length &&
                        !error && (

                        <div className="
                            p-12
                            text-center
                            text-slate-500
                        ">

                            No history records found.

                        </div>

                    )}


                    {/* ==================================================
                        DESKTOP TABLE
                    ================================================== */}

                    {!loading &&
                        sortedData.length > 0 && (

                        <div className="
                            hidden
                            lg:block
                            w-full
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                table-auto
                            ">

                                <thead className="
                                    bg-zinc-800
                                ">

                                    <tr>

                                        <th className="
                                            px-4
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            #
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Date
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Time
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Winning Number
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Year
                                        </th>


                                        <th className="
                                            px-4
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {sortedData.map(
                                        (item, index) => (

                                        <tr
                                            key={
                                                item?._id ??
                                                item?.id ??
                                                `${item?.draw_date ?? item?.date}-${item?.time ?? ""}-${index}`
                                            }
                                            className="
                                                border-t
                                                border-zinc-800
                                                hover:bg-zinc-800/70
                                                transition
                                            "
                                        >

                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                                font-bold
                                                text-blue-400
                                            ">
                                                {index + 1}
                                            </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-sm
                                                text-zinc-300
                                            ">
                                                {formatDate(
                                                    item?.draw_date ??
                                                    item?.date
                                                )}
                                            </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-sm
                                                text-zinc-300
                                            ">
                                                {item?.time ??
                                                    "—"}
                                            </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                            ">

                                                <span className="
                                                    inline-flex
                                                    rounded-xl
                                                    border
                                                    border-zinc-700
                                                    bg-zinc-800
                                                    px-4
                                                    py-2
                                                    text-lg
                                                    font-bold
                                                    text-white
                                                    whitespace-nowrap
                                                ">
                                                    {getTicket(item)}
                                                </span>

                                            </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                                text-zinc-300
                                            ">
                                                {getYear(item)}
                                            </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedItem(
                                                            item
                                                        )
                                                    }
                                                    className="
                                                        rounded-lg
                                                        bg-blue-600
                                                        hover:bg-blue-700
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* ==================================================
                        TABLET + MOBILE
                    ================================================== */}

                    {!loading &&
                        sortedData.length > 0 && (

                        <div className="
                            lg:hidden
                            p-3
                            sm:p-4
                            space-y-3
                        ">

                            {sortedData.map(
                                (item, index) => (

                                <div
                                    key={
                                        item?._id ??
                                        item?.id ??
                                        `${item?.draw_date ?? item?.date}-${item?.time ?? ""}-${index}`
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-zinc-800/60
                                        p-4
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    ">

                                        <div className="
                                            min-w-0
                                        ">

                                            <p className="
                                                text-[11px]
                                                text-zinc-500
                                            ">
                                                Record #{index + 1}
                                            </p>


                                            <p className="
                                                mt-1
                                                text-sm
                                                font-semibold
                                                text-zinc-300
                                            ">
                                                {formatDate(
                                                    item?.draw_date ??
                                                    item?.date
                                                )}
                                            </p>


                                            {item?.time && (

                                                <p className="
                                                    mt-1
                                                    text-xs
                                                    text-zinc-500
                                                ">
                                                    {item.time}
                                                </p>

                                            )}

                                        </div>


                                        <span className="
                                            shrink-0
                                            rounded-xl
                                            border
                                            border-zinc-700
                                            bg-zinc-900
                                            px-4
                                            py-2
                                            text-xl
                                            font-bold
                                            text-white
                                        ">
                                            {getTicket(item)}
                                        </span>

                                    </div>


                                    <div className="
                                        mt-4
                                        grid
                                        grid-cols-2
                                        gap-2
                                    ">

                                        <HistoryValue
                                            label="Year"
                                            value={
                                                getYear(item)
                                            }
                                        />


                                        <HistoryValue
                                            label="Lottery"
                                            value={
                                                lottery
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                lottery.slice(1)
                                            }
                                        />

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedItem(
                                                item
                                            )
                                        }
                                        className="
                                            mt-4
                                            w-full
                                            rounded-lg
                                            bg-blue-600
                                            hover:bg-blue-700
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        View Details
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* ==================================================
                    DETAILS MODAL
                ================================================== */}

                {selectedItem && (

                    <HistoryDetailsModal
                        item={selectedItem}
                        lottery={lottery}
                        onClose={() =>
                            setSelectedItem(null)
                        }
                    />

                )}

            </div>

        </Layout>

    );

}


// ================================================================
// SUMMARY CARD
// ================================================================

function HistorySummary({
    title,
    value,
    icon,
    color,
}) {

    return (

        <div className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-900
            p-4
            min-w-0
        ">

            <div className="
                flex
                items-center
                justify-between
                gap-3
            ">

                <div className="
                    min-w-0
                ">

                    <p className="
                        text-xs
                        sm:text-sm
                        text-zinc-500
                        truncate
                    ">
                        {title}
                    </p>


                    <p className={`
                        mt-2
                        text-xl
                        sm:text-2xl
                        font-bold
                        ${color}
                    `}>
                        {value}
                    </p>

                </div>


                <div className={`
                    shrink-0
                    text-2xl
                    ${color}
                `}>
                    {icon}
                </div>

            </div>

        </div>

    );

}


// ================================================================
// HISTORY VALUE
// ================================================================

function HistoryValue({
    label,
    value
}) {

    return (

        <div className="
            rounded-lg
            bg-zinc-900
            p-3
            min-w-0
        ">

            <p className="
                text-[10px]
                text-zinc-500
            ">
                {label}
            </p>


            <p className="
                mt-1
                truncate
                text-sm
                font-bold
                text-white
            ">
                {value ?? "-"}
            </p>

        </div>

    );

}


// ================================================================
// DETAILS MODAL
// ================================================================

function HistoryDetailsModal({
    item,
    lottery,
    onClose
}) {

    const isDear =
        lottery === "dear";


    const ticket =
        item?.first?.ticket ??
        "-";


    const date =
        item?.draw_date ??
        item?.date ??
        "-";


    const extraEntries =
        Object.entries(
            item || {}
        ).filter(
            ([key]) =>
                ![
                    "_id",
                    "id",
                    "first",
                    "draw_date",
                    "date",
                    "time",
                    "latest"
                ].includes(key)
        );


    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/70
                p-3
                sm:p-6
            "
            onMouseDown={(e) => {

                if (
                    e.target === e.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div className="
                flex
                max-h-[90vh]
                w-full
                max-w-2xl
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-zinc-700
                bg-zinc-950
                shadow-2xl
            ">


                {/* Header */}

                <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-zinc-800
                    px-4
                    sm:px-5
                    py-4
                ">

                    <div className="
                        min-w-0
                    ">

                        <p className="
                            text-xs
                            uppercase
                            tracking-wider
                            text-blue-400
                        ">
                            History Details
                        </p>


                        <h2 className="
                            mt-1
                            text-xl
                            sm:text-2xl
                            font-bold
                            text-white
                        ">
                            {ticket}
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            shrink-0
                            rounded-lg
                            bg-zinc-800
                            p-2
                            text-zinc-300
                            hover:bg-zinc-700
                            hover:text-white
                        "
                    >
                        <MdClose className="text-xl" />
                    </button>

                </div>


                {/* Content */}

                <div className="
                    flex-1
                    overflow-y-auto
                    p-4
                    sm:p-5
                ">

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-3
                    ">

                        <HistoryValue
                            label="Lottery"
                            value={
                                isDear
                                    ? "Dear"
                                    : "Kerala"
                            }
                        />


                        <HistoryValue
                            label="Date"
                            value={
                                formatDate(date)
                            }
                        />


                        <HistoryValue
                            label="Draw Time"
                            value={
                                item?.time ??
                                "—"
                            }
                        />


                        <HistoryValue
                            label="Winning Number"
                            value={ticket}
                        />


                        <HistoryValue
                            label="Latest"
                            value={
                                item?.latest
                                    ? "Yes"
                                    : "No"
                            }
                        />

                    </div>


                    {extraEntries.length > 0 && (

                        <div className="
                            mt-4
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            gap-3
                        ">

                            {extraEntries.map(
                                ([key, value]) => (

                                <HistoryValue
                                    key={key}
                                    label={key}
                                    value={
                                        typeof value ===
                                        "object"
                                            ? JSON.stringify(
                                                value
                                            )
                                            : value
                                    }
                                />

                            ))}

                        </div>

                    )}

                </div>


                {/* Footer */}

                <div className="
                    border-t
                    border-zinc-800
                    px-4
                    sm:px-5
                    py-3
                ">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-full
                            rounded-lg
                            bg-blue-600
                            hover:bg-blue-700
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                        "
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}


// ================================================================
// DATE FORMATTER
// ================================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

}

