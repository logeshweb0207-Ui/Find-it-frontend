import { useEffect, useMemo, useState } from "react";

import Layout from "../components/layout/Layout";

import {
    MdSettings,
    MdCloud,
    MdCheckCircle,
    MdError,
    MdRefresh,
    MdDelete,
    MdInfo,
    MdStorage,
    MdApi,
    MdSecurity,
    MdSpeed,
    MdComputer,
    MdAccessTime,
    MdWifi,
    MdClose,
} from "react-icons/md";


const API_BASE = "http://localhost:5000";


// ================================================================
// SETTINGS PAGE
// ================================================================

export default function Settings() {

    // ============================================================
    // STATE
    // ============================================================

    const [backendStatus, setBackendStatus] =
        useState("checking");

    const [lastChecked, setLastChecked] =
        useState(null);

    const [responseTime, setResponseTime] =
        useState(null);

    const [savedMessage, setSavedMessage] =
        useState("");

    const [isClearing, setIsClearing] =
        useState(false);


    // ============================================================
    // BACKEND HEALTH CHECK
    // ============================================================

    const checkBackend = async () => {

        setBackendStatus("checking");
        setSavedMessage("");


        const startTime =
            performance.now();


        try {

            const response =
                await fetch(
                    `${API_BASE}/`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );


            const endTime =
                performance.now();


            setResponseTime(
                Math.round(
                    endTime - startTime
                )
            );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            await response.text();


            setBackendStatus("online");

        } catch (error) {

            const endTime =
                performance.now();


            setResponseTime(
                Math.round(
                    endTime - startTime
                )
            );


            console.error(
                "Backend health check failed:",
                error
            );


            setBackendStatus("offline");

        } finally {

            setLastChecked(
                new Date()
            );

        }

    };


    // ============================================================
    // INITIAL CHECK
    // ============================================================

    useEffect(() => {

        checkBackend();

    }, []);


    // ============================================================
    // STATUS CONFIG
    // ============================================================

    const statusConfig = useMemo(() => {

        if (backendStatus === "online") {

            return {

                label: "Connected",

                description:
                    "Backend API is responding normally.",

                text:
                    "text-emerald-400",

                bg:
                    "bg-emerald-500/10",

                border:
                    "border-emerald-500/20",

                iconBg:
                    "bg-emerald-500/10",

                icon:
                    <MdCheckCircle />

            };

        }


        if (backendStatus === "offline") {

            return {

                label: "Offline",

                description:
                    "Backend API could not be reached.",

                text:
                    "text-red-400",

                bg:
                    "bg-red-500/10",

                border:
                    "border-red-500/20",

                iconBg:
                    "bg-red-500/10",

                icon:
                    <MdError />

            };

        }


        return {

            label: "Checking",

            description:
                "Checking the backend connection...",

            text:
                "text-yellow-400",

            bg:
                "bg-yellow-500/10",

            border:
                "border-yellow-500/20",

            iconBg:
                "bg-yellow-500/10",

            icon:
                <MdRefresh className="animate-spin" />

        };

    }, [
        backendStatus
    ]);


    // ============================================================
    // CLEAR LOCAL SETTINGS
    // ============================================================

    const clearLocalSettings = () => {

        setIsClearing(true);


        try {

            localStorage.removeItem(
                "findit_settings"
            );

            localStorage.removeItem(
                "findit_preferences"
            );


            setSavedMessage(
                "Local settings cleared successfully."
            );

        } catch (error) {

            console.error(
                "Unable to clear local settings:",
                error
            );


            setSavedMessage(
                "Unable to clear local settings."
            );

        } finally {

            setIsClearing(false);

        }


        window.setTimeout(() => {

            setSavedMessage("");

        }, 3500);

    };


    // ============================================================
    // TIME FORMAT
    // ============================================================

    const formatCheckedTime = () => {

        if (!lastChecked) {

            return "Not checked yet";

        }


        return lastChecked.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }
        );

    };


    // ============================================================
    // ENVIRONMENT
    // ============================================================

    const environment =
        import.meta.env.MODE ||
        "development";


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Layout>

            <div className="
                w-full
                min-w-0
                max-w-6xl
                mx-auto
                overflow-x-hidden
            ">


                {/* ==================================================
                    PAGE HEADER
                ================================================== */}

                <div className="
                    mb-8
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                ">

                    <div className="min-w-0">

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-blue-500/20
                            bg-blue-500/10
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-blue-400
                        ">

                            <MdSettings />

                            System Configuration

                        </div>


                        <h1 className="
                            mt-4
                            text-3xl
                            font-black
                            tracking-tight
                            text-white
                            sm:text-4xl
                            lg:text-5xl
                        ">
                            Settings
                        </h1>


                        <p className="
                            mt-3
                            max-w-3xl
                            text-sm
                            leading-6
                            text-slate-400
                            sm:text-base
                        ">
                            Monitor your Find-It AI application,
                            backend connectivity and local browser
                            preferences from one place.
                        </p>

                    </div>


                    <div className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-slate-500
                    ">

                        <MdAccessTime />

                        Last checked:

                        <span className="
                            font-semibold
                            text-slate-300
                        ">
                            {formatCheckedTime()}
                        </span>

                    </div>

                </div>


                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {savedMessage && (

                    <div className="
                        mb-6
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-2xl
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-4
                        py-3
                        text-sm
                        text-emerald-300
                    ">

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">

                            <MdCheckCircle />

                            {savedMessage}

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setSavedMessage("")
                            }
                            className="
                                rounded-lg
                                p-1
                                text-emerald-300
                                transition
                                hover:bg-emerald-500/10
                            "
                        >

                            <MdClose />

                        </button>

                    </div>

                )}


                {/* ==================================================
                    TOP STATUS CARDS
                ================================================== */}

                <div className="
                    grid
                    grid-cols-1
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                ">


                    {/* Backend */}

                    <StatusCard
                        icon={<MdCloud />}
                        title="Backend"
                        value={statusConfig.label}
                        description={statusConfig.description}
                        textClass={statusConfig.text}
                        bgClass={statusConfig.bg}
                        borderClass={statusConfig.border}
                    />


                    {/* Database */}

                    <StatusCard
                        icon={<MdStorage />}
                        title="Database"
                        value="MongoDB"
                        description="Primary application data store."
                        textClass="text-cyan-400"
                        bgClass="bg-cyan-500/10"
                        borderClass="border-cyan-500/20"
                    />


                    {/* API */}

                    <StatusCard
                        icon={<MdApi />}
                        title="API"
                        value="Express"
                        description="Node.js REST API server."
                        textClass="text-blue-400"
                        bgClass="bg-blue-500/10"
                        borderClass="border-blue-500/20"
                    />


                    {/* Environment */}

                    <StatusCard
                        icon={<MdComputer />}
                        title="Environment"
                        value={environment}
                        description="Current frontend runtime."
                        textClass="text-purple-400"
                        bgClass="bg-purple-500/10"
                        borderClass="border-purple-500/20"
                    />

                </div>


                {/* ==================================================
                    CONNECTION PANEL
                ================================================== */}

                <section className="
                    mt-6
                    overflow-hidden
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-zinc-900
                ">

                    <div className="
                        border-b
                        border-zinc-800
                        bg-gradient-to-r
                        from-zinc-900
                        via-zinc-900
                        to-blue-950/20
                        p-5
                        sm:p-6
                    ">

                        <div className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className={`
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    ${statusConfig.iconBg}
                                    ${statusConfig.text}
                                `}>

                                    <span className="text-2xl">
                                        {statusConfig.icon}
                                    </span>

                                </div>


                                <div>

                                    <p className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-slate-500
                                    ">
                                        System Health
                                    </p>


                                    <h2 className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        text-white
                                    ">
                                        Backend Connection
                                    </h2>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={checkBackend}
                                disabled={
                                    backendStatus === "checking"
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <MdRefresh
                                    className={
                                        backendStatus === "checking"
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                {backendStatus === "checking"
                                    ? "Checking..."
                                    : "Check Connection"}

                            </button>

                        </div>

                    </div>


                    <div className="
                        grid
                        grid-cols-1
                        gap-4
                        p-5
                        sm:p-6
                        lg:grid-cols-3
                    ">

                        <InfoCard
                            icon={<MdApi />}
                            title="API Server"
                            value={API_BASE}
                            accent="blue"
                        />


                        <InfoCard
                            icon={<MdWifi />}
                            title="Connection"
                            value={statusConfig.label}
                            accent={
                                backendStatus === "online"
                                    ? "emerald"
                                    : backendStatus === "offline"
                                        ? "red"
                                        : "yellow"
                            }
                        />


                        <InfoCard
                            icon={<MdSpeed />}
                            title="Response Time"
                            value={
                                responseTime !== null
                                    ? `${responseTime} ms`
                                    : "Not measured"
                            }
                            accent="purple"
                        />

                    </div>

                </section>


                {/* ==================================================
                    APPLICATION INFORMATION
                ================================================== */}

                <section className="
                    mt-6
                    rounded-3xl
                    border
                    border-zinc-800
                    bg-zinc-900
                    p-5
                    sm:p-6
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-cyan-500/10
                            text-cyan-400
                        ">

                            <MdInfo className="text-2xl" />

                        </div>


                        <div>

                            <p className="
                                text-xs
                                uppercase
                                tracking-wider
                                text-slate-500
                            ">
                                Application
                            </p>


                            <h2 className="
                                mt-1
                                text-xl
                                font-bold
                                text-white
                            ">
                                Find-It AI
                            </h2>

                        </div>

                    </div>


                    <div className="
                        mt-6
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">

                        <SettingValue
                            icon={<MdSettings />}
                            label="Application"
                            value="Find-It AI"
                        />


                        <SettingValue
                            icon={<MdStorage />}
                            label="Database"
                            value="MongoDB"
                        />


                        <SettingValue
                            icon={<MdApi />}
                            label="Backend"
                            value="Node.js + Express"
                        />


                        <SettingValue
                            icon={<MdCloud />}
                            label="Frontend"
                            value="React + Vite"
                        />


                        <SettingValue
                            icon={<MdSecurity />}
                            label="API Access"
                            value="CORS Enabled"
                        />


                        <SettingValue
                            icon={<MdComputer />}
                            label="Environment"
                            value={environment}
                        />

                    </div>

                </section>


                {/* ==================================================
                    LOCAL DATA
                ================================================== */}

                <section className="
                    mt-6
                    overflow-hidden
                    rounded-3xl
                    border
                    border-red-500/10
                    bg-zinc-900
                ">

                    <div className="
                        border-b
                        border-red-500/10
                        bg-red-500/5
                        p-5
                        sm:p-6
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
                                bg-red-500/10
                                text-red-400
                            ">

                                <MdDelete className="text-xl" />

                            </div>


                            <div>

                                <p className="
                                    text-xs
                                    uppercase
                                    tracking-wider
                                    text-red-400
                                ">
                                    Browser Storage
                                </p>


                                <h2 className="
                                    mt-1
                                    text-xl
                                    font-bold
                                    text-white
                                ">
                                    Local Data
                                </h2>


                                <p className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-slate-400
                                ">
                                    Remove Find-It preferences saved
                                    in this browser. This does not
                                    delete MongoDB data or backend data.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="
                        flex
                        flex-col
                        gap-4
                        p-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-6
                    ">

                        <div>

                            <p className="
                                text-sm
                                font-semibold
                                text-white
                            ">
                                Clear Local Settings
                            </p>


                            <p className="
                                mt-1
                                text-xs
                                text-slate-500
                            ">
                                Removes only browser-local preferences.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={clearLocalSettings}
                            disabled={isClearing}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-red-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-red-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            <MdDelete />

                            {isClearing
                                ? "Clearing..."
                                : "Clear Local Settings"}

                        </button>

                    </div>

                </section>


                {/* ==================================================
                    PROJECT STATUS
                ================================================== */}

                <section className="
                    mt-6
                    rounded-3xl
                    border
                    border-blue-500/10
                    bg-gradient-to-br
                    from-blue-500/5
                    via-zinc-900
                    to-zinc-900
                    p-5
                    sm:p-6
                ">

                    <div className="
                        flex
                        items-start
                        gap-3
                    ">

                        <div className="
                            mt-0.5
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-500/10
                            text-blue-400
                        ">

                            <MdInfo />

                        </div>


                        <div>

                            <p className="
                                text-xs
                                uppercase
                                tracking-wider
                                text-blue-400
                            ">
                                Find-It AI
                            </p>


                            <h2 className="
                                mt-1
                                text-xl
                                font-bold
                                text-white
                            ">
                                Project Status
                            </h2>


                            <p className="
                                mt-2
                                max-w-3xl
                                text-sm
                                leading-6
                                text-slate-400
                            ">
                                Dashboard, AI Ranking, Prediction,
                                Decision, responsive navigation,
                                filtering, sorting and result controls
                                are implemented. The Settings page
                                is intentionally focused on monitoring
                                and safe local configuration.
                            </p>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="
                    mt-6
                    pb-4
                    text-center
                ">

                    <p className="
                        text-xs
                        text-slate-600
                    ">
                        Find-It AI • System Settings
                    </p>

                </div>

            </div>

        </Layout>

    );

}


