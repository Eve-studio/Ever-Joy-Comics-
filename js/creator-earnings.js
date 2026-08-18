/* =========================================================
EVER JOY COMICS
CREATOR STUDIO — EARNINGS

Handles:

- Earnings overview
- LocalStorage earnings data
- Revenue breakdown
- Earnings period selection
- Earnings activity
- Payout placeholders
- Future monetization integration

IMPORTANT:

There is NO authentication redirect here.

There is NO creator kick-out here.

This page is intentionally safe to open
during development.
========================================================= */

/* =========================================================

1. STORAGE KEYS
   ========================================================= */

const EVER_JOY_EARNINGS_KEY =
"everJoyEarnings";

const EVER_JOY_PAYOUTS_KEY =
"everJoyPayouts";

/* =========================================================
2. INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    initializeCreatorEarnings();

}

);

/* =========================================================
3. INITIALIZE EARNINGS PAGE
========================================================= */

function initializeCreatorEarnings() {

loadCreatorIdentity();

loadCreatorEarnings();

setupEarningsRange();

setupPayoutButtons();

}

/* =========================================================
4. CREATOR IDENTITY
========================================================= */

function loadCreatorIdentity() {

const accountName =
    document.getElementById(
        "creatorAccountName"
    );


const avatar =
    document.getElementById(
        "creatorAvatar"
    );


/*
   If the shared account system exists,
   use the current user's information.

   If it doesn't exist, simply keep
   the default "Creator" identity.
*/

if (
    typeof getEverJoyCurrentUser !==
    "function"
) {

    return;

}


const user =
    getEverJoyCurrentUser();


if (!user) {

    return;

}


if (accountName) {

    accountName.textContent =
        user.username ||
        "Creator";

}


if (avatar) {

    if (
        user.profile &&
        user.profile.avatar
    ) {

        avatar.textContent = "";

        avatar.style.backgroundImage =
            `url("${escapeEarningsAttribute(
                user.profile.avatar
            )}")`;

        avatar.style.backgroundSize =
            "cover";

        avatar.style.backgroundPosition =
            "center";

    }
    else {

        const username =
            user.username ||
            "E";


        avatar.textContent =
            username
                .charAt(0)
                .toUpperCase();

    }

}

}

/* =========================================================
5. GET EARNINGS
========================================================= */

function getEverJoyEarnings() {

try {

    const stored =
        localStorage.getItem(
            EVER_JOY_EARNINGS_KEY
        );


    if (!stored) {

        return [];

    }


    const earnings =
        JSON.parse(
            stored
        );


    return Array.isArray(
        earnings
    )
        ? earnings
        : [];

}

catch (error) {

    console.error(
        "Ever Joy: Could not read earnings.",
        error
    );

    return [];

}

}

/* =========================================================
6. SAVE EARNINGS
========================================================= */

function saveEverJoyEarnings(
earnings
) {

try {

    localStorage.setItem(
        EVER_JOY_EARNINGS_KEY,
        JSON.stringify(
            earnings
        )
    );

    return true;

}

catch (error) {

    console.error(
        "Ever Joy: Could not save earnings.",
        error
    );

    return false;

}

}

/* =========================================================
7. LOAD EARNINGS
========================================================= */

function loadCreatorEarnings() {

const earnings =
    getEverJoyEarnings();


/*
   If the current user exists,
   only display their earnings.

   During development, if there is
   no current user, simply use all
   available prototype earnings.
*/

let creatorEarnings =
    earnings;


if (
    typeof getEverJoyCurrentUser ===
    "function"
) {

    const currentUser =
        getEverJoyCurrentUser();


    if (currentUser) {

        creatorEarnings =
            earnings.filter(
                earning =>
                    !earning.creatorId ||
                    earning.creatorId ===
                    currentUser.id
            );

    }

}


const totals =
    calculateEarningsTotals(
        creatorEarnings
    );


updateEarningsOverview(
    totals
);


updateRevenueBreakdown(
    creatorEarnings
);


renderEarningsActivity(
    creatorEarnings
);

}

/* =========================================================
8. CALCULATE TOTALS
========================================================= */

function calculateEarningsTotals(
earnings
) {

let lifetime =
    0;


let pending =
    0;


let available =
    0;


let thisMonth =
    0;


const currentDate =
    new Date();


const currentMonth =
    currentDate.getMonth();


const currentYear =
    currentDate.getFullYear();


earnings.forEach(
    earning => {

        const amount =
            Number(
                earning.amount || 0
            );


        const status =
            String(
                earning.status ||
                "available"
            )
            .toLowerCase();


        lifetime +=
            amount;


        if (
            status ===
            "pending"
        ) {

            pending +=
                amount;

        }
        else {

            available +=
                amount;

        }


        if (
            earning.date
        ) {

            const date =
                new Date(
                    earning.date
                );


            if (
                date.getMonth() ===
                    currentMonth &&
                date.getFullYear() ===
                    currentYear
            ) {

                thisMonth +=
                    amount;

            }

        }

    }
);


return {

    lifetime,
    pending,
    available,
    thisMonth

};

}

