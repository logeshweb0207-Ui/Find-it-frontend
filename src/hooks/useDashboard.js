import { useEffect, useState } from "react";

import { loadDashboard } from "../services";

export default function useDashboard() {

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState([]);

    useEffect(() => {

        fetchDashboard();

    }, []);

    async function fetchDashboard() {

        try {

            const response = await loadDashboard();

            setDashboard(response.items);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    return {

        loading,

        dashboard

    };

}