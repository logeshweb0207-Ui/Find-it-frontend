// ================================================================
// GROUP DEFINITIONS
// EXACTLY FROM ORIGINAL NEW FUNCTION
// ================================================================

export const groupDefinitions = [
    {
        id: 1,
        numbers: [
            "12",
            "16",
            "17",
            "26",
            "27",
            "67"
        ]
    },
    {
        id: 2,
        numbers: [
            "34",
            "38",
            "39",
            "48",
            "49",
            "89"
        ]
    },
    {
        id: 3,
        numbers: [
            "51",
            "52",
            "56",
            "57",
            "01",
            "02",
            "06",
            "07"
        ]
    },
    {
        id: 4,
        numbers: [
            "03",
            "04",
            "08",
            "09",
            "53",
            "54",
            "58",
            "59"
        ]
    },
    {
        id: 5,
        numbers: [
            "13",
            "18",
            "19",
            "14",
            "23",
            "28",
            "29",
            "24",
            "63",
            "68",
            "69",
            "64",
            "73",
            "78",
            "79",
            "74"
        ]
    },
    {
        id: 6,
        numbers: [
            "00",
            "11",
            "22",
            "33",
            "44",
            "50",
            "55",
            "66",
            "77",
            "88",
            "99"
        ]
    }
];


export const groupDefinitions2 = [
    {
        id: 1,
        numbers: [
            "01",
            "12",
            "23",
            "34",
            "45",
            "56",
            "67",
            "78",
            "89",
            "09"
        ]
    },
    {
        id: 2,
        numbers: [
            "13",
            "15",
            "17",
            "19",
            "35",
            "37",
            "39",
            "57",
            "59",
            "79"
        ]
    },
    {
        id: 3,
        numbers: [
            "02",
            "04",
            "06",
            "08",
            "24",
            "26",
            "28",
            "46",
            "48",
            "68"
        ]
    },
    {
        id: 4,
        numbers: [
            "05",
            "16",
            "27",
            "38",
            "49",
            "06",
            "17",
            "28",
            "39",
            "40"
        ]
    },
    {
        id: 5,
        numbers: [
            "03",
            "14",
            "25",
            "36",
            "47",
            "58",
            "69",
            "07",
            "18",
            "29"
        ]
    }
];


export const groupDefinitions3 = [
    {
        id: 1,
        numbers: [
            "01",
            "12",
            "23",
            "34",
            "45"
        ]
    },
    {
        id: 2,
        numbers: [
            "56",
            "67",
            "78",
            "89",
            "09"
        ]
    },
    {
        id: 3,
        numbers: [
            "13",
            "35",
            "57",
            "79",
            "91"
        ]
    },
    {
        id: 4,
        numbers: [
            "24",
            "46",
            "68",
            "80",
            "02"
        ]
    },
    {
        id: 5,
        numbers: [
            "15",
            "37",
            "59",
            "71",
            "93"
        ]
    },
    {
        id: 6,
        numbers: [
            "26",
            "48",
            "60",
            "82",
            "04"
        ]
    },
    {
        id: 7,
        numbers: [
            "05",
            "16",
            "27",
            "38",
            "49"
        ]
    },
    {
        id: 8,
        numbers: [
            "06",
            "17",
            "28",
            "39",
            "40"
        ]
    },
    {
        id: 9,
        numbers: [
            "03",
            "14",
            "25",
            "36",
            "47"
        ]
    },
    {
        id: 10,
        displayId: "0",
        numbers: [
            "58",
            "69",
            "70",
            "81",
            "92"
        ]
    }
];


// ================================================================
// ODD / EVEN
// ================================================================

export function getOddEvenSection(
    numStr,
    is4Digit
) {

    let pattern = "";

    for (const ch of String(numStr)) {

        const digit =
            parseInt(ch, 10);

        pattern +=
            digit % 2 !== 0
                ? "O"
                : "E";
    }


    if (!is4Digit) {

        const map3D = {
            OOO: "A",
            OOE: "B",
            OEO: "C",
            OEE: "D",
            EOO: "E",
            EOE: "F",
            EEO: "G",
            EEE: "H"
        };

        return map3D[pattern] || "A";
    }


    const map4D = {
        OOOO: "A",
        OOOE: "B",
        OOEO: "C",
        OOEE: "D",
        OEOO: "E",
        OEOE: "F",
        OEEO: "G",
        OEEE: "H",
        EOOO: "I",
        EOOE: "J",
        EOEO: "K",
        EOEE: "L",
        EEOO: "M",
        EEOE: "N",
        EEEO: "O",
        EEEE: "P"
    };

    return map4D[pattern] || "A";
}


