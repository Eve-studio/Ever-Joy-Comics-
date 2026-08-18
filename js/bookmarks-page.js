/* =========================================================
   EVER JOY COMICS
   BOOKMARKS PAGE
   ========================================================= */


/* =========================================================
   1. ELEMENTS
   ========================================================= */

const bookmarkList =
    document.querySelector(
        "#bookmarkList"
    );


const bookmarksEmpty =
    document.querySelector(
        "#bookmarksEmpty"
    );


const bookmarksCount =
    document.querySelector(
        "#bookmarksCount"
    );


/* =========================================================
   2. LOAD BOOKMARKS
   ========================================================= */

function loadEverJoyBookmarksPage() {

    if (
        !bookmarkList
    ) {

        return;

    }


    const bookmarks =
        getEverJoyPageBookmarks();


    bookmarkList.innerHTML =
        "";


    updateEverJoyBookmarkCount(
        bookmarks.length
    );


    if (
        !bookmarks.length
    ) {

        showEverJoyBookmarksEmpty();

        return;

    }


    hideEverJoyBookmarksEmpty();


    bookmarks.forEach(
        bookmark => {

            bookmarkList.appendChild(
                createEverJoyBookmarkCard(
                    bookmark
                )
            );

        }
    );

}


/* =========================================================
   3. COUNT
   ========================================================= */

function updateEverJoyBookmarkCount(
    count
) {

    if (
        !bookmarksCount
    ) {

        return;

    }


    bookmarksCount.textContent =

        count === 1

            ? "1 saved page"

            : `${count} saved pages`;

}


/* =========================================================
   4. CREATE BOOKMARK CARD
   ========================================================= */

function createEverJoyBookmarkCard(
    bookmark
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "bookmark-card";


    card.innerHTML = `

        <div class="bookmark-card-cover">

            <div class="bookmark-page-icon">
                ♡
            </div>

        </div>


        <div class="bookmark-card-content">

            <h2>
                ${escapeEverJoyBookmarkText(
                    bookmark.comicTitle
                )}
            </h2>


            <p class="bookmark-chapter">

                Chapter
                ${bookmark.chapterNumber}

                ${bookmark.chapterTitle
                    ? ` · ${escapeEverJoyBookmarkText(
                        bookmark.chapterTitle
                    )}`
                    : ""
                }

            </p>


            <span class="bookmark-page-number">

                Page ${bookmark.pageNumber}

            </span>


            <div class="bookmark-card-actions">

                <button
                    class="bookmark-open-btn"
                    data-bookmark-id="${bookmark.id}"
                >

                    Open Page

                </button>


                <button
                    class="bookmark-delete-btn"
                    data-bookmark-id="${bookmark.id}"
                    aria-label="Remove bookmark"
                >

                    ×

                </button>

            </div>

        </div>

    `;


    const openButton =
        card.querySelector(
            ".bookmark-open-btn"
        );


    const deleteButton =
        card.querySelector(
            ".bookmark-delete-btn"
        );


    openButton.addEventListener(
        "click",
        () => {

            openEverJoyBookmark(
                bookmark
            );

        }
    );


    deleteButton.addEventListener(
        "click",
        () => {

            removeEverJoyBookmarkFromPage(
                bookmark.id
            );

        }
    );


    return card;

}


/* =========================================================
   5. OPEN BOOKMARK
   ========================================================= */

function openEverJoyBookmark(
    bookmark
) {

    const url =

        `../comic/reader.html` +

        `?comic=${encodeURIComponent(
            bookmark.comicId
        )}` +

        `&chapter=${encodeURIComponent(
            bookmark.chapterId
        )}` +

        `&page=${encodeURIComponent(
            bookmark.pageNumber
        )}`;


    window.location.href =
        url;

}


/* =========================================================
   6. REMOVE BOOKMARK
   ========================================================= */

function removeEverJoyBookmarkFromPage(
    bookmarkId
) {

    const bookmarks =
        getEverJoyPageBookmarks()
            .filter(
                bookmark =>
                    bookmark.id !==
                    bookmarkId
            );


    saveEverJoyPageBookmarks(
        bookmarks
    );


    loadEverJoyBookmarksPage();

}


/* =========================================================
   7. EMPTY STATE
   ========================================================= */

function showEverJoyBookmarksEmpty() {

    if (
        bookmarksEmpty
    ) {

        bookmarksEmpty.hidden =
            false;

    }

}


function hideEverJoyBookmarksEmpty() {

    if (
        bookmarksEmpty
    ) {

        bookmarksEmpty.hidden =
            true;

    }

}


/* =========================================================
   8. SAFE TEXT
   ========================================================= */

function escapeEverJoyBookmarkText(
    value
) {

    return String(
        value || ""
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
   9. REFRESH
   ========================================================= */

const refreshButton =
    document.querySelector(
        "#bookmarkRefreshButton"
    );


if (
    refreshButton
) {

    refreshButton.addEventListener(
        "click",
        () => {

            loadEverJoyBookmarksPage();

        }
    );

}


/* =========================================================
   10. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadEverJoyBookmarksPage();

    }
);