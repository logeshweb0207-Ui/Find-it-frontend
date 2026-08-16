import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(prev => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (

        <div className="
            flex
            h-screen
            w-full
            min-w-0
            overflow-hidden
            bg-[#0B1120]
        ">

            {/* Sidebar */}

            <Sidebar
                open={sidebarOpen}
                onClose={closeSidebar}
            />


            {/* Main area */}

            <div className="
                flex
                min-w-0
                flex-1
                flex-col
                overflow-hidden
            ">

                <Navbar
                    onMenuClick={toggleSidebar}
                />


                <main className="
                    min-w-0
                    flex-1
                    overflow-y-auto
                    overflow-x-hidden
                    p-4
                    sm:p-6
                    lg:p-8
                ">

                    <div className="
                        w-full
                        min-w-0
                        max-w-full
                    ">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );
}