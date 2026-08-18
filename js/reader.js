/* =========================================================
   EVER JOY COMICS
   READER JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. READER STATE
   ========================================================= */

let readerComicCatalogue = [];

let readerChapterCatalogue = [];

let readerCurrentComic = null;

let readerCurrentChapter = null;

let readerCurrentPage = 0;

let readerCurrentMode = "page";

/* =========================================================
   2. INITIALIZE READER
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeReader();

    }
);


async function initializeReader() {

    /*
        Load both data files.
    */

    await Promise.all([

        loadReaderComics(),

        loadReaderChapters()

    ]);


    /*
        Get IDs from URL.
    */

    const comicId =
        getReaderComicId();


    const chapterId =
        getReaderChapterId();


    /*
        Make sure both IDs exist.
    */

    if (
        !comicId ||
        !chapterId
    ) {

        showReaderError(
            "This chapter could not be identified."
        );

        return;

    }


    /*
        Find comic.
    */

    readerCurrentComic =
        readerComicCatalogue.find(
            comic =>
                comic.id === comicId
        );


    /*
        Find chapter.
    */

    readerCurrentChapter =
        readerChapterCatalogue.find(
            chapter =>
                chapter.id === chapterId
        );
        
        window.readerCurrentComic =
    readerCurrentComic;

window.readerCurrentChapter =
    readerCurrentChapter;


    /*
        Validate comic.
    */

    if (!readerCurrentComic) {

        showReaderError(
            "This comic could not be found."
        );

        return;

    }


    /*
        Validate chapter.
    */

    if (!readerCurrentChapter) {

        showReaderError(
            "This chapter could not be found."
        );

        return;

    }


    /*
        Make sure the chapter belongs
        to the selected comic.
    */

    if (
        readerCurrentChapter.comicId !==
        readerCurrentComic.id
    ) {

        showReaderError(
            "This chapter does not belong to this comic."
        );

        return;

    }


    /*
        Render reader.
    */

    renderReader();


    /*
        Setup controls.
    */

    setupReaderControls();


    /*
        Hide loading state.
    */

    hideReaderLoading();

}


/* =========================================================
   3. LOAD COMICS
   ========================================================= */

async function loadReaderComics() {

    try {

        const response =
            await fetch(
                "../data/comics.json"
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load comics: ${response.status}`
            );

        }


        const data =
            await response.json();


        readerComicCatalogue =
            data.comics || [];


    } catch (error) {

        console.error(
            "Reader could not load comics:",
            error
        );

    }

}


/* =========================================================
   4. LOAD CHAPTERS
   ========================================================= */

async function loadReaderChapters() {

    try {

        const response =
            await fetch(
                "../data/chapters.json"
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load chapters: ${response.status}`
            );

        }


        const data =
            await response.json();


        readerChapterCatalogue =
            data.chapters || [];


    } catch (error) {

        console.error(
            "Reader could not load chapters:",
            error
        );

    }

}


/* =========================================================
   5. URL HELPERS
   ========================================================= */

function getReaderComicId() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    return parameters.get(
        "id"
    );

}


function getReaderChapterId() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    return parameters.get(
        "chapter"
    );

}

/* =========================================================
   6. READER MODE
   ========================================================= */

/* =========================================================
   READER MODE
   ========================================================= */

function getReaderMode(
    comic
) {

    if (!comic) {

        return "page";

    }


    const format =
        String(
            comic.format || ""
        )
        .toLowerCase()
        .trim();


    /* =====================================================
       VERTICAL READER
       ===================================================== */

    if (

        format === "manhwa" ||

        format === "webtoon" ||

        format === "webcomic" ||

        format === "webcomics" ||

        format === "digital-comic" ||

        format === "digital-comics"

    ) {

        return "vertical";

    }


    /* =====================================================
       MOTION READER
       ===================================================== */

    if (

        format === "motion-comic" ||

        format === "motion-comics"

    ) {

        return "motion";

    }


    /* =====================================================
       PAGE READER
       ===================================================== */

    if (

        format === "manga" ||

        format === "manhua" ||

        format === "bd" ||

        format === "western-comic" ||

        format === "western-comics" ||

        format === "graphic-novel" ||

        format === "graphic-novels"

    ) {

        return "page";

    }


    /*
        Unknown formats safely use
        the traditional page reader.
    */

    return "page";

}
/* =========================================================
   6. RENDER READER
   ========================================================= */

function renderReader() {

    renderReaderHeader();


    /*
        Determine which reader this comic uses.
    */

    readerCurrentMode =
        getReaderMode(
            readerCurrentComic
        );


    /*
        Apply the reader mode to the
        main reader container.
    */

    applyReaderMode(
        readerCurrentMode
    );


    /*
        Render the actual chapter.
    */

    switch (
        readerCurrentMode
    ) {

        case "vertical":

            renderVerticalReader();

            break;


        case "motion":

            renderMotionReader();

            break;


        case "page":

        default:

            renderPageReader();

            break;

    }


    setupChapterNavigation();

    updateReaderProgress();

}

/* =========================================================
   7. READER HEADER
   ========================================================= */

function renderReaderHeader() {

    const comicTitle =
        document.querySelector(
            "#readerComicTitle"
        );


    const chapterTitle =
        document.querySelector(
            "#readerChapterTitle"
        );


    if (comicTitle) {

        comicTitle.textContent =
            readerCurrentComic.title;

    }


    if (chapterTitle) {

        chapterTitle.textContent =
            `Chapter ${
                readerCurrentChapter.chapterNumber
            }${
                readerCurrentChapter.title
                    ? ` — ${
                        readerCurrentChapter.title
                    }`
                    : ""
            }`;

    }


    document.title =
        `${readerCurrentComic.title} — Chapter ${
            readerCurrentChapter.chapterNumber
        } | Ever Joy Comics`;

}


/* =========================================================
   8. RENDER COMIC PAGES
   ========================================================= */