/* =========================================================
9. UPDATE OVERVIEW
========================================================= */

function updateEarningsOverview(
totals
) {

const availableBalance =
    document.getElementById(
        "availableBalance"
    );


const lifetimeEarnings =
    document.getElementById(
        "lifetimeEarnings"
    );


const monthlyEarnings =
    document.getElementById(
        "monthlyEarnings"
    );


const pendingEarnings =
    document.getElementById(
        "pendingEarnings"
    );


const chartTotal =
    document.getElementById(
        "chartEarningsTotal"
    );


if (availableBalance) {

    availableBalance.textContent =
        formatMoney(
            totals.available
        );

}


if (lifetimeEarnings) {

    lifetimeEarnings.textContent =
        formatMoney(
            totals.lifetime
        );

}


if (monthlyEarnings) {

    monthlyEarnings.textContent =
        formatMoney(
            totals.thisMonth
        );

}


if (pendingEarnings) {

    pendingEarnings.textContent =
        formatMoney(
            totals.pending
        );

}


if (chartTotal) {

    chartTotal.textContent =
        formatMoney(
            totals.lifetime
        );

}

}

/* =========================================================
10. REVENUE BREAKDOWN
========================================================= */

function updateRevenueBreakdown(
earnings
) {

const totals = {

    comic:
        0,

    premium:
        0,

    support:
        0,

    program:
        0

};


earnings.forEach(
    earning => {

        const amount =
            Number(
                earning.amount || 0
            );


        const source =
            String(
                earning.source ||
                "program"
            )
            .toLowerCase();


        if (
            source ===
            "comic"
            ||
            source ===
            "purchase"
        ) {

            totals.comic +=
                amount;

        }
        else if (
            source ===
            "premium"
            ||
            source ===
            "chapter"
        ) {

            totals.premium +=
                amount;

        }
        else if (
            source ===
            "support"
            ||
            source ===
            "tip"
        ) {

            totals.support +=
                amount;

        }
        else {

            totals.program +=
                amount;

        }

    }
);


setText(
    "comicPurchaseEarnings",
    formatMoney(
        totals.comic
    )
);


setText(
    "premiumEarnings",
    formatMoney(
        totals.premium
    )
);


setText(
    "supportEarnings",
    formatMoney(
        totals.support
    )
);


setText(
    "programEarnings",
    formatMoney(
        totals.program
    )
);

}

/* =========================================================
11. EARNINGS ACTIVITY
========================================================= */

function renderEarningsActivity(
earnings
) {

const container =
    document.getElementById(
        "earningsActivity"
    );


if (!container) {

    return;

}


if (!earnings.length) {

    container.innerHTML = `

        <div class="creator-activity-empty">

            <div class="creator-empty-icon">
                $
            </div>

            <h3>
                No earnings yet
            </h3>

            <p>
                When your work begins generating
                revenue, your earnings activity will
                appear here.
            </p>

        </div>

    `;

    return;

}


const sorted =
    [...earnings]
        .sort(
            (a, b) =>
                new Date(
                    b.date || 0
                ) -
                new Date(
                    a.date || 0
                )
        )
        .slice(
            0,
            20
        );


container.innerHTML =
    "";


sorted.forEach(
    earning => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "creator-earning-item";


        const title =
            earning.title ||
            "Creator earning";


        const source =
            formatEarningSource(
                earning.source
            );


        const date =
            formatEarningDate(
                earning.date
            );


        const amount =
            formatMoney(
                Number(
                    earning.amount || 0
                )
            );


        item.innerHTML = `

            <div class="creator-earning-item-icon">
                $
            </div>

            <div class="creator-earning-item-content">

                <strong>
                    ${escapeEarningsHTML(title)}
                </strong>

                <small>
                    ${escapeEarningsHTML(source)}
                    ·
                    ${escapeEarningsHTML(date)}
                </small>

            </div>

            <span class="creator-earning-item-amount">
                +${escapeEarningsHTML(amount)}
            </span>

        `;


        container.appendChild(
            item
        );

    }
);

}

/* =========================================================
12. EARNINGS RANGE
========================================================= */

function setupEarningsRange() {

const range =
    document.getElementById(
        "earningsRange"
    );


if (!range) {

    return;

}


range.addEventListener(
    "change",
    () => {

        updateEarningsChartMessage(
            range.value
        );

    }
);

}

/* =========================================================
13. CHART MESSAGE
========================================================= */

