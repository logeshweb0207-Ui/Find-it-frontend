import {

    ResponsiveContainer,

    LineChart,

    Line,

    XAxis,

    YAxis,

    Tooltip,

    CartesianGrid

} from "recharts";

export default function WinProbabilityChart({ data }) {

    const chartData = [...data]

        .sort(

            (a, b) =>

                b.winProbability -

                a.winProbability

        )

        .slice(0, 10)

        .map(item => ({

            number: item.number,

            probability: item.winProbability

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

                Top Win Probability

            </h2>

         <ResponsiveContainer
    width="100%"
    height={280}
    minWidth={0}
>

                <LineChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="number"/>

                    <YAxis/>

                    <Tooltip/>

                    <Line

                        type="monotone"

                        dataKey="probability"

                        stroke="#10b981"

                        strokeWidth={3}

                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}