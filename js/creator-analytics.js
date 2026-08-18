/* =========================================================
   EVER JOY COMICS
   CREATOR STUDIO — MAIN ANALYTICS

   Handles:

   - LocalStorage comic data
   - Overall creator statistics
   - Comic performance
   - Publishing activity
   - Top-performing comics
   - Reader activity placeholder
   - Analytics period selector
   - Recent creator activity

   No authentication redirects.
   No creator access kicking.
========================================================= */


/* =========================================================
   1. STORAGE
========================================================= */

const EVER_JOY_ANALYTICS_COMICS_KEY =
    "everJoyComics";


/* =========================================================
   2. INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCreatorAnalytics();

    }
);


/* =========================================================
   3. INITIALIZE ANALYTICS
========================================================= */

function initializeCreatorAnalytics() {

    setupAnalyticsRange();

    setupAnalyticsNotifications();

    loadCreatorIdentityForAnalytics();

    loadAnalyticsData();

}


/* =========================================================
   4. CURRENT USER
========================================================= */

function getAnalyticsCurrentUser() {

    if (
        typeof getEverJoyCurrentUser !==
        "function"
    ) {

        return null;

    }

    return getEverJoyCurrentUser();

}


/* =========================================================
   5. READ COMICS FROM LOCAL STORAGE
========================================================= */

function getAnalyticsComics() {

    try {

        const stored =
            localStorage.getItem(
                EVER_JOY_ANALYTICS_COMICS_KEY
            );


        if (!stored) {

            return [];

        }


        const comics =
            JSON.parse(
                stored
            );


        return Array.isArray(comics)
            ? comics
            : [];

    }

    catch (error) {

        console.error(
            "Ever Joy Analytics: Could not read comics.",
            error
        );

        return [];

    }

}


/* =========================================================
   6. GET CREATOR COMICS
========================================================= */

function getCurrentCreatorComics() {

    const comics =
        getAnalyticsComics();


    const currentUser =
        getAnalyticsCurrentUser();


    /*
       If a user exists, show only
       that creator's comics.

       During development, if no user
       exists, use all available comics.
    */

    if (
        currentUser &&
        currentUser.id
    ) {

        return comics.filter(
            comic =>
                comic.creatorId ===
                currentUser.id
        );

    }


    return comics;

}


/* =========================================================
   7. LOAD ALL ANALYTICS
========================================================= */

function loadAnalyticsData() {

    const comics =
        getCurrentCreatorComics();


    calculateOverallStatistics(
        comics
    );


    calculatePublishingStatistics(
        comics
    );


    renderComicPerformance(
        comics
    );


    renderTopPerformers(
        comics
    );


    renderCreatorActivity(
        comics
    );


    renderAnalyticsChart(
        comics
    );

}


/* =========================================================
   8. OVERALL STATISTICS
========================================================= */

function calculateOverallStatistics(
    comics
) {

    const totalReads =
        comics.reduce(
            (
                total,
                comic
            ) =>
                total +
                Number(
                    comic.reads || 0
                ),
            0
        );


    const totalSubscribers =
        comics.reduce(
            (
                total,
                comic
            ) =>
                total +
                Number(
                    comic.subscribers || 0
                ),
            0
        );


    const published =
        comics.filter(
            comic =>
                normalizeStatus(
                    comic.status
                ) ===
                "published"
        ).length;


    /*
       There is currently no separate
       engagement event system.

       Keep this calculated safely from
       available prototype data.
    */

    const engagement =
        totalReads > 0
            ? Math.min(
                100,
                Math.round(
                    (
                        totalSubscribers /
                        totalReads
                    ) *
                    100
                )
            )
            : 0;


    setText(
        "analyticsTotalReads",
        totalReads.toLocaleString()
    );


    setText(
        "analyticsSubscribers",
        totalSubscribers.toLocaleString()
    );


    setText(
        "analyticsPublished",
        published.toLocaleString()
    );


    setText(
        "analyticsEngagement",
        `${engagement}%`
    );


    setText(
        "analyticsChartTotal",
        totalReads.toLocaleString()
    );

}


/* =========================================================
   9. PUBLISHING STATISTICS
========================================================= */

