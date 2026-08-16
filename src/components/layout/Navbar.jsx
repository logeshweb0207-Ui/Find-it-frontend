import {
    MdMenu,
    MdSearch
} from "react-icons/md";

export default function Navbar({
    onMenuClick
}) {

    return (

        <header className="
            h-20
            min-h-20
            border-b
            border-slate-800
            bg-slate-900
            flex
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
            gap-4
        ">

            {/* Left side */}

            <div className="
                flex
                items-center
                gap-3
                min-w-0
            ">

                {/* Menu */}

                <button
                    onClick={onMenuClick}
                    className="
                        p-2
                        rounded-lg
                        bg-slate-800
                        hover:bg-slate-700
                        text-white
                        transition
                        flex-shrink-0
                    "
                    aria-label="Open navigation"
                >

                    <MdMenu className="text-2xl" />

                </button>


                {/* Title */}

                <h2 className="
                    text-lg
                    sm:text-xl
                    font-semibold
                    text-white
                    truncate
                ">

                    Lottery Analytics Dashboard

                </h2>

            </div>


            {/* Search */}

            <div className="
                relative
                w-full
                max-w-[280px]
                sm:max-w-xs
                lg:max-w-sm
                min-w-0
            ">

                <MdSearch className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                    text-xl
                " />

                <input
                    placeholder="Search Number..."
                    className="
                        w-full
                        bg-slate-800
                        border
                        border-slate-700
                        rounded-xl
                        pl-10
                        pr-4
                        py-2.5
                        text-sm
                        text-white
                        placeholder:text-slate-400
                        outline-none
                        focus:border-blue-500
                        transition
                    "
                />

            </div>

        </header>

    );

}