import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";
import { getPendingData } from "../services/pendingApi";
import DetailsModal from "../components/dashboard/DetailsModal";

import {
    MdRefresh,
    MdSearch,
    MdEmojiEvents,
    MdCheckCircle,
    MdTrendingUp,
    MdVisibility,
    MdBlock,
} from "react-icons/md";


export default function Decision() {

    // ============================================================
    // STATE
    // ============================================================

    const [lottery, setLottery] = useState("kerala");
    const [digits, setDigits] = useState("single");

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [decision, setDecision] = useState("All");

    // Sorting
    const [sortBy, setSortBy] = useState("masterAI");

    // Result control
    const [resultLimit, setResultLimit] = useState(50);
    const [visibleCount, setVisibleCount] = useState(50);


    // ============================================================
    // RESULT LIMIT OPTIONS
    // ============================================================

    const resultLimitOptions =
        digits === "four"
            ? [50, 100, 250, 500]
            : [50, 100, 250, 500, 1000];


    // ============================================================
    // DIGIT LABEL
    // ============================================================

    const digitLabel = useMemo(() => {

        switch (digits) {

            case "four":
                return "four-digit";

            case "triple":
                return "triple-digit";

            case "double":
                return "double-digit";

            default:
                return "single-digit";

        }

    }, [digits]);


    // ============================================================
    // PROTECT FOUR-DIGIT RESULT LIMIT
    // ============================================================

    useEffect(() => {

        if (
            digits === "four" &&
            resultLimit > 500
        ) {
            setResultLimit(500);
        }

    }, [
        digits,
        resultLimit
    ]);


    // ============================================================
    // RESET VISIBLE COUNT
    // ============================================================

    useEffect(() => {

        setVisibleCount(
            Math.min(
                50,
                resultLimit
            )
        );

    }, [
        resultLimit,
        lottery,
        digits,
        search,
        decision,
        sortBy
    ]);


    // ============================================================
    // LOAD DATA
    // ============================================================

    useEffect(() => {

        let cancelled = false;

        async function loadDecisionData() {

            setLoading(true);
            setError("");

            try {

                console.log(
                    "Decision loading:",
                    lottery,
                    digits
                );

                const result =
                    await getPendingData(
                        lottery,
                        digits
                    );

                if (!result?.success) {

                    throw new Error(
                        result?.message ||
                        "Unable to load decision data."
                    );

                }

                if (cancelled) {
                    return;
                }

                setData(
                    Array.isArray(result.items)
                        ? result.items
                        : []
                );

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Decision Error:",
                    err
                );

                setData([]);

                setError(
                    err?.message ||
                    "Unable to load decision data."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }

        loadDecisionData();

        return () => {
            cancelled = true;
        };

    }, [
        lottery,
        digits
    ]);


    // ============================================================
    // FILTER + SORT
    // ============================================================

    const decisionData = useMemo(() => {

        const query =
            search.trim();


        const filtered =
            data.filter((item) => {

                // Search

                if (
                    query !== "" &&
                    !String(
                        item?.number ?? ""
                    ).includes(query)
                ) {
                    return false;
                }


                // Decision

                if (
                    decision !== "All" &&
                    String(
                        item?.decision ?? ""
                    ) !== decision
                ) {
                    return false;
                }


                return true;

            });


        // Sort

        filtered.sort((a, b) => {

            switch (sortBy) {

                case "win":

                    return (
                        Number(
                            b?.winProbability || 0
                        ) -
                        Number(
                            a?.winProbability || 0
                        )
                    );


                case "prediction":

                    return (
                        Number(
                            b?.predictionScore || 0
                        ) -
                        Number(
                            a?.predictionScore || 0
                        )
                    );


                case "pending":

                    return (
                        Number(
                            b?.currentPending || 0
                        ) -
                        Number(
                            a?.currentPending || 0
                        )
                    );


                case "confidence":

                    return (
                        Number(
                            b?.confidenceScore || 0
                        ) -
                        Number(
                            a?.confidenceScore || 0
                        )
                    );


                case "masterAI":
                default:

                    return (
                        Number(
                            b?.masterAIScore || 0
                        ) -
                        Number(
                            a?.masterAIScore || 0
                        )
                    );

            }

        });


        return filtered;

    }, [
        data,
        search,
        decision,
        sortBy
    ]);


    // ============================================================
    // VISIBLE DATA
    // ============================================================

    const maximumVisibleCount =
        Math.min(
            decisionData.length,
            resultLimit
        );


    const visibleDecisionData =
        decisionData.slice(
            0,
            Math.min(
                visibleCount,
                resultLimit
            )
        );


    const actualVisibleCount =
        visibleDecisionData.length;


    const hasMore =
        actualVisibleCount <
        maximumVisibleCount;


    // ============================================================
    // SUMMARY
    // ============================================================

    const stats = useMemo(() => {

        const count = (value) =>
            decisionData.filter(
                (item) =>
                    item?.decision === value
            ).length;


        return {

            total:
                decisionData.length,

            excellent:
                count("Excellent"),

            strongBuy:
                count("Strong Buy"),

            good:
                count("Good"),

            watch:
                count("Watch"),

            average:
                count("Average"),

            skip:
                count("Skip"),

        };

    }, [
        decisionData
    ]);


    // ============================================================
    // TOP DECISIONS
    // ============================================================

    const topDecisionNumbers =
        useMemo(() => {

            return decisionData
                .filter(
                    (item) =>
                        item?.decision === "Excellent" ||
                        item?.decision === "Strong Buy"
                )
                .slice(0, 10);

        }, [
            decisionData
        ]);


    // ============================================================
    // DECISION STYLE
    // ============================================================

    const getDecisionClass = (value) => {

        switch (value) {

            case "Excellent":
                return "bg-green-600 text-white";

            case "Strong Buy":
                return "bg-blue-600 text-white";

            case "Good":
                return "bg-yellow-500 text-black";

            case "Watch":
                return "bg-orange-600 text-white";

            case "Average":
                return "bg-purple-600 text-white";

            case "Skip":
                return "bg-red-600 text-white";

            default:
                return "bg-zinc-700 text-white";

        }

    };


    // ============================================================
    // DECISION ICON
    // ============================================================

    const getDecisionIcon = (value) => {

        switch (value) {

            case "Excellent":
                return <MdEmojiEvents />;

            case "Strong Buy":
                return <MdTrendingUp />;

            case "Good":
                return <MdCheckCircle />;

            case "Watch":
                return <MdVisibility />;

            case "Skip":
                return <MdBlock />;

            default:
                return <MdCheckCircle />;

        }

    };


    // ============================================================
    // REFRESH
    // ============================================================

    const refreshDecision = async () => {

        setLoading(true);
        setError("");

        try {

            const result =
                await getPendingData(
                    lottery,
                    digits
                );

            if (!result?.success) {

                throw new Error(
                    result?.message ||
                    "Unable to refresh decision data."
                );

            }

            setData(
                Array.isArray(result.items)
                    ? result.items
                    : []
            );

        } catch (err) {

            console.error(
                "Decision refresh error:",
                err
            );

            setError(
                err?.message ||
                "Unable to refresh decision data."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // CLEAR FILTERS
    // ============================================================

    const clearFilters = () => {

        setSearch("");
        setDecision("All");
        setSortBy("masterAI");

    };


    // ============================================================
    // LOAD MORE
    // ============================================================

    const loadMore = () => {

        setVisibleCount((current) =>
            Math.min(
                current + 50,
                resultLimit,
                decisionData.length
            )
        );

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
                            Decision Intelligence
                        </p>


                        <h1 className="
                            mt-1
                            text-2xl
                            sm:text-3xl
                            lg:text-4xl
                            font-bold
                            text-white
                        ">
                            Decision Center
                        </h1>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                            max-w-3xl
                        ">
                            Focus on the AI decision assigned
                            to every ranked number.
                        </p>

                    </div>


                    {/* Controls */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-3
                        w-full
                        xl:w-auto
                        xl:min-w-[480px]
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


                        <select
                            value={digits}
                            onChange={(e) =>
                                setDigits(
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

                            <option value="single">
                                Single
                            </option>

                            <option value="double">
                                Double
                            </option>

                            <option value="triple">
                                Triple
                            </option>

                            <option value="four">
                                Four
                            </option>

                        </select>


                        <button
                            type="button"
                            onClick={refreshDecision}
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
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                text-white
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
                    FILTER TOOLBAR
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
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-3
                    ">


                        {/* Search */}

                        <div className="
                            relative
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
                                placeholder="Search Number..."
                                inputMode="numeric"
                                className="
                                    w-full
                                    bg-zinc-800
                                    border
                                    border-zinc-700
                                    rounded-xl
                                    pl-10
                                    pr-4
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    focus:border-blue-500
                                "
                            />

                        </div>


                        {/* Decision */}

                        <select
                            value={decision}
                            onChange={(e) =>
                                setDecision(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                bg-zinc-800
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

                            <option value="All">
                                All Decisions
                            </option>

                            <option value="Excellent">
                                Excellent
                            </option>

                            <option value="Strong Buy">
                                Strong Buy
                            </option>

                            <option value="Good">
                                Good
                            </option>

                            <option value="Watch">
                                Watch
                            </option>

                            <option value="Average">
                                Average
                            </option>

                            <option value="Skip">
                                Skip
                            </option>

                        </select>


                        {/* Sort */}

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                bg-zinc-800
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

                            <option value="masterAI">
                                Sort: Master AI
                            </option>

                            <option value="win">
                                Sort: Win %
                            </option>

                            <option value="prediction">
                                Sort: Prediction
                            </option>

                            <option value="confidence">
                                Sort: Confidence
                            </option>

                            <option value="pending">
                                Sort: Pending
                            </option>

                        </select>

                    </div>


                    <div className="
                        mt-3
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
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
                                {decisionData.length}
                            </span>{" "}

                            matching {digitLabel} numbers

                        </p>


                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                w-full
                                sm:w-auto
                                rounded-lg
                                bg-zinc-800
                                hover:bg-zinc-700
                                px-4
                                py-2
                                text-sm
                                text-white
                            "
                        >
                            Clear Filters
                        </button>

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
                    SUMMARY CARDS
                ================================================== */}

                <div className="
                    grid
                    grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                    gap-3
                    mb-6
                ">

                    <DecisionSummary
                        title="Excellent"
                        value={stats.excellent}
                        icon={<MdEmojiEvents />}
                        color="text-green-400"
                    />

                    <DecisionSummary
                        title="Strong Buy"
                        value={stats.strongBuy}
                        icon={<MdTrendingUp />}
                        color="text-blue-400"
                    />

                    <DecisionSummary
                        title="Good"
                        value={stats.good}
                        icon={<MdCheckCircle />}
                        color="text-yellow-400"
                    />

                    <DecisionSummary
                        title="Watch"
                        value={stats.watch}
                        icon={<MdVisibility />}
                        color="text-orange-400"
                    />

                    <DecisionSummary
                        title="Average"
                        value={stats.average}
                        icon={<MdCheckCircle />}
                        color="text-purple-400"
                    />

                    <DecisionSummary
                        title="Skip"
                        value={stats.skip}
                        icon={<MdBlock />}
                        color="text-red-400"
                    />

                </div>


                {/* ==================================================
                    TOP RECOMMENDED NUMBERS
                ================================================== */}

                {!loading &&
                    topDecisionNumbers.length > 0 && (

                    <div className="
                        mb-6
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-zinc-900
                        p-4
                        sm:p-5
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        ">

                            <div>

                                <p className="
                                    text-xs
                                    uppercase
                                    tracking-wider
                                    text-blue-400
                                ">
                                    Recommended
                                </p>

                                <h2 className="
                                    mt-1
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    text-white
                                ">
                                    Strongest Decisions
                                </h2>

                            </div>

                        </div>


                        <div className="
                            mt-4
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-5
                            gap-3
                        ">

                            {topDecisionNumbers
                                .slice(0, 10)
                                .map((item, index) => (

                                <button
                                    key={`${item?.number}-${index}`}
                                    type="button"
                                    onClick={() =>
                                        setSelectedItem(
                                            item
                                        )
                                    }
                                    className="
                                        text-left
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-zinc-950/50
                                        p-4
                                        hover:border-blue-500
                                        transition
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-between
                                    ">

                                        <span className="
                                            text-xs
                                            text-zinc-500
                                        ">
                                            #{index + 1}
                                        </span>

                                        <span className={`
                                            rounded-full
                                            px-2
                                            py-1
                                            text-[10px]
                                            font-bold
                                            ${getDecisionClass(
                                                item?.decision
                                            )}
                                        `}>
                                            {item?.decision}
                                        </span>

                                    </div>


                                    <p className="
                                        mt-3
                                        text-2xl
                                        font-bold
                                        text-white
                                    ">
                                        {item?.number}
                                    </p>


                                    <div className="
                                        mt-3
                                        grid
                                        grid-cols-2
                                        gap-2
                                    ">

                                        <SmallValue
                                            label="AI"
                                            value={
                                                item?.masterAIScore
                                            }
                                        />

                                        <SmallValue
                                            label="Win"
                                            value={
                                                `${item?.winProbability ?? 0}%`
                                            }
                                        />

                                    </div>

                                </button>

                            ))}

                        </div>

                    </div>

                )}


                {/* ==================================================
                    DECISION RESULTS
                ================================================== */}

                <div className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    overflow-hidden
                ">


                    {/* Header */}

                    <div className="
                        px-4
                        sm:px-5
                        py-4
                        border-b
                        border-zinc-800
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                sm:text-xl
                                font-bold
                                text-white
                            ">
                                Decision Rankings
                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-slate-500
                            ">
                                AI decisions ranked by the selected metric
                            </p>

                        </div>


                        {/* Result limit */}

                        {!loading &&
                            decisionData.length > 0 && (

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <span className="
                                    text-xs
                                    text-zinc-500
                                ">
                                    Show
                                </span>


                                <select
                                    value={resultLimit}
                                    onChange={(e) =>
                                        setResultLimit(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-zinc-700
                                        bg-zinc-800
                                        px-3
                                        py-2
                                        text-sm
                                        text-white
                                        outline-none
                                    "
                                >

                                    {resultLimitOptions.map(
                                        (limit) => (

                                        <option
                                            key={limit}
                                            value={limit}
                                        >
                                            {limit}
                                        </option>

                                    ))}

                                </select>


                                <span className="
                                    text-xs
                                    text-zinc-500
                                ">
                                    results
                                </span>

                            </div>

                        )}

                    </div>


                    {/* Range */}

                    {!loading &&
                        decisionData.length > 0 && (

                        <div className="
                            px-4
                            sm:px-5
                            py-3
                            border-b
                            border-zinc-800
                            bg-zinc-950/40
                            flex
                            flex-col
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            gap-2
                        ">

                            <p className="
                                text-xs
                                text-zinc-500
                            ">
                                Showing{" "}
                                <span className="
                                    text-zinc-300
                                    font-semibold
                                ">
                                    1–{actualVisibleCount}
                                </span>
                                {" "}of{" "}
                                <span className="
                                    text-zinc-300
                                    font-semibold
                                ">
                                    {decisionData.length}
                                </span>
                            </p>

                            <p className="
                                text-xs
                                text-zinc-600
                            ">
                                Maximum selected:{" "}
                                {Math.min(
                                    resultLimit,
                                    decisionData.length
                                )}
                            </p>

                        </div>

                    )}


                    {/* Loading */}

                    {loading && (

                        <div className="
                            p-12
                            text-center
                            text-slate-400
                        ">
                            Loading decisions...
                        </div>

                    )}


                    {/* Empty */}

                    {!loading &&
                        decisionData.length === 0 && (

                        <div className="
                            p-12
                            text-center
                            text-slate-500
                        ">
                            No matching decisions found.
                        </div>

                    )}


                    {/* ==================================================
                        DESKTOP TABLE
                    ================================================== */}

                    {!loading &&
                        visibleDecisionData.length > 0 && (

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
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Rank
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-left
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Number
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Decision
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            AI Score
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Prediction
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Win %
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Pending
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {visibleDecisionData.map(
                                        (item, index) => (

                                        <DecisionTableRow
                                            key={`${item?.number}-${index}`}
                                            item={item}
                                            index={index}
                                            onView={() =>
                                                setSelectedItem(
                                                    item
                                                )
                                            }
                                            getDecisionClass={
                                                getDecisionClass
                                            }
                                        />

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* ==================================================
                        TABLET + MOBILE
                    ================================================== */}

                    {!loading &&
                        visibleDecisionData.length > 0 && (

                        <div className="
                            lg:hidden
                            p-3
                            sm:p-4
                            space-y-3
                        ">

                            {visibleDecisionData.map(
                                (item, index) => (

                                <DecisionMobileCard
                                    key={`${item?.number}-${index}`}
                                    item={item}
                                    index={index}
                                    onView={() =>
                                        setSelectedItem(
                                            item
                                        )
                                    }
                                    getDecisionClass={
                                        getDecisionClass
                                    }
                                />

                            ))}

                        </div>

                    )}


                    {/* ==================================================
                        LOAD MORE
                    ================================================== */}

                    {!loading &&
                        hasMore && (

                        <div className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-2
                            border-t
                            border-zinc-800
                            bg-zinc-950/40
                            px-4
                            py-5
                        ">

                            <p className="
                                text-xs
                                text-zinc-500
                            ">
                                Showing{" "}
                                <span className="
                                    text-zinc-300
                                    font-semibold
                                ">
                                    {actualVisibleCount}
                                </span>{" "}
                                of{" "}
                                <span className="
                                    text-zinc-300
                                    font-semibold
                                ">
                                    {maximumVisibleCount}
                                </span>{" "}
                                available results
                            </p>


                            <button
                                type="button"
                                onClick={loadMore}
                                className="
                                    rounded-lg
                                    bg-blue-600
                                    hover:bg-blue-700
                                    active:scale-95
                                    px-5
                                    py-2
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                "
                            >
                                Load More
                            </button>

                        </div>

                    )}


                    {!loading &&
                        decisionData.length > 0 &&
                        !hasMore && (

                        <div className="
                            flex
                            items-center
                            justify-center
                            border-t
                            border-zinc-800
                            bg-zinc-950/30
                            px-4
                            py-4
                        ">

                            <p className="
                                text-xs
                                text-zinc-600
                            ">
                                Showing all{" "}
                                {actualVisibleCount}{" "}
                                selected results
                            </p>

                        </div>

                    )}

                </div>


                {/* ==================================================
                    DETAILS MODAL
                ================================================== */}

                <DetailsModal
                    item={selectedItem}
                    onClose={() =>
                        setSelectedItem(null)
                    }
                />

            </div>

        </Layout>

    );

}


// ================================================================
// SUMMARY CARD
// ================================================================

function DecisionSummary({
    title,
    value,
    icon,
    color
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
                gap-2
            ">

                <div className="
                    min-w-0
                ">

                    <p className="
                        text-xs
                        sm:text-sm
                        text-slate-400
                        truncate
                    ">
                        {title}
                    </p>


                    <p className={`
                        mt-2
                        text-2xl
                        sm:text-3xl
                        font-bold
                        ${color}
                    `}>
                        {value}
                    </p>

                </div>


                <div className={`
                    shrink-0
                    text-3xl
                    ${color}
                `}>
                    {icon}
                </div>

            </div>

        </div>

    );

}


// ================================================================
// SMALL VALUE
// ================================================================

function SmallValue({
    label,
    value
}) {

    return (

        <div className="
            rounded-lg
            bg-zinc-900
            p-2
        ">

            <p className="
                text-[10px]
                text-zinc-500
            ">
                {label}
            </p>

            <p className="
                mt-1
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
// DESKTOP TABLE ROW
// ================================================================

function DecisionTableRow({
    item,
    index,
    onView,
    getDecisionClass,
}) {

    return (

        <tr className="
            border-t
            border-zinc-800
            hover:bg-zinc-800/70
            transition
        ">

            <td className="
                px-3
                py-3
                text-center
                font-bold
                text-blue-400
            ">
                {index + 1}
            </td>


            <td className="
                px-3
                py-3
                font-bold
                text-white
            ">
                {item?.number}
            </td>


            <td className="
                px-3
                py-3
                text-center
            ">

                <span className={`
                    inline-flex
                    whitespace-nowrap
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-bold
                    ${getDecisionClass(
                        item?.decision
                    )}
                `}>
                    {item?.decision ||
                        "Unknown"}
                </span>

            </td>


            <td className="
                px-3
                py-3
                text-center
                font-bold
                text-cyan-400
            ">
                {item?.masterAIScore ?? "-"}
            </td>


            <td className="
                px-3
                py-3
                text-center
                text-white
            ">
                {item?.predictionScore ?? "-"}
            </td>


            <td className="
                px-3
                py-3
                text-center
                font-bold
                text-emerald-400
            ">
                {item?.winProbability ?? 0}%
            </td>


            <td className="
                px-3
                py-3
                text-center
                text-white
            ">
                {item?.currentPending ?? "-"}
            </td>


            <td className="
                px-3
                py-3
                text-center
            ">

                <button
                    type="button"
                    onClick={onView}
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

    );

}


// ================================================================
// MOBILE CARD
// ================================================================

function DecisionMobileCard({
    item,
    index,
    onView,
    getDecisionClass,
}) {

    return (

        <div className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-800/60
            p-4
        ">

            <div className="
                flex
                items-center
                justify-between
                gap-3
            ">

                <div>

                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        Rank #{index + 1}
                    </p>


                    <p className="
                        mt-1
                        text-2xl
                        font-bold
                        text-white
                    ">
                        {item?.number}
                    </p>

                </div>


                <span className={`
                    inline-flex
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-bold
                    whitespace-nowrap
                    ${getDecisionClass(
                        item?.decision
                    )}
                `}>
                    {item?.decision ||
                        "Unknown"}
                </span>

            </div>


            <div className="
                mt-4
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-2
            ">

                <SmallValue
                    label="AI"
                    value={
                        item?.masterAIScore
                    }
                />

                <SmallValue
                    label="Prediction"
                    value={
                        item?.predictionScore
                    }
                />

                <SmallValue
                    label="Win %"
                    value={
                        `${item?.winProbability ?? 0}%`
                    }
                />

                <SmallValue
                    label="Pending"
                    value={
                        item?.currentPending
                    }
                />

            </div>


            <button
                type="button"
                onClick={onView}
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

    );

}

