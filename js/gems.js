/* =========================================================
EVER JOY COMICS
EVER GEMS — WALLET SYSTEM
========================================================= */

/* =========================================================

1. STORAGE KEYS
   ========================================================= */

const EVER_JOY_GEMS_KEY =
"everJoyGems";

const EVER_JOY_GEM_HISTORY_KEY =
"everJoyGemHistory";

const EVER_JOY_MEMBERSHIP_KEY =
"everJoyMembership";

/* =========================================================
2. INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    initializeGemsPage();

}

);

/* =========================================================
3. INITIALIZE GEMS PAGE
========================================================= */

function initializeGemsPage() {

loadGemBalance();

loadGemHistory();

setupGemPurchaseButtons();

syncMembershipCredits();

}

/* =========================================================
4. GET CURRENT USER
========================================================= */

function getGemsCurrentUser() {

if (
    typeof getEverJoyCurrentUser !==
    "function"
) {

    return null;

}

return getEverJoyCurrentUser();

}

/* =========================================================
5. USER-SPECIFIC STORAGE KEY
========================================================= */

function getGemsUserKey(
baseKey
) {

const user =
    getGemsCurrentUser();


if (
    user &&
    user.id
) {

    return (
        baseKey +
        "_" +
        user.id
    );

}


return baseKey;

}

/* =========================================================
6. GET GEM BALANCE
========================================================= */

function getEverJoyGemBalance() {

try {

    const key =
        getGemsUserKey(
            EVER_JOY_GEMS_KEY
        );


    const stored =
        localStorage.getItem(
            key
        );


    const balance =
        Number(
            stored || 0
        );


    if (
        !Number.isFinite(balance) ||
        balance < 0
    ) {

        return 0;

    }


    return Math.floor(
        balance
    );

}

catch (error) {

    console.error(
        "Ever Joy: Could not read Gem balance.",
        error
    );

    return 0;

}

}

/* =========================================================
7. SAVE GEM BALANCE
========================================================= */

function saveEverJoyGemBalance(
balance
) {

try {

    const safeBalance =
        Math.max(
            0,
            Math.floor(
                Number(balance) || 0
            )
        );


    const key =
        getGemsUserKey(
            EVER_JOY_GEMS_KEY
        );


    localStorage.setItem(
        key,
        String(
            safeBalance
        )
    );


    return true;

}

catch (error) {

    console.error(
        "Ever Joy: Could not save Gem balance.",
        error
    );

    return false;

}

}

/* =========================================================
8. LOAD BALANCE INTO UI
========================================================= */

function loadGemBalance() {

const balanceElement =
    document.getElementById(
        "gemsBalance"
    );


if (!balanceElement) {

    return;

}


const balance =
    getEverJoyGemBalance();


balanceElement.textContent =
    balance.toLocaleString();

}

/* =========================================================
9. ADD GEMS
========================================================= */

function addEverJoyGems(
amount,
source = "purchase",
details = {}
) {

const gemAmount =
    Number(amount);


if (
    !Number.isFinite(gemAmount) ||
    gemAmount <= 0
) {

    return {

        success: false,

        message:
            "Invalid Gem amount."

    };

}


const currentBalance =
    getEverJoyGemBalance();


const newBalance =
    currentBalance +
    Math.floor(
        gemAmount
    );


const saved =
    saveEverJoyGemBalance(
        newBalance
    );


if (!saved) {

    return {

        success: false,

        message:
            "Your Gem balance could not be updated."

    };

}


recordGemTransaction({

    type:
        "credit",

    amount:
        Math.floor(
            gemAmount
        ),

    source:
        source,

    description:
        details.description ||
        getGemSourceDescription(
            source,
            gemAmount
        ),

    reference:
        details.reference ||
        null

});


loadGemBalance();


return {

    success: true,

    amount:
        Math.floor(
            gemAmount
        ),

    balance:
        newBalance

};

}

/* =========================================================
10. SPEND GEMS
========================================================= */

function spendEverJoyGems(
amount,
details = {}
) {

const gemAmount =
    Number(amount);


if (
    !Number.isFinite(gemAmount) ||
    gemAmount <= 0
) {

    return {

        success: false,

        message:
            "Invalid Gem amount."

    };

}


const safeAmount =
    Math.floor(
        gemAmount
    );


const currentBalance =
    getEverJoyGemBalance();


if (
    currentBalance <
    safeAmount
) {

    return {

        success: false,

        message:
            "You don't have enough Gems."

    };

}


const newBalance =
    currentBalance -
    safeAmount;


const saved =
    saveEverJoyGemBalance(
        newBalance
    );


if (!saved) {

    return {

        success: false,

        message:
            "Your Gem balance could not be updated."

    };

}


recordGemTransaction({

    type:
        "debit",

    amount:
        safeAmount,

    source:
        "chapter_unlock",

    description:
        details.description ||
        "Chapter unlocked",

    reference:
        details.reference ||
        null

});


loadGemBalance();


return {

    success: true,

    amount:
        safeAmount,

    balance:
        newBalance

};

}