// ================================================================
// STATUS CARD
// ================================================================

function StatusCard({
    icon,
    title,
    value,
    description,
    textClass,
    bgClass,
    borderClass
}) {

    return (

        <div className={`
            rounded-2xl
            border
            bg-zinc-900
            p-4
            transition
            hover:-translate-y-0.5
            ${borderClass}
        `}>

            <div className="
                flex
                items-start
                justify-between
                gap-3
            ">

                <div>

                    <p className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    ">
                        {title}
                    </p>


                    <p className={`
                        mt-2
                        text-xl
                        font-bold
                        capitalize
                        ${textClass}
                    `}>
                        {value}
                    </p>


                    <p className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                    ">
                        {description}
                    </p>

                </div>


                <div className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-xl
                    ${bgClass}
                    ${textClass}
                `}>

                    {icon}

                </div>

            </div>

        </div>

    );

}


// ================================================================
// INFO CARD
// ================================================================

function InfoCard({
    icon,
    title,
    value,
    accent
}) {

    const accentClasses = {

        blue:
            "bg-blue-500/10 text-blue-400 border-blue-500/10",

        emerald:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",

        red:
            "bg-red-500/10 text-red-400 border-red-500/10",

        yellow:
            "bg-yellow-500/10 text-yellow-400 border-yellow-500/10",

        purple:
            "bg-purple-500/10 text-purple-400 border-purple-500/10",

    };


    const classes =
        accentClasses[accent] ||
        accentClasses.blue;


    return (

        <div className={`
            rounded-2xl
            border
            bg-zinc-950/40
            p-4
            ${classes}
        `}>

            <div className="
                flex
                items-center
                gap-3
            ">

                <div className="
                    text-2xl
                ">
                    {icon}
                </div>


                <div className="
                    min-w-0
                ">

                    <p className="
                        text-xs
                        text-slate-500
                    ">
                        {title}
                    </p>


                    <p className="
                        mt-1
                        truncate
                        text-sm
                        font-bold
                        text-white
                    ">
                        {value}
                    </p>

                </div>

            </div>

        </div>

    );

}


// ================================================================
// SETTING VALUE
// ================================================================

function SettingValue({
    icon,
    label,
    value
}) {

    return (

        <div className="
            flex
            min-w-0
            items-center
            gap-3
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-950/40
            p-4
            transition
            hover:border-zinc-700
        ">

            <div className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-zinc-800
                text-lg
                text-zinc-400
            ">

                {icon}

            </div>


            <div className="
                min-w-0
            ">

                <p className="
                    text-[11px]
                    uppercase
                    tracking-wider
                    text-zinc-600
                ">
                    {label}
                </p>


                <p className="
                    mt-1
                    truncate
                    text-sm
                    font-semibold
                    text-white
                ">
                    {value}
                </p>

            </div>

        </div>

    );

}

