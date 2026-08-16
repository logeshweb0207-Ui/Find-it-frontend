import { useState } from "react";
import DetailsModal from "./DetailsModal";
import {
    MdArrowDropUp,
    MdArrowDropDown
} from "react-icons/md";

export default function PendingTable({ data }) {

    const [selectedItem, setSelectedItem] = useState(null);

    const [sortField, setSortField] = useState("currentPending");

    const [sortOrder, setSortOrder] = useState("desc");

    const handleSort = (field) => {

        if (sortField === field) {

            setSortOrder(
                sortOrder === "asc"
                    ? "desc"
                    : "asc"
            );

        } else {

            setSortField(field);

            setSortOrder("desc");

        }

    };

    const sortedData = [...data].sort((a, b) => {

        let A = a?.[sortField];
        let B = b?.[sortField];

        if (A === null || A === undefined) A = 0;
        if (B === null || B === undefined) B = 0;

        if (
            typeof A === "string" &&
            typeof B === "string"
        ) {

            A = A.toLowerCase();
            B = B.toLowerCase();

        } else {

            A = Number(A) || 0;
            B = Number(B) || 0;

        }

        if (A > B) {
            return sortOrder === "asc" ? 1 : -1;
        }

        if (A < B) {
            return sortOrder === "asc" ? -1 : 1;
        }

        return 0;

    });

    const SortIcon = ({ field }) => {

        if (sortField !== field) {
            return null;
        }

        return sortOrder === "asc"
            ? <MdArrowDropUp className="text-lg" />
            : <MdArrowDropDown className="text-lg" />;

    };

    const decisionClass = (decision) => {

        switch (decision) {

            case "Excellent":
                return "bg-green-600";

            case "Strong Buy":
                return "bg-blue-600";

            case "Good":
                return "bg-yellow-600";

            case "Watch":
                return "bg-orange-600";

            case "Average":
                return "bg-purple-600";

            case "Skip":
                return "bg-red-600";

            default:
                return "bg-zinc-600";

        }

    };

    return (

        <>

            {/* TABLE CARD */}

            <div className="
                mt-8
                w-full
                max-w-full
                overflow-hidden
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
            ">

                {/* TABLE SCROLL AREA ONLY */}

                <div className="
                    w-full
                    max-w-full
                    overflow-x-auto
                    overflow-y-hidden
                ">

                    <table className="
                        w-full
                        min-w-[900px]
                        table-fixed
                        border-collapse
                    ">

                        <thead className="
                            sticky
                            top-0
                            z-20
                            bg-zinc-800
                        ">

                            <tr>

                                {/* # */}

                                <th className="
                                    w-[50px]
                                    p-3
                                    text-center
                                    text-xs
                                    font-bold
                                    text-zinc-300
                                ">
                                    #
                                </th>


                                {/* NUMBER */}

                                <th
                                    onClick={() => handleSort("number")}
                                    className="
                                        w-[110px]
                                        cursor-pointer
                                        p-3
                                        text-left
                                        text-xs
                                        font-bold
                                        text-zinc-300
                                        hover:bg-zinc-700
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        gap-1
                                    ">

                                        Number

                                        <SortIcon field="number" />

                                    </div>

                                </th>


                                {/* PENDING */}

                                <th
                                    onClick={() =>
                                        handleSort("currentPending")
                                    }
                                    className="
                                        w-[110px]
                                        cursor-pointer
                                        p-3
                                        text-center
                                        text-xs
                                        font-bold
                                        text-zinc-300
                                        hover:bg-zinc-700
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-1
                                    ">

                                        Pending

                                        <SortIcon field="currentPending" />

                                    </div>

                                </th>


                                {/* PREDICTION */}

                                <th
                                    onClick={() =>
                                        handleSort("predictionScore")
                                    }
                                    className="
                                        w-[120px]
                                        cursor-pointer
                                        p-3
                                        text-center
                                        text-xs
                                        font-bold
                                        text-zinc-300
                                        hover:bg-zinc-700
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-1
                                    ">

                                        Prediction

                                        <SortIcon field="predictionScore" />

                                    </div>

                                </th>


                                {/* AI SCORE */}

                                <th
                                    onClick={() =>
                                        handleSort("masterAIScore")
                                    }
                                    className="
                                        w-[180px]
                                        cursor-pointer
                                        p-3
                                        text-center
                                        text-xs
                                        font-bold
                                        text-zinc-300
                                        hover:bg-zinc-700
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-1
                                    ">

                                        AI Score

                                        <SortIcon field="masterAIScore" />

                                    </div>

                                </th>


                                {/* WIN */}

                                <th
                                    onClick={() =>
                                        handleSort("winProbability")
                                    }
                                    className="
                                        w-[100px]
                                        cursor-pointer
                                        p-3
                                        text-center
                                        text-xs
                                        font-bold
                                        text-zinc-300
                                        hover:bg-zinc-700
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-1
                                    ">

                                        Win %

                                        <SortIcon field="winProbability" />

                                    </div>

                                </th>


                                {/* DECISION */}

                                <th
                                    onClick={() =>
                                        handleSort("decision")
                                    }
                                    className="
                                        w-[130px]
                                        cursor-pointer
                                        p-3
                                        text-center
                                        text-xs
                                        font-bold
                                        text-zinc-300
                                        hover:bg-zinc-700
                                    "
                                >

                                    <div className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-1
                                    ">

                                        Decision

                                        <SortIcon field="decision" />

                                    </div>

                                </th>


                                {/* ACTION */}

                                <th className="
                                    w-[100px]
                                    p-3
                                    text-center
                                    text-xs
                                    font-bold
                                    text-zinc-300
                                ">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {sortedData.map((item, index) => (

                                <tr
                                    key={`${item.number}-${index}`}
                                    className="
                                        border-t
                                        border-zinc-800
                                        transition
                                        hover:bg-zinc-800
                                    "
                                >

                                    {/* # */}

                                    <td className="
                                        p-3
                                        text-center
                                        text-sm
                                        font-bold
                                        text-blue-400
                                    ">

                                        {index + 1}

                                    </td>


                                    {/* NUMBER */}

                                    <td className="
                                        p-3
                                        text-left
                                        text-sm
                                        font-bold
                                        text-white
                                    ">

                                        {item.number}

                                    </td>


                                    {/* PENDING */}

                                    <td className="
                                        p-3
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-white
                                    ">

                                        {item.currentPending}

                                    </td>


                                    {/* PREDICTION */}

                                    <td className="
                                        p-3
                                        text-center
                                        text-sm
                                        text-white
                                    ">

                                        {item.predictionScore}

                                    </td>


                                    {/* AI SCORE */}

                                    <td className="
                                        p-3
                                    ">

                                        <div className="
                                            flex
                                            flex-col
                                            gap-2
                                        ">

                                            <span className="
                                                text-sm
                                                font-bold
                                                text-white
                                            ">

                                                {item.masterAIScore}

                                            </span>

                                            <div className="
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
                                                        bg-green-500
                                                    "
                                                    style={{
                                                        width: `${Math.min(
                                                            Number(item.masterAIScore) || 0,
                                                            100
                                                        )}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </td>


                                    {/* WIN */}

                                    <td className="
                                        p-3
                                        text-center
                                        text-sm
                                        font-bold
                                        text-green-400
                                    ">

                                        {item.winProbability}%

                                    </td>


                                    {/* DECISION */}

                                    <td className="
                                        p-3
                                        text-center
                                    ">

                                        <span
                                            className={`
                                                inline-flex
                                                whitespace-nowrap
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                text-white
                                                ${decisionClass(item.decision)}
                                            `}
                                        >

                                            {item.decision}

                                        </span>

                                    </td>


                                    {/* ACTION */}

                                    <td className="
                                        p-3
                                        text-center
                                    ">

                                        <button
                                            onClick={() =>
                                                setSelectedItem(item)
                                            }
                                            className="
                                                rounded-lg
                                                bg-blue-600
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-white
                                                transition
                                                hover:bg-blue-700
                                            "
                                        >

                                            View

                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* DETAILS MODAL */}

            <DetailsModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />

        </>

    );

}