// ================================================================
// GROUP SUM
// ================================================================

export function getGroup0to27(numStr) {

    if (!numStr) {
        return "0";
    }

    let sum = 0;

    for (const ch of String(numStr)) {

        sum +=
            parseInt(ch, 10) || 0;
    }

    if (sum > 27) {
        sum = 27;
    }

    return String(sum);
}


export function getGroup0to36(numStr) {

    if (!numStr) {
        return "0";
    }

    let sum = 0;

    for (const ch of String(numStr)) {

        sum +=
            parseInt(ch, 10) || 0;
    }

    if (sum > 36) {
        sum = 36;
    }

    return String(sum);
}


// ================================================================
// MATCH GROUPS
// ================================================================

export function getMatchedGroupsForNumber(
    numStr,
    groupDefs,
    isSet3 = false
) {

    if (
        !numStr ||
        numStr.length < 2
    ) {
        return [];
    }

    const pairs = [];

    for (
        let i = 0;
        i < numStr.length - 1;
        i++
    ) {

        for (
            let j = i + 1;
            j < numStr.length;
            j++
        ) {

            pairs.push(
                numStr[i] + numStr[j]
            );
        }
    }


    const foundGroups = [];

    groupDefs.forEach((group) => {

        const isMatch =
            pairs.some((pair) => {

                const reversePair =
                    pair[1] + pair[0];

                return (
                    group.numbers.includes(pair) ||
                    group.numbers.includes(reversePair)
                );
            });


        if (isMatch) {

            if (
                isSet3 &&
                group.displayId === "0"
            ) {

                foundGroups.push("0");

            } else {

                foundGroups.push(
                    String(group.id)
                );
            }
        }
    });


    return foundGroups;
}


export function getGroupsFromNumber(
    numStr,
    groupDefs,
    isSet3 = false
) {

    const list =
        getMatchedGroupsForNumber(
            numStr,
            groupDefs,
            isSet3
        );


    list.sort((a, b) => {

        const valueA =
            a === "0"
                ? 10
                : parseInt(a, 10);

        const valueB =
            b === "0"
                ? 10
                : parseInt(b, 10);

        return valueA - valueB;
    });


    return list.length > 0
        ? list.join("")
        : "-";
}


// ================================================================
// OVERALL + POSITION RANKING
// EXACT ORIGINAL RECENCY ORDER
// ================================================================

export function updateRankingGen(
    histArr,
    is4Digit
) {

    const digits = [
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9
    ];


    const overall =
        [...digits].sort((a, b) => {

            let lastA = -1;
            let lastB = -1;

            histArr.forEach(
                (numStr, index) => {

                    if (
                        String(numStr)
                            .includes(String(a))
                    ) {
                        lastA = index;
                    }

                    if (
                        String(numStr)
                            .includes(String(b))
                    ) {
                        lastB = index;
                    }
                }
            );

            return lastA - lastB;
        });


    const result = {

        overall,

        position1: [],
        position2: [],
        position3: [],
        position4: []

    };


    const positionCount =
        is4Digit
            ? 4
            : 3;


    for (
        let pos = 0;
        pos < positionCount;
        pos++
    ) {

        const list =
            [...digits].sort((a, b) => {

                let lastA = -1;
                let lastB = -1;


                histArr.forEach(
                    (numStr, index) => {

                        if (
                            parseInt(
                                String(numStr)[pos],
                                10
                            ) === a
                        ) {
                            lastA = index;
                        }


                        if (
                            parseInt(
                                String(numStr)[pos],
                                10
                            ) === b
                        ) {
                            lastB = index;
                        }

                    }
                );

                return lastA - lastB;

            });


        if (pos === 0) {
            result.position1 = list;
        }

        if (pos === 1) {
            result.position2 = list;
        }

        if (pos === 2) {
            result.position3 = list;
        }

        if (pos === 3) {
            result.position4 = list;
        }
    }


    return result;
}


// ================================================================
// PAIR RANKING
// ================================================================

