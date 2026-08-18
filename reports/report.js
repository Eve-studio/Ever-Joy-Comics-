/* =========================================================
   EVER JOY COMICS
   CENTRALIZED REPORT SYSTEM
   report.js
   ========================================================= */


/* =========================================================
   1. REPORT CATEGORIES
   ========================================================= */

const reportCategories = {

    copyright: {
        title: "Copyright / Ownership",
        icon: "©",
        description: "Report ownership or copyright concerns.",

        subcategories: [
            "I own this work and believe it was used without permission.",
            "This work appears to contain copyrighted material.",
            "Someone is claiming ownership of my work.",
            "Unauthorized use of artwork, writing, characters, or assets.",
            "Other copyright or ownership concern."
        ]
    },


    plagiarism: {
        title: "Plagiarism / Stolen Work",
        icon: "⚠",
        description: "Report copied, stolen, or reposted work.",

        subcategories: [
            "This work appears to be copied from another creator.",
            "My work has been reposted without permission.",
            "The creator appears to be impersonating another creator.",
            "Artwork or other creative material appears to have been stolen.",
            "Other plagiarism concern."
        ]
    },


    ai: {
        title: "AI-Generated Content",
        icon: "✦",
        description: "Flag suspected undisclosed AI-generated content.",

        subcategories: [
            "The work appears to be AI-generated.",
            "The creator appears to be presenting AI-generated work as entirely human-created.",
            "The artwork appears to contain AI-generated elements.",
            "The content may violate Ever Joy's AI-content rules.",
            "Other AI-content concern."
        ]
    },


    inappropriate: {
        title: "Inappropriate Content",
        icon: "!",
        description: "Report content that may violate content rules.",

        subcategories: [
            "Sexual or explicit content.",
            "Graphic violence or disturbing content.",
            "Hateful or discriminatory content.",
            "Content involving minors in inappropriate situations.",
            "Other inappropriate content."
        ]
    },


    harassment: {
        title: "Harassment / Bullying",
        icon: "◉",
        description: "Report abusive or threatening behaviour.",

        subcategories: [
            "Harassment or targeted abuse.",
            "Bullying.",
            "Threats or intimidation.",
            "Hateful or discriminatory behaviour.",
            "Repeated unwanted behaviour."
        ]
    },


    scam: {
        title: "Scam / Fraud",
        icon: "₦",
        description: "Report suspicious or fraudulent activity.",

        subcategories: [
            "Someone is attempting to scam users.",
            "Fake payment or reward claim.",
            "Fraudulent creator or account.",
            "Suspicious external links or requests.",
            "Other fraudulent activity."
        ]
    },


    spam: {
        title: "Spam",
        icon: "✉",
        description: "Report repetitive or unwanted content.",

        subcategories: [
            "Repeated promotional content.",
            "Spam comments.",
            "Mass or automated activity.",
            "Unwanted advertisements.",
            "Other spam."
        ]
    },


    privacy: {
        title: "Privacy",
        icon: "⌾",
        description: "Report exposure or misuse of personal information.",

        subcategories: [
            "Personal information was shared without permission.",
            "Private information appears in published content.",
            "Someone is impersonating me.",
            "Unauthorized use of personal information.",
            "Other privacy concern."
        ]
    },


    security: {
        title: "Security",
        icon: "◆",
        description: "Report suspicious account or platform activity.",

        subcategories: [
            "Suspicious account activity.",
            "Someone may have accessed an account without permission.",
            "Suspicious links or files.",
            "Possible security vulnerability.",
            "Other security concern."
        ]
    },


    payment: {
        title: "Payment / Gems",
        icon: "◇",
        description: "Report issues involving purchases or gems.",

        subcategories: [
            "Gems were not received after payment.",
            "Incorrect gem balance.",
            "Purchase problem.",
            "Refund or payment issue.",
            "Other payment concern."
        ]
    },


    technical: {
        title: "Bug / Technical Problem",
        icon: "⚙",
        description: "Tell us about something that is not working correctly.",

        subcategories: [
            "A page is not loading correctly.",
            "A button or feature does not work.",
            "Reading or chapter problem.",
            "Images, audio, or other media are not loading.",
            "Other technical problem."
        ]
    },


    other: {
        title: "Other",
        icon: "⋯",
        description: "Report an issue that does not fit another category.",

        subcategories: [
            "General platform concern.",
            "Creator-related concern.",
            "Reader-related concern.",
            "Content-related concern.",
            "Something else."
        ]
    }

};


/* =========================================================
   2. ELEMENTS
   ========================================================= */

const reportForm =
    document.getElementById("reportForm");

const reportBackButton =
    document.getElementById("reportBackButton");

const reportCategoryGrid =
    document.getElementById("reportCategoryGrid");

const reportType =
    document.getElementById("reportType");

const reportSubcategoryStep =
    document.getElementById("reportSubcategoryStep");

const reportSubcategoryList =
    document.getElementById("reportSubcategoryList");

const reportSubType =
    document.getElementById("reportSubType");

const reportTargetStep =
    document.getElementById("reportTargetStep");

const reportDescriptionStep =
    document.getElementById("reportDescriptionStep");

