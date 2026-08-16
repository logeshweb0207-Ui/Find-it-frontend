export default function DetailsModal({

    item,

    onClose

}) {

    if (!item) return null;

    return (

        <div className="fixed inset-0 bg-black/70 z-50 overflow-y-auto">

<div className="bg-zinc-900 rounded-2xl border border-zinc-700
w-[900px]
max-w-[95%]
mx-auto
my-10
p-6">
                {/* Header */}

                <div className="sticky top-0 bg-zinc-900 flex justify-between items-center mb-6 pb-3 z-20">

                    <h2 className="text-2xl font-bold text-white">

                        Number {item.number}

                    </h2>

                    <button

                        onClick={onClose}

                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"

                    >

                        Close

                    </button>

                </div>

                {/* Basic Statistics */}

                <div className="grid grid-cols-2 gap-4 mb-6">

                    <Info label="Current Pending" value={item.currentPending} />

                    <Info label="Last Draw" value={item.lastDraw} />

                    <Info label="Average Gap" value={item.averageGap} />

                    <Info label="Median Gap" value={item.medianGap} />

                    <Info label="Maximum Gap" value={item.maxGap} />

                    <Info label="Minimum Gap" value={item.minGap} />

                    <Info label="Total Hits" value={item.totalHits} />

                    <Info label="Hot Score" value={item.hotScore} />

                    <Info label="Cold Score" value={item.coldScore} />

                </div>

                {/* AI Scores */}

                <h3 className="text-xl font-bold mb-4">

                    AI Analytics

                </h3>

                <div className="grid grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-2">

                    <Info label="Prediction Score" value={item.predictionScore} />

                    <Info label="Confidence Score" value={item.confidenceScore} />

                    <Info label="Recovery Score" value={item.recoveryScore} />

                    <Info label="Pressure Score" value={item.pressureScore} />

                    <Info label="Bounce Score" value={item.bounceScore} />

                    <Info label="Pattern Score" value={item.patternScore} />

                    <Info label="Cycle Score" value={item.cycleScore} />

                    <Info label="Heat Cycle Score" value={item.heatCycleScore} />

                    <Info label="Repeat Chance" value={item.repeatChanceScore} />

                    <Info label="Trend Score" value={item.trendScore} />

                    <Info label="AI Score" value={item.masterAIScore} />

                    <Info label="Win Probability" value={`${item.winProbability}%`} />

                </div>

                {/* Decision */}

                <div className="mt-8 flex justify-center">

                    <span className="px-6 py-3 rounded-full bg-green-600 text-lg font-bold">

                        {item.decision}

                    </span>

                </div>

            </div>

        </div>

    );

}

function Info({

    label,

    value

}) {

    return (

        <div className="bg-zinc-800 rounded-xl p-4">

            <p className="text-gray-400 text-sm">

                {label}

            </p>

            <p className="text-xl font-bold mt-2">

                {value}

            </p>

        </div>

    );

}