function renderComicPages() {

    const container =
        document.querySelector(
            "#comicPages"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    /*
        Make sure the chapter
        actually contains pages.
    */

    if (
        !readerCurrentChapter.pages ||
        !readerCurrentChapter.pages.length
    ) {

        showReaderError(
            "This chapter does not contain any pages yet."
        );

        return;

    }


    /*
        Create an image element
        for every page.
    */

    readerCurrentChapter.pages.forEach(
        (pageId, index) => {

            const page =
                createComicPage(
                    pageId,
                    index
                );


            container.appendChild(
                page
            );

        }
    );

}
/* =========================================================
   RENDER PAGE READER
   ========================================================= */

function renderPageReader() {

    renderComicPages();

}


/* =========================================================
   RENDER VERTICAL READER
   ========================================================= */

function renderVerticalReader() {

    renderComicPages();


    const container =
        document.querySelector(
            "#comicPages"
        );


    if (!container) {

        return;

    }


    container.classList.add(
        "reader-vertical-mode"
    );

}


/* =========================================================
   RENDER MOTION READER
   ========================================================= */

function renderMotionReader() {

    /*
        Motion Reader will be implemented
        separately when Ever Joy supports
        motion comics.

        For now we safely fall back to
        the normal page renderer instead
        of breaking the chapter.
    */

    renderComicPages();


    const container =
        document.querySelector(
            "#comicPages"
        );


    if (!container) {

        return;

    }


    container.classList.add(
        "reader-motion-mode"
    );

}
/* =========================================================
   APPLY READER MODE
   ========================================================= */

function applyReaderMode() {

    const container =
        document.querySelector(
            "#readerContainer"
        );

    if (!container || !readerCurrentComic) {
        return;
    }


    const format =
        String(
            readerCurrentComic.format || "manga"
        )
        .toLowerCase()
        .trim();


    /*
        Remove any previous reader mode.
    */

    container.classList.remove(
        "reader-mode-page",
        "reader-mode-vertical",
        "reader-mode-motion"
    );


    /*
        PAGE READER
        Manga, Western comics, BD,
        graphic novels, etc.
    */

    if (
        format === "manga" ||
        format === "western-comic" ||
        format === "western-comics" ||
        format === "bd" ||
        format === "graphic-novel" ||
        format === "graphic-novels"
    ) {

        container.classList.add(
            "reader-mode-page"
        );

        container.dataset.readerMode =
            "page";

        return;

    }


    /*
        VERTICAL READER
        Manhwa, webtoon, webcomic,
        digital comics, etc.
    */

    if (
        format === "manhwa" ||
        format === "webtoon" ||
        format === "webcomic" ||
        format === "webcomics" ||
        format === "digital-comic" ||
        format === "digital-comics" ||
        format === "manhua"
    ) {

        container.classList.add(
            "reader-mode-vertical"
        );

        container.dataset.readerMode =
            "vertical";

        return;

    }


    /*
        MOTION READER
        Reserved for future motion comics.
    */

    if (
        format === "motion" ||
        format === "motion-comic" ||
        format === "motion-comics"
    ) {

        container.classList.add(
            "reader-mode-motion"
        );

        container.dataset.readerMode =
            "motion";

        return;

    }


    /*
        DEFAULT
        Unknown formats use the normal
        page reader.
    */

    container.classList.add(
        "reader-mode-page"
    );

    container.dataset.readerMode =
        "page";

}
/* =========================================================
   9. CREATE COMIC PAGE
   ========================================================= */

function createComicPage(
    pageId,
    index
) {

    const image =
        document.createElement(
            "img"
        );


    image.className =
        "comic-page";
        
        image.dataset.pageId = pageId;
image.dataset.pageNumber = index + 1;


    /*
        TEMPORARY IMAGE PATH
        --------------------------------
        Later the creator upload system
        will provide the real page URL.
    */

    loadProtectedComicImage(
    image,
    readerCurrentComic,
    readerCurrentChapter,
    pageId
);

    image.alt =
        `${readerCurrentComic.title} - Chapter ${
            readerCurrentChapter.chapterNumber
        }, Page ${index + 1}`;


    image.loading =
        index === 0
            ? "eager"
            : "lazy";


    image.draggable =
        false;


    /*
        Track page loading errors.
    */

    image.addEventListener(
        "error",
        () => {

            image.classList.add(
                "page-error"
            );


            image.alt =
                `Page ${index + 1} unavailable`;

        }
    );


    /*
        Update progress when
        the page becomes visible.
    */

    setupPageObserver(
        image,
        index
    );


    return image;

}


/* =========================================================
   10. PAGE OBSERVER
   ========================================================= */

function setupPageObserver(
    image,
    pageIndex
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            readerCurrentPage =
                                pageIndex;
                                
                                document.dispatchEvent(
    new CustomEvent(
        "everjoy:pagechange",
        {
            detail: {
                page: pageIndex + 1
            }
        }
    )
);


                            updateReaderProgress();
                            
                            refreshEverJoyPageBookmarkButton();

                        }

                    }
                );

            },
            {
                threshold: 0.55
            }
        );


    observer.observe(
        image
    );

}


/* =========================================================
   11. UPDATE PAGE PROGRESS
   ========================================================= */

function updateReaderProgress() {

    const currentPage =
        document.querySelector(
            "#readerPageNumber"
        );


    const totalPages =
        document.querySelector(
            "#readerTotalPages"
        );


    if (currentPage) {

        currentPage.textContent =
            readerCurrentPage + 1;

    }


    if (totalPages) {

        totalPages.textContent =
            readerCurrentChapter
                ? readerCurrentChapter.pageCount
                : "--";

    }

}


/* =========================================================
   12. READER CONTROLS
   ========================================================= */

function setupReaderControls() {

    const backButton =
        document.querySelector(
            "#readerBackButton"
        );


    const menuButton =
        document.querySelector(
            "#readerMenuButton"
        );


    const nextButton =
        document.querySelector(
            "#nextChapterControl"
        );


    const previousButton =
        document.querySelector(
            "#previousChapterButton"
        );


    const nextEndButton =
        document.querySelector(
            "#nextChapterButton"
        );


    const detailsButton =
        document.querySelector(
            "#readerDetailsButton"
        );


    /*
        Back button.
    */

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    /*
        Menu button.
    */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openReaderMenu
        );

    }


    /*
        Next chapter.
    */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            goToNextChapter
        );

    }


    if (nextEndButton) {

        nextEndButton.addEventListener(
            "click",
            goToNextChapter
        );

    }


    /*
        Previous chapter.
    */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            goToPreviousChapter
        );

    }


    /*
        Back to comic.
    */

    if (detailsButton) {

        detailsButton.addEventListener(
            "click",
            goBackToComic
        );

    }


    /*
        Menu controls.
    */

    setupReaderMenu();

}


/* =========================================================
   13. CHAPTER NAVIGATION
   ========================================================= */

