/* =========================================================
   EVER JOY COMICS
   SECURITY SYSTEM
   ========================================================= */

/*
   This file handles reader-side protection only.

   It is designed to:
   - Protect the reader interface
   - Discourage casual saving/copying
   - Disable common image interactions
   - Add a subtle dynamic watermark
   - Blur the reader when the page loses visibility/focus
   - Detect suspiciously rapid reading activity

   IMPORTANT:
   Browser-side protection is deterrence.
   Real content protection will later be handled
   by Firebase Storage rules and server-side controls.
*/


/* =========================================================
   1. SECURITY STATE
   ========================================================= */

let everJoySecurityConfig = null;

let everJoySecurityLoaded = false;


/* =========================================================
   2. INITIALIZE SECURITY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEverJoySecurity();

    }
);


async function initializeEverJoySecurity() {

    /*
        Only activate reader protection
        on actual reader pages.
    */

    if (
        !document.body.classList.contains(
            "reader-body"
        )
    ) {

        return;

    }


    await loadSecurityConfig();


    if (
        !everJoySecurityLoaded
    ) {

        return;

    }


    initializeReaderProtection();

}


/* =========================================================
   3. LOAD SECURITY CONFIG
   ========================================================= */

async function loadSecurityConfig() {

    try {

        const response =
            await fetch(
                "../security/security-config.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Security configuration failed: ${response.status}`
            );

        }


        everJoySecurityConfig =
            await response.json();


        everJoySecurityLoaded =
            true;


    } catch (error) {

        console.error(
            "Ever Joy Security: Could not load security configuration.",
            error
        );

    }

}


/* =========================================================
   4. INITIALIZE READER PROTECTION
   ========================================================= */

function initializeReaderProtection() {

    const config =
        everJoySecurityConfig;


    if (
        !config ||
        !config.readerProtection ||
        config.readerProtection.enabled !== true
    ) {

        return;

    }


    const interaction =
        config.readerProtection
            .interactionProtection;


    const screen =
        config.readerProtection
            .screenProtection;


    const watermark =
        config.readerProtection
            .watermark;


    const scraping =
        config.readerProtection
            .scrapingProtection;


    /*
        Interaction protection.
    */

    if (interaction) {

        if (
            interaction.disableContextMenu
        ) {

            disableReaderContextMenu();

        }


        if (
            interaction.disableImageDragging
        ) {

            disableReaderImageDragging();

        }


        if (
            interaction.disableTextSelection
        ) {

            disableReaderTextSelection();

        }


        if (
            interaction.disableCopy
        ) {

            disableReaderCopy();

        }


        if (
            interaction.disableImageSaving
        ) {

            disableReaderImageSaving();

        }

    }


    /*
        Screen/visibility protection.
    */

    if (
        screen &&
        screen.enabled
    ) {

        initializeReaderScreenProtection(
            screen
        );

    }


    /*
        Watermark.
    */

    if (
        watermark &&
        watermark.enabled
    ) {

        initializeReaderWatermark(
            watermark
        );

    }


    /*
        Scraping detection.
    */

    if (
        scraping &&
        scraping.enabled
    ) {

        initializeReaderScrapingProtection(
            scraping
        );

    }

}


/* =========================================================
   5. DISABLE CONTEXT MENU
   ========================================================= */

function disableReaderContextMenu() {

    document.addEventListener(
        "contextmenu",
        event => {

            if (
                event.target.closest(
                    ".reader-container"
                )
            ) {

                event.preventDefault();

            }

        }
    );

}


/* =========================================================
   6. DISABLE IMAGE DRAGGING
   ========================================================= */

function disableReaderImageDragging() {

    document.addEventListener(
        "dragstart",
        event => {

            if (
                event.target.closest(
                    ".reader-container"
                ) &&
                event.target.tagName === "IMG"
            ) {

                event.preventDefault();

            }

        }
    );

}


/* =========================================================
   7. DISABLE TEXT SELECTION
   ========================================================= */

