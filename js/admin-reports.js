/* =========================================================
   EVER JOY COMICS
   ADMIN REPORTS SYSTEM
   =========================================================

   Handles:
   - Reports overview counters
   - Report queue
   - Search
   - Status filtering
   - Reason filtering
   - Refresh
   - Empty state
   - Report rendering

   Prototype version:
   Reports currently come from localStorage.

   No fake reports are created automatically.
   ========================================================= */


/* =========================================================
   1. STORAGE KEY
   ========================================================= */

const EVER_JOY_REPORTS_KEY =
    "everJoyReports";


/* =========================================================
   2. GET REPORTS
   ========================================================= */

function getEverJoyReports() {

    try {

        const storedReports =
            localStorage.getItem(
                EVER_JOY_REPORTS_KEY
            );


        if (!storedReports) {

            return [];

        }


        const reports =
            JSON.parse(
                storedReports
            );


        if (!Array.isArray(reports)) {

            return [];

        }


        return reports;

    }

    catch (error) {

        console.error(
            "Ever Joy Reports: Could not read reports.",
            error
        );

        return [];

    }

}


/* =========================================================
   3. SAVE REPORTS
   ========================================================= */

function saveEverJoyReports(
    reports
) {

    try {

        localStorage.setItem(
            EVER_JOY_REPORTS_KEY,
            JSON.stringify(
                reports
            )
        );

        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy Reports: Could not save reports.",
            error
        );

        return false;

    }

}


/* =========================================================
   4. CURRENT DATE
   ========================================================= */

function updateAdminReportsDate() {

    const dateElement =
        document.getElementById(
            "adminCurrentDate"
        );


    if (!dateElement) {

        return;

    }


    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    dateElement.textContent =
        formattedDate;

}


/* =========================================================
   5. REPORT COUNTS
   ========================================================= */

function updateAdminReportCounts(
    reports
) {

    const openCount =
        reports.filter(
            report =>
                report.status ===
                "open"
        ).length;


    const reviewCount =
        reports.filter(
            report =>
                report.status ===
                "review"
        ).length;


    const resolvedCount =
        reports.filter(
            report =>
                report.status ===
                "resolved"
        ).length;


    const totalCount =
        reports.length;



    const openElement =
        document.getElementById(
            "adminOpenReportCount"
        );


    const reviewElement =
        document.getElementById(
            "adminReviewReportCount"
        );


    const resolvedElement =
        document.getElementById(
            "adminResolvedReportCount"
        );


    const totalElement =
        document.getElementById(
            "adminTotalReportCount"
        );



    if (openElement) {

        openElement.textContent =
            openCount;

    }


    if (reviewElement) {

        reviewElement.textContent =
            reviewCount;

    }


    if (resolvedElement) {

        resolvedElement.textContent =
            resolvedCount;

    }


    if (totalElement) {

        totalElement.textContent =
            totalCount;

    }

}


/* =========================================================
   6. FORMAT REPORT REASON
   ========================================================= */

function formatAdminReportReason(
    reason
) {

    const reasons = {

        inappropriate:
            "Inappropriate Content",

        copyright:
            "Copyright",

        harassment:
            "Harassment",

        spam:
            "Spam",

        misleading:
            "Misleading Information",

        other:
            "Other"

    };


    return (
        reasons[reason]
        ||
        "Other"
    );

}


/* =========================================================
   7. FORMAT REPORT STATUS
   ========================================================= */

function formatAdminReportStatus(
    status
) {

    const statuses = {

        open:
            "Open",

        review:
            "Under Review",

        resolved:
            "Resolved"

    };


    return (
        statuses[status]
        ||
        "Open"
    );

}


/* =========================================================
   8. FILTER REPORTS
   ========================================================= */

