import API from "./api";


// ================================================================
// COMMON CLEANER
// ================================================================

function cleanDigits(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/\D/g, "");
}


// ================================================================
// LAST 3 DIGITS
// ================================================================

function getLast3(ticket) {

    const digits =
        cleanDigits(ticket);

    if (!digits) {
        return "";
    }


    return digits
        .slice(-3)
        .padStart(3, "0");
}


// ================================================================
// LAST 4 DIGITS
// ================================================================

function getLast4(ticket) {

    const digits =
        cleanDigits(ticket);

    if (!digits) {
        return "";
    }


    return digits
        .slice(-4)
        .padStart(4, "0");
}


// ================================================================
// KERALA
// ================================================================

export async function getKeralaNewFunctionData() {

    const response =
        await API.get("/results");


    const items =
        Array.isArray(response.data?.items)
            ? response.data.items
            : [];


    const normalized =
        items
            .map((item) => {

                const ticket =
                    cleanDigits(
                        item?.first?.ticket
                    );


                if (!ticket) {
                    return null;
                }


                return {

                    source: "kerala",

                    date:
                        item?.draw_date || "",

                    originalTicket:
                        ticket,

                    number3:
                        getLast3(ticket),

                    number4:
                        getLast4(ticket)

                };

            })
            .filter(Boolean);


    return {

        lottery: "kerala",

        items: normalized,

        history3:
            normalized
                .map(item => item.number3)
                .filter(Boolean),

        history4:
            normalized
                .map(item => item.number4)
                .filter(Boolean)

    };

}


// ================================================================
// DEAR
// ================================================================

export async function getDearNewFunctionData() {

    const response =
        await API.get(
            "/dear/results"
        );


    const items =
        Array.isArray(response.data?.items)
            ? response.data.items
            : [];


    const normalized =
        items
            .map((item) => {

                const ticket =
                    cleanDigits(
                        item?.first?.ticket
                    );


                if (!ticket) {
                    return null;
                }


                return {

                    source: "dear",

                    date:
                        item?.date || "",

                    time:
                        item?.time || "",

                    originalTicket:
                        ticket,

                    number3:
                        getLast3(ticket),

                    number4:
                        getLast4(ticket)

                };

            })
            .filter(Boolean);


    return {

        lottery: "dear",

        items: normalized,

        history3:
            normalized
                .map(item => item.number3)
                .filter(Boolean),

        history4:
            normalized
                .map(item => item.number4)
                .filter(Boolean)

    };

}


// ================================================================
// SELECTED LOTTERY
// ================================================================

export async function getNewFunctionHistory(
    lottery = "kerala",
    digits = 3
) {

    if (lottery === "dear") {

        const dear =
            await getDearNewFunctionData();


        return {

            lottery: "dear",

            digits,

            history:
                digits === 4
                    ? dear.history4
                    : dear.history3,

            items:
                dear.items

        };

    }


    const kerala =
        await getKeralaNewFunctionData();


    return {

        lottery: "kerala",

        digits,

        history:
            digits === 4
                ? kerala.history4
                : kerala.history3,

        items:
            kerala.items

    };

}


// ================================================================
// BOTH — NEVER MERGED
// ================================================================

export async function getNewFunctionData() {

    const [
        kerala,
        dear
    ] = await Promise.all([

        getKeralaNewFunctionData(),

        getDearNewFunctionData()

    ]);


    return {
        kerala,
        dear
    };

}