        import {
            useEffect,
            useMemo,
            useState
        } from "react";

        import Layout from "../components/layout/Layout";

        import useNewFunctionData
            from "../hooks/useNewFunctionData";

        import {
            analyzeNewFunctionHistory,
            findNumbersByGroups,
            filterTop20WithRanking,
            getDetailedNumberAnalysis,
            getGroupsFromNumber,
            getGroup0to27,
            getGroup0to36,
            groupDefinitions,
            groupDefinitions2,
            groupDefinitions3
        } from "../services/newFunctionAnalysis";

        import {
            MdAnalytics,
            MdNumbers,
            MdSearch,
            MdHistory,
            MdDownload,
            MdGridView,
            MdFilterList,
            MdCalculate,
            MdPictureAsPdf,
            MdTableView,
            MdImage,
            MdRefresh
        } from "react-icons/md";


        export default function NewFunction() {

            const [activePage, setActivePage] = useState(1);

            const [lottery, setLottery] = useState("kerala");

            const [digits, setDigits] = useState(3);

            const [groupSearchText, setGroupSearchText] =
            useState("");

        const [groupSearchResults, setGroupSearchResults] =
            useState([]);

        const [groupSearchTable1, setGroupSearchTable1] =
            useState(true);

        const [groupSearchTable2, setGroupSearchTable2] =
            useState(false);

        const [groupSearchTable3, setGroupSearchTable3] =
            useState(false);

            const [top20, setTop20] =
        useState(false);
        
        const [selectedNumber, setSelectedNumber] =
        useState(null);

        const [detailOpen, setDetailOpen] =
        useState(false);

        const [groupModalOpen, setGroupModalOpen] =
        useState(false);

    const [groupModalNumbers, setGroupModalNumbers] =
        useState([]);

    const [groupModalTitle, setGroupModalTitle] =
        useState("");

    const [groupModalSearch, setGroupModalSearch] =
        useState("");

    const [groupModalPermutation, setGroupModalPermutation] =
        useState(false);

    const [groupModalTop20, setGroupModalTop20] =
        useState(true);


    const {
        history,
        items,
        loading,
        error,
        reload
    } = useNewFunctionData(
        lottery,
        digits
    );


            const analysis = useMemo(() => {

                return analyzeNewFunctionHistory(
                    history,
                    digits === 4
                );

            }, [
                history,
                digits
            ]);


            useEffect(() => {

                console.log("=== NEW FUNCTION DATA CHECK ===", {
    lottery,
    digits,
    historyCount: history.length,
    first10: history.slice(0, 10)
});

            }, [
                lottery,
                digits,
                history.length
            ]);


            const handleLotteryChange = (value) => {

                setLottery(value);

            };

const handleDigitsChange = (value) => {

    setDigits(value);

    // Clear previous 3D/4D search
    setGroupSearchText("");

    // Clear previous search results
    setGroupSearchResults([]);

    // Open correct page
    setActivePage(
        value === 3
            ? 1
            : 2
    );

};

const runReverseGroupSearch = () => {

    const value =
        groupSearchText
            .replace(/\D/g, "")
            .trim();

    const expectedDigits =
        digits === 4 ? 4 : 3;

    // Empty search
    if (!value) {
        setGroupSearchResults([]);
        return;
    }

    // Exact digit validation
    if (value.length !== expectedDigits) {

        alert(
            `தயவுசெய்து சரியான ${expectedDigits} இலக்க எண்ணை உள்ளிடவும்.`
        );

        return;
    }

    const selectedDefinitions = [];


            if (groupSearchTable1) {

                selectedDefinitions.push({

                    name: "குழும ரேங்கிங் 1",

                    definitions:
                        groupDefinitions,
                    isSet3: false
                });

            }


            if (groupSearchTable2) {

                selectedDefinitions.push({

                    name: "குழும ரேங்கிங் 2",

                    definitions:
                        groupDefinitions2,
                    isSet3: false

                });

            }


            if (groupSearchTable3) {

                selectedDefinitions.push({

                    name: "குழும ரேங்கிங் 3",

                    definitions:
                        groupDefinitions3,
                    isSet3: true

                });

            }


            if (
                selectedDefinitions.length === 0
            ) {

                setGroupSearchResults([]);

                return;

            }


            const results =
        selectedDefinitions.map(
            (table) => {

                const allNumbers =
    findNumbersByGroups(
        value,
        table.definitions,
        digits === 4,
        table.isSet3 === true
    );

                const finalNumbers =
                    top20
                        ? filterTop20WithRanking(
                            allNumbers,
                            history
                        )
                        : allNumbers;


                return {

                    tableName:
                        table.name,

                    numbers:
                        finalNumbers

                };

            }
        );


            setGroupSearchResults(results);

        };
    const openNumberDetails = (number) => {

        const details =
            getDetailedNumberAnalysis(
                number,
                history,
                digits === 4
            );


        setSelectedNumber(details);

        // Close group modal first
        setGroupModalOpen(false);

        // Open detail modal
        setDetailOpen(true);

    };
    const generateGroupNumbers = (
        groupType,
        groupValue
    ) => {

        const max =
            digits === 4
                ? 9999
                : 999;

        const numbers = [];

        for (
            let i = 0;
            i <= max;
            i++
        ) {

            const number =
                String(i).padStart(
                    digits === 4
                        ? 4
                        : 3,
                    "0"
                );


            let matches = false;


            if (groupType === "group1") {

                matches =
                    getGroupsFromNumber(
                        number,
                        groupDefinitions,
                        false
                    )
                    .includes(
                        String(groupValue)
                    );

            }


            if (groupType === "group2") {

                matches =
                    getGroupsFromNumber(
                        number,
                        groupDefinitions2,
                        false
                    )
                    .includes(
                        String(groupValue)
                    );

            }


            if (groupType === "group3") {

                matches =
                    getGroupsFromNumber(
                        number,
                        groupDefinitions3,
                        true
                    )
                    .includes(
                        String(groupValue)
                    );

            }


            if (groupType === "sum") {

                const sum =
                    digits === 4
                        ? getGroup0to36(number)
                        : getGroup0to27(number);


                matches =
                    sum === String(groupValue);

            }


            if (matches) {

                numbers.push(number);

            }

        }


        return numbers;
    };

            const openGroupModal = (
        title,
        groupType,
        groupValue
    ) => {

        const numbers =
            generateGroupNumbers(
                groupType,
                groupValue
            );


        setGroupModalTitle(title);

        setGroupModalNumbers(
            numbers
        );

        setGroupModalSearch("");

        setGroupModalPermutation(false);

        setGroupModalTop20(true);

        setGroupModalOpen(true);

    };

            return (
                <Layout>

                    <div className="
                        w-full
                        min-w-0
                        max-w-full
                        overflow-x-hidden
                    ">

                        {/* ==================================================
                            HEADER
                        ================================================== */}

                        <div className="mb-6">

                            <p className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-cyan-400
                                sm:text-sm
                            ">
                                மேம்பட்ட எண் பகுப்பாய்வு
                            </p>


                            <h1 className="
                                mt-1
                                text-2xl
                                font-bold
                                text-white
                                sm:text-3xl
                                lg:text-4xl
                            ">
                                ஒருங்கிணைந்த ரேங்கிங் பகுப்பாய்வு
                            </h1>


                            <p className="
                                mt-2
                                max-w-4xl
                                text-sm
                                leading-6
                                text-slate-400
                            ">
                                Kerala மற்றும் Dear லாட்டரி தரவுகளை
                                தனித்தனியாக வைத்து 3 இலக்க மற்றும்
                                4 இலக்க எண் பகுப்பாய்வு செய்யலாம்.
                            </p>

                        </div>


                        {/* ==================================================
                            LOTTERY SELECTOR
                        ================================================== */}

                        <div className="
                            mb-6
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    handleLotteryChange("kerala")
                                }
                                className={
                                    "rounded-xl border px-4 py-3 text-sm font-bold transition " +
                                    (
                                        lottery === "kerala"
                                            ? "border-green-500 bg-green-500/10 text-green-400"
                                            : "border-zinc-800 bg-zinc-900 text-slate-400 hover:bg-zinc-800 hover:text-white"
                                    )
                                }
                            >
                                🇮🇳 Kerala Lottery
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    handleLotteryChange("dear")
                                }
                                className={
                                    "rounded-xl border px-4 py-3 text-sm font-bold transition " +
                                    (
                                        lottery === "dear"
                                            ? "border-purple-500 bg-purple-500/10 text-purple-400"
                                            : "border-zinc-800 bg-zinc-900 text-slate-400 hover:bg-zinc-800 hover:text-white"
                                    )
                                }
                            >
                                🎟️ Dear Lottery
                            </button>

                        </div>


                        {/* ==================================================
                            DIGIT SELECTOR
                        ================================================== */}

                        <div className="
                            mb-6
                            flex
                            flex-col
                            gap-2
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900
                            p-2
                            sm:flex-row
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    handleDigitsChange(3)
                                }
                                className={
                                    "flex-1 rounded-xl px-4 py-3 text-sm font-bold transition " +
                                    (
                                        digits === 3
                                            ? "bg-cyan-600 text-white"
                                            : "text-slate-400 hover:bg-zinc-800 hover:text-white"
                                    )
                                }
                            >
                                3 இலக்க பகுப்பாய்வு
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    handleDigitsChange(4)
                                }
                                className={
                                    "flex-1 rounded-xl px-4 py-3 text-sm font-bold transition " +
                                    (
                                        digits === 4
                                            ? "bg-cyan-600 text-white"
                                            : "text-slate-400 hover:bg-zinc-800 hover:text-white"
                                    )
                                }
                            >
                                4 இலக்க பகுப்பாய்வு
                            </button>

                        </div>


                        {/* ==================================================
                            PAGE SWITCH
                        ================================================== */}

                        <div className="
                            mb-6
                            flex
                            flex-col
                            gap-2
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900
                            p-2
                            sm:flex-row
                        ">

                            <button
                                type="button"
                                onClick={() => setActivePage(1)}
                                className={
                                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition " +
                                    (
                                        activePage === 1
                                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                                            : "text-slate-400 hover:bg-zinc-800 hover:text-white"
                                    )
                                }
                            >
                                <MdNumbers className="text-xl" />

                                பக்கம் 1 — 3 இலக்க எண்கள்

                            </button>


                            <button
                                type="button"
                                onClick={() => setActivePage(2)}
                                className={
                                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition " +
                                    (
                                        activePage === 2
                                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20"
                                            : "text-slate-400 hover:bg-zinc-800 hover:text-white"
                                    )
                                }
                            >
                                <MdNumbers className="text-xl" />

                                பக்கம் 2 — 4 இலக்க எண்கள்

                            </button>

                        </div>


                        {/* ==================================================
                            DATA STATUS
                        ================================================== */}

                        <section className="
                            mb-6
                            rounded-2xl
                            border
                            border-zinc-800
                            bg-zinc-900
                            p-4
                            sm:p-5
                        ">

                            <div className="
                                flex
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            ">

                                <div>

                                    <h2 className="
                                        text-lg
                                        font-bold
                                        text-white
                                    ">
                                        {
                                            lottery === "kerala"
                                                ? "Kerala Lottery தரவு"
                                                : "Dear Lottery தரவு"
                                        }
                                    </h2>


                                    <p className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-slate-500
                                    ">
                                        {
                                            digits === 3
                                                ? "கடைசி 3 இலக்கங்கள் மட்டும் பகுப்பாய்வுக்கு பயன்படுத்தப்படுகின்றன."
                                                : "கடைசி 4 இலக்கங்கள் மட்டும் பகுப்பாய்வுக்கு பயன்படுத்தப்படுகின்றன."
                                        }
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={reload}
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-zinc-800
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-white
                                        hover:bg-zinc-700
                                    "
                                >

                                    <MdRefresh />

                                    மீண்டும் ஏற்று

                                </button>

                            </div>


                            <div className="
                                mt-5
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-3
                            ">

                                <StatusCard
                                    label="தேர்ந்தெடுத்த லாட்டரி"
                                    value={
                                        lottery === "kerala"
                                            ? "Kerala"
                                            : "Dear"
                                    }
                                />


                                <StatusCard
                                    label="இலக்க முறை"
                                    value={`${digits} இலக்கம்`}
                                />


                                <StatusCard
                                    label="வரலாறு பதிவுகள்"
                                    value={analysis.total}
                                />

                            </div>


                            {loading && (

                                <div className="
                                    mt-5
                                    rounded-xl
                                    border
                                    border-zinc-800
                                    bg-zinc-950/50
                                    px-4
                                    py-8
                                    text-center
                                    text-sm
                                    text-slate-500
                                ">
                                    தரவு ஏற்றப்படுகிறது...
                                </div>

                            )}


                            {!loading && error && (

                                <div className="
                                    mt-5
                                    rounded-xl
                                    border
                                    border-red-500/20
                                    bg-red-500/5
                                    px-4
                                    py-4
                                    text-sm
                                    text-red-300
                                ">
                                    {error}
                                </div>

                            )}

                        </section>


                        {/* ==================================================
                            ANALYSIS
                        ================================================== */}

                        {!loading && !error && (

            <>

                <ReverseGroupSearch
                    digits={digits}
                    value={groupSearchText}
                    setValue={setGroupSearchText}

                    table1={groupSearchTable1}
                    setTable1={setGroupSearchTable1}

                    table2={groupSearchTable2}
                    setTable2={setGroupSearchTable2}

                    table3={groupSearchTable3}
                    setTable3={setGroupSearchTable3}

                    top20={top20}
                    setTop20={setTop20}

                    onSearch={runReverseGroupSearch}

                    results={groupSearchResults}

                    history={history}
                />


                {digits === 3 && (

  <ThreeDigitPage
    analysis={analysis}
    history={history}
    items={items}
    lottery={lottery}
    onNumberClick={openNumberDetails}
    onGroupClick={openGroupModal}
/>
                )}


                {digits === 4 && (

<FourDigitPage
    analysis={analysis}
    history={history}
    items={items}
    lottery={lottery}
    onNumberClick={openNumberDetails}
    onGroupClick={openGroupModal}
/>

                )}

            </>

        )}
                {groupModalOpen && (

        <GroupNumbersModal
            title={groupModalTitle}
            numbers={groupModalNumbers}
            history={history}
            search={groupModalSearch}
            setSearch={setGroupModalSearch}
            permutation={groupModalPermutation}
            setPermutation={setGroupModalPermutation}
            top20={groupModalTop20}
            setTop20={setGroupModalTop20}
            onClose={() =>
                setGroupModalOpen(false)
            }
            onNumberClick={openNumberDetails}
        />

    )}
    {detailOpen && selectedNumber && (

        <NumberDetailModal
            details={selectedNumber}
            onClose={() =>
                setDetailOpen(false)
            }
        />

    )}


                    </div>

                </Layout>
            );
        }


        /* ================================================================
        3 DIGIT PAGE
        ================================================================ */

