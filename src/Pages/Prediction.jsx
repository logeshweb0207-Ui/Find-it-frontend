import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";
import { getPendingData } from "../services/pendingApi";
import DetailsModal from "../components/dashboard/DetailsModal";
import PredictionMetrics from "../components/prediction/PredictionMetrics";

import {
    MdTrendingUp,
    MdRefresh,
    MdSearch,
    MdSpeed,
    MdPsychology,
    MdEmojiEvents
} from "react-icons/md";


export default function Prediction() {

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
    const [sortBy, setSortBy] = useState("prediction");

    // Result limit
    const [resultLimit, setResultLimit] = useState(50);

    // Currently visible rows/cards
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

        async function loadPrediction() {

            setLoading(true);
            setError("");

            try {

                console.log(
                    "Prediction loading:",
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
                        "Unable to load prediction data."
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
                    "Prediction Error:",
                    err
                );

                setData([]);

                setError(
                    err?.message ||
                    "Unable to load prediction data."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }

        loadPrediction();

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

    const predictionData = useMemo(() => {

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


                case "pending":

                    return (
                        Number(
                            b?.currentPending || 0
                        ) -
                        Number(
                            a?.currentPending || 0
                        )
                    );


                case "prediction":
                default:

                    return (
                        Number(
                            b?.predictionScore || 0
                        ) -
                        Number(
                            a?.predictionScore || 0
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
    // DISPLAY RANGE
    // ============================================================

    const maximumVisibleCount =
        Math.min(
            predictionData.length,
            resultLimit
        );


    const visiblePredictionData =
        predictionData.slice(
            0,
            Math.min(
                visibleCount,
                resultLimit
            )
        );


    const actualVisibleCount =
        visiblePredictionData.length;


    const hasMore =
        actualVisibleCount <
        maximumVisibleCount;


    // ============================================================
    // TOP 3
    // ============================================================

    const topPredictions =
        predictionData.slice(0, 3);


    // ============================================================
    // SUMMARY
    // ============================================================

    const stats = useMemo(() => {

        if (!predictionData.length) {

            return {
                total: 0,
                bestPrediction: "0.00",
                averagePrediction: "0.00",
                averageWin: "0.00"
            };

        }


        const totalPrediction =
            predictionData.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.predictionScore || 0
                    ),
                0
            );


        const totalWin =
            predictionData.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item?.winProbability || 0
                    ),
                0
            );


        return {

            total:
                predictionData.length,

            bestPrediction:
                Number(
                    predictionData[0]
                        ?.predictionScore || 0
                ).toFixed(2),

            averagePrediction:
                (
                    totalPrediction /
                    predictionData.length
                ).toFixed(2),

            averageWin:
                (
                    totalWin /
                    predictionData.length
                ).toFixed(2)

        };

    }, [
        predictionData
    ]);


    // ============================================================
    // DECISION COLORS
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
    // PREDICTION SCORE COLOR
    // ============================================================

    const getPredictionColor = (value) => {

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

    const refreshPrediction = async () => {

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
                    "Unable to refresh prediction data."
                );

            }

            setData(
                Array.isArray(result.items)
                    ? result.items
                    : []
            );

        } catch (err) {

            console.error(
                "Prediction refresh error:",
                err
            );

            setError(
                err?.message ||
                "Unable to refresh prediction data."
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
        setSortBy("prediction");

    };


    // ============================================================
    // LOAD MORE
    // ============================================================

    const loadMore = () => {

        setVisibleCount((current) => {

            return Math.min(
                current + 50,
                resultLimit,
                predictionData.length
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

                    <div className="min-w-0">

                        <p className="
                            text-xs
                            sm:text-sm
                            uppercase
                            tracking-[0.18em]
                            font-semibold
                            text-blue-400
                        ">
                            Prediction Intelligence
                        </p>


                        <h1 className="
                            mt-1
                            text-2xl
                            sm:text-3xl
                            lg:text-4xl
                            font-bold
                            text-white
                        ">
                            Prediction
                        </h1>


                        <p className="
                            mt-2
                            text-sm
                            text-slate-400
                            max-w-3xl
                        ">
                            Numbers ranked by prediction strength,
                            confidence, recovery and win probability.
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
                            onClick={refreshPrediction}
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
                    FILTERS
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

                            <option value="prediction">
                                Sort: Prediction
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
                                text-zinc-300
                                font-semibold
                            ">
                                {predictionData.length}
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
                ">

                    <PredictionSummary
                        title="Prediction Numbers"
                        value={stats.total}
                        icon={<MdPsychology />}
                        color="text-blue-400"
                    />

                    <PredictionSummary
                        title="Best Prediction"
                        value={stats.bestPrediction}
                        icon={<MdEmojiEvents />}
                        color="text-emerald-400"
                    />

                    <PredictionSummary
                        title="Average Prediction"
                        value={stats.averagePrediction}
                        icon={<MdTrendingUp />}
                        color="text-cyan-400"
                    />

                    <PredictionSummary
                        title="Average Win %"
                        value={`${stats.averageWin}%`}
                        icon={<MdSpeed />}
                        color="text-purple-400"
                    />

                </div>


                {/* ==================================================
                    TOP 3
                ================================================== */}

                {!loading &&
                    topPredictions.length > 0 && (

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-4
                        mb-6
                    ">

                        {topPredictions.map(
                            (item, index) => (

                            <div
                                key={`${item?.number}-${index}`}
                                className="
                                    rounded-2xl
                                    border
                                    border-zinc-800
                                    bg-zinc-900
                                    p-4
                                    sm:p-5
                                "
                            >

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <span className="
                                        text-xs
                                        uppercase
                                        tracking-wider
                                        text-slate-500
                                    ">
                                        Prediction #{index + 1}
                                    </span>


                                    <span className="
                                        text-xl
                                    ">
                                        {index === 0
                                            ? "🥇"
                                            : index === 1
                                                ? "🥈"
                                                : "🥉"
                                        }
                                    </span>

                                </div>


                                <div className="
                                    mt-4
                                    flex
                                    items-end
                                    justify-between
                                    gap-3
                                ">

                                    <div className="
                                        min-w-0
                                    ">

                                        <p className="
                                            text-3xl
                                            font-bold
                                            text-white
                                            truncate
                                        ">
                                            {item?.number}
                                        </p>


                                        <span className={`
                                            inline-flex
                                            mt-2
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
                                        text-right
                                        shrink-0
                                    ">

                                        <p className="
                                            text-xs
                                            text-slate-500
                                        ">
                                            Prediction
                                        </p>


                                        <p className={`
                                            text-3xl
                                            font-bold
                                            ${getPredictionColor(
                                                item?.predictionScore
                                            )}
                                        `}>
                                            {Number(
                                                item?.predictionScore ||
                                                0
                                            ).toFixed(2)}
                                        </p>

                                    </div>

                                </div>


                                <div className="
                                    mt-5
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
                                                        item?.predictionScore ||
                                                        0
                                                    ),
                                                    100
                                                )}%`
                                        }}
                                    />

                                </div>


                                <div className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-zinc-800
                                    bg-zinc-950/40
                                    px-3
                                    py-2
                                ">

                                    <p className="
                                        text-[11px]
                                        text-slate-500
                                    ">
                                        Current Pending
                                    </p>


                                    <p className="
                                        mt-1
                                        text-lg
                                        font-bold
                                        text-white
                                    ">
                                        {item?.currentPending ??
                                            "-"}
                                    </p>

                                </div>


                                <div className="
                                    mt-4
                                    min-w-0
                                ">

                                    <PredictionMetrics
                                        item={item}
                                        compact
                                    />

                                </div>


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
                    PREDICTION RESULTS
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
                                Prediction Rankings
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
                                    Highest prediction scores first
                                </p>


                                {!loading &&
                                    predictionData.length > 0 && (

                                    <span className="
                                        text-xs
                                        font-semibold
                                        text-blue-400
                                    ">
                                        Showing 1–
                                        {actualVisibleCount}
                                        {" "}of{" "}
                                        {predictionData.length}
                                    </span>

                                )}

                            </div>

                        </div>


                        {/* Result limit */}

                        {!loading &&
                            predictionData.length > 0 && (

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


                    {/* Range information */}

                    {!loading &&
                        predictionData.length > 0 && (

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
                                    font-semibold
                                    text-zinc-300
                                ">
                                    1–{actualVisibleCount}
                                </span>

                                {" "}of{" "}

                                <span className="
                                    font-semibold
                                    text-zinc-300
                                ">
                                    {predictionData.length}
                                </span>

                                {" "}matching {digitLabel} predictions

                            </p>


                            <p className="
                                text-xs
                                text-zinc-600
                            ">
                                Maximum selected:
                                {" "}
                                {Math.min(
                                    resultLimit,
                                    predictionData.length
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
                            Loading predictions...
                        </div>

                    )}


                    {/* Empty */}

                    {!loading &&
                        predictionData.length === 0 && (

                        <div className="
                            p-12
                            text-center
                            text-slate-500
                        ">
                            No matching predictions found.
                        </div>

                    )}


                    {/* ==================================================
                        DESKTOP
                    ================================================== */}

                    {!loading &&
                        visiblePredictionData.length > 0 && (

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
                                            Prediction
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Confidence
                                        </th>

                                        <th className="
                                            px-3
                                            py-3
                                            text-center
                                            text-xs
                                            text-zinc-300
                                        ">
                                            Recovery
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
                                            Decision
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

                                    {visiblePredictionData.map(
                                        (item, index) => {

                                        const score =
                                            Number(
                                                item?.predictionScore ||
                                                0
                                            );


                                        return (

                                            <tr
                                                key={`${item?.number}-${index}`}
                                                className="
                                                    border-t
                                                    border-zinc-800
                                                    hover:bg-zinc-800/70
                                                    transition
                                                "
                                            >

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
                                                ">

                                                    <div className="
                                                        min-w-[140px]
                                                    ">

                                                        <div className="
                                                            flex
                                                            items-center
                                                            justify-between
                                                            gap-2
                                                        ">

                                                            <span className={`
                                                                font-bold
                                                                ${getPredictionColor(
                                                                    score
                                                                )}
                                                            `}>
                                                                {score.toFixed(2)}
                                                            </span>


                                                            <span className="
                                                                text-[11px]
                                                                text-zinc-500
                                                            ">
                                                                / 100
                                                            </span>

                                                        </div>


                                                        <div className="
                                                            mt-2
                                                            h-2
                                                            rounded-full
                                                            bg-zinc-700
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
                                                                            score,
                                                                            100
                                                                        )}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>

                                                </td>


                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                    text-white
                                                ">
                                                    {item?.confidenceScore ??
                                                        "-"}
                                                </td>


                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                    text-white
                                                ">
                                                    {item?.recoveryScore ??
                                                        "-"}
                                                </td>


                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                    font-bold
                                                    text-emerald-400
                                                ">
                                                    {item?.winProbability ??
                                                        0}%
                                                </td>


                                                <td className="
                                                    px-3
                                                    py-3
                                                    text-center
                                                ">

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

                                                </td>


                                                <td className="
                                                    px-3
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

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* ==================================================
                        TABLET + MOBILE
                    ================================================== */}

                    {!loading &&
                        visiblePredictionData.length > 0 && (

                        <div className="
                            lg:hidden
                            p-3
                            sm:p-4
                            space-y-3
                            min-w-0
                        ">

                            {visiblePredictionData.map(
                                (item, index) => {

                                const score =
                                    Number(
                                        item?.predictionScore ||
                                        0
                                    );


                                return (

                                    <div
                                        key={`${item?.number}-${index}`}
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


                                            <div className="
                                                text-right
                                            ">

                                                <p className="
                                                    text-xs
                                                    text-slate-500
                                                ">
                                                    Prediction
                                                </p>


                                                <p className={`
                                                    text-2xl
                                                    font-bold
                                                    ${getPredictionColor(
                                                        score
                                                    )}
                                                `}>
                                                    {score.toFixed(2)}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="
                                            mt-3
                                            h-2
                                            rounded-full
                                            bg-zinc-700
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
                                                            score,
                                                            100
                                                        )}%`
                                                }}
                                            />

                                        </div>


                                        <div className="
                                            mt-4
                                            rounded-lg
                                            border
                                            border-zinc-800
                                            bg-zinc-900
                                            px-3
                                            py-2
                                        ">

                                            <p className="
                                                text-[11px]
                                                text-slate-500
                                            ">
                                                Current Pending
                                            </p>


                                            <p className="
                                                mt-1
                                                text-lg
                                                font-bold
                                                text-white
                                            ">
                                                {item?.currentPending ??
                                                    "-"}
                                            </p>

                                        </div>


                                        <div className="
                                            mt-4
                                            min-w-0
                                        ">

                                            <PredictionMetrics
                                                item={item}
                                                compact
                                            />

                                        </div>


                                        <div className="
                                            mt-4
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        ">

                                            <span className={`
                                                inline-flex
                                                max-w-[55%]
                                                truncate
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


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedItem(
                                                        item
                                                    )
                                                }
                                                className="
                                                    shrink-0
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

                                    </div>

                                );

                            })}

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
                                    font-semibold
                                    text-zinc-300
                                ">
                                    {actualVisibleCount}
                                </span>{" "}
                                of{" "}
                                <span className="
                                    font-semibold
                                    text-zinc-300
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


                    {/* Limit reached */}

                    {!loading &&
                        predictionData.length > 0 &&
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
                                selected prediction results
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

function PredictionSummary({
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
            sm:p-5
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




// import { useEffect, useMemo, useState } from "react";
// import Layout from "../components/layout/Layout";
// import { getPendingData } from "../services/pendingApi";
// import DetailsModal from "../components/dashboard/DetailsModal";
// import PredictionMetrics from "../components/prediction/PredictionMetrics";

// import {
//     MdTrendingUp,
//     MdRefresh,
//     MdSearch,
//     MdSpeed,
//     MdPsychology,
//     MdEmojiEvents
// } from "react-icons/md";


// export default function Prediction() {

//     // ============================================================
//     // STATE
//     // ============================================================

//     const [lottery, setLottery] = useState("kerala");
//     const [digits, setDigits] = useState("single");

//     const [data, setData] = useState([]);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [selectedItem, setSelectedItem] = useState(null);

//     // Filters
//     const [search, setSearch] = useState("");
//     const [decision, setDecision] = useState("All");

//     // Sorting
//     const [sortBy, setSortBy] = useState("prediction");


//     // ============================================================
//     // DIGIT LABEL
//     // ============================================================

//     const digitLabel = useMemo(() => {

//         switch (digits) {

//             case "four":
//                 return "four-digit";

//             case "triple":
//                 return "triple-digit";

//             case "double":
//                 return "double-digit";

//             default:
//                 return "single-digit";

//         }

//     }, [digits]);


//     // ============================================================
//     // LOAD DATA
//     // ============================================================

//     useEffect(() => {

//         let cancelled = false;

//         async function loadPrediction() {

//             setLoading(true);
//             setError("");

//             try {

//                 const result =
//                     await getPendingData(
//                         lottery,
//                         digits
//                     );

//                 if (!result?.success) {

//                     throw new Error(
//                         result?.message ||
//                         "Unable to load prediction data."
//                     );

//                 }

//                 if (cancelled) {
//                     return;
//                 }

//                 setData(
//                     Array.isArray(result.items)
//                         ? result.items
//                         : []
//                 );

//             } catch (err) {

//                 if (cancelled) {
//                     return;
//                 }

//                 console.error(
//                     "Prediction Error:",
//                     err
//                 );

//                 setData([]);

//                 setError(
//                     err?.message ||
//                     "Unable to load prediction data."
//                 );

//             } finally {

//                 if (!cancelled) {
//                     setLoading(false);
//                 }

//             }

//         }

//         loadPrediction();

//         return () => {
//             cancelled = true;
//         };

//     }, [lottery, digits]);


//     // ============================================================
//     // FILTER + SORT
//     // ============================================================

//     const predictionData = useMemo(() => {

//         const query =
//             search.trim();


//         const filtered =
//             data.filter((item) => {

//                 // Search

//                 if (
//                     query !== "" &&
//                     !String(
//                         item?.number ?? ""
//                     ).includes(query)
//                 ) {
//                     return false;
//                 }


//                 // Decision

//                 if (
//                     decision !== "All" &&
//                     String(
//                         item?.decision ?? ""
//                     ) !== decision
//                 ) {
//                     return false;
//                 }


//                 return true;

//             });


//         filtered.sort((a, b) => {

//             switch (sortBy) {

//                 case "win":

//                     return (
//                         Number(
//                             b?.winProbability || 0
//                         ) -
//                         Number(
//                             a?.winProbability || 0
//                         )
//                     );


//                 case "confidence":

//                     return (
//                         Number(
//                             b?.confidenceScore || 0
//                         ) -
//                         Number(
//                             a?.confidenceScore || 0
//                         )
//                     );


//                 case "recovery":

//                     return (
//                         Number(
//                             b?.recoveryScore || 0
//                         ) -
//                         Number(
//                             a?.recoveryScore || 0
//                         )
//                     );


//                 case "pending":

//                     return (
//                         Number(
//                             b?.currentPending || 0
//                         ) -
//                         Number(
//                             a?.currentPending || 0
//                         )
//                     );


//                 case "prediction":
//                 default:

//                     return (
//                         Number(
//                             b?.predictionScore || 0
//                         ) -
//                         Number(
//                             a?.predictionScore || 0
//                         )
//                     );

//             }

//         });


//         return filtered;

//     }, [
//         data,
//         search,
//         decision,
//         sortBy
//     ]);


//     // ============================================================
//     // TOP 3
//     // ============================================================

//     const topPredictions =
//         predictionData.slice(0, 3);


//     // ============================================================
//     // SUMMARY
//     // ============================================================

//     const stats = useMemo(() => {

//         if (!predictionData.length) {

//             return {
//                 total: 0,
//                 bestPrediction: "0.00",
//                 averagePrediction: "0.00",
//                 averageWin: "0.00"
//             };

//         }


//         const totalPrediction =
//             predictionData.reduce(
//                 (sum, item) =>
//                     sum +
//                     Number(
//                         item?.predictionScore || 0
//                     ),
//                 0
//             );


//         const totalWin =
//             predictionData.reduce(
//                 (sum, item) =>
//                     sum +
//                     Number(
//                         item?.winProbability || 0
//                     ),
//                 0
//             );


//         return {

//             total:
//                 predictionData.length,

//             bestPrediction:
//                 Number(
//                     predictionData[0]
//                         ?.predictionScore || 0
//                 ).toFixed(2),

//             averagePrediction:
//                 (
//                     totalPrediction /
//                     predictionData.length
//                 ).toFixed(2),

//             averageWin:
//                 (
//                     totalWin /
//                     predictionData.length
//                 ).toFixed(2)

//         };

//     }, [predictionData]);


//     // ============================================================
//     // DECISION COLORS
//     // ============================================================

//     const getDecisionClass = (value) => {

//         switch (value) {

//             case "Excellent":
//                 return "bg-green-600 text-white";

//             case "Strong Buy":
//                 return "bg-blue-600 text-white";

//             case "Good":
//                 return "bg-yellow-500 text-black";

//             case "Watch":
//                 return "bg-orange-600 text-white";

//             case "Average":
//                 return "bg-purple-600 text-white";

//             case "Skip":
//                 return "bg-red-600 text-white";

//             default:
//                 return "bg-zinc-700 text-white";

//         }

//     };


//     // ============================================================
//     // SCORE COLOR
//     // ============================================================

//     const getPredictionColor = (value) => {

//         const score =
//             Number(value || 0);

//         if (score >= 90) {
//             return "text-emerald-400";
//         }

//         if (score >= 80) {
//             return "text-blue-400";
//         }

//         if (score >= 70) {
//             return "text-yellow-400";
//         }

//         if (score >= 60) {
//             return "text-orange-400";
//         }

//         return "text-red-400";

//     };


//     // ============================================================
//     // REFRESH
//     // ============================================================

//     const refreshPrediction = async () => {

//         setLoading(true);
//         setError("");

//         try {

//             const result =
//                 await getPendingData(
//                     lottery,
//                     digits
//                 );

//             if (!result?.success) {

//                 throw new Error(
//                     result?.message ||
//                     "Unable to refresh prediction data."
//                 );

//             }

//             setData(
//                 Array.isArray(result.items)
//                     ? result.items
//                     : []
//             );

//         } catch (err) {

//             console.error(
//                 "Prediction refresh error:",
//                 err
//             );

//             setError(
//                 err?.message ||
//                 "Unable to refresh prediction data."
//             );

//         } finally {

//             setLoading(false);

//         }

//     };


//     // ============================================================
//     // CLEAR FILTERS
//     // ============================================================

//     const clearFilters = () => {

//         setSearch("");
//         setDecision("All");
//         setSortBy("prediction");

//     };


//     // ============================================================
//     // RENDER
//     // ============================================================

//     return (

//         <Layout>

//             <div className="
//                 w-full
//                 min-w-0
//                 max-w-full
//                 overflow-x-hidden
//             ">


//                 {/* ==================================================
//                     HEADER
//                 ================================================== */}

//                 <div className="
//                     flex
//                     flex-col
//                     xl:flex-row
//                     xl:items-center
//                     xl:justify-between
//                     gap-5
//                     mb-6
//                 ">

//                     <div>

//                         <p className="
//                             text-xs
//                             sm:text-sm
//                             uppercase
//                             tracking-[0.18em]
//                             font-semibold
//                             text-blue-400
//                         ">
//                             Prediction Intelligence
//                         </p>


//                         <h1 className="
//                             mt-1
//                             text-2xl
//                             sm:text-3xl
//                             lg:text-4xl
//                             font-bold
//                             text-white
//                         ">
//                             Prediction
//                         </h1>


//                         <p className="
//                             mt-2
//                             text-sm
//                             text-slate-400
//                             max-w-3xl
//                         ">
//                             Numbers ranked by prediction strength,
//                             confidence, recovery and win probability.
//                         </p>

//                     </div>


//                     {/* Controls */}

//                     <div className="
//                         grid
//                         grid-cols-1
//                         sm:grid-cols-3
//                         gap-3
//                         w-full
//                         xl:w-auto
//                         xl:min-w-[480px]
//                     ">


//                         <select
//                             value={lottery}
//                             onChange={(e) =>
//                                 setLottery(
//                                     e.target.value
//                                 )
//                             }
//                             className="
//                                 w-full
//                                 bg-zinc-900
//                                 border
//                                 border-zinc-700
//                                 rounded-xl
//                                 px-3
//                                 py-3
//                                 text-sm
//                                 text-white
//                                 outline-none
//                                 focus:border-blue-500
//                             "
//                         >

//                             <option value="kerala">
//                                 Kerala
//                             </option>

//                             <option value="dear">
//                                 Dear
//                             </option>

//                         </select>


//                         <select
//                             value={digits}
//                             onChange={(e) =>
//                                 setDigits(
//                                     e.target.value
//                                 )
//                             }
//                             className="
//                                 w-full
//                                 bg-zinc-900
//                                 border
//                                 border-zinc-700
//                                 rounded-xl
//                                 px-3
//                                 py-3
//                                 text-sm
//                                 text-white
//                                 outline-none
//                                 focus:border-blue-500
//                             "
//                         >

//                             <option value="single">
//                                 Single
//                             </option>

//                             <option value="double">
//                                 Double
//                             </option>

//                             <option value="triple">
//                                 Triple
//                             </option>

//                             <option value="four">
//                                 Four
//                             </option>

//                         </select>


//                         <button
//                             type="button"
//                             onClick={refreshPrediction}
//                             disabled={loading}
//                             className="
//                                 flex
//                                 items-center
//                                 justify-center
//                                 gap-2
//                                 rounded-xl
//                                 bg-blue-600
//                                 hover:bg-blue-700
//                                 disabled:opacity-50
//                                 px-4
//                                 py-3
//                                 text-sm
//                                 font-semibold
//                                 text-white
//                             "
//                         >

//                             <MdRefresh />

//                             {loading
//                                 ? "Loading..."
//                                 : "Refresh"}

//                         </button>

//                     </div>

//                 </div>


//                 {/* ==================================================
//                     FILTERS
//                 ================================================== */}

//                 <div className="
//                     mb-6
//                     rounded-2xl
//                     border
//                     border-zinc-800
//                     bg-zinc-900
//                     p-3
//                     sm:p-4
//                 ">

//                     <div className="
//                         grid
//                         grid-cols-1
//                         sm:grid-cols-3
//                         gap-3
//                     ">


//                         {/* Search */}

//                         <div className="
//                             relative
//                         ">

//                             <MdSearch className="
//                                 absolute
//                                 left-3
//                                 top-1/2
//                                 -translate-y-1/2
//                                 text-zinc-500
//                                 text-xl
//                             " />

//                             <input
//                                 type="text"
//                                 value={search}
//                                 onChange={(e) =>
//                                     setSearch(
//                                         e.target.value
//                                     )
//                                 }
//                                 placeholder="Search Number..."
//                                 inputMode="numeric"
//                                 className="
//                                     w-full
//                                     bg-zinc-800
//                                     border
//                                     border-zinc-700
//                                     rounded-xl
//                                     pl-10
//                                     pr-4
//                                     py-3
//                                     text-sm
//                                     text-white
//                                     outline-none
//                                     focus:border-blue-500
//                                 "
//                             />

//                         </div>


//                         {/* Decision */}

//                         <select
//                             value={decision}
//                             onChange={(e) =>
//                                 setDecision(
//                                     e.target.value
//                                 )
//                             }
//                             className="
//                                 w-full
//                                 bg-zinc-800
//                                 border
//                                 border-zinc-700
//                                 rounded-xl
//                                 px-3
//                                 py-3
//                                 text-sm
//                                 text-white
//                                 outline-none
//                                 focus:border-blue-500
//                             "
//                         >

//                             <option value="All">
//                                 All Decisions
//                             </option>

//                             <option value="Excellent">
//                                 Excellent
//                             </option>

//                             <option value="Strong Buy">
//                                 Strong Buy
//                             </option>

//                             <option value="Good">
//                                 Good
//                             </option>

//                             <option value="Watch">
//                                 Watch
//                             </option>

//                             <option value="Average">
//                                 Average
//                             </option>

//                             <option value="Skip">
//                                 Skip
//                             </option>

//                         </select>


//                         {/* Sort */}

//                         <select
//                             value={sortBy}
//                             onChange={(e) =>
//                                 setSortBy(
//                                     e.target.value
//                                 )
//                             }
//                             className="
//                                 w-full
//                                 bg-zinc-800
//                                 border
//                                 border-zinc-700
//                                 rounded-xl
//                                 px-3
//                                 py-3
//                                 text-sm
//                                 text-white
//                                 outline-none
//                                 focus:border-blue-500
//                             "
//                         >

//                             <option value="prediction">
//                                 Sort: Prediction
//                             </option>

//                             <option value="win">
//                                 Sort: Win %
//                             </option>

//                             <option value="confidence">
//                                 Sort: Confidence
//                             </option>

//                             <option value="recovery">
//                                 Sort: Recovery
//                             </option>

//                             <option value="pending">
//                                 Sort: Pending
//                             </option>

//                         </select>

//                     </div>


//                     <div className="
//                         mt-3
//                         flex
//                         flex-col
//                         sm:flex-row
//                         sm:items-center
//                         sm:justify-between
//                         gap-3
//                     ">

//                         <p className="
//                             text-xs
//                             text-zinc-500
//                         ">
//                             Showing{" "}
//                             <span className="
//                                 text-zinc-300
//                                 font-semibold
//                             ">
//                                 {predictionData.length}
//                             </span>{" "}
//                             matching {digitLabel} numbers
//                         </p>


//                         <button
//                             type="button"
//                             onClick={clearFilters}
//                             className="
//                                 w-full
//                                 sm:w-auto
//                                 rounded-lg
//                                 bg-zinc-800
//                                 hover:bg-zinc-700
//                                 px-4
//                                 py-2
//                                 text-sm
//                                 text-white
//                             "
//                         >
//                             Clear Filters
//                         </button>

//                     </div>

//                 </div>


//                 {/* ==================================================
//                     ERROR
//                 ================================================== */}

//                 {error && (

//                     <div className="
//                         mb-6
//                         rounded-xl
//                         border
//                         border-red-900
//                         bg-red-950/40
//                         px-4
//                         py-3
//                         text-sm
//                         text-red-300
//                     ">
//                         {error}
//                     </div>

//                 )}


//                 {/* ==================================================
//                     SUMMARY
//                 ================================================== */}

//                 <div className="
//                     grid
//                     grid-cols-2
//                     lg:grid-cols-4
//                     gap-3
//                     sm:gap-4
//                     mb-6
//                 ">

//                     <PredictionSummary
//                         title="Prediction Numbers"
//                         value={stats.total}
//                         icon={<MdPsychology />}
//                         color="text-blue-400"
//                     />

//                     <PredictionSummary
//                         title="Best Prediction"
//                         value={stats.bestPrediction}
//                         icon={<MdEmojiEvents />}
//                         color="text-emerald-400"
//                     />

//                     <PredictionSummary
//                         title="Average Prediction"
//                         value={stats.averagePrediction}
//                         icon={<MdTrendingUp />}
//                         color="text-cyan-400"
//                     />

//                     <PredictionSummary
//                         title="Average Win %"
//                         value={`${stats.averageWin}%`}
//                         icon={<MdSpeed />}
//                         color="text-purple-400"
//                     />

//                 </div>


//                 {/* ==================================================
//                     TOP 3 PREDICTIONS
//                 ================================================== */}

//                 {!loading &&
//                     topPredictions.length > 0 && (

//                     <div className="
//                         grid
//                         grid-cols-1
//                         md:grid-cols-2
//                         xl:grid-cols-3
//                         gap-4
//                         mb-6
//                     ">

//                         {topPredictions.map(
//                             (item, index) => (

//                             <div
//                                 key={`${item?.number}-${index}`}
//                                 className="
//                                     rounded-2xl
//                                     border
//                                     border-zinc-800
//                                     bg-zinc-900
//                                     p-4
//                                     sm:p-5
//                                 "
//                             >

//                                 <div className="
//                                     flex
//                                     items-center
//                                     justify-between
//                                 ">

//                                     <span className="
//                                         text-xs
//                                         uppercase
//                                         tracking-wider
//                                         text-slate-500
//                                     ">
//                                         Prediction #{index + 1}
//                                     </span>


//                                     <span className="
//                                         text-xl
//                                     ">
//                                         {index === 0
//                                             ? "🥇"
//                                             : index === 1
//                                                 ? "🥈"
//                                                 : "🥉"
//                                         }
//                                     </span>

//                                 </div>


//                                 <div className="
//                                     mt-4
//                                     flex
//                                     items-end
//                                     justify-between
//                                     gap-3
//                                 ">

//                                     <div>

//                                         <p className="
//                                             text-3xl
//                                             font-bold
//                                             text-white
//                                         ">
//                                             {item?.number}
//                                         </p>


//                                         <span className={`
//                                             inline-flex
//                                             mt-2
//                                             rounded-full
//                                             px-3
//                                             py-1
//                                             text-xs
//                                             font-bold
//                                             ${getDecisionClass(
//                                                 item?.decision
//                                             )}
//                                         `}>
//                                             {item?.decision ||
//                                                 "Unknown"}
//                                         </span>

//                                     </div>


//                                     <div className="
//                                         text-right
//                                     ">

//                                         <p className="
//                                             text-xs
//                                             text-slate-500
//                                         ">
//                                             Prediction
//                                         </p>

//                                         <p className={`
//                                             text-3xl
//                                             font-bold
//                                             ${getPredictionColor(
//                                                 item?.predictionScore
//                                             )}
//                                         `}>
//                                             {Number(
//                                                 item?.predictionScore ||
//                                                 0
//                                             ).toFixed(2)}
//                                         </p>

//                                     </div>

//                                 </div>


//                                 {/* Prediction bar */}

//                                 <div className="
//                                     mt-5
//                                     h-2
//                                     rounded-full
//                                     bg-zinc-800
//                                     overflow-hidden
//                                 ">

//                                     <div
//                                         className="
//                                             h-full
//                                             rounded-full
//                                             bg-blue-500
//                                         "
//                                         style={{
//                                             width:
//                                                 `${Math.min(
//                                                     Number(
//                                                         item?.predictionScore ||
//                                                         0
//                                                     ),
//                                                     100
//                                                 )}%`
//                                         }}
//                                     />

//                                 </div>

// <div className="
//     mt-4
//     rounded-lg
//     border
//     border-zinc-800
//     bg-zinc-900
//     px-3
//     py-2
// ">

//     <p className="
//         text-[11px]
//         text-slate-500
//     ">
//         Current Pending
//     </p>

//     <p className="
//         mt-1
//         text-lg
//         font-bold
//         text-white
//     ">
//         {item?.currentPending ?? "-"}
//     </p>

// </div>
//                                 {/* Metrics */}

//                                <div className="mt-4">

//                                 <PredictionMetrics
//                                     item={item}
//                                     compact
//                                               />

// </div>


//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setSelectedItem(item)
//                                     }
//                                     className="
//                                         mt-4
//                                         w-full
//                                         rounded-lg
//                                         bg-zinc-800
//                                         hover:bg-zinc-700
//                                         px-4
//                                         py-2
//                                         text-sm
//                                         font-semibold
//                                         text-white
//                                     "
//                                 >
//                                     View Full Analysis
//                                 </button>

//                             </div>

//                         ))}

//                     </div>

//                 )}


//                 {/* ==================================================
//                     PREDICTION TABLE
//                 ================================================== */}

//                 <div className="
//                     rounded-2xl
//                     border
//                     border-zinc-800
//                     bg-zinc-900
//                     overflow-hidden
//                     min-w-0
//                 ">


//                     <div className="
//                         px-4
//                         sm:px-5
//                         py-4
//                         border-b
//                         border-zinc-800
//                     ">

//                         <h2 className="
//                             text-lg
//                             sm:text-xl
//                             font-bold
//                             text-white
//                         ">
//                             Prediction Rankings
//                         </h2>

//                         <p className="
//                             mt-1
//                             text-xs
//                             text-slate-500
//                         ">
//                             Highest prediction scores first
//                         </p>

//                     </div>


//                     {loading && (

//                         <div className="
//                             p-12
//                             text-center
//                             text-slate-400
//                         ">
//                             Loading predictions...
//                         </div>

//                     )}


//                     {!loading &&
//                         predictionData.length === 0 && (

//                         <div className="
//                             p-12
//                             text-center
//                             text-slate-500
//                         ">
//                             No matching predictions found.
//                         </div>

//                     )}


//                     {/* Desktop */}

//                     {!loading &&
//                         predictionData.length > 0 && (

//                         <div className="
//                             hidden
//                             lg:block
//                             w-full
//                             overflow-x-auto
//                         ">

//                             <table className="
//                                 w-full
//                                 table-auto
//                             ">

//                                 <thead className="
//                                     bg-zinc-800
//                                 ">

//                                     <tr>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Rank
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-left
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Number
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Prediction
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Confidence
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Recovery
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Win %
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Decision
//                                         </th>

//                                         <th className="
//                                             px-3
//                                             py-3
//                                             text-center
//                                             text-xs
//                                             text-zinc-300
//                                         ">
//                                             Action
//                                         </th>

//                                     </tr>

//                                 </thead>


//                                 <tbody>

//                                     {predictionData.map(
//                                         (item, index) => {

//                                         const score =
//                                             Number(
//                                                 item?.predictionScore ||
//                                                 0
//                                             );

//                                         return (

//                                             <tr
//                                                 key={`${item?.number}-${index}`}
//                                                 className="
//                                                     border-t
//                                                     border-zinc-800
//                                                     hover:bg-zinc-800/70
//                                                     transition
//                                                 "
//                                             >

//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     text-center
//                                                     font-bold
//                                                     text-blue-400
//                                                 ">
//                                                     {index + 1}
//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     font-bold
//                                                     text-white
//                                                 ">
//                                                     {item?.number}
//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                 ">

//                                                     <div className="
//                                                         min-w-[140px]
//                                                     ">

//                                                         <div className="
//                                                             flex
//                                                             items-center
//                                                             justify-between
//                                                             gap-2
//                                                         ">

//                                                             <span className={`
//                                                                 font-bold
//                                                                 ${getPredictionColor(
//                                                                     score
//                                                                 )}
//                                                             `}>
//                                                                 {score.toFixed(2)}
//                                                             </span>

//                                                             <span className="
//                                                                 text-[11px]
//                                                                 text-zinc-500
//                                                             ">
//                                                                 / 100
//                                                             </span>

//                                                         </div>


//                                                         <div className="
//                                                             mt-2
//                                                             h-2
//                                                             rounded-full
//                                                             bg-zinc-700
//                                                             overflow-hidden
//                                                         ">

//                                                             <div
//                                                                 className="
//                                                                     h-full
//                                                                     rounded-full
//                                                                     bg-blue-500
//                                                                 "
//                                                                 style={{
//                                                                     width:
//                                                                         `${Math.min(
//                                                                             score,
//                                                                             100
//                                                                         )}%`
//                                                                 }}
//                                                             />

//                                                         </div>

//                                                     </div>

//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     text-center
//                                                     text-white
//                                                 ">
//                                                     {item?.confidenceScore ?? "-"}
//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     text-center
//                                                     text-white
//                                                 ">
//                                                     {item?.recoveryScore ?? "-"}
//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     text-center
//                                                     font-bold
//                                                     text-emerald-400
//                                                 ">
//                                                     {item?.winProbability ?? 0}%
//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     text-center
//                                                 ">

//                                                     <span className={`
//                                                         inline-flex
//                                                         rounded-full
//                                                         px-3
//                                                         py-1
//                                                         text-xs
//                                                         font-bold
//                                                         whitespace-nowrap
//                                                         ${getDecisionClass(
//                                                             item?.decision
//                                                         )}
//                                                     `}>
//                                                         {item?.decision ||
//                                                             "Unknown"}
//                                                     </span>

//                                                 </td>


//                                                 <td className="
//                                                     px-3
//                                                     py-3
//                                                     text-center
//                                                 ">

//                                                     <button
//                                                         type="button"
//                                                         onClick={() =>
//                                                             setSelectedItem(
//                                                                 item
//                                                             )
//                                                         }
//                                                         className="
//                                                             rounded-lg
//                                                             bg-blue-600
//                                                             hover:bg-blue-700
//                                                             px-3
//                                                             py-1.5
//                                                             text-xs
//                                                             font-semibold
//                                                             text-white
//                                                         "
//                                                     >
//                                                         View
//                                                     </button>

//                                                 </td>

//                                             </tr>

//                                         );

//                                     })}

//                                 </tbody>

//                             </table>

//                         </div>

//                     )}


//                     {/* Tablet + Mobile */}

//                     {!loading &&
//                         predictionData.length > 0 && (

//                         <div className="
//                             lg:hidden
//                             p-3
//                             sm:p-4
//                             space-y-3
//                         ">

//                             {predictionData.map(
//                                 (item, index) => {

//                                 const score =
//                                     Number(
//                                         item?.predictionScore ||
//                                         0
//                                     );

//                                 return (

//                                     <div
//                                         key={`${item?.number}-${index}`}
//                                         className="
//                                             rounded-xl
//                                             border
//                                             border-zinc-800
//                                             bg-zinc-800/60
//                                             p-4
//                                         "
//                                     >

//                                         <div className="
//                                             flex
//                                             items-center
//                                             justify-between
//                                             gap-3
//                                         ">

//                                             <div>

//                                                 <p className="
//                                                     text-xs
//                                                     text-slate-500
//                                                 ">
//                                                     Rank #{index + 1}
//                                                 </p>

//                                                 <p className="
//                                                     mt-1
//                                                     text-2xl
//                                                     font-bold
//                                                     text-white
//                                                 ">
//                                                     {item?.number}
//                                                 </p>

//                                             </div>


//                                             <div className="
//                                                 text-right
//                                             ">

//                                                 <p className="
//                                                     text-xs
//                                                     text-slate-500
//                                                 ">
//                                                     Prediction
//                                                 </p>

//                                                 <p className={`
//                                                     text-2xl
//                                                     font-bold
//                                                     ${getPredictionColor(
//                                                         score
//                                                     )}
//                                                 `}>
//                                                     {score.toFixed(2)}
//                                                 </p>

//                                             </div>

//                                         </div>


//                                         <div className="
//                                             mt-3
//                                             h-2
//                                             rounded-full
//                                             bg-zinc-700
//                                             overflow-hidden
//                                         ">

//                                             <div
//                                                 className="
//                                                     h-full
//                                                     rounded-full
//                                                     bg-blue-500
//                                                 "
//                                                 style={{
//                                                     width:
//                                                         `${Math.min(
//                                                             score,
//                                                             100
//                                                         )}%`
//                                                 }}
//                                             />

//                                         </div>


//                                         <div className="mt-4">

//                                     <div className="
//     mt-4
//     rounded-lg
//     border
//     border-zinc-800
//     bg-zinc-900
//     px-3
//     py-2
// ">

//     <p className="
//         text-[11px]
//         text-slate-500
//     ">
//         Current Pending
//     </p>

//     <p className="
//         mt-1
//         text-lg
//         font-bold
//         text-white
//     ">
//         {item?.currentPending ?? "-"}
//     </p>

// </div>
//     <PredictionMetrics
//         item={item}
//         compact
//     />

// </div>


//                                         <div className="
//                                             mt-4
//                                             flex
//                                             items-center
//                                             justify-between
//                                             gap-3
//                                         ">

//                                             <span className={`
//                                                 inline-flex
//                                                 rounded-full
//                                                 px-3
//                                                 py-1
//                                                 text-xs
//                                                 font-bold
//                                                 whitespace-nowrap
//                                                 ${getDecisionClass(
//                                                     item?.decision
//                                                 )}
//                                             `}>
//                                                 {item?.decision ||
//                                                     "Unknown"}
//                                             </span>


//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     setSelectedItem(
//                                                         item
//                                                     )
//                                                 }
//                                                 className="
//                                                     rounded-lg
//                                                     bg-blue-600
//                                                     hover:bg-blue-700
//                                                     px-4
//                                                     py-2
//                                                     text-sm
//                                                     font-semibold
//                                                     text-white
//                                                 "
//                                             >
//                                                 View Details
//                                             </button>

//                                         </div>

//                                     </div>

//                                 );

//                             })}

//                         </div>

//                     )}

//                 </div>


//                 {/* ==================================================
//                     DETAILS MODAL
//                 ================================================== */}

//                 <DetailsModal
//                     item={selectedItem}
//                     onClose={() =>
//                         setSelectedItem(null)
//                     }
//                 />

//             </div>

//         </Layout>

//     );

// }


// // ================================================================
// // SUMMARY CARD
// // ================================================================

// function PredictionSummary({
//     title,
//     value,
//     icon,
//     color
// }) {

//     return (

//         <div className="
//             rounded-2xl
//             border
//             border-zinc-800
//             bg-zinc-900
//             p-4
//             sm:p-5
//             min-w-0
//         ">

//             <div className="
//                 flex
//                 items-center
//                 justify-between
//                 gap-3
//             ">

//                 <div className="
//                     min-w-0
//                 ">

//                     <p className="
//                         text-xs
//                         sm:text-sm
//                         text-slate-400
//                         truncate
//                     ">
//                         {title}
//                     </p>


//                     <p className={`
//                         mt-2
//                         text-2xl
//                         sm:text-3xl
//                         font-bold
//                         ${color}
//                     `}>
//                         {value}
//                     </p>

//                 </div>


//                 <div className={`
//                     shrink-0
//                     text-3xl
//                     ${color}
//                 `}>
//                     {icon}
//                 </div>

//             </div>

//         </div>

//     );

// }


// // ================================================================
// // MINI METRIC
// // ================================================================

// function MiniMetric({
//     label,
//     value
// }) {

//     return (

//         <div className="
//             rounded-lg
//             bg-zinc-900
//             p-3
//             min-w-0
//         ">

//             <p className="
//                 text-[11px]
//                 text-slate-500
//                 truncate
//             ">
//                 {label}
//             </p>

//             <p className="
//                 mt-1
//                 text-sm
//                 font-bold
//                 text-white
//                 truncate
//             ">
//                 {value}
//             </p>

//         </div>

//     );

// }