function setupChapterNavigation() {

    const chapters =
        getComicChapters(
            readerCurrentComic.id
        );


    const currentIndex =
        chapters.findIndex(
            chapter =>
                chapter.id ===
                readerCurrentChapter.id
        );


    /*
        Chapters are sorted newest first.
    */

    const previousChapter =
        chapters[
            currentIndex + 1
        ];


    const nextChapter =
        chapters[
            currentIndex - 1
        ];


    const previousButton =
        document.querySelector(
            "#previousChapterButton"
        );


    const nextButton =
        document.querySelector(
            "#nextChapterControl"
        );


    const nextEndButton =
        document.querySelector(
            "#nextChapterButton"
        );


    /*
        Previous chapter.
    */

    if (
        !previousChapter &&
        previousButton
    ) {

        previousButton.disabled =
            true;

        previousButton.style.opacity =
            "0.35";

    }


    /*
        Next chapter.
    */

    if (
        !nextChapter
    ) {

        if (nextButton) {

            nextButton.disabled =
                true;

            nextButton.style.opacity =
                "0.35";

        }


        if (nextEndButton) {

            nextEndButton.textContent =
                "No More Chapters";

            nextEndButton.disabled =
                true;

            nextEndButton.style.opacity =
                "0.5";

        }

    }

}


/* =========================================================
   14. GET COMIC CHAPTERS
   ========================================================= */

function getComicChapters(
    comicId
) {

    return readerChapterCatalogue
        .filter(
            chapter =>
                chapter.comicId ===
                comicId
        )
        .sort(
            (a, b) =>
                b.chapterNumber -
                a.chapterNumber
        );

}


/* =========================================================
   15. GO TO NEXT CHAPTER
   ========================================================= */

function goToNextChapter() {

    const chapters =
        getComicChapters(
            readerCurrentComic.id
        );


    const currentIndex =
        chapters.findIndex(
            chapter =>
                chapter.id ===
                readerCurrentChapter.id
        );


    const nextChapter =
        chapters[
            currentIndex - 1
        ];


    if (!nextChapter) {

        return;

    }


    navigateToChapter(
        nextChapter
    );

}


/* =========================================================
   16. GO TO PREVIOUS CHAPTER
   ========================================================= */

function goToPreviousChapter() {

    const chapters =
        getComicChapters(
            readerCurrentComic.id
        );


    const currentIndex =
        chapters.findIndex(
            chapter =>
                chapter.id ===
                readerCurrentChapter.id
        );


    const previousChapter =
        chapters[
            currentIndex + 1
        ];


    if (!previousChapter) {

        return;

    }


    navigateToChapter(
        previousChapter
    );

}


/* =========================================================
   17. NAVIGATE TO CHAPTER
   ========================================================= */

function navigateToChapter(
    chapter
) {

    window.location.href =
        `reader.html?id=${encodeURIComponent(
            readerCurrentComic.id
        )}&chapter=${encodeURIComponent(
            chapter.id
        )}`;

}


/* =========================================================
   18. GO BACK TO COMIC
   ========================================================= */

function goBackToComic() {

    window.location.href =
        `details.html?id=${encodeURIComponent(
            readerCurrentComic.id
        )}`;

}


/* =========================================================
   19. READER MENU
   ========================================================= */

function setupReaderMenu() {

    const menuClose =
        document.querySelector(
            "#readerMenuClose"
        );


    const overlay =
        document.querySelector(
            "#readerOverlay"
        );


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeReaderMenu
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeReaderMenu
        );

    }

}


/* =========================================================
   20. OPEN READER MENU
   ========================================================= */

function openReaderMenu() {

    const menu =
        document.querySelector(
            "#readerMenu"
        );


    const overlay =
        document.querySelector(
            "#readerOverlay"
        );


    if (menu) {

        menu.classList.add(
            "open"
        );

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "visible"
        );

    }

}


/* =========================================================
   21. CLOSE READER MENU
   ========================================================= */

function closeReaderMenu() {

    const menu =
        document.querySelector(
            "#readerMenu"
        );


    const overlay =
        document.querySelector(
            "#readerOverlay"
        );


    if (menu) {

        menu.classList.remove(
            "open"
        );

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "visible"
        );

    }

}


/* =========================================================
   22. HIDE LOADING STATE
   ========================================================= */

function hideReaderLoading() {

    const loading =
        document.querySelector(
            "#readerLoading"
        );


    if (loading) {

        loading.style.display =
            "none";

    }

}


/* =========================================================
   23. READER ERROR
   ========================================================= */

function showReaderError(
    message
) {

    const loading =
        document.querySelector(
            "#readerLoading"
        );


    const pages =
        document.querySelector(
            "#comicPages"
        );


    const controls =
        document.querySelector(
            "#readerControls"
        );


    if (loading) {

        loading.innerHTML = `

            <div class="reader-error">

                <div class="reader-error-icon">

                    !

                </div>


                <h2>

                    Something went wrong

                </h2>


                <p>

                    ${escapeReaderHTML(
                        message
                    )}

                </p>


                <button
                    onclick="history.back()"
                    class="back-details-btn"
                >

                    Go Back

                </button>

            </div>

        `;

    }


    if (pages) {

        pages.innerHTML = "";

    }


    if (controls) {

        controls.style.display =
            "none";

    }

}


/* =========================================================
   24. HTML ESCAPE
   ========================================================= */

function escapeReaderHTML(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

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
   EVER JOY COMICS
   LIBRARY LOGIC
   Add below existing reader.js code
   ========================================================= */


/* =========================================================
   1. LIBRARY STORAGE
   ========================================================= */

/*
    For the prototype, reader information is stored
    locally on the device.

    Later, when real accounts/backend storage are added,
    this can be connected to the user's Ever Joy account.
*/

const EVER_JOY_LIBRARY_KEY =
    "everJoyLibrary";

const EVER_JOY_HISTORY_KEY =
    "everJoyReadingHistory";

const EVER_JOY_BOOKMARKS_KEY =
    "everJoyBookmarks";


/* =========================================================
   2. STORAGE HELPERS
   ========================================================= */

function getLibraryData() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVER_JOY_LIBRARY_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Could not read library:",
            error
        );

        return [];

    }

}


function saveLibraryData(
    data
) {

    localStorage.setItem(
        EVER_JOY_LIBRARY_KEY,
        JSON.stringify(data)
    );

}


function getReadingHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVER_JOY_HISTORY_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Could not read history:",
            error
        );

        return [];

    }

}


function saveReadingHistory(
    data
) {

    localStorage.setItem(
        EVER_JOY_HISTORY_KEY,
        JSON.stringify(data)
    );

}


function getBookmarks() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVER_JOY_BOOKMARKS_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Could not read bookmarks:",
            error
        );

        return [];

    }

}


/* =========================================================
   3. LIBRARY INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.querySelector(
                ".library-page"
            )
        ) {

            initializeLibrary();

        }

    }
);


async function initializeLibrary() {

    const comics =
        await loadLibraryComics();


    renderContinueReading(
        comics
    );


    renderMyComics(
        comics
    );


    renderRecentlyRead(
        comics
    );


    renderBookmarkPreview(
        comics
    );


    setupLibraryMenu();

}


/* =========================================================
   4. LOAD COMICS
   ========================================================= */