function disableReaderTextSelection() {

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "ever-joy-reader-selection-protection";


    style.textContent = `

        .reader-body .reader-container,
        .reader-body .reader-container * {

            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   8. DISABLE COPY
   ========================================================= */

function disableReaderCopy() {

    document.addEventListener(
        "copy",
        event => {

            if (
                event.target.closest(
                    ".reader-container"
                )
            ) {

                event.preventDefault();

            }

        }
    );

}


/* =========================================================
   9. DISABLE IMAGE SAVING
   ========================================================= */

function disableReaderImageSaving() {

    document.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.tagName === "IMG" &&
                event.target.closest(
                    ".reader-container"
                )
            ) {

                event.target.setAttribute(
                    "draggable",
                    "false"
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   10. SCREEN / VISIBILITY PROTECTION
   ========================================================= */

function initializeReaderScreenProtection(
    config
) {

    /*
        Blur when the reader tab becomes
        hidden or the browser window loses
        focus.

        This is deterrence only. Browsers do
        not give websites reliable access to
        operating-system screenshot events.
    */

    const reader =
        document.querySelector(
            "#readerContainer"
        );


    if (!reader) {

        return;

    }


    function applyBlur() {

        reader.classList.add(
            "reader-security-blur"
        );

    }


    function removeBlur() {

        reader.classList.remove(
            "reader-security-blur"
        );

    }


    if (
        config.blurOnVisibilityLoss
    ) {

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    applyBlur();

                }
                else {

                    removeBlur();

                }

            }
        );

    }


    if (
        config.blurOnWindowBlur
    ) {

        window.addEventListener(
            "blur",
            applyBlur
        );


        window.addEventListener(
            "focus",
            removeBlur
        );

    }

}


/* =========================================================
   11. READER WATERMARK
   ========================================================= */

function initializeReaderWatermark(
    config
) {

    const container =
        document.querySelector(
            "#readerContainer"
        );


    if (!container) {

        return;

    }


    /*
        Prevent duplicate watermark.
    */

    if (
        document.querySelector(
            ".ever-joy-security-watermark"
        )
    ) {

        return;

    }


    const watermark =
        document.createElement(
            "div"
        );


    watermark.className =
        "ever-joy-security-watermark";


    watermark.setAttribute(
        "aria-hidden",
        "true"
    );


    watermark.textContent =
        "EVER JOY COMICS";


    watermark.style.opacity =
        config.opacity !== undefined
            ? config.opacity
            : 0.12;


    container.appendChild(
        watermark
    );


    /*
        Dynamic movement makes it harder
        to simply crop a watermark away.
    */

    if (
        config.dynamic
    ) {

        startDynamicReaderWatermark(
            watermark
        );

    }

}


/* =========================================================
   12. DYNAMIC WATERMARK
   ========================================================= */

function startDynamicReaderWatermark(
    watermark
) {

    let position = 0;


    const positions = [

        {
            top: "18%",
            left: "20%",
            transform:
                "rotate(-18deg)"
        },

        {
            top: "42%",
            left: "62%",
            transform:
                "rotate(12deg)"
        },

        {
            top: "68%",
            left: "30%",
            transform:
                "rotate(-10deg)"
        },

        {
            top: "82%",
            left: "72%",
            transform:
                "rotate(15deg)"
        }

    ];


    function moveWatermark() {

        const current =
            positions[
                position
            ];


        watermark.style.top =
            current.top;


        watermark.style.left =
            current.left;


        watermark.style.transform =
            current.transform;


        position =
            (
                position + 1
            )
            %
            positions.length;

    }


    moveWatermark();


    setInterval(
        moveWatermark,
        12000
    );

}


/* =========================================================
   13. SCRAPING PROTECTION
   ========================================================= */

function initializeReaderScrapingProtection(
    config
) {

    /*
        This is deliberately lightweight for now.

        Firebase/server-side protection will later
        become the authoritative anti-scraping layer.
    */

    let pageRequests =
        0;


    let requestWindowStart =
        Date.now();


    const requestWindow =
        10000;


    const maximumRequests =
        25;


    function registerPageActivity() {

        const now =
            Date.now();


        if (
            now -
            requestWindowStart
            >
            requestWindow
        ) {

            pageRequests =
                0;


            requestWindowStart =
                now;

        }


        pageRequests++;


        if (
            pageRequests >
            maximumRequests
        ) {

            flagSuspiciousReaderActivity();

        }

    }


    /*
        Watch pages entering the reader.
    */

    const pages =
        document.querySelector(
            "#comicPages"
        );


    if (!pages) {

        return;

    }


    const observer =
        new MutationObserver(
            mutations => {

                mutations.forEach(
                    mutation => {

                        mutation.addedNodes
                            .forEach(
                                node => {

                                    if (
                                        node.nodeType === 1 &&
                                        node.tagName === "IMG"
                                    ) {

                                        registerPageActivity();

                                    }

                                }
                            );

                    }
                );

            }
        );


    observer.observe(
        pages,
        {
            childList: true
        }
    );

}


/* =========================================================
   14. FLAG SUSPICIOUS ACTIVITY
   ========================================================= */

function flagSuspiciousReaderActivity() {

    /*
        We do NOT ban the user here.

        This is only a signal.

        Later this can send an event to
        Firebase/Cloud Functions for proper
        server-side analysis.
    */

    console.warn(
        "Ever Joy Security: Suspicious reader activity detected."
    );


    document.body.dataset.securityFlag =
        "suspicious-reader-activity";

}


/* =========================================================
   15. SECURITY STATUS
   ========================================================= */

function isEverJoyReaderSecurityEnabled() {

    return Boolean(

        everJoySecurityConfig &&

        everJoySecurityConfig.readerProtection &&

        everJoySecurityConfig.readerProtection.enabled === true

    );

}
/* =========================================================
   EVER JOY COMICS
   SECURITY CONFIGURATION
   Loads security-config.json and makes the
   settings available to the security system.
   ========================================================= */

let everJoySecurityConfig = null;


/* =========================================================
   LOAD SECURITY CONFIG
   ========================================================= */

async function loadEverJoySecurityConfig() {

    try {

        const response =
            await fetch(
                "../security/security-config.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Security config failed to load: ${response.status}`
            );

        }


        everJoySecurityConfig =
            await response.json();


        console.log(
            "Ever Joy: Security configuration loaded."
        );


        return everJoySecurityConfig;


    } catch (error) {

        console.error(
            "Ever Joy: Could not load security configuration.",
            error
        );


        /*
            Safe fallback.

            The system remains available even if
            the configuration file cannot be loaded.
        */

        everJoySecurityConfig = {

            contentModeration: {

                enabled: true,

                statuses: [
                    "pending",
                    "under_review",
                    "confirmed",
                    "cleared",
                    "rejected"
                ],

                flagReasons: [
                    "suspected_ai_generated",
                    "copyright_concern",
                    "stolen_content",
                    "unauthorized_upload",
                    "inappropriate_content",
                    "misleading_content",
                    "other"
                ],

                defaultStatus: "pending",

                requireManualReview: true

            },

            assetProtection: {
                enabled: true
            },

            contentProtection: {
                enabled: true
            },

            watermark: {
                enabled: true
            }

        };


        return everJoySecurityConfig;

    }

}


