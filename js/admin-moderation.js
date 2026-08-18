/* =========================================================
   EVER JOY COMICS
   MODERATION SYSTEM
   =========================================================

   Handles:
   - Moderation page
   - Pending submissions
   - Approved content
   - Rejected content
   - Search / filtering
   - Approve / reject actions
   - Empty moderation state

   Prototype version:
   Uses localStorage.

   IMPORTANT:
   Placeholder/test comics should NOT automatically appear
   as moderation submissions. Only content explicitly marked
   as "pending" should be handled here.
   ========================================================= */


/* =========================================================
   1. STORAGE KEYS
   ========================================================= */

const EVER_JOY_MODERATION_KEY =
    "everJoyModerationQueue";


/* =========================================================
   2. GET MODERATION QUEUE
   ========================================================= */

function getEverJoyModerationQueue() {

    try {

        const storedQueue =
            localStorage.getItem(
                EVER_JOY_MODERATION_KEY
            );


        if (!storedQueue) {

            return [];

        }


        const queue =
            JSON.parse(
                storedQueue
            );


        if (!Array.isArray(queue)) {

            return [];

        }


        return queue;

    }

    catch (error) {

        console.error(
            "Ever Joy Moderation: Could not read moderation queue.",
            error
        );

        return [];

    }

}


/* =========================================================
   3. SAVE MODERATION QUEUE
   ========================================================= */

function saveEverJoyModerationQueue(
    queue
) {

    try {

        localStorage.setItem(
            EVER_JOY_MODERATION_KEY,
            JSON.stringify(queue)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy Moderation: Could not save moderation queue.",
            error
        );

        return false;

    }

}


/* =========================================================
   4. GET PENDING SUBMISSIONS
   ========================================================= */

function getEverJoyPendingSubmissions() {

    const queue =
        getEverJoyModerationQueue();


    return queue.filter(
        item =>
            item &&
            item.status === "pending"
    );

}


/* =========================================================
   5. GET APPROVED SUBMISSIONS
   ========================================================= */

function getEverJoyApprovedSubmissions() {

    const queue =
        getEverJoyModerationQueue();


    return queue.filter(
        item =>
            item &&
            item.status === "approved"
    );

}


/* =========================================================
   6. GET REJECTED SUBMISSIONS
   ========================================================= */

function getEverJoyRejectedSubmissions() {

    const queue =
        getEverJoyModerationQueue();


    return queue.filter(
        item =>
            item &&
            item.status === "rejected"
    );

}


/* =========================================================
   7. FORMAT DATE
   ========================================================= */

function formatEverJoyModerationDate(
    date
) {

    if (!date) {

        return "Unknown date";

    }


    try {

        return new Date(
            date
        ).toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }

    catch {

        return "Unknown date";

    }

}


/* =========================================================
   8. APPROVE SUBMISSION
   ========================================================= */

function approveEverJoySubmission(
    submissionId
) {

    if (!submissionId) {

        return false;

    }


    const queue =
        getEverJoyModerationQueue();


    const submissionIndex =
        queue.findIndex(
            item =>
                item &&
                item.id ===
                submissionId
        );


    if (
        submissionIndex === -1
    ) {

        return false;

    }


    queue[
        submissionIndex
    ].status =
        "approved";


    queue[
        submissionIndex
    ].reviewedAt =
        new Date().toISOString();


    const saved =
        saveEverJoyModerationQueue(
            queue
        );


    if (!saved) {

        return false;

    }


    renderEverJoyModerationPage();


    return true;

}


/* =========================================================
   9. REJECT SUBMISSION
   ========================================================= */

function rejectEverJoySubmission(
    submissionId
) {

    if (!submissionId) {

        return false;

    }


    const queue =
        getEverJoyModerationQueue();


    const submissionIndex =
        queue.findIndex(
            item =>
                item &&
                item.id ===
                submissionId
        );


    if (
        submissionIndex === -1
    ) {

        return false;

    }


    queue[
        submissionIndex
    ].status =
        "rejected";


    queue[
        submissionIndex
    ].reviewedAt =
        new Date().toISOString();


    const saved =
        saveEverJoyModerationQueue(
            queue
        );


    if (!saved) {

        return false;

    }


    renderEverJoyModerationPage();


    return true;

}


/* =========================================================
   10. CREATE MODERATION CARD
   ========================================================= */

