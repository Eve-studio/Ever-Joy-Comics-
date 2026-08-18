/* =========================================================
EVER JOY COMICS
MEMBERSHIP PAGE
MEMBERSHIP.JS

Handles:

- Membership page initialization
- Current membership display
- Gem balance display
- Plan selection
- Membership state
- Gem bundle navigation
- Profile membership linking
- Future Google Play billing hooks

IMPORTANT:
No authentication redirect.
No forced login.
No page-kicking security.
========================================================= */

/* =========================================================

1. STORAGE KEYS
   ========================================================= */

const EVER_JOY_MEMBERSHIP_KEY =
"everJoyMembership";

const EVER_JOY_GEMS_KEY =
"everJoyGems";

const EVER_JOY_CURRENT_USER_KEY =
"everJoyCurrentUser";

/* =========================================================
2. INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    initializeMembershipPage();

}

);

/* =========================================================
3. INITIALIZE MEMBERSHIP PAGE
========================================================= */

function initializeMembershipPage() {

loadMembershipState();

loadGemBalance();

setupMembershipPlans();

setupGemNavigation();

setupMembershipNavigation();

}

/* =========================================================
4. GET MEMBERSHIP DATA
========================================================= */

function getEverJoyMembership() {

try {

    const stored =
        localStorage.getItem(
            EVER_JOY_MEMBERSHIP_KEY
        );


    if (!stored) {

        return {
            plan: "free",
            active: false,
            gems: 0
        };

    }


    const membership =
        JSON.parse(stored);


    if (
        !membership ||
        typeof membership !== "object"
    ) {

        return {
            plan: "free",
            active: false,
            gems: 0
        };

    }


    return membership;

}
catch (error) {

    console.error(
        "Ever Joy: Could not read membership data.",
        error
    );


    return {
        plan: "free",
        active: false,
        gems: 0
    };

}

}

/* =========================================================
5. SAVE MEMBERSHIP DATA
========================================================= */

function saveEverJoyMembership(
membership
) {

try {

    localStorage.setItem(
        EVER_JOY_MEMBERSHIP_KEY,
        JSON.stringify(
            membership
        )
    );


    return true;

}
catch (error) {

    console.error(
        "Ever Joy: Could not save membership data.",
        error
    );


    return false;

}

}

/* =========================================================
6. LOAD MEMBERSHIP STATE
========================================================= */

function loadMembershipState() {

const membership =
    getEverJoyMembership();


const currentPlan =
    membership.plan ||
    "free";


const planName =
    formatMembershipPlan(
        currentPlan
    );


/*
   Optional elements.

   The page can work even if some of
   these elements do not exist.
*/

const membershipName =
    document.getElementById(
        "currentMembershipName"
    );


const membershipStatus =
    document.getElementById(
        "currentMembershipStatus"
    );


const membershipBadge =
    document.getElementById(
        "membershipStatusBadge"
    );


if (membershipName) {

    membershipName.textContent =
        planName;

}


if (membershipStatus) {

    membershipStatus.textContent =
        membership.active &&
        currentPlan !== "free"
            ? "Active"
            : "Free";

}


if (membershipBadge) {

    membershipBadge.textContent =
        membership.active &&
        currentPlan !== "free"
            ? "MEMBER"
            : "FREE";

}


/*
   Highlight the current plan
   if matching plan cards exist.
*/

document
    .querySelectorAll(
        "[data-membership-plan]"
    )
    .forEach(
        card => {

            const plan =
                card.dataset
                    .membershipPlan;


            card.classList.toggle(
                "is-current-plan",
                plan === currentPlan
            );

        }
    );

}

/* =========================================================
7. FORMAT PLAN NAME
========================================================= */

function formatMembershipPlan(
plan
) {

switch (
    String(plan)
        .toLowerCase()
) {

    case "basic":
        return "Basic";

    case "plus":
        return "Plus";

    case "premium":
        return "Premium";

    case "free":
    default:
        return "Free";

}

}