function ThreeDigitPage({
    analysis,
    history,
    items,
    lottery,
    onNumberClick,
    onGroupClick
}) {

            return (
                <div className="space-y-6">

                    {/* ==================================================
                        OVERALL + POSITION
                    ================================================== */}

                    <SectionCard
                        icon={<MdAnalytics />}
                        title="1. ஒற்றை இலக்க எண்கள் ரேங்கிங்"
                        description="வரலாற்று 3 இலக்க தரவிலிருந்து ஒட்டுமொத்த மற்றும் நிலை வாரியான ரேங்கிங்."
                    >

                        <div className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        ">

                            <RankingTable
        title="ஒட்டுமொத்த (0 - 9)"
        items={analysis.ranking.overall}
        onNumberClick={onNumberClick}
    />


                            <RankingTable
                                title="Rank A"
                                items={analysis.ranking.position1}
                                onNumberClick={onNumberClick}
                            />


                            <RankingTable
                                title="Rank B"
                                items={analysis.ranking.position2}
                                onNumberClick={onNumberClick}
                            />


                            <RankingTable
                                title="Rank C"
                                items={analysis.ranking.position3}
                                onNumberClick={onNumberClick}
                            />

                        </div>

                    </SectionCard>


                    {/* ==================================================
                        PAIR
                    ================================================== */}

                    <RankingLabelSection
                        title="2. இரட்டை இலக்க எண்கள் ரேங்கிங்"
                        items={
                            analysis.pairRanking.map(
                                item => item.label
                            )
                        }
                    />


                    {/* ==================================================
                        GROUP 1
                    ================================================== */}

                    <GroupRankingSection
        title="குழும ரேங்கிங் 1 — பழைய 6 குழுக்கள்"
        items={analysis.group1}
        groupType="group1"
        onGroupClick={onGroupClick}
    />


                    {/* ==================================================
                        GROUP 2
                    ================================================== */}

                    <GroupRankingSection
        title="குழும ரேங்கிங் 2 — புதிய 5 குழுக்கள்"
        items={analysis.group2}
        groupType="group2"
        onGroupClick={onGroupClick}
    />


                    {/* ==================================================
                        GROUP 3
                    ================================================== */}

                    <GroupRankingSection
        title="குழும ரேங்கிங் 3 — புதிய 10 குழுக்கள்"
        items={analysis.group3}
        groupType="group3"
        onGroupClick={onGroupClick}
    />


                    {/* ==================================================
                        ODD EVEN
                    ================================================== */}

                    <OddEvenSection
                        title="Odd / Even ரேங்கிங் — A முதல் H"
                        analysis={analysis.oddEven}
                    />


                    {/* ==================================================
                        GROUP 0 - 27
                    ================================================== */}

                    <GroupSumSection
                        title="குழு 0 முதல் 27 — Digit Sum"
                        analysis={analysis.groupSum}
                        onGroupClick={onGroupClick}
                    />


                    {/* ==================================================
                        HISTORY
                    ================================================== */}

                    <HistorySection
        lottery={lottery}
        digits={3}
        items={items}
        history={history}
    />

                </div>
            );
        }


        /* ================================================================
        4 DIGIT PAGE
        ================================================================ */