export function updatePairRankingGen(
    histArr
) {

    const pairs = [

        {
            label: "1 - 6",
            digits: ["1", "6"]
        },

        {
            label: "2 - 7",
            digits: ["2", "7"]
        },

        {
            label: "3 - 8",
            digits: ["3", "8"]
        },

        {
            label: "4 - 9",
            digits: ["4", "9"]
        },

        {
            label: "0 - 5",
            digits: ["0", "5"]
        }

    ];


    return [...pairs].sort((a, b) => {

        let lastA = -1;
        let lastB = -1;


        histArr.forEach(
            (numStr, index) => {

                if (
                    a.digits.some(
                        d =>
                            String(numStr)
                                .includes(d)
                    )
                ) {
                    lastA = index;
                }


                if (
                    b.digits.some(
                        d =>
                            String(numStr)
                                .includes(d)
                    )
                ) {
                    lastB = index;
                }

            }
        );


        return lastA - lastB;

    });
}


// ================================================================
// GROUP RANKING
// ================================================================

export function updateGroupRankingGen(
    groupDefs,
    histArr,
    isSet3 = false
) {

    const defs =
        [...groupDefs];


    defs.sort((a, b) => {

        let lastA = -1;
        let lastB = -1;


        histArr.forEach(
            (numStr, index) => {

                const pairs = [];


                for (
                    let x = 0;
                    x < numStr.length - 1;
                    x++
                ) {

                    for (
                        let y = x + 1;
                        y < numStr.length;
                        y++
                    ) {

                        pairs.push(
                            numStr[x] + numStr[y]
                        );
                    }
                }


                const aMatch =
                    a.numbers.some(
                        pair =>
                            pairs.includes(pair) ||
                            pairs.includes(
                                pair[1] + pair[0]
                            )
                    );


                const bMatch =
                    b.numbers.some(
                        pair =>
                            pairs.includes(pair) ||
                            pairs.includes(
                                pair[1] + pair[0]
                            )
                    );


                if (aMatch) {
                    lastA = index;
                }

                if (bMatch) {
                    lastB = index;
                }

            }
        );


        return lastA - lastB;

    });


    return defs.map(
        (group, index) => ({

            rank: index + 1,

            id:
                isSet3 &&
                group.displayId === "0"
                    ? "0"
                    : String(group.id),

            name:
                isSet3 &&
                group.displayId === "0"
                    ? "குழு 0"
                    : `குழு ${group.id}`,

            count:
                group.numbers.length,

            numbers:
                group.numbers

        })
    );
}


// ================================================================
// ODD / EVEN RANKING
// ================================================================

export function updateOddEvenRankings(
    histArr,
    is4Digit
) {

    const sections =
        is4Digit
            ? [
                "A", "B", "C", "D",
                "E", "F", "G", "H",
                "I", "J", "K", "L",
                "M", "N", "O", "P"
            ]
            : [
                "A", "B", "C", "D",
                "E", "F", "G", "H"
            ];


    const counts = {};

    sections.forEach(
        s => {
            counts[s] = 0;
        }
    );


    histArr.forEach(
        num => {

            const section =
                getOddEvenSection(
                    num,
                    is4Digit
                );


            if (
                counts[section] !== undefined
            ) {
                counts[section]++;
            }

        }
    );


    const frequency =
        [...sections]
            .sort(
                (a, b) =>
                    counts[b] - counts[a]
            )
            .map(
                (section, index) => ({

                    rank: index + 1,

                    section,

                    count:
                        counts[section]

                })
            );


    const lastIndices = {};

    sections.forEach(
        s => {
            lastIndices[s] = -1;
        }
    );


    histArr.forEach(
        (num, index) => {

            const section =
                getOddEvenSection(
                    num,
                    is4Digit
                );


            if (
                lastIndices[section] !== undefined
            ) {

                lastIndices[section] =
                    index;
            }

        }
    );


    const recency =
        [...sections]
            .sort(
                (a, b) =>
                    lastIndices[b] -
                    lastIndices[a]
            )
            .map(
                (section, index) => ({

                    rank: index + 1,

                    section,

                    lastIndex:
                        lastIndices[section]

                })
            );


    return {
        frequency,
        recency
    };
}


// ================================================================
// GROUP 0-27 RANKING
// ================================================================

