import {
    MdRefresh,
    MdDownload,
    MdSearch
} from "react-icons/md";

export default function Toolbar({

    lottery,

    setLottery,

    digits,

    setDigits,

    search,

    setSearch,

    decision,

    setDecision,

    sort,

    setSort

}) {

    return (

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-8">

           <div className="
    grid
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-4
    xl:grid-cols-6
    gap-3
    w-full
    min-w-0
    items-center
">

                <select
                    className="bg-zinc-800 rounded-lg p-3 w-full min-w-0"
                    value={lottery}
                    onChange={(e)=>setLottery(e.target.value)}
                >

                    <option value="kerala">

                        Kerala

                    </option>

                    <option value="dear">

                        Dear

                    </option>

                </select>

                <select
                    className="bg-zinc-800 rounded-lg p-3 w-full min-w-0"
                    value={digits}
                    onChange={(e)=>setDigits(e.target.value)}
                >

                    <option value="single">Single</option>

                    <option value="double">Double</option>

                    <option value="triple">Triple</option>

                    <option value="four">Four</option>

                </select>

                <select
                    className="bg-zinc-800 rounded-lg p-3 w-full min-w-0"
                    value={decision}
                    onChange={(e)=>setDecision(e.target.value)}
                >

                    <option value="All">All</option>

                    <option>Excellent</option>

                    <option>Strong Buy</option>

                    <option>Good</option>

                    <option>Watch</option>

                    <option>Average</option>

                    <option>Skip</option>

                </select>   

<select
    className="bg-zinc-800 rounded-lg p-3 w-full min-w-0"
    value={sort}
    onChange={(e) => setSort(e.target.value)}
>

    <option value="pending">
        Pending
    </option>

    <option value="ai">
        AI Score
    </option>

    <option value="win">
        Win %
    </option>

    <option value="prediction">
        Prediction
    </option>

    <option value="recovery">
        Recovery
    </option>

    <option value="pressure">
        Pressure
    </option>

    <option value="bounce">
        Bounce
    </option>

    <option value="pattern">
        Pattern
    </option>

</select>
                <div className="
    relative
    w-full
    min-w-0
    sm:col-span-2
    lg:col-span-2
">

                    <MdSearch
                        className="absolute left-3 top-4 text-gray-400"
                    />

                    <input

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                        placeholder="Search Number..."

                        className="w-full bg-zinc-800 rounded-lg pl-10 p-3"

                    />

                </div>

            </div>

            <div className="
    flex
    flex-col
    sm:flex-row
    gap-3
    mt-5
    w-full
">

                <button
    className="
        bg-blue-600
        hover:bg-blue-700
        px-4
        py-2
        rounded-lg
        flex
        items-center
        justify-center
        gap-2
        w-full
        sm:w-auto
        transition
    "
>

                    <MdRefresh/>

                    Refresh

                </button>

                <button
    className="
        bg-green-600
        hover:bg-green-700
        px-4
        py-2
        rounded-lg
        flex
        items-center
        justify-center
        gap-2
        w-full
        sm:w-auto
        transition
    "
>

                    <MdDownload/>

                    Export CSV

                </button>

            </div>

        </div>

    );

}