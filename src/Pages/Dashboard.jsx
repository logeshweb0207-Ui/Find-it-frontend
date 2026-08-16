import Layout from "../components/layout/Layout";
import StatCard from "../components/cards/StatCard";
import { useEffect, useState } from "react";
import { getPendingData } from "../services/pendingApi";
import PendingTable from "../components/dashboard/PendingTable";
import AIScoreChart from "../components/charts/AIScoreChart";
import DecisionPieChart from "../components/charts/DecisionPieChart";
import WinProbabilityChart from "../components/charts/WinProbabilityChart";
import Toolbar from "../components/dashboard/Toolbar";
import Pagination from "../components/dashboard/Pagination";

import {

MdNumbers,

MdStar,

MdTrendingUp,

MdVisibility,

MdBlock

} from "react-icons/md";

export default function Dashboard() {

    const [data, setData] = useState([]);
    const [lottery,setLottery]=useState("kerala");

const [digits, setDigits] = useState("single");

const [search,setSearch]=useState("");

const [decision,setDecision]=useState("All");

const [sort,setSort]=useState("pending");

const [currentPage, setCurrentPage] = useState(1);

const [pageSize, setPageSize] = useState(25);
    const stats = {

    total: data.length,

    excellent: data.filter(
        item => item.decision === "Excellent"
    ).length,

    strongBuy: data.filter(
        item => item.decision === "Strong Buy"
    ).length,

    good: data.filter(
        item => item.decision === "Good"
    ).length,

    watch: data.filter(
        item => item.decision === "Watch"
    ).length,

    average: data.filter(
        item => item.decision === "Average"
    ).length,

    skip: data.filter(
        item => item.decision === "Skip"
    ).length,

    averageAI:
        data.length > 0
            ? (
                data.reduce(
                    (sum, item) =>
                        sum + item.masterAIScore,
                    0
                ) / data.length
            ).toFixed(2)
            : 0,

    highestPending:
        data.length > 0
            ? Math.max(
                ...data.map(
                    item => item.currentPending || 0
                )
            )
            : 0,
        highestAI:
    data.length > 0
        ? Math.max(
            ...data.map(item => item.masterAIScore || 0)
        )
        : 0,

highestWin:
    data.length > 0
        ? Math.max(
            ...data.map(item => item.winProbability || 0)
        ).toFixed(2)
        : 0,

};
console.log("CURRENT DIGIT MODE:", digits);

const [loading, setLoading] = useState(true);   
useEffect(() => {

    async function load() {

        setLoading(true);

        try {

            const normalizedDigits = String(digits)
                .trim()
                .toLowerCase();

            console.log("Loading:", lottery, normalizedDigits);

            const result = await getPendingData(
                lottery,
                normalizedDigits
            );

            setData(result.items || []);

        } catch (err) {

            console.error("Pending data error:", err);

            setData([]);

        } finally {

            setLoading(false);

        }

    }

    load();

}, [lottery, digits]);
const filteredData = [...data]
    .filter((item) => {

        // Decision filter
        if (
            decision !== "All" &&
            item.decision !== decision
        ) {
            return false;
        }

        // Number search
        if (
            search.trim() !== "" &&
            !String(item.number).includes(search.trim())
        ) {
            return false;
        }

        return true;
    })
    .sort((a, b) => {

        switch (sort) {

            case "ai":
                return (
                    Number(b.masterAIScore || 0) -
                    Number(a.masterAIScore || 0)
                );

            case "win":
                return (
                    Number(b.winProbability || 0) -
                    Number(a.winProbability || 0)
                );

            case "prediction":
                return (
                    Number(b.predictionScore || 0) -
                    Number(a.predictionScore || 0)
                );

            case "recovery":
                return (
                    Number(b.recoveryScore || 0) -
                    Number(a.recoveryScore || 0)
                );

            case "pressure":
                return (
                    Number(b.pressureScore || 0) -
                    Number(a.pressureScore || 0)
                );

            case "bounce":
                return (
                    Number(b.bounceScore || 0) -
                    Number(a.bounceScore || 0)
                );

            case "pattern":
                return (
                    Number(b.patternScore || 0) -
                    Number(a.patternScore || 0)
                );

            default:
                return (
                    Number(b.currentPending || 0) -
                    Number(a.currentPending || 0)
                );
        }

    });
    const totalPages = Math.ceil(
    filteredData.length / pageSize
);

const startIndex =
    (currentPage - 1) * pageSize;

const endIndex =
    startIndex + pageSize;

const paginatedData =
    filteredData.slice(
        startIndex,
        endIndex
    );

    return (
<Layout>
       <div className="
    grid
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-2
    lg:grid-cols-4
    xl:grid-cols-8
    gap-4
    w-full
    min-w-0
">

    <StatCard
title="Total Numbers"
value={stats.total}
color="text-blue-400"
icon={<MdNumbers/>}
/>



<StatCard
title="Excellent"
value={stats.excellent}
color="text-green-400"
icon={<MdStar/>}
/>
<StatCard
title="Strong Buy"
value={stats.strongBuy}
color="text-yellow-400"
icon={<MdTrendingUp/>}
/>

<StatCard
title="Watch"
value={stats.watch}
color="text-orange-400"
icon={<MdVisibility/>}
/>

<StatCard
title="Skip"
value={stats.skip}
color="text-red-400"
icon={<MdBlock/>}
/>

<StatCard
    title="Highest AI"
    value={stats.highestAI}
    color="text-cyan-400"
    icon="🧠"
/>

<StatCard
    title="Highest Pending"
    value={stats.highestPending}
    color="text-purple-400"
    icon="🔥"
/>

<StatCard
    title="Highest Win %"
    value={`${stats.highestWin}%`}
    color="text-emerald-400"
    icon="🎯"
/>

</div>
<Toolbar

lottery={lottery}

setLottery={setLottery}

digits={digits}

setDigits={setDigits}

search={search}

setSearch={setSearch}

decision={decision}

setDecision={setDecision}

sort={sort}

setSort={setSort}

/>
<PendingTable
    data={paginatedData}
    digits={digits}
/>
<Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    pageSize={pageSize}
    setCurrentPage={setCurrentPage}
    setPageSize={setPageSize}
    totalItems={filteredData.length}
/>
<div className="
    grid
    grid-cols-1
    xl:grid-cols-2
    gap-4
    lg:gap-6
    mt-8
    w-full
    min-w-0
">

    <AIScoreChart data={data}/>

    <DecisionPieChart data={data}/>

</div>

<div className="
    mt-4
    lg:mt-6
    w-full
    min-w-0
">

    <WinProbabilityChart data={data}/>

</div>
</Layout>
    );

}