/* =========================================================
   SECURITY CONFIG HELPERS
   ========================================================= */

function getEverJoySecurityConfig() {

    return everJoySecurityConfig;

}


/* =========================================================
   CHECK MODERATION STATUS
   ========================================================= */

function isValidModerationStatus(
    status
) {

    if (
        !everJoySecurityConfig ||
        !everJoySecurityConfig.contentModeration
    ) {

        return false;

    }


    return everJoySecurityConfig
        .contentModeration
        .statuses
        .includes(status);

}


/* =========================================================
   CHECK FLAG REASON
   ========================================================= */

function isValidFlagReason(
    reason
) {

    if (
        !everJoySecurityConfig ||
        !everJoySecurityConfig.contentModeration
    ) {

        return false;

    }


    return everJoySecurityConfig
        .contentModeration
        .flagReasons
        .includes(reason);

}


/* =========================================================
   CREATE LOCAL MODERATION RECORD
   ---------------------------------------------------------
   TEMPORARY PRE-FIREBASE STRUCTURE.

   This does NOT store reports permanently.
   Firebase will replace this later.
   ========================================================= */

function createPendingModerationRecord(
    contentId,
    contentType,
    reason
) {

    if (
        !everJoySecurityConfig ||
        !everJoySecurityConfig.contentModeration ||
        !everJoySecurityConfig.contentModeration.enabled
    ) {

        return null;

    }


    if (
        !isValidFlagReason(reason)
    ) {

        console.warn(
            "Ever Joy: Invalid moderation reason.",
            reason
        );

        return null;

    }


    return {

        id:
            `moderation_${Date.now()}`,

        contentId:
            contentId,

        contentType:
            contentType,

        reason:
            reason,

        status:
            everJoySecurityConfig
                .contentModeration
                .defaultStatus,

        createdAt:
            new Date().toISOString(),

        requiresManualReview:
            everJoySecurityConfig
                .contentModeration
                .requireManualReview === true

    };

}


/* =========================================================
   INITIALIZE SECURITY CONFIG
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadEverJoySecurityConfig();

    }
);