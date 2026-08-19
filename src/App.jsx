import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import ProductHome from "./Pages/ProductHome";

import Dashboard from "./Pages/Dashboard";
import Ranking from "./Pages/Ranking";
import Prediction from "./Pages/Prediction";
import Decision from "./Pages/Decision";
import History from "./Pages/History";
import Settings from "./Pages/Settings";

import NewFunction from "./Pages/NewFunction";


export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ==================================================
                    MAIN PRODUCT HOME
                ================================================== */}

                <Route
                    path="/"
                    element={<ProductHome />}
                />


                {/* ==================================================
                    ANALYSE METHOD
                ================================================== */}

                <Route
                    path="/analyse"
                    element={
                        <Navigate
                            to="/analyse/dashboard"
                            replace
                        />
                    }
                />


                <Route
                    path="/analyse/dashboard"
                    element={<Dashboard />}
                />


                <Route
                    path="/analyse/ranking"
                    element={<Ranking />}
                />


                <Route
                    path="/analyse/prediction"
                    element={<Prediction />}
                />


                <Route
                    path="/analyse/decision"
                    element={<Decision />}
                />


                <Route
                    path="/analyse/history"
                    element={<History />}
                />


                <Route
                    path="/analyse/settings"
                    element={<Settings />}
                />


                {/* ==================================================
                    NEW FUNCTION
                ================================================== */}

                <Route
                    path="/new-function"
                    element={<NewFunction />}
                />


                {/* ==================================================
                    BACKWARD COMPATIBILITY
                ================================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <Navigate
                            to="/analyse/dashboard"
                            replace
                        />
                    }
                />


                <Route
                    path="/ranking"
                    element={
                        <Navigate
                            to="/analyse/ranking"
                            replace
                        />
                    }
                />


                <Route
                    path="/prediction"
                    element={
                        <Navigate
                            to="/analyse/prediction"
                            replace
                        />
                    }
                />


                <Route
                    path="/decision"
                    element={
                        <Navigate
                            to="/analyse/decision"
                            replace
                        />
                    }
                />


                <Route
                    path="/history"
                    element={
                        <Navigate
                            to="/analyse/history"
                            replace
                        />
                    }
                />


                <Route
                    path="/settings"
                    element={
                        <Navigate
                            to="/analyse/settings"
                            replace
                        />
                    }
                />


                {/* ==================================================
                    FALLBACK
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}


// import {
//     BrowserRouter,
//     Routes,
//     Route,
//     Navigate
// } from "react-router-dom";

// import ProductHome from "./Pages/ProductHome";
// import Dashboard from "./Pages/Dashboard";
// import Ranking from "./Pages/Ranking";
// import Prediction from "./Pages/Prediction";
// import Decision from "./Pages/Decision";
// import History from "./Pages/History";
// import Settings from "./Pages/Settings";


// export default function App() {

//     return (

//         <BrowserRouter>

//             <Routes>

//                 {/* ==================================================
//                     MAIN HOME
//                 ================================================== */}

//                 <Route
//                     path="/"
//                     element={<ProductHome />}
//                 />


//                 {/* ==================================================
//                     ANALYSE METHOD
//                 ================================================== */}

//                 <Route
//                     path="/analyse"
//                     element={
//                         <Navigate
//                             to="/analyse/dashboard"
//                             replace
//                         />
//                     }
//                 />


//                 <Route
//                     path="/analyse/dashboard"
//                     element={<Dashboard />}
//                 />


//                 <Route
//                     path="/analyse/ranking"
//                     element={<Ranking />}
//                 />


//                 <Route
//                     path="/analyse/prediction"
//                     element={<Prediction />}
//                 />


//                 <Route
//                     path="/analyse/decision"
//                     element={<Decision />}
//                 />


//                 <Route
//                     path="/analyse/history"
//                     element={<History />}
//                 />


//                 <Route
//                     path="/analyse/settings"
//                     element={<Settings />}
//                 />


//                 {/* ==================================================
//                     OLD ROUTES → NEW ANALYSE ROUTES
//                 ================================================== */}

//                 <Route
//                     path="/dashboard"
//                     element={
//                         <Navigate
//                             to="/analyse/dashboard"
//                             replace
//                         />
//                     }
//                 />


//                 <Route
//                     path="/ranking"
//                     element={
//                         <Navigate
//                             to="/analyse/ranking"
//                             replace
//                         />
//                     }
//                 />


//                 <Route
//                     path="/prediction"
//                     element={
//                         <Navigate
//                             to="/analyse/prediction"
//                             replace
//                         />
//                     }
//                 />


//                 <Route
//                     path="/decision"
//                     element={
//                         <Navigate
//                             to="/analyse/decision"
//                             replace
//                         />
//                     }
//                 />


//                 <Route
//                     path="/history"
//                     element={
//                         <Navigate
//                             to="/analyse/history"
//                             replace
//                         />
//                     }
//                 />


//                 <Route
//                     path="/settings"
//                     element={
//                         <Navigate
//                             to="/analyse/settings"
//                             replace
//                         />
//                     }
//                 />


//                 {/* ==================================================
//                     FALLBACK
//                 ================================================== */}

//                 <Route
//                     path="*"
//                     element={
//                         <Navigate
//                             to="/"
//                             replace
//                         />
//                     }
//                 />

//             </Routes>

//         </BrowserRouter>

//     );

// }