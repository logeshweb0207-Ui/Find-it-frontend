export default function RankingRow({
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
        <tr
            className="
                border-t
                border-zinc-800
                hover:bg-zinc-800/70
                transition
            "
        >

            {/* Rank */}

            <td className="
                p-3
                text-center
                font-bold
                text-blue-400
            ">

                {rank}

            </td>


            {/* Number + Pending */}

            <td className="p-3">

                <div className="flex flex-col gap-1">

                    <span className="
                        font-bold
                        text-white
                    ">
                        {item.number}
                    </span>

                    <span className="
                        text-[11px]
                        text-zinc-500
                    ">

                        Pending{" "}

                        <span className="
                            text-zinc-300
                            font-semibold
                        ">
                            {item.currentPending}
                        </span>

                    </span>

                </div>

            </td>


            {/* AI Score */}

            <td className="p-3">

                <div className="min-w-[140px]">

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    ">

                        <span className={`
                            font-bold
                            ${getScoreColor(
                                item.masterAIScore
                            )}
                        `}>

                            {item.masterAIScore}

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
                                bg-gradient-to-r
                                from-blue-500
                                to-emerald-400
                            "
                            style={{
                                width: `${aiScore}%`
                            }}
                        />

                    </div>

                </div>

            </td>


            {/* Confidence */}

            <td className="
                p-3
                text-center
                font-semibold
                text-white
            ">

                {item.confidenceScore}

            </td>


            {/* Recovery */}

            <td className="
                p-3
                text-center
                font-semibold
                text-white
            ">

                {item.recoveryScore}

            </td>


            {/* Win Probability */}

            <td className="
                p-3
                text-center
                font-bold
                text-emerald-400
            ">

                {item.winProbability}%

            </td>


            {/* Decision */}

            <td className="
                p-3
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
                        item.decision
                    )}
                `}>

                    {item.decision}

                </span>

            </td>


            {/* Action */}

            <td className="
                p-3
                text-center
            ">

                <button
                    onClick={() => onView(item)}
                    className="
                        px-3
                        py-1.5
                        rounded-lg
                        bg-blue-600
                        hover:bg-blue-700
                        text-xs
                        font-semibold
                        text-white
                        transition
                    "
                >

                    View

                </button>

            </td>

        </tr>
    );
}