async function loadLibraryComics() {

    try {

        const response =
            await fetch(
                "../data/comics.json"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load comics."
            );

        }


        const data =
            await response.json();


        return data.comics || [];


    } catch (error) {

        console.error(
            "Library comic loading error:",
            error
        );

        return [];

    }

}


/* =========================================================
   5. FIND COMIC
   ========================================================= */

function findLibraryComic(
    comics,
    comicId
) {

    return comics.find(
        comic =>
            String(
                comic.id
            )
            ===
            String(
                comicId
            )
    );

}


/* =========================================================
   6. CONTINUE READING
   ========================================================= */

function renderContinueReading(
    comics
) {

    const container =
        document.querySelector(
            "#continueReadingList"
        );


    const emptyState =
        document.querySelector(
            "#continueEmpty"
        );


    if (
        !container
    ) {

        return;

    }


    const history =
        getReadingHistory();


    /*
        Only show works that have
        actual reading progress.
    */

    const continueItems =
        history
            .filter(
                item =>
                    Number(
                        item.progress || 0
                    ) > 0
                    &&
                    Number(
                        item.progress || 0
                    ) < 100
            )
            .sort(
                (a, b) =>
                    new Date(
                        b.updatedAt || 0
                    )
                    -
                    new Date(
                        a.updatedAt || 0
                    )
            )
            .slice(
                0,
                8
            );


    container.innerHTML =
        "";


    if (
        !continueItems.length
    ) {

        container.style.display =
            "none";


        if (
            emptyState
        ) {

            emptyState.hidden =
                false;

        }

        return;

    }


    container.style.display =
        "flex";


    if (
        emptyState
    ) {

        emptyState.hidden =
            true;

    }


    continueItems.forEach(
        item => {

            const comic =
                findLibraryComic(
                    comics,
                    item.comicId
                );


            if (
                !comic
            ) {

                return;

            }


            const card =
                createContinueCard(
                    comic,
                    item
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   7. CONTINUE CARD
   ========================================================= */

function createContinueCard(
    comic,
    progressData
) {

    const link =
        document.createElement(
            "a"
        );


    link.className =
        "continue-card";


    link.href =
        `../comic/reader.html?comic=${
            encodeURIComponent(
                comic.id
            )
        }&chapter=${
            encodeURIComponent(
                progressData.chapterId ||
                ""
            )
        }`;


    const image =
        document.createElement(
            "img"
        );


    image.src =
        comic.cover ||
        comic.coverImage ||
        comic.image ||
        "../assets/images/placeholder-cover.jpg";


    image.alt =
        comic.title ||
        "Comic";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "continue-card-content";


    const title =
        document.createElement(
            "span"
        );


    title.className =
        "continue-card-title";


    title.textContent =
        comic.title ||
        "Untitled";


    const chapter =
        document.createElement(
            "span"
        );


    chapter.className =
        "continue-card-chapter";


    chapter.textContent =
        progressData.chapterTitle
            ? `Continue ${progressData.chapterTitle}`
            : "Continue reading";


    const progress =
        document.createElement(
            "div"
        );


    progress.className =
        "continue-progress";


    progress.style.setProperty(
        "--progress",
        `${progressData.progress || 0}%`
    );


    const progressBar =
        document.createElement(
            "span"
        );


    progress.appendChild(
        progressBar
    );


    content.appendChild(
        title
    );

    content.appendChild(
        chapter
    );

    content.appendChild(
        progress
    );


    link.appendChild(
        image
    );

    link.appendChild(
        content
    );


    return link;

}


/* =========================================================
   8. MY COMICS
   ========================================================= */

function renderMyComics(
    comics
) {

    const grid =
        document.querySelector(
            "#libraryGrid"
        );


    const emptyState =
        document.querySelector(
            "#libraryEmpty"
        );


    if (
        !grid
    ) {

        return;

    }


    const library =
        getLibraryData();


    const savedComics =
        library
            .map(
                item =>
                    findLibraryComic(
                        comics,
                        item.comicId ||
                        item.id
                    )
            )
            .filter(Boolean);


    grid.innerHTML =
        "";


    if (
        !savedComics.length
    ) {

        grid.style.display =
            "none";


        if (
            emptyState
        ) {

            emptyState.hidden =
                false;

        }

        return;

    }


    grid.style.display =
        "grid";


    if (
        emptyState
    ) {

        emptyState.hidden =
            true;

    }


    savedComics.forEach(
        comic => {

            grid.appendChild(
                createLibraryCard(
                    comic
                )
            );

        }
    );

}


/* =========================================================
   9. LIBRARY CARD
   ========================================================= */

function createLibraryCard(
    comic
) {

    const link =
        document.createElement(
            "a"
        );


    link.className =
        "library-card";


    link.href =
        `../comic/details.html?id=${
            encodeURIComponent(
                comic.id
            )
        }`;


    const cover =
        document.createElement(
            "div"
        );


    cover.className =
        "library-card-cover";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        comic.cover ||
        comic.coverImage ||
        comic.image ||
        "../assets/images/placeholder-cover.jpg";


    image.alt =
        comic.title ||
        "Comic cover";


    image.loading =
        "lazy";


    cover.appendChild(
        image
    );


    if (
        comic.status
    ) {

        const badge =
            document.createElement(
                "span"
            );


        badge.className =
            "library-card-badge";


        badge.textContent =
            formatLibraryStatus(
                comic.status
            );


        cover.appendChild(
            badge
        );

    }


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "library-card-info";


    const title =
        document.createElement(
            "span"
        );


    title.className =
        "library-card-title";


    title.textContent =
        comic.title ||
        "Untitled";


    const meta =
        document.createElement(
            "span"
        );


    meta.className =
        "library-card-meta";


    meta.textContent =
        buildLibraryMeta(
            comic
        );


    info.appendChild(
        title
    );


    info.appendChild(
        meta
    );


    link.appendChild(
        cover
    );


    link.appendChild(
        info
    );


    return link;

}


/* =========================================================
   10. RECENTLY READ
   ========================================================= */

function renderRecentlyRead(
    comics
) {

    const grid =
        document.querySelector(
            "#recentlyReadGrid"
        );


    if (
        !grid
    ) {

        return;

    }


    const history =
        getReadingHistory();


    const recent =
        history
            .sort(
                (a, b) =>
                    new Date(
                        b.updatedAt || 0
                    )
                    -
                    new Date(
                        a.updatedAt || 0
                    )
            )
            .slice(
                0,
                6
            );


    grid.innerHTML =
        "";


    recent.forEach(
        item => {

            const comic =
                findLibraryComic(
                    comics,
                    item.comicId
                );


            if (
                !comic
            ) {

                return;

            }


            const card =
                createRecentlyReadCard(
                    comic,
                    item
                );


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   11. RECENTLY READ CARD
   ========================================================= */

function createRecentlyReadCard(
    comic,
    progressData
) {

    const link =
        createLibraryCard(
            comic
        );


    const progress =
        document.createElement(
            "div"
        );


    progress.className =
        "library-progress";


    progress.style.setProperty(
        "--progress",
        `${progressData.progress || 0}%`
    );


    const bar =
        document.createElement(
            "span"
        );


    progress.appendChild(
        bar
    );


    link
        .querySelector(
            ".library-card-info"
        )
        ?.appendChild(
            progress
        );


    return link;

}


/* =========================================================
   12. BOOKMARK PREVIEW
   ========================================================= */

function renderBookmarkPreview(
    comics
) {

    const container =
        document.querySelector(
            "#bookmarkPreview"
        );


    if (
        !container
    ) {

        return;

    }


    const bookmarks =
        getBookmarks();


    if (
        !bookmarks.length
    ) {

        return;

    }


    const firstBookmark =
        bookmarks[0];


    const comic =
        findLibraryComic(
            comics,
            firstBookmark.comicId
        );


    if (
        !comic
    ) {

        return;

    }


    container.innerHTML =
        "";


    const link =
        document.createElement(
            "a"
        );


    link.className =
        "bookmark-preview-card";


    link.href =
        `../comic/reader.html?comic=${
            encodeURIComponent(
                comic.id
            )
        }&chapter=${
            encodeURIComponent(
                firstBookmark.chapterId ||
                ""
            )
        }`;


    const image =
        document.createElement(
            "img"
        );


    image.src =
        comic.cover ||
        comic.coverImage ||
        comic.image ||
        "../assets/images/placeholder-cover.jpg";


    image.alt =
        comic.title ||
        "Comic";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "bookmark-preview-content";


    content.innerHTML = `

        <span class="bookmark-preview-label">
            BOOKMARKED CHAPTER
        </span>

        <strong>
            ${escapeReaderHTML(
                comic.title ||
                "Untitled"
            )}
        </strong>

        <small>
            ${
                escapeReaderHTML(
                    firstBookmark.chapterTitle ||
                    "Saved chapter"
                )
            }
        </small>

    `;


    link.appendChild(
        image
    );


    link.appendChild(
        content
    );


    container.appendChild(
        link
    );

}


/* =========================================================
   13. ADD TO LIBRARY
   ========================================================= */

function addToLibrary(
    comicId
) {

    const library =
        getLibraryData();


    const alreadySaved =
        library.some(
            item =>
                String(
                    item.comicId ||
                    item.id
                )
                ===
                String(
                    comicId
                )
        );


    if (
        alreadySaved
    ) {

        return false;

    }


    library.push({

        comicId:
            comicId,

        addedAt:
            new Date().toISOString()

    });


    saveLibraryData(
        library
    );


    return true;

}


/* =========================================================
   14. REMOVE FROM LIBRARY
   ========================================================= */

function removeFromLibrary(
    comicId
) {

    const library =
        getLibraryData()
            .filter(
                item =>
                    String(
                        item.comicId ||
                        item.id
                    )
                    !==
                    String(
                        comicId
                    )
            );


    saveLibraryData(
        library
    );

}


/* =========================================================
   15. CHECK LIBRARY
   ========================================================= */

function isInLibrary(
    comicId
) {

    const library =
        getLibraryData();


    return library.some(
        item =>
            String(
                item.comicId ||
                item.id
            )
            ===
            String(
                comicId
            )
    );

}


/* =========================================================
   16. SAVE READING PROGRESS
   ========================================================= */

function saveReadingProgress(
    comicId,
    chapterId,
    chapterTitle,
    progress
) {

    const history =
        getReadingHistory();


    const existingIndex =
        history.findIndex(
            item =>
                String(
                    item.comicId
                )
                ===
                String(
                    comicId
                )
        );


    const readingData = {

        comicId:
            comicId,

        chapterId:
            chapterId,

        chapterTitle:
            chapterTitle || "",

        progress:
            Math.min(
                100,
                Math.max(
                    0,
                    Number(
                        progress
                    ) || 0
                )
            ),

        updatedAt:
            new Date().toISOString()

    };


    if (
        existingIndex !== -1
    ) {

        history[
            existingIndex
        ] =
            readingData;

    } else {

        history.unshift(
            readingData
        );

    }


    saveReadingHistory(
        history
    );

}


/* =========================================================
   17. SAVE BOOKMARK
   ========================================================= */

function saveChapterBookmark(
    comicId,
    chapterId,
    chapterTitle
) {

    const bookmarks =
        getBookmarks();


    const alreadyBookmarked =
        bookmarks.some(
            bookmark =>

                String(
                    bookmark.comicId
                )
                ===
                String(
                    comicId
                )

                &&

                String(
                    bookmark.chapterId
                )
                ===
                String(
                    chapterId
                )
        );


    if (
        alreadyBookmarked
    ) {

        return false;

    }


    bookmarks.unshift({

        comicId:
            comicId,

        chapterId:
            chapterId,

        chapterTitle:
            chapterTitle || "",

        savedAt:
            new Date().toISOString()

    });


    localStorage.setItem(

        EVER_JOY_BOOKMARKS_KEY,

        JSON.stringify(
            bookmarks
        )

    );


    return true;

}


/* =========================================================
   18. REMOVE BOOKMARK
   ========================================================= */

function removeChapterBookmark(
    comicId,
    chapterId
) {

    const bookmarks =
        getBookmarks()
            .filter(
                bookmark =>

                    !(
                        String(
                            bookmark.comicId
                        )
                        ===
                        String(
                            comicId
                        )

                        &&

                        String(
                            bookmark.chapterId
                        )
                        ===
                        String(
                            chapterId
                        )
                    )
            );


    localStorage.setItem(

        EVER_JOY_BOOKMARKS_KEY,

        JSON.stringify(
            bookmarks
        )

    );

}


/* =========================================================
   19. CHECK BOOKMARK
   ========================================================= */

function isChapterBookmarked(
    comicId,
    chapterId
) {

    const bookmarks =
        getBookmarks();


    return bookmarks.some(
        bookmark =>

            String(
                bookmark.comicId
            )
            ===
            String(
                comicId
            )

            &&

            String(
                bookmark.chapterId
            )
            ===
            String(
                chapterId
            )
    );

}


/* =========================================================
   20. LIBRARY MENU
   ========================================================= */

function setupLibraryMenu() {

    const menuButton =
        document.querySelector(
            "#libraryMenuButton"
        );


    const closeButton =
        document.querySelector(
            "#closeLibraryMenu"
        );


    const menu =
        document.querySelector(
            "#librarySideMenu"
        );


    const overlay =
        document.querySelector(
            "#libraryMenuOverlay"
        );


    if (
        menuButton
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                openLibraryMenu();

            }
        );

    }


    if (
        closeButton
    ) {

        closeButton.addEventListener(
            "click",
            () => {

                closeLibraryMenu();

            }
        );

    }


    if (
        overlay
    ) {

        overlay.addEventListener(
            "click",
            () => {

                closeLibraryMenu();

            }
        );

    }

}


/* =========================================================
   21. OPEN LIBRARY MENU
   ========================================================= */

function openLibraryMenu() {

    const menu =
        document.querySelector(
            "#librarySideMenu"
        );


    const overlay =
        document.querySelector(
            "#libraryMenuOverlay"
        );


    if (
        menu
    ) {

        menu.classList.add(
            "open"
        );

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    if (
        overlay
    ) {

        overlay.classList.add(
            "visible"
        );

    }

}


/* =========================================================
   22. CLOSE LIBRARY MENU
   ========================================================= */

function closeLibraryMenu() {

    const menu =
        document.querySelector(
            "#librarySideMenu"
        );


    const overlay =
        document.querySelector(
            "#libraryMenuOverlay"
        );


    if (
        menu
    ) {

        menu.classList.remove(
            "open"
        );

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (
        overlay
    ) {

        overlay.classList.remove(
            "visible"
        );

    }

}


/* =========================================================
   23. STATUS FORMATTER
   ========================================================= */

function formatLibraryStatus(
    status
) {

    if (!status) {

        return "";

    }


    return String(
        status
    )
    .charAt(0)
    .toUpperCase()
    +
    String(
        status
    )
    .slice(1);

}


/* =========================================================
   24. META BUILDER
   ========================================================= */

function buildLibraryMeta(
    comic
) {

    const parts = [];


    if (
        comic.type
    ) {

        parts.push(
            comic.type
        );

    }


    if (
        comic.chapterCount
    ) {

        parts.push(
            `${comic.chapterCount} ${
                comic.chapterCount === 1
                    ? "chapter"
                    : "chapters"
            }`
        );

    }


    return parts.join(
        " • "
    );

}


/* =========================================================
   25. HTML SAFETY
   ========================================================= */

function escapeReaderHTML(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(
        value
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
   EVER JOY COMICS
   READING PROGRESS SYSTEM
   ========================================================= */


/* =========================================================
   1. READING HISTORY STORAGE
   ========================================================= */

const EVER_JOY_READING_HISTORY_KEY =
    "everJoyReadingHistory";


/* =========================================================
   2. GET READING HISTORY
   ========================================================= */

function getEverJoyReadingHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVER_JOY_READING_HISTORY_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Could not load reading history:",
            error
        );

        return [];

    }

}


/* =========================================================
   3. SAVE READING HISTORY
   ========================================================= */

function saveEverJoyReadingHistory(
    history
) {

    localStorage.setItem(
        EVER_JOY_READING_HISTORY_KEY,
        JSON.stringify(
            history
        )
    );

}


/* =========================================================
   4. GET READER PARAMETERS
   ========================================================= */

function getEverJoyReaderParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return {

        comicId:
            params.get("comic") ||
            params.get("id"),

        chapterId:
            params.get("chapter") ||
            params.get("chapterId")

    };

}


/* =========================================================
   5. FIND EXISTING READING RECORD
   ========================================================= */

function findEverJoyReadingRecord(
    history,
    comicId
) {

    return history.find(
        item =>

            String(
                item.comicId
            )
            ===
            String(
                comicId
            )
    );

}


/* =========================================================
   6. SAVE CURRENT PROGRESS
   ========================================================= */

function saveEverJoyReadingProgress(
    progress
) {

    const {
        comicId,
        chapterId
    } =
        getEverJoyReaderParameters();


    if (
        !comicId
    ) {

        return;

    }


    const history =
        getEverJoyReadingHistory();


    const existingIndex =
        history.findIndex(
            item =>

                String(
                    item.comicId
                )
                ===
                String(
                    comicId
                )
        );


    const existingRecord =
        existingIndex !== -1
            ? history[
                existingIndex
            ]
            : null;


    /*
        Never allow progress below 0
        or above 100.
    */

    const safeProgress =
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    progress
                ) || 0
            )
        );


    const readingRecord = {

        comicId:
            comicId,

        chapterId:
            chapterId ||
            existingRecord?.chapterId ||
            "",

        chapterTitle:
            existingRecord?.chapterTitle ||
            "",

        progress:
            safeProgress,

        updatedAt:
            new Date().toISOString()

    };


    if (
        existingIndex !== -1
    ) {

        history[
            existingIndex
        ] =
            readingRecord;

    } else {

        history.unshift(
            readingRecord
        );

    }


    saveEverJoyReadingHistory(
        history
    );

}


/* =========================================================
   7. CALCULATE READING PROGRESS
   ========================================================= */

function calculateEverJoyReaderProgress() {

    const documentHeight =
        document.documentElement
            .scrollHeight;


    const viewportHeight =
        window.innerHeight;


    const scrollableHeight =
        documentHeight -
        viewportHeight;


    if (
        scrollableHeight <= 0
    ) {

        return 100;

    }


    const scrollPosition =
        window.scrollY;


    const progress =
        (
            scrollPosition /
            scrollableHeight
        ) * 100;


    return Math.round(
        progress
    );

}


/* =========================================================
   8. SAVE PROGRESS WHILE READING
   ========================================================= */

let everJoyProgressTimer = null;


function trackEverJoyReadingProgress() {

    const progress =
        calculateEverJoyReaderProgress();


    /*
        Save only when there is
        meaningful progress.
    */

    if (
        progress >= 1
    ) {

        saveEverJoyReadingProgress(
            progress
        );

    }

}


/* =========================================================
   9. THROTTLE PROGRESS SAVING
   ========================================================= */

function scheduleEverJoyProgressSave() {

    if (
        everJoyProgressTimer
    ) {

        clearTimeout(
            everJoyProgressTimer
        );

    }


    everJoyProgressTimer =
        setTimeout(
            () => {

                trackEverJoyReadingProgress();

            },
            500
        );

}


/* =========================================================
   10. READER INITIALIZATION
   ========================================================= */

function initializeEverJoyProgressTracking() {

    const {
        comicId,
        chapterId
    } =
        getEverJoyReaderParameters();


    /*
        If this isn't a comic reader URL,
        don't activate the tracker.
    */

    if (
        !comicId ||
        !chapterId
    ) {

        return;

    }


    window.addEventListener(
        "scroll",
        scheduleEverJoyProgressSave,
        {
            passive: true
        }
    );


    /*
        Save one final progress value
        when the reader leaves the page.
    */

    window.addEventListener(
        "beforeunload",
        () => {

            trackEverJoyReadingProgress();

        }
    );


    /*
        Save the current position if the
        browser puts the page into the
        background.
    */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState
                ===
                "hidden"
            ) {

                trackEverJoyReadingProgress();

            }

        }
    );

}