export function updateGroup27Rankings(
    histArr
) {

    const groups =
        Array.from(
            {
                length: 28
            },
            (_, index) =>
                String(index)
        );


    const counts = {};

    groups.forEach(
        g => {
            counts[g] = 0;
        }
    );


    histArr.forEach(
        num => {

            const group =
                getGroup0to27(num);


            if (
                counts[group] !== undefined
            ) {
                counts[group]++;
            }

        }
    );


    const frequency =
        [...groups]
            .sort((a, b) => {

                if (
                    counts[b] !== counts[a]
                ) {
                    return (
                        counts[b] -
                        counts[a]
                    );
                }


                return (
                    parseInt(a, 10) -
                    parseInt(b, 10)
                );

            })
            .map(
                (group, index) => ({

                    rank: index + 1,

                    group,

                    count:
                        counts[group]

                })
            );


    const lastIndices = {};

    groups.forEach(
        g => {
            lastIndices[g] = -1;
        }
    );


    histArr.forEach(
        (num, index) => {

            const group =
                getGroup0to27(num);


            lastIndices[group] =
                index;

        }
    );


    const recency =
        [...groups]
            .sort((a, b) => {

                if (
                    lastIndices[b] !==
                    lastIndices[a]
                ) {

                    return (
                        lastIndices[b] -
                        lastIndices[a]
                    );
                }


                return (
                    parseInt(a, 10) -
                    parseInt(b, 10)
                );

            })
            .map(
                (group, index) => ({

                    rank: index + 1,

                    group,

                    lastIndex:
                        lastIndices[group]

                })
            );


    return {
        frequency,
        recency
    };
}


// ================================================================
// GROUP 0-36 RANKING
// ================================================================

export function updateGroup36Rankings(
    histArr
) {

    const groups =
        Array.from(
            {
                length: 37
            },
            (_, index) =>
                String(index)
        );


    const counts = {};

    groups.forEach(
        g => {
            counts[g] = 0;
        }
    );


    histArr.forEach(
        num => {

            const group =
                getGroup0to36(num);


            if (
                counts[group] !== undefined
            ) {
                counts[group]++;
            }

        }
    );


    const frequency =
        [...groups]
            .sort((a, b) => {

                if (
                    counts[b] !== counts[a]
                ) {

                    return (
                        counts[b] -
                        counts[a]
                    );
                }


                return (
                    parseInt(a, 10) -
                    parseInt(b, 10)
                );

            })
            .map(
                (group, index) => ({

                    rank: index + 1,

                    group,

                    count:
                        counts[group]

                })
            );


    const lastIndices = {};

    groups.forEach(
        g => {
            lastIndices[g] = -1;
        }
    );


    histArr.forEach(
        (num, index) => {

            const group =
                getGroup0to36(num);


            lastIndices[group] =
                index;

        }
    );


    const recency =
        [...groups]
            .sort((a, b) => {

                if (
                    lastIndices[b] !==
                    lastIndices[a]
                ) {

                    return (
                        lastIndices[b] -
                        lastIndices[a]
                    );
                }


                return (
                    parseInt(a, 10) -
                    parseInt(b, 10)
                );

            })
            .map(
                (group, index) => ({

                    rank: index + 1,

                    group,

                    lastIndex:
                        lastIndices[group]

                })
            );


    return {
        frequency,
        recency
    };
}


// ================================================================
// COMPLETE ANALYSIS
// ================================================================

export function analyzeNewFunctionHistory(
    histArr,
    is4Digit
) {

    const safeHistory =
        Array.isArray(histArr)
            ? histArr
            : [];


    const ranking =
        updateRankingGen(
            safeHistory,
            is4Digit
        );


    const pairRanking =
        updatePairRankingGen(
            safeHistory
        );


    const group1 =
        updateGroupRankingGen(
            groupDefinitions,
            safeHistory,
            false
        );


    const group2 =
        updateGroupRankingGen(
            groupDefinitions2,
            safeHistory,
            false
        );


    const group3 =
        updateGroupRankingGen(
            groupDefinitions3,
            safeHistory,
            true
        );


    const oddEven =
        updateOddEvenRankings(
            safeHistory,
            is4Digit
        );


    const groupSum =
        is4Digit
            ? updateGroup36Rankings(
                safeHistory
            )
            : updateGroup27Rankings(
                safeHistory
            );


    return {

        total:
            safeHistory.length,

        ranking,

        pairRanking,

        group1,

        group2,

        group3,

        oddEven,

        groupSum

    };
}