function updateEarningsChartMessage(
range
) {

const message =
    document.querySelector(
        "#earningsChartMessage p"
    );


if (!message) {

    return;

}


const messages = {

    "7":
        "Your revenue activity from the last 7 days will appear here.",

    "30":
        "Your revenue activity from the last 30 days will appear here.",

    "90":
        "Your revenue activity from the last 3 months will appear here.",

    "365":
        "Your revenue activity from the last year will appear here."

};


message.textContent =
    messages[range] ||
    messages["30"];

}

/* =========================================================
14. PAYOUT BUTTONS
========================================================= */

function setupPayoutButtons() {

const manageButton =
    document.getElementById(
        "managePayoutButton"
    );


const setupButton =
    document.getElementById(
        "setupPayoutButton"
    );


if (manageButton) {

    manageButton.addEventListener(
        "click",
        () => {

            showEarningsNotice(
                "Payout management will become available when Ever Joy's payment system is connected."
            );

        }
    );

}


if (setupButton) {

    setupButton.addEventListener(
        "click",
        () => {

            showEarningsNotice(
                "Payout setup is currently being prepared."
            );

        }
    );

}

}

/* =========================================================
15. ADD EARNING
Future monetization systems can call this.
========================================================= */

function createEverJoyEarning(
earningData
) {

const earnings =
    getEverJoyEarnings();


let creatorId =
    "development";


if (
    typeof getEverJoyCurrentUser ===
    "function"
) {

    const currentUser =
        getEverJoyCurrentUser();


    if (currentUser) {

        creatorId =
            currentUser.id;

    }

}


const newEarning = {

    id:
        "earning_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8),

    creatorId,

    title:
        String(
            earningData?.title ||
            "Creator earning"
        )
        .trim(),

    source:
        earningData?.source ||
        "program",

    amount:
        Number(
            earningData?.amount || 0
        ),

    status:
        earningData?.status ||
        "available",

    date:
        earningData?.date ||
        new Date().toISOString()

};


earnings.push(
    newEarning
);


const saved =
    saveEverJoyEarnings(
        earnings
    );


if (!saved) {

    return {

        success: false,

        message:
            "Earning could not be saved."

    };

}


loadCreatorEarnings();


return {

    success: true,

    message:
        "Earning saved successfully.",

    earning:
        newEarning

};

}

/* =========================================================
16. FORMAT MONEY
========================================================= */

function formatMoney(
amount
) {

return "$" +
    Number(
        amount || 0
    )
    .toFixed(2);

}

/* =========================================================
17. FORMAT SOURCE
========================================================= */

function formatEarningSource(
source
) {

const normalized =
    String(
        source || "program"
    )
    .toLowerCase();


switch (
    normalized
) {

    case "comic":
    case "purchase":
        return "Comic purchase";

    case "premium":
    case "chapter":
        return "Premium content";

    case "support":
    case "tip":
        return "Reader support";

    case "program":
        return "Creator program";

    default:
        return "Creator earning";

}

}

/* =========================================================
18. FORMAT DATE
========================================================= */

function formatEarningDate(
date
) {

if (!date) {

    return "Date unavailable";

}


const parsed =
    new Date(
        date
    );


if (
    Number.isNaN(
        parsed.getTime()
    )
) {

    return "Date unavailable";

}


return parsed.toLocaleDateString(
    undefined,
    {
        year: "numeric",
        month: "short",
        day: "numeric"
    }
);

}

/* =========================================================
19. TEMPORARY NOTICE
========================================================= */

function showEarningsNotice(
message
) {

const existing =
    document.querySelector(
        ".creator-earnings-notice"
    );


if (existing) {

    existing.remove();

}


const notice =
    document.createElement(
        "div"
    );


notice.className =
    "creator-earnings-notice";


notice.textContent =
    message;


document.body.appendChild(
    notice
);


setTimeout(
    () => {

        if (notice) {

            notice.remove();

        }

    },
    3000
);

}

/* =========================================================
20. TEXT HELPER
========================================================= */

function setText(
id,
value
) {

const element =
    document.getElementById(
        id
    );


if (element) {

    element.textContent =
        value;

}

}

/* =========================================================
21. SAFE HTML
========================================================= */

function escapeEarningsHTML(
value
) {

return String(
    value ?? ""
)
.replace(
    /&/g,
    "&amp;"
)
.replace(
    /</g,
    "&lt;"
)
.replace(
    />/g,
    "&gt;"
)
.replace(
    /"/g,
    "&quot;"
)
.replace(
    /'/g,
    "&#039;"
);

}

/* =========================================================
22. SAFE ATTRIBUTE
========================================================= */

function escapeEarningsAttribute(
value
) {

return String(
    value ?? ""
)
.replace(
    /"/g,
    "%22"
)
.replace(
    /'/g,
    "%27"
);

}