/* =========================================================
   11. START PROGRESS TRACKING
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEverJoyProgressTracking();

    }
);
/* =========================================================
   EVER JOY COMICS
   CHAPTER METADATA + CONTINUE READING BRIDGE
   ========================================================= */


/* =========================================================
   1. CHAPTER DATA CACHE
   ========================================================= */

let everJoyChapterData = [];


/* =========================================================
   2. LOAD CHAPTER METADATA
   ========================================================= */

async function loadEverJoyChapterMetadata() {

    try {

        const response =
            await fetch(
                "../data/chapters.json"
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Could not load chapters.json"
            );

        }


        const data =
            await response.json();


        everJoyChapterData =
            data.chapters || [];


        return everJoyChapterData;


    } catch (error) {

        console.error(
            "Ever Joy chapter metadata error:",
            error
        );


        return [];

    }

}


/* =========================================================
   3. FIND CHAPTER
   ========================================================= */

function findEverJoyChapter(
    chapterId
) {

    return everJoyChapterData.find(
        chapter =>

            String(
                chapter.id
            )
            ===
            String(
                chapterId
            )
    );

}


/* =========================================================
   4. FIND COMIC CHAPTERS
   ========================================================= */

function findEverJoyComicChapters(
    comicId
) {

    return everJoyChapterData.filter(
        chapter =>

            String(
                chapter.comicId
            )
            ===
            String(
                comicId
            )
    );

}