/* =========================================================
8. GEM BALANCE
========================================================= */

function getEverJoyGemBalance() {

try {

    const stored =
        localStorage.getItem(
            EVER_JOY_GEMS_KEY
        );


    if (!stored) {

        return 0;

    }


    /*
       Support both:

       "500"

       and:

       {
           balance: 500
       }
    */

    if (
        !Number.isNaN(
            Number(stored)
        )
    ) {

        return Math.max(
            0,
            Number(stored)
        );

    }


    const parsed =
        JSON.parse(stored);


    if (
        parsed &&
        typeof parsed === "object"
    ) {

        return Math.max(
            0,
            Number(
                parsed.balance || 0
            )
        );

    }


    return 0;

}
catch (error) {

    console.error(
        "Ever Joy: Could not read gem balance.",
        error
    );


    return 0;

}

}

/* =========================================================
9. DISPLAY GEM BALANCE
========================================================= */

function loadGemBalance() {

const balance =
    getEverJoyGemBalance();


const balanceElements =
    document.querySelectorAll(
        "[data-gem-balance]"
    );


balanceElements.forEach(
    element => {

        element.textContent =
            balance.toLocaleString();

    }
);


const specificBalance =
    document.getElementById(
        "membershipGemBalance"
    );


if (specificBalance) {

    specificBalance.textContent =
        balance.toLocaleString();

}

}

/* =========================================================
10. MEMBERSHIP PLAN BUTTONS
========================================================= */

function setupMembershipPlans() {

const buttons =
    document.querySelectorAll(
        "[data-membership-plan]"
    );


buttons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const plan =
                    button.dataset
                        .membershipPlan;


                if (!plan) {

                    return;

                }


                selectMembershipPlan(
                    plan
                );

            }
        );

    }
);

}

/* =========================================================
11. SELECT MEMBERSHIP PLAN
========================================================= */

function selectMembershipPlan(
plan
) {

/*
   This does NOT activate membership.

   Real activation will happen through
   Google Play billing.

   For now, send the selected plan into
   the future purchase handler.
*/

prepareMembershipPurchase(
    plan
);

}

/* =========================================================
12. PURCHASE PREPARATION
========================================================= */

function prepareMembershipPurchase(
plan
) {

const normalizedPlan =
    String(plan)
        .toLowerCase();


const validPlans = [
    "basic",
    "plus",
    "premium"
];


if (
    !validPlans.includes(
        normalizedPlan
    )
) {

    return;

}


/*
   Future Google Play integration.

   Example future flow:

   Reader taps plan
   ↓
   Google Play Billing
   ↓
   Payment confirmed
   ↓
   Subscription renewed
   ↓
   Ever Joy receives confirmation
   ↓
   Membership activated
   ↓
   Monthly gems deposited
*/

const event =
    new CustomEvent(
        "everJoyMembershipPurchaseRequested",
        {
            detail: {
                plan:
                    normalizedPlan
            }
        }
    );


document.dispatchEvent(
    event
);


showMembershipMessage(
    `Selected ${formatMembershipPlan(normalizedPlan)} membership.`
);

}

/* =========================================================
13. GEM NAVIGATION
========================================================= */

function setupGemNavigation() {

const gemButtons =
    document.querySelectorAll(
        "[data-gem-shop]"
    );


gemButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                /*
                   If the element already has
                   a normal link, allow it to work.

                   Otherwise use the default
                   gems page.
                */

                const href =
                    button.getAttribute(
                        "href"
                    );


                if (href) {

                    return;

                }


                event.preventDefault();


                window.location.href =
                    "./gems.html";

            }
        );

    }
);

}

/* =========================================================
14. MEMBERSHIP NAVIGATION
========================================================= */

function setupMembershipNavigation() {

/*
   Supports profile links such as:

   data-membership-link

   without requiring profile.js
   to know anything about the
   membership implementation.
*/

const membershipLinks =
    document.querySelectorAll(
        "[data-membership-link]"
    );


membershipLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                /*
                   If profile already has the
                   correct membership.html link,
                   do nothing.

                   This prevents the JS from
                   fighting normal navigation.
                */

                if (href) {

                    return;

                }


                event.preventDefault();


                window.location.href =
                    "../membership/membership.html";

            }
        );

    }
);

}