function createEverJoyModerationCard(
    submission
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "moderation-content-card";


    card.dataset.id =
        submission.id || "";


    const title =
        submission.title ||
        "Untitled Comic";


    const creator =
        submission.creatorName ||
        submission.author ||
        "Unknown Creator";


    const format =
        submission.format ||
        "Comic";


    const submittedAt =
        formatEverJoyModerationDate(
            submission.submittedAt
        );


    const description =
        submission.description ||
        "No description provided.";


    const cover =
        submission.cover ||
        "../assets/images/comic-placeholder.jpg";


    card.innerHTML = `

        <div class="moderation-card-cover">

            <img
                src="${cover}"
                alt="${title}"
            >

        </div>


        <div class="moderation-card-content">

            <div class="moderation-card-top">

                <span class="moderation-card-format">
                    ${format}
                </span>

                <span class="moderation-card-status">
                    Pending
                </span>

            </div>


            <h3>
                ${title}
            </h3>


            <p class="moderation-card-creator">
                By ${creator}
            </p>


            <p class="moderation-card-description">
                ${description}
            </p>


            <span class="moderation-card-date">
                Submitted ${submittedAt}
            </span>


            <div class="moderation-card-actions">

                <button
                    type="button"
                    class="moderation-approve-btn"
                    data-action="approve"
                    data-id="${submission.id}"
                >
                    Approve
                </button>


                <button
                    type="button"
                    class="moderation-reject-btn"
                    data-action="reject"
                    data-id="${submission.id}"
                >
                    Reject
                </button>

            </div>

        </div>

    `;


    return card;

}


/* =========================================================
   11. RENDER MODERATION PAGE
   ========================================================= */

function renderEverJoyModerationPage() {

    const container =
        document.getElementById(
            "moderationContentList"
        );


    if (!container) {

        return;

    }


    const pending =
        getEverJoyPendingSubmissions();


    container.innerHTML = "";


    if (
        pending.length === 0
    ) {

        container.innerHTML = `

            <div class="moderation-empty-state">

                <span class="moderation-empty-icon">
                    ◌
                </span>


                <strong>
                    No pending submissions
                </strong>


                <span>
                    New creator submissions will appear here
                    when they are ready for review.
                </span>

            </div>

        `;


        updateEverJoyModerationCounts();

        return;

    }


    pending.forEach(
        submission => {

            const card =
                createEverJoyModerationCard(
                    submission
                );


            container.appendChild(
                card
            );

        }
    );


    updateEverJoyModerationCounts();

}


/* =========================================================
   12. UPDATE COUNTS
   ========================================================= */

function updateEverJoyModerationCounts() {

    const pendingCount =
        getEverJoyPendingSubmissions()
            .length;


    const approvedCount =
        getEverJoyApprovedSubmissions()
            .length;


    const rejectedCount =
        getEverJoyRejectedSubmissions()
            .length;


    const pendingElement =
        document.getElementById(
            "moderationPendingCount"
        );


    const approvedElement =
        document.getElementById(
            "moderationApprovedCount"
        );


    const rejectedElement =
        document.getElementById(
            "moderationRejectedCount"
        );


    if (pendingElement) {

        pendingElement.textContent =
            pendingCount;

    }


    if (approvedElement) {

        approvedElement.textContent =
            approvedCount;

    }


    if (rejectedElement) {

        rejectedElement.textContent =
            rejectedCount;

    }

}


/* =========================================================
   13. SEARCH
   ========================================================= */

function filterEverJoyModeration(
    searchTerm
) {

    const cards =
        document.querySelectorAll(
            ".moderation-content-card"
        );


    const normalizedSearch =
        String(
            searchTerm || ""
        )
        .trim()
        .toLowerCase();


    cards.forEach(
        card => {

            const text =
                card.textContent
                    .toLowerCase();


            card.style.display =
                text.includes(
                    normalizedSearch
                )
                    ? ""
                    : "none";

        }
    );

}


/* =========================================================
   14. ACTION HANDLER
   ========================================================= */

function handleEverJoyModerationAction(
    event
) {

    const button =
        event.target.closest(
            "[data-action]"
        );


    if (!button) {

        return;

    }


    const action =
        button.dataset.action;


    const submissionId =
        button.dataset.id;


    if (
        !submissionId
    ) {

        return;

    }


    if (
        action === "approve"
    ) {

        const confirmed =
            confirm(
                "Approve this submission?"
            );


        if (confirmed) {

            approveEverJoySubmission(
                submissionId
            );

        }

    }


    if (
        action === "reject"
    ) {

        const confirmed =
            confirm(
                "Reject this submission?"
            );


        if (confirmed) {

            rejectEverJoySubmission(
                submissionId
            );

        }

    }

}


/* =========================================================
   15. CONNECT EVENTS
   ========================================================= */

function setupEverJoyModerationEvents() {

    const container =
        document.getElementById(
            "moderationContentList"
        );


    if (container) {

        container.addEventListener(
            "click",
            handleEverJoyModerationAction
        );

    }


    const searchInput =
        document.getElementById(
            "moderationSearch"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function() {

                filterEverJoyModeration(
                    this.value
                );

            }
        );

    }


    const refreshButton =
        document.getElementById(
            "moderationRefreshBtn"
        );


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            function() {

                renderEverJoyModerationPage();

            }
        );

    }

}


/* =========================================================
   16. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupEverJoyModerationEvents();

        renderEverJoyModerationPage();

    }
);