const reportEvidenceStep =
    document.getElementById("reportEvidenceStep");

const reportContactStep =
    document.getElementById("reportContactStep");

const reportConfirmationStep =
    document.getElementById("reportConfirmationStep");

const reportSubmitSection =
    document.getElementById("reportSubmitSection");

const reportDescription =
    document.getElementById("reportDescription");

const reportCharacterCount =
    document.getElementById("reportCharacterCount");

const reportFormError =
    document.getElementById("reportFormError");

const reportConfirmation =
    document.getElementById("reportConfirmation");

const reportSuccess =
    document.getElementById("reportSuccess");


/* =========================================================
   3. CURRENT STATE
   ========================================================= */

let selectedCategory = "";

let selectedSubcategory = "";


/* =========================================================
   4. BACK BUTTON
   ========================================================= */

if (reportBackButton) {

    reportBackButton.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "../index.html";

            }

        }
    );

}


/* =========================================================
   5. CREATE CATEGORY CARDS
   ========================================================= */

function renderCategories() {

    if (!reportCategoryGrid) {
        return;
    }


    reportCategoryGrid.innerHTML = "";


    Object.entries(reportCategories)
        .forEach(
            ([key, category]) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "report-category-card";

                button.dataset.category =
                    key;


                button.innerHTML = `

                    <span
                        class="report-category-icon"
                        aria-hidden="true"
                    >
                        ${category.icon}
                    </span>

                    <span
                        class="report-category-title"
                    >
                        ${category.title}
                    </span>

                    <span
                        class="report-category-description"
                    >
                        ${category.description}
                    </span>

                `;


                button.addEventListener(
                    "click",
                    () => {

                        selectCategory(
                            key,
                            button
                        );

                    }
                );


                reportCategoryGrid.appendChild(
                    button
                );

            }
        );

}


/* =========================================================
   6. SELECT CATEGORY
   ========================================================= */

