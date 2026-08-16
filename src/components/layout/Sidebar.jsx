import {
    MdDashboard,
    MdAutoGraph,
    MdTrendingUp,
    MdCheckCircle,
    MdHistory,
    MdSettings,
    MdLocalFireDepartment,
    MdClose
} from "react-icons/md";

import { NavLink } from "react-router-dom";


const menus = [

    {
        name: "Dashboard",
        icon: <MdDashboard />,
        path: "/"
    },

    {
        name: "AI Ranking",
        icon: <MdAutoGraph />,
        path: "/ranking"
    },

    {
        name: "Prediction",
        icon: <MdTrendingUp />,
        path: "/prediction"
    },

    {
        name: "Decision",
        icon: <MdCheckCircle />,
        path: "/decision"
    },

    {
        name: "History",
        icon: <MdHistory />,
        path: "/history"
    },

    {
        name: "Settings",
        icon: <MdSettings />,
        path: "/settings"
    }

];


export default function Sidebar({
    open,
    onClose
}) {

    return (

        <>

            {/* ==================================================
                OVERLAY
            ================================================== */}

            {open && (

                <div
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/60
                        backdrop-blur-sm
                    "
                />

            )}


            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    h-screen
                    w-72
                    bg-slate-900
                    border-r
                    border-slate-800
                    flex
                    flex-col
                    transition-transform
                    duration-300
                    ease-in-out

                    ${
                        open
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="
                    h-20
                    flex
                    items-center
                    justify-between
                    px-5
                    border-b
                    border-slate-800
                    shrink-0
                ">


                    {/* Logo */}

                    <div className="
                        flex
                        items-center
                        min-w-0
                    ">

                        <MdLocalFireDepartment
                            className="
                                shrink-0
                                text-4xl
                                text-blue-500
                            "
                        />


                        <h1 className="
                            ml-3
                            text-2xl
                            font-bold
                            text-white
                            truncate
                        ">
                            Find-It AI
                        </h1>

                    </div>


                    {/* ==================================================
                        CLOSE BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        title="Close sidebar"
                        className="
                            ml-3
                            shrink-0
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            text-slate-300
                            transition
                            hover:border-blue-500
                            hover:bg-blue-600
                            hover:text-white
                            active:scale-95
                        "
                    >

                        <MdClose className="text-2xl" />

                    </button>

                </div>


                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <nav className="
                    flex-1
                    overflow-y-auto
                    p-5
                ">

                    {menus.map((menu) => (

                        <NavLink
                            key={menu.name}
                            to={menu.path}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                rounded-xl
                                mb-2
                                transition-all
                                ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-200 hover:bg-slate-800 hover:text-white"
                                }
                            `}
                        >

                            <span className="
                                shrink-0
                                text-xl
                            ">
                                {menu.icon}
                            </span>


                            <span className="
                                truncate
                            ">
                                {menu.name}
                            </span>

                        </NavLink>

                    ))}

                </nav>

            </aside>

        </>

    );

}