/* =========================================================
   5. UPDATE READING RECORD WITH METADATA
   ========================================================= */

function updateEverJoyReadingMetadata(
    comicId,
    chapterId
) {

    if (
        !comicId ||
        !chapterId
    ) {

        return;

    }


    const chapter =
        findEverJoyChapter(
            chapterId
        );


    if (
        !chapter
    ) {

        return;

    }


    const history =
        getEverJoyReadingHistory();


    const index =
        history.findIndex(
            item =>

                String(
                    item.comicId
                )
                ===
                String(
                    comicId
                )
        );


    if (
        index === -1
    ) {

        return;

    }


    history[
        index
    ].chapterTitle =
        chapter.title;


    history[
        index
    ].chapterNumber =
        chapter.chapterNumber;


    history[
        index
    ].pageCount =
        chapter.pageCount;


    saveEverJoyReadingHistory(
        history
    );

}


/* =========================================================
   6. GET CONTINUE READING DATA
   ========================================================= */

function getEverJoyContinueReadingData() {

    const history =
        getEverJoyReadingHistory();


    return history
        .filter(
            item =>

                item.comicId &&
                item.chapterId
        )
        .sort(
            (a, b) =>

                new Date(
                    b.updatedAt || 0
                )
                -
                new Date(
                    a.updatedAt || 0
                )
        )
        .slice(
            0,
            8
        );

}


