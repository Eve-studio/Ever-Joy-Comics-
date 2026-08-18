/* =========================================================
   EVER JOY COMICS
   PAGE BOOKMARK SYSTEM
   ========================================================= */


/* =========================================================
   1. STORAGE
   ========================================================= */

const EVER_JOY_PAGE_BOOKMARKS_KEY =
    "everJoyPageBookmarks";


/* =========================================================
   2. GET BOOKMARKS
   ========================================================= */

function getEverJoyPageBookmarks() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVER_JOY_PAGE_BOOKMARKS_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Ever Joy: Could not load page bookmarks.",
            error
        );

        return [];

    }

}


/* =========================================================
   3. SAVE BOOKMARKS
   ========================================================= */

function saveEverJoyPageBookmarks(
    bookmarks
) {

    localStorage.setItem(

        EVER_JOY_PAGE_BOOKMARKS_KEY,

        JSON.stringify(
            bookmarks
        )

    );

}


/* =========================================================
   4. GET CURRENT READER PAGE
   ========================================================= */

function getCurrentEverJoyReaderPage() {

    if (
        !readerCurrentComic ||
        !readerCurrentChapter
    ) {

        return null;

    }


    const pageIndex =
        readerCurrentPage;


    const pageId =
        readerCurrentChapter.pages[
            pageIndex
        ];


    if (
        !pageId
    ) {

        return null;

    }


    return {

        comicId:
            readerCurrentComic.id,

        comicTitle:
            readerCurrentComic.title,

        chapterId:
            readerCurrentChapter.id,

        chapterNumber:
            readerCurrentChapter.chapterNumber,

        chapterTitle:
            readerCurrentChapter.title,

        pageId:
            pageId,

        pageNumber:
            pageIndex + 1

    };

}


/* =========================================================
   5. CHECK BOOKMARK
   ========================================================= */

function isCurrentEverJoyPageBookmarked() {

    const currentPage =
        getCurrentEverJoyReaderPage();


    if (
        !currentPage
    ) {

        return false;

    }


    return getEverJoyPageBookmarks()
        .some(
            bookmark =>

                bookmark.comicId ===
                    currentPage.comicId

                &&

                bookmark.chapterId ===
                    currentPage.chapterId

                &&

                bookmark.pageId ===
                    currentPage.pageId

        );

}


/* =========================================================
   6. ADD BOOKMARK
   ========================================================= */

function addCurrentEverJoyPageBookmark() {

    const currentPage =
        getCurrentEverJoyReaderPage();


    if (
        !currentPage
    ) {

        return false;

    }


    const bookmarks =
        getEverJoyPageBookmarks();


    const exists =
        bookmarks.some(
            bookmark =>

                bookmark.comicId ===
                    currentPage.comicId

                &&

                bookmark.chapterId ===
                    currentPage.chapterId

                &&

                bookmark.pageId ===
                    currentPage.pageId

        );


    if (
        exists
    ) {

        return false;

    }


    bookmarks.unshift({

        id:
            `page_bookmark_${Date.now()}`,

        ...currentPage,

        createdAt:
            new Date().toISOString()

    });


    saveEverJoyPageBookmarks(
        bookmarks
    );


    return true;

}


/* =========================================================
   7. REMOVE CURRENT PAGE BOOKMARK
   ========================================================= */

function removeCurrentEverJoyPageBookmark() {

    const currentPage =
        getCurrentEverJoyReaderPage();


    if (
        !currentPage
    ) {

        return false;

    }


    const bookmarks =
        getEverJoyPageBookmarks()
            .filter(
                bookmark =>

                    !(
                        bookmark.comicId ===
                            currentPage.comicId

                        &&

                        bookmark.chapterId ===
                            currentPage.chapterId

                        &&

                        bookmark.pageId ===
                            currentPage.pageId
                    )

            );


    saveEverJoyPageBookmarks(
        bookmarks
    );


    return true;

}


/* =========================================================
   8. TOGGLE CURRENT PAGE BOOKMARK
   ========================================================= */

function toggleCurrentEverJoyPageBookmark() {

    if (
        isCurrentEverJoyPageBookmarked()
    ) {

        removeCurrentEverJoyPageBookmark();

        return false;

    }


    addCurrentEverJoyPageBookmark();

    return true;

}
/* =========================================================
   9. UPDATE PAGE BOOKMARK BUTTON
   ========================================================= */