function calculatePublishingStatistics(
    comics
) {

    const drafts =
        comics.filter(
            comic =>
                normalizeStatus(
                    comic.status
                ) ===
                "draft"
        ).length;


    const pending =
        comics.filter(
            comic =>
                normalizeStatus(
                    comic.status
                ) ===
                "pending"
        ).length;


    const published =
        comics.filter(
            comic =>
                normalizeStatus(
                    comic.status
                ) ===
                "published"
        ).length;


    setText(
        "analyticsDrafts",
        drafts
    );


    setText(
        "analyticsPending",
        pending
    );


    setText(
        "analyticsPublishedActivity",
        published
    );

}


/* =========================================================
   10. COMIC PERFORMANCE
========================================================= */

function renderComicPerformance(
    comics
) {

    const grid =
        document.getElementById(
            "analyticsComicGrid"
        );


    const empty =
        document.getElementById(
            "analyticsComicEmpty"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        "";


    if (!comics.length) {

        grid.hidden =
            true;


        if (empty) {

            empty.hidden =
                false;

        }

        return;

    }


    if (empty) {

        empty.hidden =
            true;

    }


    grid.hidden =
        false;


    const maxReads =
        Math.max(
            ...comics.map(
                comic =>
                    Number(
                        comic.reads || 0
                    )
            ),
            1
        );


    comics.forEach(
        comic => {

            grid.appendChild(
                createAnalyticsComicCard(
                    comic,
                    maxReads
                )
            );

        }
    );

}


/* =========================================================
   11. CREATE COMIC ANALYTICS CARD
========================================================= */

function createAnalyticsComicCard(
    comic,
    maxReads
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "creator-analytics-comic-card";


    const title =
        comic.title ||
        "Untitled Comic";


    const description =
        comic.description ||
        "No description available.";


    const cover =
        comic.cover ||
        "../assets/images/default-comic-cover.png";


    const reads =
        Number(
            comic.reads || 0
        );


    const subscribers =
        Number(
            comic.subscribers || 0
        );


    const status =
        formatAnalyticsStatus(
            comic.status
        );


    const performance =
        Math.max(
            3,
            Math.round(
                (
                    reads /
                    maxReads
                ) *
                100
            )
        );


    article.innerHTML = `

        <div class="creator-analytics-cover-wrapper">

            <img
                src="${escapeAnalyticsHTML(cover)}"
                alt="${escapeAnalyticsHTML(title)} cover"
                class="creator-analytics-cover"
                loading="lazy"
            >

        </div>


        <div class="creator-analytics-comic-content">

            <span class="creator-analytics-status">
                ${escapeAnalyticsHTML(status)}
            </span>


            <h3 class="creator-analytics-comic-title">
                ${escapeAnalyticsHTML(title)}
            </h3>


            <p class="creator-analytics-comic-description">
                ${escapeAnalyticsHTML(description)}
            </p>


            <div class="creator-analytics-metrics">

                <div class="creator-analytics-metric">

                    <span>
                        Reads
                    </span>

                    <strong>
                        ${reads.toLocaleString()}
                    </strong>

                </div>


                <div class="creator-analytics-metric">

                    <span>
                        Subscribers
                    </span>

                    <strong>
                        ${subscribers.toLocaleString()}
                    </strong>

                </div>

            </div>


            <div class="creator-analytics-performance">

                <div class="creator-analytics-performance-header">

                    <span>
                        Relative performance
                    </span>

                    <strong>
                        ${performance}%
                    </strong>

                </div>


                <div class="creator-analytics-bar">

                    <div
                        class="creator-analytics-bar-fill"
                        style="width:${performance}%"
                    ></div>

                </div>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   12. TOP PERFORMERS
========================================================= */

function renderTopPerformers(
    comics
) {

    const grid =
        document.getElementById(
            "analyticsTopGrid"
        );


    const empty =
        document.getElementById(
            "analyticsTopEmpty"
        );


    if (!grid) {

        return;

    }


    const ranked =
        [...comics]
        .sort(
            (
                a,
                b
            ) =>
                Number(
                    b.reads || 0
                ) -
                Number(
                    a.reads || 0
                )
        )
        .slice(
            0,
            5
        );


    if (!ranked.length) {

        grid.hidden =
            true;


        if (empty) {

            empty.hidden =
                false;

        }

        return;

    }


    if (empty) {

        empty.hidden =
            true;

    }


    grid.hidden =
        false;


    grid.innerHTML =
        "";


    ranked.forEach(
        (
            comic,
            index
        ) => {

            grid.appendChild(
                createTopPerformerCard(
                    comic,
                    index + 1
                )
            );

        }
    );

}


/* =========================================================
   13. TOP PERFORMER CARD
========================================================= */

function createTopPerformerCard(
    comic,
    rank
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "creator-analytics-comic-card";


    const title =
        comic.title ||
        "Untitled Comic";


    const reads =
        Number(
            comic.reads || 0
        );


    article.innerHTML = `

        <div
            style="
                display:flex;
                align-items:center;
                gap:14px;
                padding:20px;
            "
        >

            <span class="creator-analytics-rank">
                ${rank}
            </span>


            <div style="min-width:0;">

                <strong>
                    ${escapeAnalyticsHTML(title)}
                </strong>

                <p
                    style="
                        margin:5px 0 0;
                        opacity:.6;
                        font-size:.82rem;
                    "
                >
                    ${reads.toLocaleString()} reads
                </p>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   14. CHART
========================================================= */

function renderAnalyticsChart(
    comics
) {

    const chart =
        document.getElementById(
            "analyticsChart"
        );


    if (!chart) {

        return;

    }


    const totalReads =
        comics.reduce(
            (
                total,
                comic
            ) =>
                total +
                Number(
                    comic.reads || 0
                ),
            0
        );


    if (
        totalReads === 0
    ) {

        return;

    }


    const existing =
        chart.querySelector(
            ".creator-analytics-chart-bars"
        );


    if (existing) {

        existing.remove();

    }


    const bars =
        document.createElement(
            "div"
        );


    bars.className =
        "creator-analytics-chart-bars";


    const values =
        createChartValues(
            totalReads
        );


    const max =
        Math.max(
            ...values,
            1
        );


    values.forEach(
        value => {

            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "creator-analytics-chart-bar";


            bar.style.height =
                `${Math.max(
                    4,
                    (
                        value /
                        max
                    ) *
                    100
                )}%`;


            bars.appendChild(
                bar
            );

        }
    );


    chart.classList.add(
        "creator-analytics-chart-active"
    );


    chart.appendChild(
        bars
    );

}


/* =========================================================
   15. CHART VALUES
========================================================= */

function createChartValues(
    total
) {

    /*
       Prototype visualization.

       Real daily activity will replace
       this when reader-event tracking
       is implemented.
    */

    if (!total) {

        return [];

    }


    return [
        0,
        0,
        0,
        0,
        total
    ];

}


/* =========================================================
   16. RECENT CREATOR ACTIVITY
========================================================= */

function renderCreatorActivity(
    comics
) {

    const container =
        document.getElementById(
            "analyticsActivity"
        );


    if (!container) {

        return;

    }


    if (!comics.length) {

        container.innerHTML = `

            <div class="creator-empty-icon">
                ✦
            </div>

            <h3>
                No analytics activity yet.
            </h3>

            <p>
                Comic creation, updates, publishing,
                reader activity, and subscriber events
                will appear here as your creator account
                grows.
            </p>

        `;

        return;

    }


    const activities =
        [];


    comics.forEach(
        comic => {

            if (
                comic.createdAt
            ) {

                activities.push({

                    date:
                        new Date(
                            comic.createdAt
                        ),

                    icon:
                        "＋",

                    title:
                        comic.title ||
                        "Untitled Comic",

                    message:
                        "Comic created."

                });

            }


            if (
                comic.updatedAt &&
                comic.updatedAt !==
                comic.createdAt
            ) {

                activities.push({

                    date:
                        new Date(
                            comic.updatedAt
                        ),

                    icon:
                        "✦",

                    title:
                        comic.title ||
                        "Untitled Comic",

                    message:
                        "Comic updated."

                });

            }


            if (
                normalizeStatus(
                    comic.status
                ) ===
                "published"
            ) {

                activities.push({

                    date:
                        new Date(
                            comic.updatedAt ||
                            comic.createdAt ||
                            Date.now()
                        ),

                    icon:
                        "✓",

                    title:
                        comic.title ||
                        "Untitled Comic",

                    message:
                        "Comic is published."

                });

            }

        }
    );


    activities.sort(
        (
            a,
            b
        ) =>
            b.date -
            a.date
    );


    const recent =
        activities.slice(
            0,
            8
        );


    container.innerHTML =
        "";


    recent.forEach(
        activity => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "creator-analytics-activity-item";


            item.innerHTML = `

                <span
                    class="creator-analytics-activity-icon"
                >
                    ${escapeAnalyticsHTML(
                        activity.icon
                    )}
                </span>


                <div
                    class="creator-analytics-activity-content"
                >

                    <strong>
                        ${escapeAnalyticsHTML(
                            activity.title
                        )}
                    </strong>


                    <p>
                        ${escapeAnalyticsHTML(
                            activity.message
                        )}
                    </p>


                    <span
                        class="creator-analytics-activity-time"
                    >
                        ${formatAnalyticsDate(
                            activity.date
                        )}
                    </span>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   17. ANALYTICS RANGE
========================================================= */

function setupAnalyticsRange() {

    const range =
        document.getElementById(
            "analyticsRange"
        );


    if (!range) {

        return;

    }


    range.addEventListener(
        "change",
        () => {

            updateAnalyticsRangeMessage(
                range.value
            );

            loadAnalyticsData();

        }
    );

}


/* =========================================================
   18. RANGE MESSAGE
========================================================= */

function updateAnalyticsRangeMessage(
    range
) {

    const message =
        document.getElementById(
            "analyticsChartMessage"
        );


    if (!message) {

        return;

    }


    const labels = {

        "7":
            "Your audience activity from the last 7 days will appear here.",

        "30":
            "Your audience activity from the last 30 days will appear here.",

        "90":
            "Your audience activity from the last 3 months will appear here.",

        "365":
            "Your audience activity from the last year will appear here."

    };


    message.textContent =
        labels[range] ||
        labels["30"];

}


/* =========================================================
   19. NOTIFICATIONS
========================================================= */

function setupAnalyticsNotifications() {

    const button =
        document.getElementById(
            "creatorNotificationButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            showAnalyticsNotice();

        }
    );

}


function showAnalyticsNotice() {

    const existing =
        document.querySelector(
            ".creator-temporary-notice"
        );


    if (existing) {

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

            notice.remove();

        },
        2500
    );

}


/* =========================================================
   20. CREATOR IDENTITY
========================================================= */

function loadCreatorIdentityForAnalytics() {

    const user =
        getAnalyticsCurrentUser();


    if (!user) {

        return;

    }


    const name =
        document.getElementById(
            "creatorAccountName"
        );


    const avatar =
        document.getElementById(
            "creatorAvatar"
        );


    if (name) {

        name.textContent =
            user.username ||
            "Creator";

    }


    if (avatar) {

        const username =
            user.username ||
            "E";


        avatar.textContent =
            username
                .charAt(0)
                .toUpperCase();

    }

}


/* =========================================================
   21. STATUS NORMALIZATION
========================================================= */

function normalizeStatus(
    status
) {

    const value =
        String(
            status ||
            "draft"
        )
        .toLowerCase()
        .trim();


    if (
        value ===
        "pending review"
    ) {

        return "pending";

    }


    return value;

}


/* =========================================================
   22. STATUS LABEL
========================================================= */

function formatAnalyticsStatus(
    status
) {

    switch (
        normalizeStatus(status)
    ) {

        case "published":
            return "Published";

        case "pending":
            return "Pending Review";

        case "ongoing":
            return "Ongoing";

        case "completed":
            return "Completed";

        case "scheduled":
            return "Scheduled";

        default:
            return "Draft";

    }

}


/* =========================================================
   23. DATE FORMAT
========================================================= */

function formatAnalyticsDate(
    date
) {

    if (
        !date ||
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recently";

    }


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   24. TEXT HELPER
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
   25. SAFE HTML
========================================================= */

function escapeAnalyticsHTML(
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