/* =========================================================
   7. INITIALIZE CHAPTER METADATA
   ========================================================= */

async function initializeEverJoyChapterBridge() {

    const {
        comicId,
        chapterId
    } =
        getEverJoyReaderParameters();


    /*
        Only activate when we're
        actually inside a comic chapter.
    */

    if (
        !comicId ||
        !chapterId
    ) {

        return;

    }


    await loadEverJoyChapterMetadata();


    updateEverJoyReadingMetadata(
        comicId,
        chapterId
    );

}


/* =========================================================
   8. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEverJoyChapterBridge();

    }
);
/* =========================================================
   EVER JOY COMICS
   LIBRARY CONTINUE READING RENDERER
   ========================================================= */


/* =========================================================
   1. COMIC DATA CACHE
   ========================================================= */

let everJoyComicData = [];


/* =========================================================
   2. LOAD COMIC DATA
   ========================================================= */

async function loadEverJoyComicData() {

    try {

        const response =
            await fetch(
                "../data/comics.json"
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Could not load comics.json"
            );

        }


        const data =
            await response.json();


        /*
            Support either:

            {
                "comics": [...]
            }

            or a direct array.
        */

        everJoyComicData =
            Array.isArray(data)
                ? data
                : (
                    data.comics || []
                );


        return everJoyComicData;


    } catch (error) {

        console.error(
            "Ever Joy comic data error:",
            error
        );


        return [];

    }

}


/* =========================================================
   3. FIND COMIC
   ========================================================= */

function findEverJoyComic(
    comicId
) {

    return everJoyComicData.find(
        comic =>

            String(
                comic.id
            )
            ===
            String(
                comicId
            )
    );

}


/* =========================================================
   4. CREATE CONTINUE READING CARD
   ========================================================= */

function createEverJoyContinueCard(
    record
) {

    const comic =
        findEverJoyComic(
            record.comicId
        );


    if (
        !comic
    ) {

        return null;

    }


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    record.progress
                ) || 0
            )
        );


    const chapterNumber =
        record.chapterNumber
        || "";


    const chapterTitle =
        record.chapterTitle
        || "Continue reading";


    const comicTitle =
        comic.title
        || "Untitled";


    const cover =
        comic.cover
        ||
        comic.coverImage
        ||
        comic.image
        ||
        "../assets/images/comic-placeholder.jpg";


    const chapterLabel =
        chapterNumber
            ? `Chapter ${chapterNumber}`
            : chapterTitle;


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "continue-reading-card";


    card.innerHTML = `

        <div class="continue-reading-cover">

            <img
                src="${cover}"
                alt="${comicTitle}"
                loading="lazy"
            >

        </div>


        <div class="continue-reading-info">

            <h3>
                ${comicTitle}
            </h3>


            <p>
                ${chapterLabel}
                ${chapterTitle !== chapterLabel
                    ? ` · ${chapterTitle}`
                    : ""}
            </p>


            <div class="continue-progress">

                <div class="continue-progress-track">

                    <div
                        class="continue-progress-fill"
                        style="width: ${progress}%"
                    ></div>

                </div>


                <span>
                    ${progress}%
                </span>

            </div>


            <a
                class="continue-reading-btn"
                href="../comic/reader.html?comic=${encodeURIComponent(
                    record.comicId
                )}&chapter=${encodeURIComponent(
                    record.chapterId
                )}"
            >

                Continue

            </a>

        </div>

    `;


    return card;

}


