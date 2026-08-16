export default function RankingMetrics({
    item,
    compact = false
}) {

    if (!item) {
        return null;
    }

    const metrics = [
        {
            label: "Confidence",
            value: item.confidenceScore
        },
        {
            label: "Recovery",
            value: item.recoveryScore
        },
        {
            label: "Pressure",
            value: item.pressureScore
        },
        {
            label: "Bounce",
            value: item.bounceScore
        },
        {
            label: "Pattern",
            value: item.patternScore
        },
        {
            label: "Win %",
            value: item.winProbability
        }
    ];


    const getValue = (value) => {

        const number = Number(value || 0);

        return Number.isInteger(number)
            ? number
            : number.toFixed(2);

    };


    const getBarColor = (value) => {

        const number = Number(value || 0);

        if (number >= 90) {
            return "bg-emerald-500";
        }

        if (number >= 80) {
            return "bg-blue-500";
        }

        if (number >= 70) {
            return "bg-yellow-500";
        }

        if (number >= 60) {
            return "bg-orange-500";
        }

        return "bg-red-500";

    };


    return (

        <div className="
            grid
            grid-cols-2
            gap-2
            w-full
        ">

            {metrics.map((metric) => (

                <div
                    key={metric.label}
                    className="
                        min-w-0
                        rounded-lg
                        bg-zinc-900
                        border
                        border-zinc-800
                        p-3
                    "
                >

                    <div className="
                        flex
                        items-center
                        justify-between
                        gap-2
                        min-w-0
                    ">

                        <span className="
                            min-w-0
                            truncate
                            text-[11px]
                            text-slate-500
                        ">
                            {metric.label}
                        </span>

                        <span className="
                            shrink-0
                            text-xs
                            sm:text-sm
                            font-bold
                            text-white
                        ">

                            {getValue(metric.value)}

                            {metric.label === "Win %" && "%"}

                        </span>

                    </div>


                    <div className="
                        mt-2
                        h-1.5
                        w-full
                        overflow-hidden
                        rounded-full
                        bg-zinc-800
                    ">

                        <div
                            className={`
                                h-full
                                rounded-full
                                ${getBarColor(metric.value)}
                            `}
                            style={{
                                width: `${Math.min(
                                    Number(metric.value || 0),
                                    100
                                )}%`
                            }}
                        />

                    </div>

                </div>

            ))}

        </div>

    );

}