function updateEverJoyPageBookmarkButton() {

    const button =
        document.querySelector(
            "#readerBookmarkButton"
        );


    if (!button) {

        return;

    }


    const bookmarked =
        isCurrentEverJoyPageBookmarked();


    const icon =
        button.querySelector(
            "span"
        );


    if (bookmarked) {

        if (icon) {

            icon.textContent =
                "♥";

        }


        button.classList.add(
            "bookmarked"
        );


        button.setAttribute(
            "aria-label",
            "Remove page bookmark"
        );


        const text =
            button.lastChild;


        if (
            text &&
            text.nodeType ===
                Node.TEXT_NODE
        ) {

            text.textContent =
                " Remove Page Bookmark";

        }

    } else {

        if (icon) {

            icon.textContent =
                "♡";

        }


        button.classList.remove(
            "bookmarked"
        );


        button.setAttribute(
            "aria-label",
            "Bookmark current page"
        );


        const text =
            button.lastChild;


        if (
            text &&
            text.nodeType ===
                Node.TEXT_NODE
        ) {

            text.textContent =
                " Bookmark Current Page";

        }

    }

}


/* =========================================================
   10. CONNECT PAGE BOOKMARK BUTTON
   ========================================================= */

function initializeEverJoyPageBookmarkButton() {

    const button =
        document.querySelector(
            "#readerBookmarkButton"
        );


    if (!button) {

        return;

    }


    if (
        button.dataset.pageBookmarkReady
        ===
        "true"
    ) {

        updateEverJoyPageBookmarkButton();

        return;

    }


    button.dataset.pageBookmarkReady =
        "true";


    button.addEventListener(
        "click",
        event => {

            event.preventDefault();


            toggleCurrentEverJoyPageBookmark();


            updateEverJoyPageBookmarkButton();

        }
    );


    updateEverJoyPageBookmarkButton();

}


/* =========================================================
   11. UPDATE WHEN READER PAGE CHANGES
   ========================================================= */

function refreshEverJoyPageBookmarkButton() {

    updateEverJoyPageBookmarkButton();

}


/* =========================================================
   12. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            () => {

                initializeEverJoyPageBookmarkButton();

            },

            300

        );

    }
);
/* =========================================================
   EVER JOY COMICS
   BOOKMARKS PAGE CONNECTION
   ========================================================= */


/* =========================================================
   1. BOOKMARK STORAGE CONNECTION
   ========================================================= */

const EVER_JOY_BOOKMARKS_PAGE_KEY =
    "everJoyBookmarks";


/* =========================================================
   2. GET SAVED BOOKMARKS
   ========================================================= */

function getBookmarksPageData() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVER_JOY_BOOKMARKS_PAGE_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Ever Joy: Could not load bookmarks.",
            error
        );

        return [];

    }

}


/* =========================================================
   3. FIND BOOKMARK CONTAINER
   ========================================================= */

function getBookmarksPageContainer() {

    return (
        document.querySelector("#bookmarkList")
        ||
        document.querySelector("#bookmarksList")
        ||
        document.querySelector(".bookmark-list")
        ||
        document.querySelector(".bookmarks-list")
    );

}


/* =========================================================
   4. FIND EMPTY STATE
   ========================================================= */

function getBookmarksEmptyState() {

    return (
        document.querySelector("#bookmarksEmpty")
        ||
        document.querySelector(".bookmarks-empty")
    );

}


/* =========================================================
   5. CREATE BOOKMARK CARD
   ========================================================= */

