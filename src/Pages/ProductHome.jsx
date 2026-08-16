import {
    MdSearch,
    MdAutoGraph,
    MdArrowForward,
    MdHistory,
    MdGridView,
    MdAnalytics
} from "react-icons/md";


// ================================================================
// ORIGINAL FIND-IT URL
// LOCAL DEVELOPMENT
// ================================================================

const FINDIT_URL =
    import.meta.env.VITE_FINDIT_URL ||
    "https://find-it-original.onrender.com/";


export default function ProductHome() {

    // ============================================================
    // OPEN ORIGINAL FIND-IT
    // ============================================================

    const openFindIt = () => {

        window.location.assign(FINDIT_URL);

    };


    // ============================================================
    // OPEN ANALYSE METHOD
    // ============================================================

    const openAnalyse = () => {

        window.location.assign(
            "/analyse/dashboard"
        );

    };


    return (

        <div className="
            min-h-screen
            w-full
            overflow-x-hidden
            bg-[#070B14]
            text-white
        ">

            {/* Background */}

            <div className="
                pointer-events-none
                fixed
                inset-0
                overflow-hidden
            ">

                <div className="
                    absolute
                    left-[-120px]
                    top-[-120px]
                    h-[320px]
                    w-[320px]
                    rounded-full
                    bg-blue-600/10
                    blur-3xl
                " />

                <div className="
                    absolute
                    right-[-120px]
                    bottom-[-120px]
                    h-[320px]
                    w-[320px]
                    rounded-full
                    bg-purple-600/10
                    blur-3xl
                " />

            </div>


            {/* Content */}

            <div className="
                relative
                mx-auto
                flex
                min-h-screen
                w-full
                max-w-7xl
                flex-col
                justify-center
                px-4
                py-10
                sm:px-6
                lg:px-8
            ">

                {/* Brand */}

                <div className="
                    mb-10
                    text-center
                ">

                    <div className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-blue-500/20
                        bg-blue-500/10
                        text-blue-400
                        shadow-2xl
                        shadow-blue-500/10
                    ">

                        <MdAnalytics className="text-4xl" />

                    </div>


                    <p className="
                        mt-5
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.3em]
                        text-blue-400
                    ">
                        Find-It AI
                    </p>


                    <h1 className="
                        mt-3
                        text-3xl
                        font-black
                        tracking-tight
                        sm:text-4xl
                        lg:text-5xl
                    ">
                        SK Lottery Intelligence Platform
                    </h1>


                    <p className="
                        mx-auto
                        mt-4
                        max-w-2xl
                        text-sm
                        leading-6
                        text-slate-400
                        sm:text-base
                    ">
                        Choose the original lottery result explorer
                        or the new AI-powered analysis system.
                    </p>

                </div>


                {/* Two systems */}

                <div className="
                    grid
                    grid-cols-1
                    gap-5
                    lg:grid-cols-2
                ">


                    {/* ==================================================
                        FIND-IT
                    ================================================== */}

                    <button
                        type="button"
                        onClick={openFindIt}
                        className="
                            group
                            text-left
                            rounded-3xl
                            border
                            border-zinc-800
                            bg-zinc-900/80
                            p-5
                            shadow-2xl
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:border-blue-500/40
                            hover:bg-zinc-900
                            sm:p-7
                        "
                    >

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-500/10
                                text-blue-400
                            ">

                                <MdSearch className="text-3xl" />

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-zinc-800
                                text-zinc-400
                                transition
                                group-hover:bg-blue-600
                                group-hover:text-white
                            ">

                                <MdArrowForward />

                            </div>

                        </div>


                        <p className="
                            mt-6
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-blue-400
                        ">
                            Original System
                        </p>


                        <h2 className="
                            mt-2
                            text-2xl
                            font-black
                            sm:text-3xl
                        ">
                            Find-It
                        </h2>


                        <p className="
                            mt-3
                            text-sm
                            leading-6
                            text-slate-400
                        ">
                            Explore Kerala and Dear lottery results
                            using the original result tables, year
                            history, horizontal box patterns, vertical
                            box patterns and search tools.
                        </p>


                        <div className="
                            mt-6
                            grid
                            grid-cols-1
                            gap-2
                            sm:grid-cols-2
                        ">

                            <FeatureItem
                                icon={<MdGridView />}
                                text="Year & Month Tables"
                            />

                            <FeatureItem
                                icon={<MdSearch />}
                                text="Horizontal Search"
                            />

                            <FeatureItem
                                icon={<MdSearch />}
                                text="Vertical Search"
                            />

                            <FeatureItem
                                icon={<MdHistory />}
                                text="Lottery History"
                            />

                        </div>


                        <div className="
                            mt-7
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-blue-500/10
                            bg-blue-500/5
                            px-4
                            py-3
                        ">

                            <span className="
                                text-sm
                                font-semibold
                                text-blue-300
                            ">
                                Open Find-It
                            </span>


                            <MdArrowForward className="
                                text-xl
                                text-blue-400
                                transition
                                group-hover:translate-x-1
                            " />

                        </div>

                    </button>


                    {/* ==================================================
                        ANALYSE METHOD
                    ================================================== */}

                    <button
                        type="button"
                        onClick={openAnalyse}
                        className="
                            group
                            text-left
                            rounded-3xl
                            border
                            border-zinc-800
                            bg-zinc-900/80
                            p-5
                            shadow-2xl
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:border-purple-500/40
                            hover:bg-zinc-900
                            sm:p-7
                        "
                    >

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-purple-500/10
                                text-purple-400
                            ">

                                <MdAutoGraph className="text-3xl" />

                            </div>


                            <div className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-zinc-800
                                text-zinc-400
                                transition
                                group-hover:bg-purple-600
                                group-hover:text-white
                            ">

                                <MdArrowForward />

                            </div>

                        </div>


                        <p className="
                            mt-6
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-purple-400
                        ">
                            New Intelligence System
                        </p>


                        <h2 className="
                            mt-2
                            text-2xl
                            font-black
                            sm:text-3xl
                        ">
                            Analyse Method
                        </h2>


                        <p className="
                            mt-3
                            text-sm
                            leading-6
                            text-slate-400
                        ">
                            Use the new AI intelligence platform to
                            analyze pending numbers, ranking strength,
                            prediction scores and decision signals.
                        </p>


                        <div className="
                            mt-6
                            grid
                            grid-cols-1
                            gap-2
                            sm:grid-cols-2
                        ">

                            <FeatureItem
                                icon={<MdAnalytics />}
                                text="Dashboard"
                            />

                            <FeatureItem
                                icon={<MdAutoGraph />}
                                text="AI Ranking"
                            />

                            <FeatureItem
                                icon={<MdSearch />}
                                text="Prediction"
                            />

                            <FeatureItem
                                icon={<MdHistory />}
                                text="Decision & History"
                            />

                        </div>


                        <div className="
                            mt-7
                            flex
                            items-center
                            justify-between
                            rounded-2xl
                            border
                            border-purple-500/10
                            bg-purple-500/5
                            px-4
                            py-3
                        ">

                            <span className="
                                text-sm
                                font-semibold
                                text-purple-300
                            ">
                                Open Analyse Method
                            </span>


                            <MdArrowForward className="
                                text-xl
                                text-purple-400
                                transition
                                group-hover:translate-x-1
                            " />

                        </div>

                    </button>

                </div>


                {/* Footer */}

                <div className="
                    mt-10
                    text-center
                ">

                    <p className="
                        text-xs
                        text-slate-600
                    ">
                        Find-It AI • Lottery Results & Intelligence
                    </p>

                </div>

            </div>

        </div>

    );

}


// ================================================================
// FEATURE ITEM
// ================================================================

function FeatureItem({
    icon,
    text
}) {

    return (

        <div className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-zinc-800
            bg-zinc-950/40
            px-3
            py-2.5
        ">

            <span className="
                text-lg
                text-slate-500
            ">
                {icon}
            </span>


            <span className="
                text-xs
                font-medium
                text-slate-300
            ">
                {text}
            </span>

        </div>

    );

}