// ================================================================
// REVERSE GROUP SEARCH
// EXACT ORIGINAL GROUP LOGIC
// ================================================================

// ================================================================
// REVERSE GROUP SEARCH
// ================================================================

export function findNumbersByGroups(
    targetGroupText,
    groupDefs,
    isSet3 = false
) {

    const raw =
        String(targetGroupText || "")
            .trim();


    if (!raw) {
        return [];
    }


    const targetGroupIDs =
        raw
            .split("")
            .map((digit) =>
                digit === "0"
                    ? "0"
                    : String(
                        parseInt(digit, 10)
                    )
            )
            .filter(Boolean);


    if (
        targetGroupIDs.length === 0
    ) {

        return [];

    }


    const max =
        isSet3
            ? 9999
            : 999;


    const results = [];


    for (
        let i = 0;
        i <= max;
        i++
    ) {

        const number =
            String(i).padStart(
                isSet3
                    ? 4
                    : 3,
                "0"
            );


        const matchedGroups =
            getMatchedGroupsForNumber(
                number,
                groupDefs,
                isSet3
            );


        const matchesAll =
            targetGroupIDs.every(
                (groupID) =>
                    matchedGroups.includes(
                        String(groupID)
                    )
            );


        if (matchesAll) {

            results.push(number);

        }

    }


    return results;
}

// ================================================================
// TOP 20 FILTER
// EXACT ORIGINAL ALGORITHM
// ================================================================

export function filterTop20WithRanking(
    numList,
    histArr,
    is4Digit = false
) {

    if (
        !numList ||
        numList.length <= 20
    ) {
        return numList;
    }


    const digitRankMap = {};

    const digits = [
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9
    ];


    digits.sort((a, b) => {

        let lastA = -1;
        let lastB = -1;


        histArr.forEach(
            (numStr, index) => {

                if (
                    String(numStr)
                        .includes(String(a))
                ) {
                    lastA = index;
                }


                if (
                    String(numStr)
                        .includes(String(b))
                ) {
                    lastB = index;
                }

            }
        );


        return lastA - lastB;

    });


    digits.forEach(
        (digit, index) => {

            digitRankMap[digit] =
                index;

        }
    );


    const scoredList =
        numList.map(
            (numStr) => {

                let score = 0;


                for (
                    const ch of String(numStr)
                ) {

                    score +=
                        digitRankMap[
                            parseInt(ch, 10)
                        ] || 0;

                }


                return {

                    num: numStr,

                    score

                };

            }
        );


    scoredList.sort(
        (a, b) =>
            a.score - b.score
    );


    return scoredList
        .slice(0, 20)
        .map(
            item =>
                item.num
        );

}


// ================================================================
// DETAILED NUMBER ANALYSIS
// ================================================================

export function getDetailedNumberAnalysis(
    numStr,
    history,
    is4Digit
) {

    const number =
        String(numStr || "")
            .replace(/\D/g, "")
            .padStart(
                is4Digit ? 4 : 3,
                "0"
            )
            .slice(
                is4Digit ? -4 : -3
            );


    const safeHistory =
        Array.isArray(history)
            ? history
            : [];


    const group1 =
        getGroupsFromNumber(
            number,
            groupDefinitions,
            false
        );


    const group2 =
        getGroupsFromNumber(
            number,
            groupDefinitions2,
            false
        );


    const group3 =
        getGroupsFromNumber(
            number,
            groupDefinitions3,
            true
        );


    const oddEven =
        getOddEvenSection(
            number,
            is4Digit
        );


    const digitSumGroup =
        is4Digit
            ? getGroup0to36(number)
            : getGroup0to27(number);


    const historyCount =
        safeHistory.filter(
            item =>
                String(item) === number
        ).length;


    const lastHistoryIndex =
        safeHistory.lastIndexOf(number);


    return {

        number,

        digits:
            is4Digit
                ? 4
                : 3,

        group1,

        group2,

        group3,

        oddEven,

        digitSumGroup,

        historyCount,

        lastHistoryIndex,

        existsInHistory:
            lastHistoryIndex !== -1

    };
}