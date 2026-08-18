/* =========================================================
   EVER JOY COMICS
   CONTENT PROTECTION SYSTEM

   Handles:
   - Reader protection
   - Image protection
   - Copy prevention
   - Drag prevention
   - Context-menu prevention
   - Print prevention
   - Dynamic watermark
   - Suspicious reading behaviour hooks

   NOTE:
   Browser-side protection is a deterrent, not absolute
   DRM. Real access control will be enforced with Firebase
   Storage / authentication rules later.
   ========================================================= */


/* =========================================================
   1. CONTENT PROTECTION STATE
   ========================================================= */

let everJoyProtectionConfig = null;

let everJoyProtectionReady = false;


/* =========================================================
   2. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeContentProtection();

    }
);


async function initializeContentProtection() {

    await loadContentProtectionConfig();

    if (!everJoyProtectionConfig) {

        console.warn(
            "Ever Joy: Content protection configuration could not be loaded."
        );

        return;

    }


    if (
        everJoyProtectionConfig.contentProtection?.enabled
        !==
        true
    ) {

        console.info(
            "Ever Joy: Content protection is disabled."
        );

        return;

    }


    applyReaderProtection();

    applyImageProtection();

    applyCopyProtection();

    applyPrintProtection();

    setupProtectionWatermark();

    setupSuspiciousActivityDetection();


    everJoyProtectionReady =
        true;


    console.info(
        "Ever Joy: Content protection initialized."
    );

}


/* =========================================================
   3. LOAD CONFIGURATION
   ========================================================= */