/* =========================================================
11. PURCHASE BUTTONS
========================================================= */

function setupGemPurchaseButtons() {

const buttons =
    document.querySelectorAll(
        ".gems-purchase-button"
    );


buttons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const amount =
                    Number(
                        button.dataset.gemAmount
                    );


                const price =
                    button.dataset.price;


                handleGemPurchase(
                    amount,
                    price
                );

            }
        );

    }
);

}

/* =========================================================
12. PROTOTYPE PURCHASE
========================================================= */

function handleGemPurchase(
amount,
price
) {

/*
   DEVELOPMENT MODE ONLY.

   This simulates a successful purchase.

   Later this function should be replaced
   by the verified Google Play/payment flow.
*/


const result =
    addEverJoyGems(
        amount,
        "purchase",
        {

            description:
                `${amount} Ever Gems purchased`,

            reference:
                "prototype_" +
                Date.now()

        }
    );


if (!result.success) {

    showGemPurchaseMessage(
        result.message
    );

    return;

}


showGemPurchaseMessage(
    `${amount.toLocaleString()} Gems added to your wallet.`
);


console.info(
    "Ever Joy prototype Gem purchase:",
    {
        amount,
        price,
        newBalance:
            result.balance
    }
);

}

/* =========================================================
13. TRANSACTION HISTORY
========================================================= */

function getGemHistory() {

try {

    const key =
        getGemsUserKey(
            EVER_JOY_GEM_HISTORY_KEY
        );


    const stored =
        localStorage.getItem(
            key
        );


    if (!stored) {

        return [];

    }


    const history =
        JSON.parse(
            stored
        );


    return Array.isArray(
        history
    )
        ? history
        : [];

}

catch (error) {

    console.error(
        "Ever Joy: Could not read Gem history.",
        error
    );

    return [];

}

}

/* =========================================================
14. SAVE TRANSACTION HISTORY
========================================================= */

function saveGemHistory(
history
) {

try {

    const key =
        getGemsUserKey(
            EVER_JOY_GEM_HISTORY_KEY
        );


    localStorage.setItem(
        key,
        JSON.stringify(
            history
        )
    );


    return true;

}

catch (error) {

    console.error(
        "Ever Joy: Could not save Gem history.",
        error
    );

    return false;

}

}

/* =========================================================
15. RECORD TRANSACTION
========================================================= */

function recordGemTransaction(
transaction
) {

const history =
    getGemHistory();


history.unshift({

    id:
        "gem_tx_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8),

    type:
        transaction.type ||
        "credit",

    amount:
        Number(
            transaction.amount || 0
        ),

    source:
        transaction.source ||
        "unknown",

    description:
        transaction.description ||
        "",

    reference:
        transaction.reference ||
        null,

    createdAt:
        new Date()
            .toISOString()

});


/*
   Keep the prototype history
   reasonably small.
*/

if (
    history.length >
    100
) {

    history.splice(
        100
    );

}


saveGemHistory(
    history
);

}

/* =========================================================
16. LOAD HISTORY
========================================================= */

function loadGemHistory() {

const container =
    document.getElementById(
        "gemsHistory"
    );


if (!container) {

    return;

}


const history =
    getGemHistory();


if (!history.length) {

    container.innerHTML = `

        <div class="gems-history-empty">

            <span>
                ◆
            </span>

            <h3>
                No Gem activity yet
            </h3>

            <p>
                Your Gem purchases and membership credits
                will appear here.
            </p>

        </div>

    `;

    return;

}


container.innerHTML =
    "";


history.forEach(
    transaction => {

        container.appendChild(
            createGemHistoryItem(
                transaction
            )
        );

    }
);

}

/* =========================================================
17. CREATE HISTORY ITEM
========================================================= */