/* =========================================================
   5. RENDER CONTINUE READING
   ========================================================= */

async function renderEverJoyContinueReading() {

    const container =
        document.querySelector(
            "#continueReadingList"
        );


    if (
        !container
    ) {

        return;

    }


    const records =
        getEverJoyContinueReadingData();


    if (
        records.length === 0
    ) {

        container.innerHTML = `

            <div class="library-empty">

                <span>
                    📖
                </span>

                <p>
                    Start reading a comic and
                    your progress will appear here.
                </p>

            </div>

        `;

        return;

    }


    await loadEverJoyComicData();


    container.innerHTML = "";


    records.forEach(
        record => {

            const card =
                createEverJoyContinueCard(
                    record
                );


            if (
                card
            ) {

                container.appendChild(
                    card
                );

            }

        }
    );


    if (
        container.children.length === 0
    ) {

        container.innerHTML = `

            <div class="library-empty">

                <span>
                    📖
                </span>

                <p>
                    Your reading progress will
                    appear here.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   6. LIBRARY INITIALIZATION
   ========================================================= */

function initializeEverJoyContinueReading() {

    renderEverJoyContinueReading();

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEverJoyContinueReading();

    }
);
/* =========================================================
   EVER JOY COMICS
   READER BOOKMARK CONTROL
   ========================================================= */


/* =========================================================
   11. GET CURRENT PAGE
   ========================================================= */

function getCurrentEverJoyPage() {

    /*
        Supports a reader where the current
        page is represented by a data attribute.
    */

    const activePage =
        document.querySelector(
            "[data-page-id].active"
        );


    if (
        activePage
    ) {

        return {

            pageId:
                activePage.dataset.pageId,

            pageNumber:
                activePage.dataset.pageNumber
                || ""

        };

    }


    /*
        Fallback for a reader that uses
        a current-page variable or element.
    */

    const pageElement =
        document.querySelector(
            "[data-page-id]"
        );


    if (
        pageElement
    ) {

        return {

            pageId:
                pageElement.dataset.pageId,

            pageNumber:
                pageElement.dataset.pageNumber
                || ""

        };

    }


    return null;

}


/* =========================================================
   12. CREATE BOOKMARK BUTTON
   ========================================================= */

function createEverJoyBookmarkButton() {

    /*
        Don't create a duplicate button
        if one already exists.
    */

    const existing =
        document.querySelector(
            "#everJoyBookmarkBtn"
        );


    if (
        existing
    ) {

        return existing;

    }


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.id =
        "everJoyBookmarkBtn";


    button.className =
        "ever-joy-bookmark-btn";


    button.setAttribute(
        "aria-label",
        "Bookmark current page"
    );


    button.innerHTML = `

        <span
            class="bookmark-icon"
        >
            ♡
        </span>

        <span
            class="bookmark-label"
        >
            Bookmark
        </span>

    `;


    /*
        Place the button in the
        reader's fixed controls if
        that container exists.
    */

    const controlContainer =
        document.querySelector(
            ".reader-controls"
        )
        ||
        document.querySelector(
            ".reader-toolbar"
        )
        ||
        document.querySelector(
            ".reader-header"
        );


    if (
        controlContainer
    ) {

        controlContainer.appendChild(
            button
        );

    } else {

        /*
            Safe fallback.
        */

        document.body.appendChild(
            button
        );

    }


    return button;

}


/* =========================================================
   13. UPDATE BOOKMARK BUTTON
   ========================================================= */

function updateEverJoyBookmarkButton(
    button
) {

    const currentPage =
        getCurrentEverJoyPage();


    if (
        !currentPage
    ) {

        return;

    }


    const bookmarked =
        getCurrentEverJoyBookmarkState(
            currentPage.pageId
        );


    if (
        bookmarked
    ) {

        button.classList.add(
            "bookmarked"
        );


        button.querySelector(
            ".bookmark-icon"
        ).textContent =
            "♥";


        button.querySelector(
            ".bookmark-label"
        ).textContent =
            "Bookmarked";


        button.setAttribute(
            "aria-label",
            "Remove bookmark"
        );

    } else {

        button.classList.remove(
            "bookmarked"
        );


        button.querySelector(
            ".bookmark-icon"
        ).textContent =
            "♡";


        button.querySelector(
            ".bookmark-label"
        ).textContent =
            "Bookmark";


        button.setAttribute(
            "aria-label",
            "Bookmark current page"
        );

    }

}


/* =========================================================
   14. TOGGLE BOOKMARK
   ========================================================= */

function toggleEverJoyCurrentBookmark(
    button
) {

    const currentPage =
        getCurrentEverJoyPage();


    if (
        !currentPage
    ) {

        console.warn(
            "Ever Joy: Could not identify the current page."
        );

        return;

    }


    const {
        comicId,
        chapterId
    } =
        getEverJoyReaderParameters();


    const bookmarked =
        isEverJoyPageBookmarked(
            comicId,
            chapterId,
            currentPage.pageId
        );


    if (
        bookmarked
    ) {

        const bookmarks =
            getEverJoyBookmarks()
                .filter(
                    bookmark =>

                        !(
                            String(
                                bookmark.comicId
                            )
                            ===
                            String(
                                comicId
                            )

                            &&

                            String(
                                bookmark.chapterId
                            )
                            ===
                            String(
                                chapterId
                            )

                            &&

                            String(
                                bookmark.pageId
                            )
                            ===
                            String(
                                currentPage.pageId
                            )
                        )
                );


        saveEverJoyBookmarks(
            bookmarks
        );

    } else {

        bookmarkCurrentEverJoyPage(
            currentPage.pageId,
            currentPage.pageNumber
        );

    }


    updateEverJoyBookmarkButton(
        button
    );

}


/* =========================================================
   15. INITIALIZE BOOKMARK CONTROL
   ========================================================= */

function initializeEverJoyBookmarkControl() {

    const {
        comicId,
        chapterId
    } =
        getEverJoyReaderParameters();


    if (
        !comicId ||
        !chapterId
    ) {

        return;

    }


    const button =
        createEverJoyBookmarkButton();


    if (
        !button
    ) {

        return;

    }


    updateEverJoyBookmarkButton(
        button
    );


    button.addEventListener(
        "click",
        () => {

            toggleEverJoyCurrentBookmark(
                button
            );

        }
    );

}


/* =========================================================
   16. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEverJoyBookmarkControl();

    }
);