function createBookmarksPageCard(
    bookmark
) {

    const card =
        document.createElement("article");


    card.className =
        "bookmark-card";


    card.dataset.bookmarkId =
        bookmark.id;


    /*
        Build the reader destination.

        This sends the reader back to
        the exact comic + chapter.

        The page number is also included
        so the reader can later restore
        the bookmarked page.
    */

    const readerUrl =
        `reader.html?comic=${
            encodeURIComponent(
                bookmark.comicId
            )
        }&chapter=${
            encodeURIComponent(
                bookmark.chapterId
            )
        }&page=${
            encodeURIComponent(
                bookmark.pageNumber || 1
            )
        }`;


    const cover =
        document.createElement("div");

    cover.className =
        "bookmark-cover";


    const image =
        document.createElement("img");


    /*
        We don't assume a real cover
        exists yet.

        The comic catalogue will be
        connected later when creator
        uploads become available.
    */

    image.src =
        "../assets/images/comic-placeholder.jpg";


    image.alt =
        bookmark.chapterTitle ||
        "Bookmarked comic";


    image.loading =
        "lazy";


    image.addEventListener(
        "error",
        () => {

            image.style.visibility =
                "hidden";

        }
    );


    cover.appendChild(image);


    /* =====================================================
       INFORMATION
       ===================================================== */

    const info =
        document.createElement("div");


    info.className =
        "bookmark-info";


    const comicTitle =
        document.createElement("h3");


    comicTitle.className =
        "bookmark-comic-title";


    comicTitle.textContent =
        bookmark.comicTitle ||
        `Comic ${bookmark.comicId}`;


    const chapterTitle =
        document.createElement("p");


    chapterTitle.className =
        "bookmark-chapter-title";


    chapterTitle.textContent =
        bookmark.chapterNumber
            ? `Chapter ${
                bookmark.chapterNumber
            } — ${
                bookmark.chapterTitle ||
                "Untitled"
            }`
            : (
                bookmark.chapterTitle ||
                "Bookmarked chapter"
            );


    const pageInfo =
        document.createElement("div");


    pageInfo.className =
        "bookmark-page-info";


    const pageText =
        document.createElement("span");


    pageText.textContent =
        bookmark.pageNumber
            ? `Page ${bookmark.pageNumber}`
            : "Chapter bookmark";


    pageInfo.appendChild(
        pageText
    );


    info.appendChild(
        comicTitle
    );


    info.appendChild(
        chapterTitle
    );


    info.appendChild(
        pageInfo
    );


    /* =====================================================
       ACTIONS
       ===================================================== */

    const actions =
        document.createElement("div");


    actions.className =
        "bookmark-actions";


    /* OPEN */

    const openButton =
        document.createElement("a");


    openButton.className =
        "bookmark-open-btn";


    openButton.href =
        readerUrl;


    openButton.setAttribute(
        "aria-label",
        "Open bookmark"
    );


    openButton.innerHTML =
        "→";


    /* REMOVE */

    const removeButton =
        document.createElement("button");


    removeButton.type =
        "button";


    removeButton.className =
        "bookmark-remove-btn";


    removeButton.setAttribute(
        "aria-label",
        "Remove bookmark"
    );


    removeButton.innerHTML =
        "×";


    removeButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            removeBookmarkFromPage(
                bookmark.id
            );

        }
    );


    actions.appendChild(
        openButton
    );


    actions.appendChild(
        removeButton
    );


    /* =====================================================
       BUILD CARD
       ===================================================== */

    card.appendChild(
        cover
    );


    card.appendChild(
        info
    );


    card.appendChild(
        actions
    );


    return card;

}


/* =========================================================
   6. RENDER BOOKMARKS
   ========================================================= */

function renderEverJoyBookmarksPage() {

    const container =
        getBookmarksPageContainer();


    if (!container) {

        console.warn(
            "Ever Joy: Bookmark list container was not found."
        );

        return;

    }


    const bookmarks =
        getBookmarksPageData();


    container.innerHTML =
        "";


    const emptyState =
        getBookmarksEmptyState();


    /* =====================================================
       EMPTY
       ===================================================== */

    if (!bookmarks.length) {

        if (emptyState) {

            emptyState.style.display =
                "flex";

        } else {

            container.innerHTML = `

                <div class="bookmarks-empty">

                    <div class="bookmarks-empty-icon">
                        ♡
                    </div>

                    <h2>
                        No bookmarks yet
                    </h2>

                    <p>
                        Bookmark a page while reading
                        and it will appear here.
                    </p>

                </div>

            `;

        }

        updateBookmarksCount(0);

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

    }


    /* =====================================================
       SORT NEWEST FIRST
       ===================================================== */

    bookmarks.sort(
        (a, b) => {

            return (
                new Date(
                    b.createdAt || 0
                )
                -
                new Date(
                    a.createdAt || 0
                )
            );

        }
    );


    /* =====================================================
       RENDER
       ===================================================== */

    bookmarks.forEach(
        bookmark => {

            container.appendChild(
                createBookmarksPageCard(
                    bookmark
                )
            );

        }
    );


    updateBookmarksCount(
        bookmarks.length
    );

}


/* =========================================================
   7. UPDATE COUNT
   ========================================================= */

function updateBookmarksCount(
    count
) {

    const counter =
        document.querySelector(
            "#bookmarksCount"
        )
        ||
        document.querySelector(
            ".bookmarks-header-count"
        );


    if (!counter) {

        return;

    }


    counter.textContent =
        count === 1
            ? "1 bookmark"
            : `${count} bookmarks`;

}


/* =========================================================
   8. REMOVE BOOKMARK
   ========================================================= */

function removeBookmarkFromPage(
    bookmarkId
) {

    const bookmarks =
        getBookmarksPageData();


    const updated =
        bookmarks.filter(
            bookmark =>
                String(
                    bookmark.id
                )
                !==
                String(
                    bookmarkId
                )
        );


    localStorage.setItem(

        EVER_JOY_BOOKMARKS_PAGE_KEY,

        JSON.stringify(
            updated
        )

    );


    renderEverJoyBookmarksPage();

}


/* =========================================================
   9. REFRESH WHEN RETURNING TO PAGE
   ========================================================= */

window.addEventListener(
    "pageshow",
    () => {

        renderEverJoyBookmarksPage();

    }
);


/* =========================================================
   10. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderEverJoyBookmarksPage();

    }
);