import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import ProductHome from "./pages/ProductHome";

import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import Prediction from "./pages/Prediction";
import Decision from "./pages/Decision";
import History from "./pages/History";
import Settings from "./pages/Settings";


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