function createGemHistoryItem(
transaction
) {

const item =
    document.createElement(
        "div"
    );


item.className =
    "gems-history-item";


const isCredit =
    transaction.type ===
    "credit";


const sign =
    isCredit
        ? "+"
        : "−";


const amount =
    Math.abs(
        Number(
            transaction.amount || 0
        )
    );


const description =
    escapeGemsHTML(
        transaction.description ||
        "Gem activity"
    );


const date =
    formatGemDate(
        transaction.createdAt
    );


item.innerHTML = `

    <div class="gems-history-icon ${
        isCredit
            ? "credit"
            : "debit"
    }">

        ${isCredit ? "＋" : "−"}

    </div>


    <div class="gems-history-details">

        <strong>
            ${description}
        </strong>

        <span>
            ${date}
        </span>

    </div>


    <strong class="gems-history-amount ${
        isCredit
            ? "credit"
            : "debit"
    }">

        ${sign}${amount.toLocaleString()}

    </strong>

`;


return item;

}

/* =========================================================
18. MEMBERSHIP CREDIT SYNC
========================================================= */

function syncMembershipCredits() {

/*
   Membership data is intentionally simple
   during the prototype stage.

   Expected future structure:

   {
       plan: "plus",
       status: "active",
       monthlyGems: 1000,
       renewalDate: "...",
       lastGemCredit: "..."
   }
*/


let membership;

try {

    const stored =
        localStorage.getItem(
            EVER_JOY_MEMBERSHIP_KEY
        );


    if (!stored) {

        return;

    }


    membership =
        JSON.parse(
            stored
        );

}

catch (error) {

    console.error(
        "Ever Joy: Could not read membership data.",
        error
    );

    return;

}


if (
    !membership ||
    membership.status !==
    "active"
) {

    return;

}


const monthlyGems =
    Number(
        membership.monthlyGems ||
        0
    );


if (
    monthlyGems <= 0
) {

    return;

}


/*
   The actual production system should receive
   a verified renewal event from the payment
   provider.

   This local prototype only prevents the same
   renewal credit from being applied twice.
*/

const renewalKey =
    membership.lastSuccessfulRenewal ||
    membership.renewalDate ||
    null;


if (!renewalKey) {

    return;

}


const creditedKey =
    getGemsUserKey(
        "everJoyLastMembershipGemCredit"
    );


const alreadyCredited =
    localStorage.getItem(
        creditedKey
    );


if (
    alreadyCredited ===
    String(
        renewalKey
    )
) {

    return;

}


const result =
    addEverJoyGems(
        monthlyGems,
        "membership",
        {

            description:
                `${monthlyGems.toLocaleString()} monthly membership Gems`,

            reference:
                String(
                    renewalKey
                )

        }
    );


if (
    result.success
) {

    localStorage.setItem(
        creditedKey,
        String(
            renewalKey
        )
    );


    showGemPurchaseMessage(
        `${monthlyGems.toLocaleString()} membership Gems added.`
    );

}

}

/* =========================================================
19. SOURCE DESCRIPTION
========================================================= */

function getGemSourceDescription(
source,
amount
) {

const value =
    Number(amount || 0)
        .toLocaleString();


switch (
    source
) {

    case "membership":

        return (
            `${value} monthly membership Gems`
        );


    case "purchase":

        return (
            `${value} Ever Gems purchased`
        );


    case "refund_adjustment":

        return (
            `${value} Gems refund adjustment`
        );


    default:

        return (
            `${value} Gems credited`
        );

}

}

/* =========================================================
20. MESSAGE
========================================================= */

function showGemPurchaseMessage(
message
) {

const notice =
    document.getElementById(
        "gemsPurchaseMessage"
    );


if (!notice) {

    return;

}


notice.textContent =
    message;


notice.hidden =
    false;


clearTimeout(
    notice._hideTimer
);


notice._hideTimer =
    setTimeout(
        () => {

            notice.hidden =
                true;

        },
        3000
    );

}

/* =========================================================
21. DATE FORMATTER
========================================================= */

function formatGemDate(
dateValue
) {

if (!dateValue) {

    return "Unknown date";

}


const date =
    new Date(
        dateValue
    );


if (
    Number.isNaN(
        date.getTime()
    )
) {

    return "Unknown date";

}


return date.toLocaleDateString(
    undefined,
    {

        day:
            "numeric",

        month:
            "short",

        year:
            "numeric"

    }
);

}

/* =========================================================
22. SAFE HTML
========================================================= */

function escapeGemsHTML(
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
23. PUBLIC GEM HELPERS
========================================================= */

/*
These helpers can later be called by
the chapter reader.

Example:

spendEverJoyGems(
30,
{
description:
"Unlocked Chapter 12",
reference:
"chapter_12"
}
);
*/

window.EverJoyGems = {

getBalance:
    getEverJoyGemBalance,

add:
    addEverJoyGems,

spend:
    spendEverJoyGems,

getHistory:
    getGemHistory

};