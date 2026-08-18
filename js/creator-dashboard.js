/* =========================================================
   EVER JOY COMICS
   CREATOR STUDIO — DASHBOARD

   Handles:

   - Creator information
   - Dashboard statistics
   - Recent comics
   - Performance range
   - Notifications
   - Future dashboard data hooks

   Development version:
   No authentication redirects are used here.
   ========================================================= */


/* =========================================================
   1. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCreatorDashboard();

    }
);


/* =========================================================
   2. INITIALIZE DASHBOARD
   ========================================================= */

function initializeCreatorDashboard() {

    const currentUser =
        typeof getEverJoyCurrentUser === "function"
            ? getEverJoyCurrentUser()
            : null;


    /*
       Load whatever information is available.

       No login redirect.
       No creator redirect.
       The Creator Studio is currently
       being developed as a frontend prototype.
    */

    if (currentUser) {

        loadCreatorIdentity(
            currentUser
        );

    }
    else {

        loadCreatorIdentity({
            username: "Creator",
            profile: {}
        });

    }


    loadCreatorStatistics(
        currentUser
    );


    loadCreatorComics(
        currentUser
    );


    setupPerformanceRange();


    setupCreatorNotifications();

}


/* =========================================================
   3. LOAD CREATOR IDENTITY
   ========================================================= */

function loadCreatorIdentity(
    user
) {

    if (!user) {

        user = {

            username:
                "Creator",

            profile: {}

        };

    }


    const accountName =
        document.getElementById(
            "creatorAccountName"
        );


    const avatar =
        document.getElementById(
            "creatorAvatar"
        );


    /* -----------------------------------------------------
       CREATOR NAME
       ----------------------------------------------------- */

    if (accountName) {

        accountName.textContent =
            user.username ||
            "Creator";

    }


    /* -----------------------------------------------------
       CREATOR AVATAR
       ----------------------------------------------------- */

    if (avatar) {

        if (
            user.profile &&
            user.profile.avatar
        ) {

            avatar.textContent =
                "";


            avatar.style.backgroundImage =
                `url("${user.profile.avatar}")`;


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


            avatar.style.backgroundImage =
                "";

        }

    }

}


/* =========================================================
   4. LOAD CREATOR STATISTICS
   ========================================================= */

function loadCreatorStatistics(
    user
) {

    const totalReads =
        document.getElementById(
            "creatorTotalReads"
        );


    const followers =
        document.getElementById(
            "creatorFollowers"
        );


    const earnings =
        document.getElementById(
            "creatorEarnings"
        );


    const comicCount =
        document.getElementById(
            "creatorComicCount"
        );


    const chartTotal =
        document.getElementById(
            "creatorChartTotal"
        );


    /*
       Prototype values.

       These will later come from the
       creator's actual comics and analytics.
    */

    if (totalReads) {

        totalReads.textContent =
            "0";

    }


    if (followers) {

        followers.textContent =
            "0";

    }


    if (earnings) {

        earnings.textContent =
            "$0.00";

    }


    if (comicCount) {

        comicCount.textContent =
            "0";

    }


    if (chartTotal) {

        chartTotal.textContent =
            "0";

    }


    /*
       If the comics system exists,
       calculate the creator's comic count.
    */

    if (
        typeof getEverJoyComics ===
        "function" &&
        user &&
        user.id
    ) {

        const comics =
            getEverJoyComics();


        const creatorComics =
            comics.filter(
                comic =>
                    comic.creatorId ===
                    user.id
            );


        if (comicCount) {

            comicCount.textContent =
                creatorComics.length;

        }

    }

}


/* =========================================================
   5. LOAD RECENT COMICS
   ========================================================= */

