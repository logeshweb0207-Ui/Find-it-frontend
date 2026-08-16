import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#f97316",
    "#a855f7",
    "#ef4444"
];

export default function DecisionPieChart({ data }) {

    const chartData = [

        {
            name: "Excellent",
            value: data.filter(
                i => i.decision === "Excellent"
            ).length
        },

        {
            name: "Strong Buy",
            value: data.filter(
                i => i.decision === "Strong Buy"
            ).length
        },

        {
            name: "Good",
            value: data.filter(
                i => i.decision === "Good"
            ).length
        },

        {
            name: "Watch",
            value: data.filter(
                i => i.decision === "Watch"
            ).length
        },

        {
            name: "Average",
            value: data.filter(
                i => i.decision === "Average"
            ).length
        },

        {
            name: "Skip",
            value: data.filter(
                i => i.decision === "Skip"
            ).length
        }

    ];

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

                Decision Distribution

            </h2>

            <ResponsiveContainer
    width="100%"
    height={280}
    minWidth={0}
>

                <PieChart>

                    <Pie

                        data={chartData}

                        dataKey="value"

                        nameKey="name"

                        outerRadius={110}

                    >

                        {

                            chartData.map((entry, index) => (

                                <Cell

                                    key={index}

                                    fill={COLORS[index]}

                                />

                            ))

                        }

                    </Pie>

                    <Tooltip />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}