/* =========================================================
15. MEMBERSHIP MESSAGE
========================================================= */

function showMembershipMessage(
message
) {

let notice =
    document.querySelector(
        ".membership-temporary-notice"
    );


if (notice) {

    notice.remove();

}


notice =
    document.createElement(
        "div"
    );


notice.className =
    "membership-temporary-notice";


notice.textContent =
    message;


document.body.appendChild(
    notice
);


requestAnimationFrame(
    () => {

        notice.classList.add(
            "show"
        );

    }
);


setTimeout(
    () => {

        notice.classList.remove(
            "show"
        );


        setTimeout(
            () => {

                notice.remove();

            },
            250
        );

    },
    2500
);

}

/* =========================================================
16. FUTURE MEMBERSHIP ACTIVATION
========================================================= */

function activateEverJoyMembership(
plan,
monthlyGems
) {

const membership = {

    plan:
        String(plan)
            .toLowerCase(),

    active:
        true,

    startedAt:
        new Date().toISOString(),

    renewedAt:
        new Date().toISOString(),

    monthlyGems:
        Number(monthlyGems) || 0

};


const saved =
    saveEverJoyMembership(
        membership
    );


if (!saved) {

    return {
        success: false,
        message:
            "Membership could not be activated."
    };

}


/*
   Monthly gems are deposited separately
   so the billing system can call this
   only after a confirmed payment.
*/

loadMembershipState();


return {
    success: true,
    membership
};

}

/* =========================================================
17. FUTURE MONTHLY GEM CREDIT
========================================================= */

function creditMembershipGems(
amount
) {

const gemsToAdd =
    Math.max(
        0,
        Number(amount) || 0
    );


if (!gemsToAdd) {

    return {
        success: false,
        message:
            "Invalid gem amount."
    };

}


const currentBalance =
    getEverJoyGemBalance();


const newBalance =
    currentBalance +
    gemsToAdd;


try {

    localStorage.setItem(
        EVER_JOY_GEMS_KEY,
        JSON.stringify({
            balance:
                newBalance,

            updatedAt:
                new Date()
                    .toISOString()
        })
    );


    loadGemBalance();


    return {
        success: true,
        balance:
            newBalance
    };

}
catch (error) {

    console.error(
        "Ever Joy: Could not credit membership gems.",
        error
    );


    return {
        success: false,
        message:
            "Gems could not be credited."
    };

}

}

/* =========================================================
18. FUTURE SUBSCRIPTION RENEWAL HOOK
========================================================= */

function handleEverJoyMembershipRenewal(
plan,
monthlyGems
) {

/*
   This function is intended for the
   future Google Play billing callback.

   Once Google confirms renewal:

   1. Membership remains active.
   2. Renewal date updates.
   3. Monthly gems are credited.
   4. Existing gems remain untouched.
*/

const membership =
    getEverJoyMembership();


membership.plan =
    String(plan)
        .toLowerCase();


membership.active =
    true;


membership.renewedAt =
    new Date().toISOString();


membership.monthlyGems =
    Number(monthlyGems) || 0;


const saved =
    saveEverJoyMembership(
        membership
    );


if (!saved) {

    return {
        success: false
    };

}


const gemResult =
    creditMembershipGems(
        monthlyGems
    );


loadMembershipState();


return {
    success:
        gemResult.success,

    balance:
        gemResult.balance
};

}

/* =========================================================
19. PUBLIC HELPERS
========================================================= */

window.EverJoyMembership = {

getMembership:
    getEverJoyMembership,

getGems:
    getEverJoyGemBalance,

activate:
    activateEverJoyMembership,

creditGems:
    creditMembershipGems,

renew:
    handleEverJoyMembershipRenewal

};