function loadCreatorComics(
    user
) {

    const comicsContainer =
        document.getElementById(
            "creatorRecentComics"
        );


    if (!comicsContainer) {

        return;

    }


    /*
       If the comic storage already exists,
       use it.

       Otherwise show the empty state.
    */

    if (
        typeof getEverJoyComics !==
        "function"
    ) {

        showEmptyComicsState(
            comicsContainer
        );

        return;

    }


    const comics =
        getEverJoyComics();


    let creatorComics =
        comics;


    if (
        user &&
        user.id
    ) {

        creatorComics =
            comics.filter(
                comic =>
                    comic.creatorId ===
                    user.id
            );

    }


    if (!creatorComics.length) {

        showEmptyComicsState(
            comicsContainer
        );

        return;

    }


    /*
       Show the newest comics first.
    */

    creatorComics =
        creatorComics
            .slice()
            .sort(
                (a, b) =>
                    new Date(
                        b.updatedAt ||
                        b.createdAt ||
                        0
                    )
                    -
                    new Date(
                        a.updatedAt ||
                        a.createdAt ||
                        0
                    )
            )
            .slice(
                0,
                4
            );


    comicsContainer.innerHTML =
        "";


    creatorComics.forEach(
        comic => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "creator-recent-comic";


            item.innerHTML = `

                <strong>
                    ${escapeCreatorText(
                        comic.title ||
                        "Untitled Comic"
                    )}
                </strong>

                <span>
                    ${Number(
                        comic.reads || 0
                    ).toLocaleString()}
                    reads
                </span>

            `;


            comicsContainer.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   6. EMPTY COMICS STATE
   ========================================================= */

function showEmptyComicsState(
    container
) {

    container.innerHTML = `

        <div class="creator-comics-empty">

            <div class="creator-empty-icon">
                ▣
            </div>

            <h3>
                Your studio is empty
            </h3>

            <p>
                Create your first comic and it
                will appear here.
            </p>

            <a
                href="./upload.html"
                class="creator-secondary-button"
            >
                Create your first comic
            </a>

        </div>

    `;

}


/* =========================================================
   7. PERFORMANCE RANGE
   ========================================================= */

function setupPerformanceRange() {

    const performanceRange =
        document.getElementById(
            "performanceRange"
        );


    if (!performanceRange) {

        return;

    }


    performanceRange.addEventListener(
        "change",
        () => {

            updatePerformancePlaceholder(
                performanceRange.value
            );

        }
    );

}


/* =========================================================
   8. PERFORMANCE PLACEHOLDER
   ========================================================= */

function updatePerformancePlaceholder(
    range
) {

    const chartMessage =
        document.querySelector(
            ".creator-chart-message p"
        );


    if (!chartMessage) {

        return;

    }


    let message =
        "Your audience activity will appear here as readers discover your comics.";


    if (range === "7") {

        message =
            "Your audience activity from the last 7 days will appear here.";

    }


    if (range === "30") {

        message =
            "Your audience activity from the last 30 days will appear here.";

    }


    if (range === "90") {

        message =
            "Your audience activity from the last 3 months will appear here.";

    }


    if (range === "365") {

        message =
            "Your audience activity from the last year will appear here.";

    }


    chartMessage.textContent =
        message;

}


/* =========================================================
   9. CREATOR NOTIFICATIONS
   ========================================================= */

function setupCreatorNotifications() {

    const notificationButton =
        document.getElementById(
            "creatorNotificationButton"
        );


    if (!notificationButton) {

        return;

    }


    notificationButton.addEventListener(
        "click",
        () => {

            showCreatorNotificationMessage();

        }
    );

}


/* =========================================================
   10. NOTIFICATION MESSAGE
   ========================================================= */

function showCreatorNotificationMessage() {

    const existingNotice =
        document.querySelector(
            ".creator-temporary-notice"
        );


    if (existingNotice) {

        return;

    }


    const notice =
        document.createElement(
            "div"
        );


    notice.className =
        "creator-temporary-notice";


    notice.textContent =
        "No new creator notifications.";


    document.body.appendChild(
        notice
    );


    setTimeout(
        () => {

            if (notice) {

                notice.remove();

            }

        },
        2500
    );

}


/* =========================================================
   11. UPDATE DASHBOARD STATISTICS
   ========================================================= */

function updateCreatorDashboardStats(
    stats = {}
) {

    const totalReads =
        document.getElementById(
            "creatorTotalReads"
        );


    const followers =
        document.getElementById(
            "creatorFollowers"
        );


    const earnings =
        document.getElementById(
            "creatorEarnings"
        );


    const comicCount =
        document.getElementById(
            "creatorComicCount"
        );


    const chartTotal =
        document.getElementById(
            "creatorChartTotal"
        );


    if (totalReads) {

        totalReads.textContent =
            Number(
                stats.reads || 0
            ).toLocaleString();

    }


    if (followers) {

        followers.textContent =
            Number(
                stats.followers || 0
            ).toLocaleString();

    }


    if (earnings) {

        earnings.textContent =
            `$${Number(
                stats.earnings || 0
            ).toFixed(2)}`;

    }


    if (comicCount) {

        comicCount.textContent =
            Number(
                stats.comics || 0
            ).toLocaleString();

    }


    if (chartTotal) {

        chartTotal.textContent =
            Number(
                stats.reads || 0
            ).toLocaleString();

    }

}


/* =========================================================
   12. CREATOR ACTIVITY
   ========================================================= */

function addCreatorActivity(
    activity
) {

    const activityContainer =
        document.getElementById(
            "creatorActivity"
        );


    if (
        !activityContainer ||
        !activity
    ) {

        return;

    }


    const activityItem =
        document.createElement(
            "div"
        );


    activityItem.className =
        "creator-activity-item";


    activityItem.innerHTML = `

        <span class="creator-activity-icon">
            ✦
        </span>

        <div>

            <strong>
                ${escapeCreatorText(
                    activity.title ||
                    "Creator activity"
                )}
            </strong>

            <p>
                ${escapeCreatorText(
                    activity.message ||
                    ""
                )}
            </p>

        </div>

    `;


    const emptyState =
        activityContainer.querySelector(
            ".creator-empty-icon"
        );


    if (emptyState) {

        activityContainer.innerHTML =
            "";

    }


    activityContainer.prepend(
        activityItem
    );

}


/* =========================================================
   13. SAFE TEXT
   ========================================================= */

function escapeCreatorText(
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