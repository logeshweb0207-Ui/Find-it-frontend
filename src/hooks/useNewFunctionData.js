import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    getNewFunctionHistory
} from "../services/newFunctionApi";


export default function useNewFunctionData(
    lottery = "kerala",
    digits = 3
) {

    const [history, setHistory] =
        useState([]);

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadData = useCallback(
        async () => {

            setLoading(true);

            setError("");


            try {

                const result =
                    await getNewFunctionHistory(
                        lottery,
                        digits
                    );


                // ==================================================
                // HISTORY
                // ==================================================

                setHistory(
                    Array.isArray(
                        result?.history
                    )
                        ? result.history
                        : []
                );


                // ==================================================
                // FULL NORMALIZED ITEMS
                // ==================================================

                setItems(
                    Array.isArray(
                        result?.items
                    )
                        ? result.items
                        : []
                );


            } catch (err) {

                console.error(
                    "New Function data loading error:",
                    err
                );


                setHistory([]);

                setItems([]);


                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "தரவை ஏற்ற முடியவில்லை."
                );


            } finally {

                setLoading(false);

            }

        },
        [
            lottery,
            digits
        ]
    );


    useEffect(() => {

        loadData();

    }, [loadData]);


    return {

        history,

        items,

        loading,

        error,

        reload: loadData

    };

}