function selectCategory(
    categoryKey,
    clickedButton
) {

    const category =
        reportCategories[categoryKey];


    if (!category) {
        return;
    }


    selectedCategory =
        categoryKey;

    selectedSubcategory =
        "";


    reportType.value =
        categoryKey;

    reportSubType.value =
        "";


    document
        .querySelectorAll(
            ".report-category-card"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    clickedButton.classList.add(
        "active"
    );


    renderSubcategories(
        category.subcategories
    );


    showSection(
        reportSubcategoryStep
    );


    hideSection(
        reportTargetStep
    );

    hideSection(
        reportDescriptionStep
    );

    hideSection(
        reportEvidenceStep
    );

    hideSection(
        reportContactStep
    );

    hideSection(
        reportConfirmationStep
    );

    hideSection(
        reportSubmitSection
    );


    scrollToSection(
        reportSubcategoryStep
    );

}


/* =========================================================
   7. RENDER SUBCATEGORIES
   ========================================================= */

function renderSubcategories(
    subcategories
) {

    if (!reportSubcategoryList) {
        return;
    }


    reportSubcategoryList.innerHTML = "";


    subcategories.forEach(
        (subcategory, index) => {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "report-subcategory-option";


            button.dataset.index =
                index;


            button.textContent =
                subcategory;


            button.addEventListener(
                "click",
                () => {

                    selectSubcategory(
                        subcategory,
                        button
                    );

                }
            );


            reportSubcategoryList.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   8. SELECT SUBCATEGORY
   ========================================================= */

function selectSubcategory(
    subcategory,
    clickedButton
) {

    selectedSubcategory =
        subcategory;


    reportSubType.value =
        subcategory;


    document
        .querySelectorAll(
            ".report-subcategory-option"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );


    clickedButton.classList.add(
        "active"
    );


    showSection(
        reportTargetStep
    );


    showSection(
        reportDescriptionStep
    );


    showSection(
        reportEvidenceStep
    );


    showSection(
        reportContactStep
    );


    showSection(
        reportConfirmationStep
    );


    showSection(
        reportSubmitSection
    );


    scrollToSection(
        reportTargetStep
    );

}


/* =========================================================
   9. SECTION HELPERS
   ========================================================= */

function showSection(element) {

    if (!element) {
        return;
    }

    element.hidden = false;

}


function hideSection(element) {

    if (!element) {
        return;
    }

    element.hidden = true;

}


/* =========================================================
   10. SCROLL
   ========================================================= */

function scrollToSection(
    element
) {

    if (!element) {
        return;
    }


    setTimeout(
        () => {

            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        80
    );

}


/* =========================================================
   11. DESCRIPTION CHARACTER COUNT
   ========================================================= */

if (
    reportDescription &&
    reportCharacterCount
) {

    reportDescription.addEventListener(
        "input",
        () => {

            const length =
                reportDescription.value.length;


            reportCharacterCount.textContent =
                `${length} / 3000`;

        }
    );

}


/* =========================================================
   12. ERROR MESSAGE
   ========================================================= */

function showError(
    message
) {

    if (!reportFormError) {
        return;
    }


    reportFormError.textContent =
        message;


    reportFormError.hidden =
        false;


    reportFormError.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function clearError() {

    if (!reportFormError) {
        return;
    }


    reportFormError.textContent =
        "";

    reportFormError.hidden =
        true;

}


/* =========================================================
   13. VALIDATE FORM
   ========================================================= */

function validateReport() {

    clearError();


    if (!selectedCategory) {

        showError(
            "Please select a report category."
        );

        return false;

    }


    if (!selectedSubcategory) {

        showError(
            "Please select the issue that best describes your report."
        );

        return false;

    }


    const targetType =
        document.getElementById(
            "reportTargetType"
        );


    const targetId =
        document.getElementById(
            "reportTargetId"
        );


    if (
        !targetType ||
        !targetType.value
    ) {

        showError(
            "Please select what you are reporting."
        );

        return false;

    }


    if (
        !targetId ||
        !targetId.value.trim()
    ) {

        showError(
            "Please provide the relevant link or ID."
        );

        return false;

    }


    if (
        !reportDescription ||
        reportDescription.value.trim().length < 10
    ) {

        showError(
            "Please provide a little more detail about the issue."
        );

        return false;

    }


    if (
        reportDescription.value.length >
        3000
    ) {

        showError(
            "Your description is too long."
        );

        return false;

    }


    const email =
        document.getElementById(
            "reportEmail"
        );


    if (
        email &&
        email.value.trim()
    ) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                email.value.trim()
            )
        ) {

            showError(
                "Please enter a valid email address."
            );

            return false;

        }

    }


    if (
        !reportConfirmation ||
        !reportConfirmation.checked
    ) {

        showError(
            "Please confirm that the information provided is accurate."
        );

        return false;

    }


    return true;

}


/* =========================================================
   14. FORM SUBMISSION
   ========================================================= */

if (reportForm) {

    reportForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!validateReport()) {
                return;
            }


            const submitButton =
                document.getElementById(
                    "reportSubmitButton"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            /*
                TEMPORARY LOCAL SUBMISSION

                Firebase will replace this section later.

                We deliberately do NOT use localStorage
                for permanent report storage.
            */

            const reportData = {

                category:
                    selectedCategory,

                categoryName:
                    reportCategories[
                        selectedCategory
                    ].title,

                issue:
                    selectedSubcategory,

                targetType:
                    document.getElementById(
                        "reportTargetType"
                    )?.value || "",

                targetId:
                    document.getElementById(
                        "reportTargetId"
                    )?.value.trim() || "",

                description:
                    reportDescription?.value.trim() || "",

                evidence:
                    document.getElementById(
                        "reportEvidence"
                    )?.value.trim() || "",

                email:
                    document.getElementById(
                        "reportEmail"
                    )?.value.trim() || "",

                createdAt:
                    new Date().toISOString()

            };


            console.log(
                "Ever Joy Report:",
                reportData
            );


            /*
                Simulate submission until Firebase
                is integrated.
            */

            setTimeout(
                () => {

                    if (reportForm) {

                        reportForm.hidden =
                            true;

                    }


                    if (reportSuccess) {

                        reportSuccess.hidden =
                            false;

                        reportSuccess.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                },
                700
            );

        }
    );

}


/* =========================================================
   15. CLEAR / RESET WHEN PAGE LOADS
   ========================================================= */

function resetReportForm() {

    selectedCategory = "";

    selectedSubcategory = "";


    if (reportForm) {
        reportForm.reset();
    }


    if (reportType) {
        reportType.value = "";
    }


    if (reportSubType) {
        reportSubType.value = "";
    }


    hideSection(
        reportSubcategoryStep
    );

    hideSection(
        reportTargetStep
    );

    hideSection(
        reportDescriptionStep
    );

    hideSection(
        reportEvidenceStep
    );

    hideSection(
        reportContactStep
    );

    hideSection(
        reportConfirmationStep
    );

    hideSection(
        reportSubmitSection
    );


    if (reportSuccess) {
        reportSuccess.hidden = true;
    }


    if (reportForm) {
        reportForm.hidden = false;
    }


    clearError();

}


resetReportForm();


/* =========================================================
   16. CONTEXTUAL REPORT SUPPORT
   =========================================================

   Later, other parts of Ever Joy can open:

   report.html?type=comic&id=123

   or:

   report.html?type=creator&id=456

   or:

   report.html?type=comment&id=789

   Firebase will eventually use these values to connect
   the report to the exact item being reported.
   ========================================================= */

function loadReportContext() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const type =
        params.get("type");

    const id =
        params.get("id");


    if (!type && !id) {
        return;
    }


    const targetType =
        document.getElementById(
            "reportTargetType"
        );


    const targetId =
        document.getElementById(
            "reportTargetId"
        );


    if (targetType && type) {

        const allowedTypes = [
            "comic",
            "chapter",
            "creator",
            "comment",
            "review",
            "account",
            "other"
        ];


        if (
            allowedTypes.includes(type)
        ) {

            targetType.value =
                type;

        }

    }


    if (targetId && id) {

        targetId.value =
            id;

    }

}


loadReportContext();


/* =========================================================
   17. KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            reportFormError &&
            !reportFormError.hidden
        ) {

            clearError();

        }

    }
);