function FourDigitPage({
    analysis,
    history,
    items,
    lottery,
    onNumberClick,
    onGroupClick
}) {

            return (
                <div className="space-y-6">

                    {/* ==================================================
                        OVERALL + POSITION
                    ================================================== */}

                    <SectionCard
                        icon={<MdAnalytics />}
                        title="1. ஒற்றை இலக்க எண்கள் ரேங்கிங் — 4 இலக்கம்"
                        description="4 இலக்க history-ன் கடைசி 4 இலக்கங்களை வைத்து ஒட்டுமொத்த மற்றும் நிலை வாரியான ரேங்கிங்."
                    >

                        <div className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-3
                            xl:grid-cols-5
                        ">

                            <RankingTable
                                title="ஒட்டுமொத்த (0 - 9)"
                                items={analysis.ranking.overall}
                                onNumberClick={onNumberClick}
                            />


                            <RankingTable
                                title="Rank D — 1வது"
                                items={analysis.ranking.position1}
                                onNumberClick={onNumberClick}
                            />


                            <RankingTable
                                title="Rank A — 2வது"
                                items={analysis.ranking.position2}
                                onNumberClick={onNumberClick}
                            />


                            <RankingTable
                                title="Rank B — 3வது"
                                items={analysis.ranking.position3}
                                onNumberClick={onNumberClick}
                            />


                            <RankingTable
                                title="Rank C — 4வது"
                                items={analysis.ranking.position4}
                                onNumberClick={onNumberClick}
                            />

                        </div>

                    </SectionCard>


                    {/* ==================================================
                        PAIR
                    ================================================== */}

                    <RankingLabelSection
                        title="2. இரட்டை இலக்க எண்கள் ரேங்கிங் — 4 இலக்கம்"
                        items={
                            analysis.pairRanking.map(
                                item => item.label
                            )
                        }
                    />


                    {/* ==================================================
                        GROUP 1
                    ================================================== */}

                    <GroupRankingSection
                        title="குழும ரேங்கிங் 1 — பழைய 6 குழுக்கள்"
                        items={analysis.group1}
                        groupType="group1"
        onGroupClick={onGroupClick}
                    />


                    {/* ==================================================
                        GROUP 2
                    ================================================== */}

                    <GroupRankingSection
                        title="குழும ரேங்கிங் 2 — புதிய 5 குழுக்கள்"
                        items={analysis.group2}
                        groupType="group2"
        onGroupClick={onGroupClick}
                    />


                    {/* ==================================================
                        GROUP 3
                    ================================================== */}

                    <GroupRankingSection
                        title="குழும ரேங்கிங் 3 — புதிய 10 குழுக்கள்"
                        items={analysis.group3}
                        groupType="group3"
        onGroupClick={onGroupClick}
                    />


                    {/* ==================================================
                        ODD EVEN
                    ================================================== */}

                    <OddEvenSection
                        title="Odd / Even ரேங்கிங் — A முதல் P"
                        analysis={analysis.oddEven}
                    />


                    {/* ==================================================
                        GROUP 0 - 36
                    ================================================== */}

                    <GroupSumSection
                        title="குழு 0 முதல் 36 — Digit Sum"
                        analysis={analysis.groupSum}
                        onGroupClick={onGroupClick}
                    />


                    {/* ==================================================
                        HISTORY
                    ================================================== */}

                    <HistorySection
        lottery={lottery}
        digits={4}
        items={items}
        history={history}
    />  

                </div>
            );
        }


        /* ================================================================
        STATUS CARD
        ================================================================ */

        function StatusCard({
            label,
            value
        }) {

            return (
                <div className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950/50
                    p-4
                ">

                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        {label}
                    </p>


                    <p className="
                        mt-1
                        text-lg
                        font-bold
                        text-white
                    ">
                        {value}
                    </p>

                </div>
            );
        }


        /* ================================================================
        SECTION CARD
        ================================================================ */

        function SectionCard({
            icon,
            title,
            description,
            children
        }) {

            return (
                <section className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                ">

                    <div className="
                        flex
                        items-start
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-cyan-500/10
                            text-cyan-400
                        ">

                            {icon}

                        </div>


                        <div className="
                            min-w-0
                        ">

                            <h2 className="
                                text-lg
                                font-bold
                                text-white
                            ">
                                {title}
                            </h2>


                            <p className="
                                mt-1
                                text-xs
                                leading-5
                                text-slate-500
                            ">
                                {description}
                            </p>

                        </div>

                    </div>


                    <div className="mt-5">
                        {children}
                    </div>

                </section>
            );
        }


        /* ================================================================
        RANKING TABLE
        ================================================================ */

        function RankingTable({
            title,
            items,
            onNumberClick
        }) {

            return (
                <div className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950/50
                    p-4
                ">

                    <h3 className="
                        text-sm
                        font-bold
                        text-white
                    ">
                        {title}
                    </h3>


                    <div className="
                        mt-3
                        overflow-hidden
                        rounded-lg
                        border
                        border-zinc-800
                    ">

                        {items.map(
                            (item, index) => (

                                <div
                                    key={`${item}-${index}`}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-zinc-800
                                        px-3
                                        py-2
                                        last:border-b-0
                                    "
                                >

                                    <span className="
                                        text-xs
                                        font-bold
                                        text-red-400
                                    ">
                                        {index + 1}
                                    </span>


                                    <button
        type="button"
        onClick={() =>
            onNumberClick(item)
        }
        className="
            text-sm
            font-bold
            text-cyan-300
            transition
            hover:text-cyan-200
            hover:underline
        "
    >
        {item}
    </button>

                                </div>

                            )
                        )}

                    </div>

                </div>
            );
        }


        /* ================================================================
        PAIR SECTION
        ================================================================ */

        function RankingLabelSection({
            title,
            items
        }) {

            return (
                <section className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                ">

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-2
                    ">

                        <MdNumbers className="
                            text-xl
                            text-cyan-400
                        " />


                        <h2 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            {title}
                        </h2>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-5
                    ">

                        {items.map(
                            (item, index) => (

                                <div
                                    key={`${item}-${index}`}
                                    className="
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-zinc-950/50
                                        p-4
                                        text-center
                                    "
                                >

                                    <p className="
                                        text-xs
                                        font-bold
                                        text-red-400
                                    ">
                                        Rank {index + 1}
                                    </p>


                                    <p className="
                                        mt-2
                                        text-lg
                                        font-black
                                        text-cyan-300
                                    ">
                                        {item}
                                    </p>

                                </div>

                            )
                        )}

                    </div>

                </section>
            );
        }


        /* ================================================================
        GROUP RANKING
        ================================================================ */

        function GroupRankingSection({
            title,
            items,
            groupType,
        onGroupClick
        }) {

            return (
                <section className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                ">

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-2
                    ">

                        <MdGridView className="
                            text-xl
                            text-cyan-400
                        " />


                        <h2 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            {title}
                        </h2>

                    </div>


                    <div className="
                        overflow-x-auto
                    ">

                        <table className="
                            w-full
                            min-w-[600px]
                            border-collapse
                        ">

                            <thead>

                                <tr className="bg-zinc-800">

                                    <th className="
                                        px-4
                                        py-3
                                        text-center
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    ">
                                        ரேங்க்
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-center
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    ">
                                        குழு
                                    </th>


                                    <th className="
                                        px-4
                                        py-3
                                        text-center
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    ">
                                        எண்கள்
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {items.map(
                                    (item) => (

                                        <tr
                                            key={`${item.id}-${item.rank}`}
                                            className="
                                                border-t
                                                border-zinc-800
                                            "
                                        >

                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                                text-sm
                                                font-bold
                                                text-red-400
                                            ">
                                                {item.rank}
                                            </td>


                                            <td className="
        px-4
        py-3
        text-center
    ">
        <button
            type="button"
            onClick={() =>
                onGroupClick(
                    `${item.name} — ${title}`,
                    groupType,
                    item.id
                )
            }
            className="
                text-sm
                font-bold
                text-cyan-300
                hover:text-cyan-100
                hover:underline
            "
        >
            {item.name}
        </button>
    </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                                text-sm
                                                font-bold
                                                text-slate-300
                                            ">
                                                {item.count}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>
            );
        }


        /* ================================================================
        ODD EVEN
        ================================================================ */

        function OddEvenSection({
            title,
            analysis
        }) {

            return (
                <section className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                ">

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-2
                    ">

                        <MdAnalytics className="
                            text-xl
                            text-cyan-400
                        " />


                        <h2 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            {title}
                        </h2>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        gap-4
                        lg:grid-cols-2
                    ">

                        <SimpleList
                            title="அதிர்வெண் ரேங்கிங்"
                            items={
                                analysis.frequency.map(
                                    item =>
                                        `${item.section} — ${item.count} முறை`
                                )
                            }
                        />


                        <SimpleList
                            title="கடைசி வருகை ரேங்கிங்"
                            items={
                                analysis.recency.map(
                                    item =>
                                        item.section
                                )
                            }
                        />

                    </div>

                </section>
            );
        }


        /* ================================================================
        GROUP SUM
        ================================================================ */

        function GroupSumSection({
            title,
            analysis
        }) {

            return (
                <section className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                ">

                    <div className="
                        mb-5
                        flex
                        items-center
                        gap-2
                    ">

                        <MdNumbers className="
                            text-xl
                            text-cyan-400
                        " />


                        <h2 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            {title}
                        </h2>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        gap-4
                        lg:grid-cols-2
                    ">

                        <SimpleList
                            title="அதிர்வெண் ரேங்கிங்"
                            items={
                                analysis.frequency.map(
                                    item =>
                                        `${item.group} — ${item.count} முறை`
                                )
                            }
                        />


                        <SimpleList
                            title="கடைசி வருகை ரேங்கிங்"
                            items={
                                analysis.recency.map(
                                    item =>
                                        item.group
                                )
                            }
                        />

                    </div>

                </section>
            );
        }


        /* ================================================================
        SIMPLE LIST
        ================================================================ */

        function SimpleList({
            title,
            items
        }) {

            return (
                <div className="
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-950/50
                    p-4
                ">

                    <h3 className="
                        text-sm
                        font-bold
                        text-white
                    ">
                        {title}
                    </h3>


                    <div className="
                        mt-3
                        space-y-2
                    ">

                        {items.map(
                            (item, index) => (

                                <div
                                    key={`${item}-${index}`}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-lg
                                        border
                                        border-zinc-800
                                        px-3
                                        py-2
                                    "
                                >

                                    <span className="
                                        text-xs
                                        font-bold
                                        text-red-400
                                    ">
                                        {index + 1}
                                    </span>


                                    <span className="
                                        text-sm
                                        font-bold
                                        text-cyan-300
                                    ">
                                        {item}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </div>
            );
        }


        /* ================================================================
        HISTORY
        ================================================================ */
    function HistorySection({
        lottery,
        digits,
        items,
        history
    }) {

        const visibleItems =
            Array.isArray(items)
                ? items.slice(0, 100)
                : [];


        return (
            <section
                className="
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                "
            >

                <div className="
                    flex
                    items-center
                    gap-2
                ">

                    <MdHistory
                        className="
                            text-xl
                            text-cyan-400
                        "
                    />


                    <h2 className="
                        text-lg
                        font-bold
                        text-white
                    ">
                        {lottery === "kerala"
                            ? "Kerala"
                            : "Dear"
                        }{" "}
                        — {digits} இலக்க வரலாறு
                    </h2>

                </div>


                <p className="
                    mt-2
                    text-xs
                    text-slate-500
                ">
                    மொத்த பதிவுகள்: {history.length}
                </p>


                <div className="
                    mt-4
                    overflow-x-auto
                    rounded-xl
                    border
                    border-zinc-800
                ">

                    <table className="
                        w-full
                        min-w-[650px]
                        border-collapse
                    ">

                        <thead>

                            <tr className="
                                bg-zinc-800
                            ">

                                <th className="
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    text-slate-300
                                ">
                                    தேதி
                                </th>


                                {lottery === "dear" && (

                                    <th className="
                                        px-4
                                        py-3
                                        text-center
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    ">
                                        Slot
                                    </th>

                                )}


                                <th className="
                                    px-4
                                    py-3
                                    text-center
                                    text-xs
                                    font-semibold
                                    text-slate-300
                                ">
                                    Original
                                </th>


                                <th className="
                                    px-4
                                    py-3
                                    text-center
                                    text-xs
                                    font-semibold
                                    text-slate-300
                                ">
                                    {digits}D
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {visibleItems.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={
                                            lottery === "dear"
                                                ? 4
                                                : 3
                                        }
                                        className="
                                            px-4
                                            py-10
                                            text-center
                                            text-xs
                                            text-slate-500
                                        "
                                    >
                                        வரலாற்று தரவு இல்லை
                                    </td>

                                </tr>

                            ) : (

                                visibleItems.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                `${item.date}-${item.time || ""}-${index}`
                                            }
                                            className="
                                                border-t
                                                border-zinc-800
                                            "
                                        >

                                            <td className="
                                                px-4
                                                py-3
                                                text-sm
                                                text-slate-300
                                            ">
                                                {item.date || "-"}
                                            </td>


                                            {lottery === "dear" && (

                                                <td className="
                                                    px-4
                                                    py-3
                                                    text-center
                                                    text-sm
                                                    font-semibold
                                                    text-purple-300
                                                ">
                                                    {item.time || "-"}
                                                </td>

                                            )}


                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                                text-sm
                                                font-bold
                                                text-white
                                            ">
                                                {item.originalTicket || "-"}
                                            </td>


                                            <td className="
                                                px-4
                                                py-3
                                                text-center
                                                text-sm
                                                font-black
                                                text-cyan-300
                                            ">
                                                {digits === 4
                                                    ? item.number4
                                                    : item.number3
                                                }
                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>
        );
    }

    function ReverseGroupSearch({
        digits,
        value,
        setValue,
        table1,
        setTable1,
        table2,
        setTable2,
        table3,
        setTable3,
        top20,
        setTop20,
        onSearch,
        results,
        history
    }) {

            const historySet =
                new Set(history || []);


            return (

                <section className="
                    mb-6
                    rounded-2xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-4
                    sm:p-5
                ">

                    {/* ==================================================
                        TITLE
                    ================================================== */}

                    <div className="
                        flex
                        items-center
                        gap-2
                    ">

                        <MdFilterList
                            className="
                                text-xl
                                text-purple-400
                            "
                        />


                        <h2 className="
                            text-lg
                            font-bold
                            text-white
                        ">
                            {
                                digits === 3
                                    ? "3 இலக்க பல குழுமச் சேர்க்கை தேடல்"
                                    : "4 இலக்க பல குழுமச் சேர்க்கை தேடல்"
                            }
                        </h2>

                    </div>


                    <p className="
                        mt-2
                        text-xs
                        leading-5
                        text-slate-500
                    ">
                        குழு எண்களை உள்ளிட்டு,
                        அந்த குழுக்களுக்கு பொருந்தும்
                        {digits} இலக்க எண்களை கண்டுபிடிக்கலாம்.
                    </p>


                    {/* ==================================================
                        SEARCH INPUT
                    ================================================== */}

                    <div className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                    ">

<input
    type="text"
    inputMode="numeric"
    value={value}
    maxLength={digits}
    onChange={(event) => {
        const cleanValue = event.target.value
            .replace(/\D/g, "")
            .slice(0, digits);

        setValue(cleanValue);
    }}
    placeholder={
        digits === 4
            ? "எ.கா. 1357"
            : "எ.கா. 135"
    }
    className="
        min-w-0
        flex-1
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        px-4
        py-3
        text-white
        outline-none
        focus:border-purple-500
    "
/>


                        <button
                            type="button"
                            onClick={onSearch}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-purple-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-purple-700
                            "
                        >

                            <MdSearch />

                            தேடு

                        </button>

                    </div>


                    {/* ==================================================
                        TABLE SELECT
                    ================================================== */}

                    <div className="
                        mt-4
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-3
                    ">

                        <label className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950/50
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            text-slate-300
                        ">

                            <input
                                type="checkbox"
                                checked={table1}
                                onChange={(event) =>
                                    setTable1(
                                        event.target.checked
                                    )
                                }
                                className="h-4 w-4"
                            />

                            டேபிள் 1 — 6 குழுக்கள்

                        </label>


                        <label className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950/50
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            text-slate-300
                        ">

                            <input
                                type="checkbox"
                                checked={table2}
                                onChange={(event) =>
                                    setTable2(
                                        event.target.checked
                                    )
                                }
                                className="h-4 w-4"
                            />

                            டேபிள் 2 — 5 குழுக்கள்

                        </label>


                        <label className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-zinc-800
                            bg-zinc-950/50
                            px-3
                            py-3
                            text-xs
                            font-semibold
                            text-slate-300
                        ">

                            <input
                                type="checkbox"
                                checked={table3}
                                onChange={(event) =>
                                    setTable3(
                                        event.target.checked
                                    )
                                }
                                className="h-4 w-4"
                            />

                            டேபிள் 3 — 10 குழுக்கள்

                        </label>
                        <label className="
            mt-4
            flex
            cursor-pointer
            items-center
            gap-2
            text-xs
            font-semibold
            text-slate-300
        ">

            <input
                type="checkbox"
                checked={top20}
                onChange={(event) =>
                    setTop20(
                        event.target.checked
                    )
                }
                className="h-4 w-4"
            />

            Top 20 மட்டும் காட்டவும்

        </label>

                    </div>


                    {/* ==================================================
                        RESULTS
                    ================================================== */}

                    <div className="mt-5">

                        {results.length === 0 ? (

                            <div className="
                                rounded-xl
                                border
                                border-dashed
                                border-zinc-700
                                bg-zinc-950/40
                                px-4
                                py-8
                                text-center
                            ">

                                <p className="
                                    text-sm
                                    font-semibold
                                    text-slate-400
                                ">
                                    தேடல் முடிவுகள் இங்கே காண்பிக்கப்படும்
                                </p>


                                <p className="
                                    mt-2
                                    text-xs
                                    text-slate-600
                                ">
                                    குழு எண்களை உள்ளிட்டு
                                    தேடு என்பதை அழுத்தவும்.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-4">

                                {results.map(
                                    (result) => (

                                        <div
                                            key={result.tableName}
                                            className="
                                                rounded-xl
                                                border
                                                border-zinc-800
                                                bg-zinc-950/50
                                                p-4
                                            "
                                        >

                                            <p className="
                                                text-sm
                                                font-bold
                                                text-purple-300
                                            ">
                                                {result.tableName}
                                            </p>


                                            <p className="
                                                mt-1
                                                text-xs
                                                text-slate-500
                                            ">
                                                மொத்தம்:
                                                {" "}
                                                {result.numbers.length}
                                                {" "}
                                                எண்கள்
                                            </p>


                                            <div className="
                                                mt-4
                                                grid
                                                grid-cols-3
                                                gap-2
                                                sm:grid-cols-5
                                                md:grid-cols-8
                                                lg:grid-cols-10
                                            ">

                                                {result.numbers.map(
                                                    (number) => (

                                                        <div
                                                            key={number}
                                                            className={
                                                                "rounded-lg border px-2 py-2 text-center text-xs font-bold " +
                                                                (
                                                                    historySet.has(number)
                                                                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                                                                        : "border-zinc-800 bg-zinc-900 text-cyan-300"
                                                                )
                                                            }
                                                        >
                                                            {number}
                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>

            );
        }   
        function GroupNumbersModal({
        title,
        numbers,
        history,
        search,
        setSearch,
        permutation,
        setPermutation,
        top20,
        setTop20,
        onClose,
        onNumberClick
    }) {

        const historySet =
            new Set(history || []);


        const rawSearch =
    search.trim();


const queries =
    rawSearch
        .split(/[\s,]+/)
        .map((value) =>
            value.replace(/\D/g, "")
        )
        .filter(Boolean);


let filtered = [];


if (queries.length === 0) {

    filtered = [...numbers];

} else {

    const matchedSet =
        new Set();


    for (const query of queries) {

        for (const number of numbers) {

            const value =
                String(number);


            /* ==================================================
               NORMAL SEARCH
            ================================================== */

            if (!permutation) {

                if (
                    value.includes(query)
                ) {

                    matchedSet.add(
                        value
                    );

                }

                continue;
            }


            /* ==================================================
               PERMUTATION / BOX SEARCH
            ================================================== */

            const sortedQuery =
                query
                    .split("")
                    .sort()
                    .join("");


            /* --------------------------------------------------
               3 DIGIT FULL PERMUTATION
               123 → 123,132,213,231,312,321
            -------------------------------------------------- */

            if (
                query.length === 3 &&
                value.length === 3
            ) {

                const sortedNumber =
                    value
                        .split("")
                        .sort()
                        .join("");


                if (
                    sortedQuery ===
                    sortedNumber
                ) {

                    matchedSet.add(
                        value
                    );

                }

                continue;
            }


            /* --------------------------------------------------
               2 DIGIT BOX SEARCH

               Example:
               query = 12

               123 → match
               512 → match
               921 → match

               Because 1 and 2 appear together.
            -------------------------------------------------- */

            if (
                query.length === 2 &&
                value.length >= 2
            ) {

                let pairMatched =
                    false;


                for (
                    let i = 0;
                    i < value.length - 1;
                    i++
                ) {

                    for (
                        let j = i + 1;
                        j < value.length;
                        j++
                    ) {

                        const pair =
                            value[i] +
                            value[j];


                        const sortedPair =
                            pair
                                .split("")
                                .sort()
                                .join("");


                        const sortedTarget =
                            sortedQuery;


                        if (
                            sortedPair ===
                            sortedTarget
                        ) {

                            pairMatched = true;

                            break;

                        }

                    }


                    if (pairMatched) {
                        break;
                    }

                }


                if (pairMatched) {

                    matchedSet.add(
                        value
                    );

                }

                continue;
            }


            /* --------------------------------------------------
               GENERIC PERMUTATION

               Allows smaller queries to match the
               sorted digits contained in the number.
            -------------------------------------------------- */

            const sortedNumber =
                value
                    .split("")
                    .sort()
                    .join("");


            if (
                sortedNumber.includes(
                    sortedQuery
                )
            ) {

                matchedSet.add(
                    value
                );

            }

        }

    }


    filtered =
        Array.from(matchedSet);

}


/* ============================================================
   TOP 20
============================================================ */

if (top20) {

    filtered =
        filtered.slice(0, 20);

}

        return (

            <div
                className="
                    fixed
                    inset-0
                    z-[100]
                    flex
                    items-center
                    justify-center
                    bg-black/70
                    p-4
                    backdrop-blur-sm
                "
                onClick={onClose}
            >

                <div
                    className="
                        flex
                        max-h-[90vh]
                        w-full
                        max-w-5xl
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-zinc-800
                        bg-zinc-950
                    "
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    {/* HEADER */}

                    <div className="
                        border-b
                        border-zinc-800
                        p-4
                        sm:p-5
                    ">

                        <div className="
                            flex
                            items-start
                            justify-between
                            gap-4
                        ">

                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-white
                                ">
                                    {title}
                                </h2>


                                <p className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                ">
                                    மொத்த பொருந்தும் எண்கள்:
                                    {" "}
                                    {filtered.length}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={onClose}
                                className="
                                    rounded-lg
                                    bg-zinc-800
                                    px-3
                                    py-2
                                    text-sm
                                    font-bold
                                    text-white
                                    hover:bg-zinc-700
                                "
                            >
                                ✕
                            </button>

                        </div>


                        {/* SEARCH */}

                        <div className="
                            mt-4
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                        ">

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    "எண் தேட (எ.கா: " +
                                    (
                                        numbers[0]
                                            ? numbers[0].length === 4
                                                ? "1234"
                                                : "123"
                                            : "123"
                                    ) +
                                    ")"
                                }
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-xl
                                    border
                                    border-zinc-700
                                    bg-zinc-900
                                    px-4
                                    py-3
                                    text-sm
                                    text-white
                                    outline-none
                                    focus:border-cyan-500
                                "
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="
                                    rounded-xl
                                    bg-zinc-800
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-300
                                    hover:bg-zinc-700
                                "
                            >
                                Reset
                            </button>

                        </div>


                        {/* FILTERS */}

                        <div className="
                            mt-3
                            flex
                            flex-wrap
                            gap-5
                        ">

                            <label className="
                                flex
                                cursor-pointer
                                items-center
                                gap-2
                                text-xs
                                font-semibold
                                text-slate-300
                            ">

                                <input
                                    type="checkbox"
                                    checked={permutation}
                                    onChange={(event) =>
                                        setPermutation(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                Permutation / Box

                            </label>


                            <label className="
                                flex
                                cursor-pointer
                                items-center
                                gap-2
                                text-xs
                                font-semibold
                                text-red-300
                            ">

                                <input
                                    type="checkbox"
                                    checked={top20}
                                    onChange={(event) =>
                                        setTop20(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                Top 20 மட்டும்

                            </label>

                        </div>

                    </div>


                    {/* NUMBER GRID */}

                    <div className="
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-5
                    ">

                        {filtered.length === 0 ? (

                            <div className="
                                rounded-xl
                                border
                                border-dashed
                                border-zinc-700
                                px-4
                                py-10
                                text-center
                            ">

                                <p className="
                                    text-sm
                                    text-slate-400
                                ">
                                    எண்கள் எதுவும் கிடைக்கவில்லை
                                </p>

                            </div>

                        ) : (

                            <div className="
                                grid
                                grid-cols-3
                                gap-2
                                sm:grid-cols-5
                                md:grid-cols-8
                                lg:grid-cols-10
                            ">

                                {filtered.map(
                                    (number) => {

                                        const exists =
                                            historySet.has(
                                                number
                                            );


                                        return (

                                            <button
                                                key={number}
                                                type="button"
                                                onClick={() =>
                                                    onNumberClick(
                                                        number
                                                    )
                                                }
                                                className={
                                                    "rounded-lg border px-2 py-2 text-center text-xs font-bold transition " +
                                                    (
                                                        exists
                                                            ? "border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                                                            : "border-zinc-800 bg-zinc-900 text-cyan-300 hover:bg-zinc-800"
                                                    )
                                                }
                                            >
                                                {number}
                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>


                    {/* FOOTER */}

                    <div className="
                        border-t
                        border-zinc-800
                        px-4
                        py-3
                        text-right
                        text-xs
                        text-slate-500
                    ">

                        பச்சை நிறம் = வரலாற்றில் ஏற்கனவே உள்ளது

                    </div>

                </div>

            </div>

        );
    }

    function NumberDetailModal({
        details,
        onClose
    }) {

        return (

            <div
                className="
                    fixed
                    inset-0
                    z-[200]
                    flex
                    items-center
                    justify-center
                    bg-black/70
                    p-4
                    backdrop-blur-sm
                "
                onClick={onClose}
            >

                <div
                    className="
                        max-h-[90vh]
                        w-full
                        max-w-2xl
                        overflow-y-auto
                        rounded-2xl
                        border
                        border-cyan-500/20
                        bg-zinc-950
                        p-5
                        shadow-2xl
                        sm:p-6
                    "
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <div className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    ">

                        <div>

                            <p className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-cyan-400
                            ">
                                எண் விரிவான பகுப்பாய்வு
                            </p>


                            <h2 className="
                                mt-1
                                text-3xl
                                font-black
                                text-white
                            ">
                                {details.number}
                            </h2>


                            <p className="
                                mt-1
                                text-xs
                                text-slate-500
                            ">
                                {details.digits} இலக்க எண்
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-lg
                                bg-zinc-800
                                px-3
                                py-2
                                text-sm
                                font-bold
                                text-white
                                hover:bg-zinc-700
                            "
                        >
                            ✕
                        </button>

                    </div>


                    <div className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                    ">

                        <DetailCard
                            title="குழு 1 — பழைய"
                            value={details.group1}
                        />


                        <DetailCard
                            title="குழு 2 — புதிய 5"
                            value={details.group2}
                        />


                        <DetailCard
                            title="குழு 3 — 10 சிஸ்டம்"
                            value={details.group3}
                        />


                        <DetailCard
                            title="Odd / Even Section"
                            value={details.oddEven}
                        />


                        <DetailCard
                            title={
                                details.digits === 4
                                    ? "குழு 0–36"
                                    : "குழு 0–27"
                            }
                            value={details.digitSumGroup}
                        />


                        <DetailCard
                            title="History-ல் வந்த எண்ணிக்கை"
                            value={`${details.historyCount} முறை`}
                        />

                    </div>


                    <div className="
                        mt-4
                        rounded-xl
                        border
                        border-zinc-800
                        bg-zinc-900
                        p-4
                    ">

                        <p className="
                            text-xs
                            text-slate-500
                        ">
                            வரலாற்றுத் தரவு நிலை
                        </p>


                        <p className="
                            mt-2
                            text-sm
                            font-semibold
                            text-white
                        ">

                            {details.existsInHistory

                                ? "இந்த எண் வரலாற்று ரிசல்ட்டில் உள்ளது."

                                : "இந்த எண் தற்போதைய வரலாற்று பட்டியலில் இல்லை."
                            }

                        </p>


                        {details.lastHistoryIndex !== -1 && (

                            <p className="
                                mt-2
                                text-xs
                                text-slate-500
                            ">
                                கடைசி வரலாற்று Index:
                                {" "}
                                {details.lastHistoryIndex + 1}
                            </p>

                        )}

                    </div>


                    <div className="
                        mt-5
                        flex
                        justify-end
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                rounded-xl
                                bg-cyan-600
                                px-5
                                py-2.5
                                text-sm
                                font-bold
                                text-white
                                hover:bg-cyan-700
                            "
                        >
                            மூடு
                        </button>

                    </div>

                </div>

            </div>
        );
    }


    function DetailCard({
        title,
        value
    }) {

        return (

            <div className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                p-4
            ">

                <p className="
                    text-xs
                    text-slate-500
                ">
                    {title}
                </p>


                <p className="
                    mt-2
                    text-base
                    font-bold
                    text-cyan-300
                ">
                    {value || "-"}
                </p>

            </div>

        );
    }