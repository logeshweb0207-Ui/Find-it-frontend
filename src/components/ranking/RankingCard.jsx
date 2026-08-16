import RankingMetrics from "./RankingMetrics";

export default function RankingCard({
    item,
    rank,
    onView,
    getDecisionClass,
    getScoreColor
}) {

    const aiScore = Math.min(
        Number(item.masterAIScore || 0),
        100
    );

    return (

        <div className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-800
            p-4
            sm:p-5
        ">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="
                flex
                items-center
                justify-between
                gap-3
            ">

                <div className="min-w-0">

                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        Rank #{rank}
                    </p>


                    <div className="
                        mt-1
                        flex
                        items-end
                        gap-3
                    ">

                        <p className="
                            text-2xl
                            sm:text-3xl
                            font-bold
                            text-white
                        ">

                            {item.number}

                        </p>

                        <p className="
                            pb-1
                            text-xs
                            text-slate-500
                        ">

                            Pending{" "}

                            <span className="
                                font-semibold
                                text-slate-300
                            ">

                                {item.currentPending}

                            </span>

                        </p>

                    </div>

                </div>


                {/* AI SCORE */}

                <div className="
                    text-right
                    shrink-0
                ">

                    <p className="
                        text-[11px]
                        text-slate-500
                    ">
                        Master AI
                    </p>

                    <p className={`
                        text-2xl
                        sm:text-3xl
                        font-bold
                        ${getScoreColor(
                            item.masterAIScore
                        )}
                    `}>

                        {item.masterAIScore}

                    </p>

                </div>

            </div>


            {/* ==================================================
                AI SCORE BAR
            ================================================== */}

            <div className="
                mt-4
                h-2
                w-full
                overflow-hidden
                rounded-full
                bg-zinc-700
            ">

                <div
                    className="
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        from-blue-500
                        to-emerald-400
                    "
                    style={{
                        width: `${aiScore}%`
                    }}
                />

            </div>


            {/* ==================================================
                CORE METRICS
            ================================================== */}

            <div className="mt-4">

                <RankingMetrics
                    item={item}
                    compact
                />

            </div>


            {/* ==================================================
                DECISION + ACTION
            ================================================== */}

            <div className="
                mt-4
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
            ">

                <div>

                    <p className="
                        mb-1
                        text-[11px]
                        text-slate-500
                    ">
                        AI Decision
                    </p>

                    <span className={`
                        inline-flex
                        whitespace-nowrap
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-bold
                        ${getDecisionClass(
                            item.decision
                        )}
                    `}>

                        {item.decision}

                    </span>

                </div>


                <button
                    onClick={() => onView(item)}
                    className="
                        w-full
                        sm:w-auto
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >

                    View Details

                </button>

            </div>

        </div>

    );
}