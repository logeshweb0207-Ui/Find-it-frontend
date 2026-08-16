import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";
import { getPendingData } from "../services/pendingApi";
import DetailsModal from "../components/dashboard/DetailsModal";

import RankingMetrics from "../components/ranking/RankingMetrics";
import RankingRow from "../components/ranking/RankingRow";
import RankingCard from "../components/ranking/RankingCard";

import {
    MdEmojiEvents,
    MdPsychology,
    MdTrendingUp,
    MdSecurity,
    MdRefresh,
    MdSearch,
} from "react-icons/md";


// ================================================================
// RANKING PAGE
// ================================================================

export default function Ranking() {

    // ============================================================
    // STATE
    // ============================================================

    const [lottery, setLottery] = useState("kerala");
    const [digits, setDigits] = useState("single");

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);

    // Ranking controls
    const [search, setSearch] = useState("");
    const [decision, setDecision] = useState("All");
    const [minimumAI, setMinimumAI] = useState("0");
    const [sortBy, setSortBy] = useState("ai");

    // ============================================================
    // PHASE 6.5
    // ============================================================

    // Maximum number the user allows the page to render
    const [resultLimit, setResultLimit] = useState(50);

    // Number currently visible before clicking Load More
    const [visibleCount, setVisibleCount] = useState(50);


    // ============================================================
    // RESULT LIMIT OPTIONS
    // ============================================================

    const resultLimitOptions =
        digits === "four"
            ? [50, 100, 250, 500]
            : [50, 100, 250, 500, 1000];


    // ============================================================
    // PROTECT FOUR-DIGIT LIMIT
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
    // RESET VISIBLE RANGE
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
        minimumAI,
        sortBy
    ]);


    // ============================================================
    // LOAD DATA
    // ============================================================

    useEffect(() => {

        let cancelled = false;

        async function loadRanking() {

            setLoading(true);
            setError("");

            try {

                console.log(
                    "Ranking loading:",
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
                        "Unable to load ranking data."
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
                    "AI Ranking Error:",
                    err
                );

                setData([]);

                setError(
                    err?.message ||
                    "Unable to load AI ranking data."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }

        loadRanking();

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

    const rankedData = useMemo(() => {

        const minAI =
            Number(minimumAI || 0);

        const query =
            search.trim();


        const filtered =
            data.filter((item) => {

                // ------------------------------------------------
                // Search
                // ------------------------------------------------

                if (
                    query !== "" &&
                    !String(
                        item?.number ?? ""
                    ).includes(query)
                ) {

                    return false;

                }


                // ------------------------------------------------
                // Decision
                // ------------------------------------------------

                if (
                    decision !== "All" &&
                    String(
                        item?.decision ?? ""
                    ) !== decision
                ) {

                    return false;

                }


                // ------------------------------------------------
                // Minimum AI
                // ------------------------------------------------

                if (
                    Number(
                        item?.masterAIScore || 0
                    ) < minAI
                ) {

                    return false;

                }


                return true;

            });


        // ========================================================
        // SORT
        // ========================================================

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


                case "confidence":

                    return (
                        Number(
                            b?.confidenceScore || 0
                        ) -
                        Number(
                            a?.confidenceScore || 0
                        )
                    );


                case "recovery":

                    return (
                        Number(
                            b?.recoveryScore || 0
                        ) -
                        Number(
                            a?.recoveryScore || 0
                        )
                    );


                case "pressure":

                    return (
                        Number(
                            b?.pressureScore || 0
                        ) -
                        Number(
                            a?.pressureScore || 0
                        )
                    );


                case "bounce":

                    return (
                        Number(
                            b?.bounceScore || 0
                        ) -
                        Number(
                            a?.bounceScore || 0
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


                case "ai":

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
        minimumAI,
        sortBy
    ]);


    // ============================================================
    // TOP 3
    // ============================================================

    const topRanked =
        rankedData.slice(0, 3);


    // ============================================================
    // PHASE 6.5
    // DISPLAYED DATA
    // ============================================================

    const maximumVisibleCount =
        Math.min(
            rankedData.length,
            resultLimit
        );


    const visibleRankedData =
        rankedData.slice(
            0,
            Math.min(
                visibleCount,
                resultLimit
            )
        );


    const actualVisibleCount =
        visibleRankedData.length;


    const hasMore =
        actualVisibleCount <
        maximumVisibleCount;


    // ============================================================
    // DIGIT LABEL
    // ============================================================

    const digitLabel =
        digits === "four"
            ? "four-digit"
            : digits === "triple"
                ? "triple-digit"
                : digits === "double"
                    ? "double-digit"
                    : "single-digit";


    // ============================================================
    // SUMMARY
    // ============================================================

    const stats = useMemo(() => {

        if (!rankedData.length) {

            return {
                total: 0,
                averageAI: "0.00",
                bestAI: "0.00",
                averageWin: "0.00",
            };

        }


        const totalAI =
            rankedData.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.masterAIScore || 0
                    ),
                0
            );


        const totalWin =
            rankedData.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.winProbability || 0
                    ),
                0
            );


        return {

            total:
                rankedData.length,

            averageAI:
                (
                    totalAI /
                    rankedData.length
                ).toFixed(2),

            bestAI:
                Number(
                    rankedData[0]
                        ?.masterAIScore || 0
                ).toFixed(2),

            averageWin:
                (
                    totalWin /
                    rankedData.length
                ).toFixed(2),

        };

    }, [
        rankedData
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
    // SCORE COLOR
    // ============================================================

    const getScoreColor = (value) => {

        const score =
            Number(value || 0);

        if (score >= 90) {
            return "text-emerald-400";
        }

        if (score >= 80) {
            return "text-blue-400";
        }

        if (score >= 70) {
            return "text-yellow-400";
        }

        if (score >= 60) {
            return "text-orange-400";
        }

        return "text-red-400";

    };


    // ============================================================
    // REFRESH
    // ============================================================

    const refreshRanking = async () => {

        setLoading(true);
        setError("");

        try {

            console.log(
                "Ranking refresh:",
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
                    "Unable to refresh ranking."
                );

            }

            setData(
                Array.isArray(result.items)
                    ? result.items
                    : []
            );

        } catch (err) {

            console.error(
                "Ranking Refresh Error:",
                err
            );

            setError(
                err?.message ||
                "Unable to refresh ranking."
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
        setMinimumAI("0");
        setSortBy("ai");

    };


    // ============================================================
    // LOAD MORE
    // ============================================================

    const loadMore = () => {

        setVisibleCount((current) => {

            return Math.min(
                current + 50,
                resultLimit,
                rankedData.length
            );

        });

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
                    PAGE HEADER
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
                            AI Intelligence
                        </p>


                        <h1 className="
                            mt-1
                            text-2xl
                            sm:text-3xl
                            lg:text-4xl
                            font-bold
                            text-white
                        ">
                            AI Ranking
                        </h1>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                            max-w-3xl
                        ">
                            Find the strongest numbers using
                            the Master AI scoring engine and
                            supporting intelligence metrics.
                        </p>

                    </div>


                    {/* Primary controls */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-3
                        w-full
                        xl:w-auto
                        xl:min-w-[480px]
                    ">


                        {/* Lottery */}

                        <select
                            value={lottery}
                            onChange={(e) =>
                                setLottery(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                min-w-0
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


                        {/* Digit */}

                        <select
                            value={digits}
                            onChange={(e) =>
                                setDigits(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                min-w-0
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


                        {/* Refresh */}

                        <button
                            type="button"
                            onClick={refreshRanking}
                            disabled={loading}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                px-4
                                py-3
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                text-white
                                text-sm
                                font-semibold
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
                    min-w-0
                ">


                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-3
                        min-w-0
                    ">


                        {/* Search */}

                        <div className="
                            relative
                            w-full
                            min-w-0
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
                                    min-w-0
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
                                min-w-0
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


                        {/* Minimum AI */}

                        <select
                            value={minimumAI}
                            onChange={(e) =>
                                setMinimumAI(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                min-w-0
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

                            <option value="0">
                                Minimum AI: Any
                            </option>

                            <option value="60">
                                Minimum AI: 60+
                            </option>

                            <option value="70">
                                Minimum AI: 70+
                            </option>

                            <option value="80">
                                Minimum AI: 80+
                            </option>

                            <option value="90">
                                Minimum AI: 90+
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
                                min-w-0
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

                            <option value="ai">
                                Sort: AI Score
                            </option>

                            <option value="win">
                                Sort: Win %
                            </option>

                            <option value="confidence">
                                Sort: Confidence
                            </option>

                            <option value="recovery">
                                Sort: Recovery
                            </option>

                            <option value="pressure">
                                Sort: Pressure
                            </option>

                            <option value="bounce">
                                Sort: Bounce
                            </option>

                            <option value="pending">
                                Sort: Pending
                            </option>

                        </select>

                    </div>


                    {/* Filter footer */}

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
                                {rankedData.length}
                            </span>{" "}

                            matching {digitLabel} numbers

                        </p>


                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                w-full
                                sm:w-auto
                                px-4
                                py-2
                                rounded-lg
                                bg-zinc-800
                                hover:bg-zinc-700
                                text-sm
                                text-white
                                transition
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
                    SUMMARY
                ================================================== */}

                <div className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-3
                    sm:gap-4
                    mb-6
                    min-w-0
                ">

                    <SummaryCard
                        title="Matching Numbers"
                        value={stats.total}
                        icon={<MdPsychology />}
                        color="text-blue-400"
                    />

                    <SummaryCard
                        title="Best AI Score"
                        value={stats.bestAI}
                        icon={<MdEmojiEvents />}
                        color="text-emerald-400"
                    />

                    <SummaryCard
                        title="Average AI Score"
                        value={stats.averageAI}
                        icon={<MdTrendingUp />}
                        color="text-cyan-400"
                    />

                    <SummaryCard
                        title="Average Win Probability"
                        value={`${stats.averageWin}%`}
                        icon={<MdSecurity />}
                        color="text-purple-400"
                    />

                </div>


                {/* ==================================================
                    TOP 3
                ================================================== */}

                {!loading &&
                    topRanked.length > 0 && (

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-4
                        mb-6
                        w-full
                        min-w-0
                    ">

                        {topRanked.map(
                            (item, index) => (

                            <div
                                key={`${item?.number}-${index}`}
                                className="
                                    min-w-0
                                    rounded-2xl
                                    border
                                    border-zinc-800
                                    bg-gradient-to-br
                                    from-zinc-900
                                    to-zinc-950
                                    p-4
                                    sm:p-5
                                "
                            >

                                {/* Top heading */}

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                ">

                                    <span className="
                                        text-xs
                                        uppercase
                                        tracking-wider
                                        text-slate-500
                                    ">
                                        Top {index + 1}
                                    </span>


                                    <span className="
                                        text-xl
                                        sm:text-2xl
                                    ">
                                        {index === 0
                                            ? "🥇"
                                            : index === 1
                                                ? "🥈"
                                                : "🥉"
                                        }
                                    </span>

                                </div>


                                {/* Number + AI */}

                                <div className="
                                    mt-4
                                    flex
                                    items-end
                                    justify-between
                                    gap-3
                                    min-w-0
                                ">

                                    <div className="
                                        min-w-0
                                    ">

                                        <p className="
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            text-white
                                            truncate
                                        ">
                                            {item?.number}
                                        </p>


                                        <span className={`
                                            inline-flex
                                            mt-2
                                            max-w-full
                                            px-3
                                            py-1
                                            rounded-full
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
                                        text-right
                                        shrink-0
                                    ">

                                        <p className="
                                            text-xs
                                            text-slate-500
                                        ">
                                            Master AI
                                        </p>


                                        <p className={`
                                            text-2xl
                                            sm:text-3xl
                                            font-bold
                                            ${getScoreColor(
                                                item?.masterAIScore
                                            )}
                                        `}>

                                            {Number(
                                                item?.masterAIScore ||
                                                0
                                            ).toFixed(2)}

                                        </p>

                                    </div>

                                </div>


                                {/* AI progress */}

                                <div className="
                                    mt-4
                                    h-2
                                    rounded-full
                                    bg-zinc-800
                                    overflow-hidden
                                ">

                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-blue-500
                                        "
                                        style={{
                                            width:
                                                `${Math.min(
                                                    Number(
                                                        item?.masterAIScore ||
                                                        0
                                                    ),
                                                    100
                                                )}%`
                                        }}
                                    />

                                </div>


                                {/* Intelligence metrics */}

                                <div className="
                                    mt-4
                                    min-w-0
                                ">

                                    <RankingMetrics
                                        item={item}
                                        compact
                                    />

                                </div>


                                {/* Details */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedItem(item)
                                    }
                                    className="
                                        mt-4
                                        w-full
                                        rounded-lg
                                        bg-zinc-800
                                        hover:bg-zinc-700
                                        px-4
                                        py-2
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                    "
                                >
                                    View Full Analysis
                                </button>

                            </div>

                        ))}

                    </div>

                )}


                {/* ==================================================
                    RANKED RESULTS
                ================================================== */}

                <div className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    overflow-hidden
                    min-w-0
                ">


                    {/* Ranking header */}

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
                        min-w-0
                    ">


                        <div className="
                            min-w-0
                        ">

                            <h2 className="
                                text-lg
                                sm:text-xl
                                font-bold
                                text-white
                            ">
                                Ranked Numbers
                            </h2>


                            <div className="
                                mt-1
                                flex
                                flex-wrap
                                items-center
                                gap-x-3
                                gap-y-1
                            ">

                                <p className="
                                    text-xs
                                    text-slate-500
                                ">
                                    Sorted by your selected
                                    intelligence metric
                                </p>


                                {!loading &&
                                    rankedData.length > 0 && (

                                    <span className="
                                        text-xs
                                        font-semibold
                                        text-blue-400
                                    ">
                                        Showing 1–
                                        {actualVisibleCount}
                                        {" "}
                                        of
                                        {" "}
                                        {rankedData.length}
                                    </span>

                                )}

                            </div>

                        </div>


                        {/* Result limit */}

                        {!loading &&
                            rankedData.length > 0 && (

                            <div className="
                                flex
                                items-center
                                gap-2
                                shrink-0
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
                                        focus:border-blue-500
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


                    {/* Result range information */}

                    {!loading &&
                        rankedData.length > 0 && (

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
                                    {rankedData.length}
                                </span>

                                {" "}matching {digitLabel} rankings

                            </p>


                            <p className="
                                text-xs
                                text-zinc-600
                            ">

                                Maximum selected:
                                {" "}
                                {Math.min(
                                    resultLimit,
                                    rankedData.length
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
                            Loading ranking...
                        </div>

                    )}


                    {/* Empty */}

                    {!loading &&
                        rankedData.length === 0 && (

                        <div className="
                            p-10
                            sm:p-12
                            text-center
                            text-slate-500
                        ">
                            No matching numbers found.
                        </div>

                    )}


                    {/* ==================================================
                        DESKTOP TABLE
                    ================================================== */}

                    {!loading &&
                        visibleRankedData.length > 0 && (

                        <div className="
                            hidden
                            lg:block
                            w-full
                            min-w-0
                            overflow-x-auto
                        ">

                            <table className="
                                w-full
                                table-auto
                                border-collapse
                            ">


                                <thead className="
                                    bg-zinc-800
                                ">

                                    <tr>

                                        <th className="
                                            px-2
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Rank
                                        </th>


                                        <th className="
                                            px-2
                                            py-3
                                            text-left
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Number
                                        </th>


                                        <th className="
                                            px-2
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            AI Score
                                        </th>


                                        <th className="
                                            px-2
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Confidence
                                        </th>


                                        <th className="
                                            px-2
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Recovery
                                        </th>


                                        <th className="
                                            px-2
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Win %
                                        </th>


                                        <th className="
                                            px-2
                                            py-3
                                            text-center
                                            text-xs
                                            font-semibold
                                            text-zinc-300
                                        ">
                                            Decision
                                        </th>


                                        <th className="
                                            px-2
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

                                    {visibleRankedData.map(
                                        (item, index) => (

                                        <RankingRow
                                            key={`${item?.number}-${index}`}
                                            item={item}
                                            rank={
                                                index + 1
                                            }
                                            onView={
                                                setSelectedItem
                                            }
                                            getDecisionClass={
                                                getDecisionClass
                                            }
                                            getScoreColor={
                                                getScoreColor
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
                        visibleRankedData.length > 0 && (

                        <div className="
                            lg:hidden
                            p-3
                            sm:p-4
                            space-y-3
                            min-w-0
                        ">

                            {visibleRankedData.map(
                                (item, index) => (

                                <RankingCard
                                    key={`${item?.number}-${index}`}
                                    item={item}
                                    rank={
                                        index + 1
                                    }
                                    onView={
                                        setSelectedItem
                                    }
                                    getDecisionClass={
                                        getDecisionClass
                                    }
                                    getScoreColor={
                                        getScoreColor
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
                                </span>

                                {" "}of{" "}

                                <span className="
                                    text-zinc-300
                                    font-semibold
                                ">
                                    {maximumVisibleCount}
                                </span>

                                {" "}available results

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


                    {/* Limit reached */}

                    {!loading &&
                        rankedData.length > 0 &&
                        !hasMore &&
                        actualVisibleCount > 0 && (

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

function SummaryCard({
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
            sm:p-5
            min-w-0
        ">

            <div className="
                flex
                items-center
                justify-between
                gap-3
                min-w-0
            ">

                <div className="
                    min-w-0
                ">

                    <p className="
                        text-sm
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