function filterAdminReports(
    reports
) {

    const searchInput =
        document.getElementById(
            "adminReportSearch"
        );


    const statusFilter =
        document.getElementById(
            "adminReportStatusFilter"
        );


    const reasonFilter =
        document.getElementById(
            "adminReportReasonFilter"
        );


    const search =
        (
            searchInput?.value
            ||
            ""
        )
        .trim()
        .toLowerCase();


    const selectedStatus =
        statusFilter?.value
        ||
        "all";


    const selectedReason =
        reasonFilter?.value
        ||
        "all";


    return reports.filter(
        report => {


            const searchableText =
                [

                    report.title,

                    report.comicTitle,

                    report.username,

                    report.reporter,

                    report.description,

                    report.reason

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !search
                ||
                searchableText.includes(
                    search
                );


            const matchesStatus =
                selectedStatus ===
                "all"
                ||
                report.status ===
                selectedStatus;


            const matchesReason =
                selectedReason ===
                "all"
                ||
                report.reason ===
                selectedReason;


            return (
                matchesSearch
                &&
                matchesStatus
                &&
                matchesReason
            );

        }
    );

}


/* =========================================================
   9. RENDER EMPTY STATE
   ========================================================= */

function renderAdminReportsEmptyState(
    message = "No reports yet"
) {

    const reportList =
        document.getElementById(
            "adminReportList"
        );


    if (!reportList) {

        return;

    }


    reportList.innerHTML = `

        <div class="admin-empty-state">

            <span class="admin-empty-icon">
                ◌
            </span>

            <strong>
                ${message}
            </strong>

            <span>
                Reader reports will appear here
                when they are submitted.
            </span>

        </div>

    `;

}


/* =========================================================
   10. RENDER REPORTS
   ========================================================= */

function renderAdminReports(
    reports
) {

    const reportList =
        document.getElementById(
            "adminReportList"
        );


    if (!reportList) {

        return;

    }


    if (!reports.length) {

        renderAdminReportsEmptyState(
            "No matching reports"
        );

        return;

    }


    reportList.innerHTML =
        reports.map(
            report => {


                const title =
                    report.title
                    ||
                    report.comicTitle
                    ||
                    "Untitled Report";


                const reporter =
                    report.username
                    ||
                    report.reporter
                    ||
                    "Anonymous Reader";


                const reason =
                    formatAdminReportReason(
                        report.reason
                    );


                const status =
                    formatAdminReportStatus(
                        report.status
                    );


                const description =
                    report.description
                    ||
                    "No additional information provided.";


                return `

                    <article
                        class="admin-report-card"
                        data-report-id="${report.id || ""}"
                    >

                        <div class="admin-report-card-top">

                            <div>

                                <span class="admin-report-reason">
                                    ${reason}
                                </span>

                                <h3>
                                    ${title}
                                </h3>

                            </div>


                            <span
                                class="admin-report-status
                                ${report.status || "open"}"
                            >

                                ${status}

                            </span>

                        </div>


                        <p class="admin-report-description">

                            ${description}

                        </p>


                        <div class="admin-report-meta">

                            <span>
                                Reported by:
                                <strong>
                                    ${reporter}
                                </strong>
                            </span>


                            <button
                                type="button"
                                class="admin-report-review-btn"
                                data-report-id="${report.id || ""}"
                            >

                                Review

                            </button>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}


/* =========================================================
   11. LOAD REPORTS
   ========================================================= */

function loadAdminReports() {

    const reports =
        getEverJoyReports();


    updateAdminReportCounts(
        reports
    );


    const filteredReports =
        filterAdminReports(
            reports
        );


    if (!reports.length) {

        renderAdminReportsEmptyState(
            "No reports yet"
        );

        return;

    }


    renderAdminReports(
        filteredReports
    );

}


/* =========================================================
   12. SEARCH
   ========================================================= */

function setupAdminReportSearch() {

    const searchInput =
        document.getElementById(
            "adminReportSearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function() {

            loadAdminReports();

        }
    );

}


/* =========================================================
   13. STATUS FILTER
   ========================================================= */

function setupAdminReportStatusFilter() {

    const statusFilter =
        document.getElementById(
            "adminReportStatusFilter"
        );


    if (!statusFilter) {

        return;

    }


    statusFilter.addEventListener(
        "change",
        function() {

            loadAdminReports();

        }
    );

}


/* =========================================================
   14. REASON FILTER
   ========================================================= */

function setupAdminReportReasonFilter() {

    const reasonFilter =
        document.getElementById(
            "adminReportReasonFilter"
        );


    if (!reasonFilter) {

        return;

    }


    reasonFilter.addEventListener(
        "change",
        function() {

            loadAdminReports();

        }
    );

}


/* =========================================================
   15. REFRESH
   ========================================================= */

function setupAdminReportsRefresh() {

    const refreshButton =
        document.getElementById(
            "adminRefreshReports"
        );


    if (!refreshButton) {

        return;

    }


    refreshButton.addEventListener(
        "click",
        function() {

            loadAdminReports();

        }
    );

}


/* =========================================================
   16. REPORT REVIEW BUTTON
   ========================================================= */

function setupAdminReportReviewButtons() {

    const reportList =
        document.getElementById(
            "adminReportList"
        );


    if (!reportList) {

        return;

    }


    reportList.addEventListener(
        "click",
        function(event) {


            const button =
                event.target.closest(
                    ".admin-report-review-btn"
                );


            if (!button) {

                return;

            }


            const reportId =
                button.dataset.reportId;


            if (!reportId) {

                return;

            }


            console.log(
                "Ever Joy Reports: Reviewing report",
                reportId
            );


            /*
               Review functionality will be
               connected when the report-detail
               interface is created.
            */

        }
    );

}


/* =========================================================
   17. INITIALIZE REPORTS PAGE
   ========================================================= */

function initializeAdminReports() {

    updateAdminReportsDate();

    setupAdminReportSearch();

    setupAdminReportStatusFilter();

    setupAdminReportReasonFilter();

    setupAdminReportsRefresh();

    setupAdminReportReviewButtons();

    loadAdminReports();

}


/* =========================================================
   18. START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdminReports
);