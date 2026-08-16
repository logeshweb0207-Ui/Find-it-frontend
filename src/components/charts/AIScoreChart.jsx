import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

export default function AIScoreChart({ data }) {

    const chartData = data
        .slice(0, 10)
        .map(item => ({
            number: item.number,
            ai: item.masterAIScore
        }));

    return (

        <div className="
    bg-zinc-900
    rounded-xl
    border
    border-zinc-800
    p-4
    sm:p-5
    w-full
    min-w-0
">

            <h2 className="text-xl font-bold mb-5">

                Top AI Scores

            </h2>

            <ResponsiveContainer
    width="100%"
    height={280}
    minWidth={0}
>

                <BarChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="number" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="ai"
                        fill="#2563eb"
                        radius={[6,6,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}