async function loadContentProtectionConfig() {

    try {

        const response =
            await fetch(
                "../security/content-protection.json"
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        everJoyProtectionConfig =
            await response.json();


    } catch (error) {

        console.error(
            "Ever Joy: Failed to load content protection configuration.",
            error
        );

    }

}


/* =========================================================
   4. READER PROTECTION
   ========================================================= */

function applyReaderProtection() {

    const reader =
        document.querySelector(
            ".reader-body"
        );


    if (!reader) {

        return;

    }


    const settings =
        everJoyProtectionConfig
            ?.contentProtection
            ?.reader;


    if (!settings) {

        return;

    }


    if (
        settings.allowContextMenu
        ===
        false
    ) {

        reader.addEventListener(
            "contextmenu",
            preventProtectionAction
        );

    }


    if (
        settings.allowCopy
        ===
        false
    ) {

        reader.addEventListener(
            "copy",
            preventProtectionAction
        );


        reader.addEventListener(
            "cut",
            preventProtectionAction
        );


        reader.addEventListener(
            "selectstart",
            preventProtectionAction
        );

    }


    if (
        settings.allowImageDragging
        ===
        false
    ) {

        reader.addEventListener(
            "dragstart",
            event => {

                if (
                    event.target
                    &&
                    event.target.tagName
                    ===
                    "IMG"
                ) {

                    event.preventDefault();

                }

            }
        );

    }

}


/* =========================================================
   5. IMAGE PROTECTION
   ========================================================= */

function applyImageProtection() {

    const settings =
        everJoyProtectionConfig
            ?.contentProtection
            ?.images;


    if (!settings) {

        return;

    }


    if (
        settings.disableDragging
        !==
        true
    ) {

        return;

    }


    protectReaderImages();


    /*
        The reader creates its images
        dynamically, so watch for new
        pages being inserted.
    */

    const pageContainer =
        document.querySelector(
            "#comicPages"
        );


    if (!pageContainer) {

        return;

    }


    const observer =
        new MutationObserver(
            () => {

                protectReaderImages();

            }
        );


    observer.observe(
        pageContainer,
        {
            childList: true,
            subtree: true
        }
    );

}


/* =========================================================
   6. PROTECT READER IMAGES
   ========================================================= */

function protectReaderImages() {

    const images =
        document.querySelectorAll(
            "#comicPages img"
        );


    images.forEach(
        image => {

            image.draggable =
                false;


            image.setAttribute(
                "draggable",
                "false"
            );


            image.addEventListener(
                "dragstart",
                preventProtectionAction
            );


            image.addEventListener(
                "contextmenu",
                preventProtectionAction
            );

        }
    );

}


/* =========================================================
   7. COPY PROTECTION
   ========================================================= */

function applyCopyProtection() {

    const settings =
        everJoyProtectionConfig
            ?.contentProtection
            ?.reader;


    if (!settings) {

        return;

    }


    if (
        settings.allowCopy
        !==
        false
    ) {

        return;

    }


    document.addEventListener(
        "copy",
        preventProtectionAction
    );


    document.addEventListener(
        "cut",
        preventProtectionAction
    );


    document.addEventListener(
        "selectstart",
        preventProtectionAction
    );

}


/* =========================================================
   8. PRINT PROTECTION
   ========================================================= */

function applyPrintProtection() {

    const settings =
        everJoyProtectionConfig
            ?.contentProtection
            ?.reader;


    if (!settings) {

        return;

    }


    if (
        settings.allowPrint
        !==
        false
    ) {

        return;

    }


    window.addEventListener(
        "beforeprint",
        () => {

            document.body.classList.add(
                "everjoy-print-blocked"
            );

        }
    );


    window.addEventListener(
        "afterprint",
        () => {

            document.body.classList.remove(
                "everjoy-print-blocked"
            );

        }
    );

}


/* =========================================================
   9. GENERAL PROTECTION ACTION
   ========================================================= */

function preventProtectionAction(
    event
) {

    if (event) {

        event.preventDefault();

    }


    return false;

}


/* =========================================================
   10. WATERMARK
   ========================================================= */

function setupProtectionWatermark() {

    const settings =
        everJoyProtectionConfig
            ?.contentProtection
            ?.watermark;


    if (!settings) {

        return;

    }


    if (
        settings.enabled
        !==
        true
    ) {

        return;

    }


    const existing =
        document.querySelector(
            ".everjoy-content-watermark"
        );


    if (existing) {

        return;

    }


    const watermark =
        document.createElement(
            "div"
        );


    watermark.className =
        "everjoy-content-watermark";


    watermark.setAttribute(
        "aria-hidden",
        "true"
    );


    watermark.textContent =
        buildWatermarkText(
            settings
        );


    document.body.appendChild(
        watermark
    );


    if (
        settings.dynamicPosition
        ===
        true
    ) {

        startDynamicWatermark(
            watermark
        );

    }

}


/* =========================================================
   11. BUILD WATERMARK TEXT
   ========================================================= */

function buildWatermarkText(
    settings
) {

    const parts = [];


    if (
        settings.showPlatformName
        ===
        true
    ) {

        parts.push(
            "Ever Joy Comics"
        );

    }


    if (
        settings.showCreatorName
        ===
        true
        &&
        readerCurrentComic
        &&
        readerCurrentComic.creators
    ) {

        const writer =
            readerCurrentComic
                .creators
                ?.writer
                ?.name;


        if (writer) {

            parts.push(
                `© ${writer}`
            );

        }

    }


    if (
        settings.showComicTitle
        ===
        true
        &&
        readerCurrentComic
    ) {

        parts.push(
            readerCurrentComic.title
        );

    }


    return parts.join(
        " • "
    );

}


/* =========================================================
   12. DYNAMIC WATERMARK
   ========================================================= */

function startDynamicWatermark(
    watermark
) {

    const positions = [

        {
            top: "18%",
            left: "8%"
        },

        {
            top: "36%",
            left: "58%"
        },

        {
            top: "57%",
            left: "20%"
        },

        {
            top: "76%",
            left: "65%"
        }

    ];


    let positionIndex =
        0;


    function moveWatermark() {

        const position =
            positions[
                positionIndex
            ];


        watermark.style.top =
            position.top;


        watermark.style.left =
            position.left;


        positionIndex =
            (
                positionIndex + 1
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
   13. SUSPICIOUS ACTIVITY DETECTION
   ========================================================= */

function setupSuspiciousActivityDetection() {

    const settings =
        everJoyProtectionConfig
            ?.contentProtection
            ?.scraping;


    if (!settings) {

        return;

    }


    if (
        settings.enabled
        !==
        true
    ) {

        return;

    }


    setupRapidPageDetection(
        settings
    );


    setupReadingSpeedDetection(
        settings
    );

}


/* =========================================================
   14. RAPID PAGE DETECTION
   ========================================================= */

function setupRapidPageDetection(
    settings
) {

    if (
        settings.detectRapidPageLoading
        !==
        true
    ) {

        return;

    }


    let pageChanges =
        [];


    document.addEventListener(
        "everjoy:pagechange",
        () => {

            const now =
                Date.now();


            pageChanges.push(
                now
            );


            pageChanges =
                pageChanges.filter(
                    timestamp =>
                        now - timestamp
                        <
                        10000
                );


            /*
                More than 15 page changes
                in 10 seconds is suspicious.
            */

            if (
                pageChanges.length
                >=
                15
            ) {

                flagSuspiciousActivity(
                    "rapid-page-navigation"
                );

            }

        }
    );

}


/* =========================================================
   15. READING SPEED DETECTION
   ========================================================= */

function setupReadingSpeedDetection(
    settings
) {

    if (
        settings.detectAbnormalReadingSpeed
        !==
        true
    ) {

        return;

    }


    let pageStartTime =
        Date.now();


    let previousPage =
        -1;


    document.addEventListener(
        "everjoy:pagechange",
        event => {

            const page =
                event.detail
                    ?.page;


            if (
                typeof page
                !==
                "number"
            ) {

                return;

            }


            if (
                page ===
                previousPage
            ) {

                return;

            }


            const now =
                Date.now();


            const timeSpent =
                now -
                pageStartTime;


            /*
                Less than 500ms per page
                repeatedly is suspicious.
            */

            if (
                previousPage
                >=
                0
                &&
                timeSpent
                <
                500
            ) {

                flagSuspiciousActivity(
                    "abnormal-reading-speed"
                );

            }


            pageStartTime =
                now;


            previousPage =
                page;

        }
    );

}


/* =========================================================
   16. FLAG SUSPICIOUS ACTIVITY
   ========================================================= */

function flagSuspiciousActivity(
    reason
) {

    console.warn(
        "Ever Joy: Suspicious activity detected:",
        reason
    );


    document.dispatchEvent(
        new CustomEvent(
            "everjoy:suspicious-activity",
            {
                detail: {

                    reason,

                    comicId:
                        readerCurrentComic
                            ?.id
                            ||
                            null,

                    chapterId:
                        readerCurrentChapter
                            ?.id
                            ||
                            null,

                    timestamp:
                        Date.now()

                }

            }
        )
    );

}