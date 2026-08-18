/* =========================================================
   EVER JOY COMICS
   COMIC + CHAPTER + DETAILS SYSTEM
   ========================================================= */


/* =========================================================
   1. GLOBAL DATA
   ========================================================= */

let comicCatalogue = [];

let chapterCatalogue = [];

let currentComic = null;

let currentChapter = null;


/* =========================================================
   2. PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializePage();

    }
);


async function initializePage() {

    const detailsPage =
        document.querySelector(
            "#comicDetails"
        );


    const chapterPage =
        document.querySelector(
            "#chapterPage"
        );


    /*
        Determine which comic page
        we're currently on.
    */

    if (detailsPage) {

        await initializeDetailsPage();

        return;

    }


    if (chapterPage) {

        await initializeChapterPage();

        return;

    }

}


/* =========================================================
   3. DETAILS PAGE INITIALIZATION
   ========================================================= */

async function initializeDetailsPage() {

    await loadComicCatalogue();

    await loadChapterCatalogue();


    const comicId =
        getComicIdFromURL();


    if (!comicId) {

        showComicError(
            "No comic was selected."
        );

        return;

    }


    currentComic =
        findComicById(
            comicId
        );


    if (!currentComic) {

        showComicError(
            "This comic could not be found."
        );

        return;

    }


    /*
        Render the complete comic
        details page.
    */

    renderComicDetails(
        currentComic
    );


    /*
        Initialize the library
        button after the comic
        has been identified.
    */

    setupComicLibraryButton();


    /*
        Connect the ratings and
        reviews system.

        reviews.js is responsible
        for rendering the actual
        reviews and rating data.
    */

    initializeComicReviews(
        currentComic
    );

}


/* =========================================================
   4. CHAPTER PAGE INITIALIZATION
   ========================================================= */

async function initializeChapterPage() {

    await loadComicCatalogue();

    await loadChapterCatalogue();


    const comicId =
        getComicIdFromURL();


    const chapterId =
        getChapterIdFromURL();


    if (!comicId || !chapterId) {

        showChapterError(
            "The chapter could not be identified."
        );

        return;

    }


    currentComic =
        findComicById(
            comicId
        );


    currentChapter =
        findChapterById(
            chapterId
        );


    if (!currentComic) {

        showChapterError(
            "This comic could not be found."
        );

        return;

    }


    if (!currentChapter) {

        showChapterError(
            "This chapter could not be found."
        );

        return;

    }


    /*
        Security check.

        Make sure the chapter actually
        belongs to the comic in the URL.
    */

    if (
        String(
            currentChapter.comicId
        )
        !==
        String(
            currentComic.id
        )
    ) {

        showChapterError(
            "This chapter does not belong to this comic."
        );

        return;

    }


    renderChapterPage(
        currentComic,
        currentChapter
    );

}


/* =========================================================
   5. LOAD COMICS
   ========================================================= */

async function loadComicCatalogue() {

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


        comicCatalogue =
            data.comics || [];


        console.log(
            `Loaded ${comicCatalogue.length} comics.`
        );


    } catch (error) {

        console.error(
            "Unable to load comic catalogue:",
            error
        );

        comicCatalogue = [];

    }

}


/* =========================================================
   6. LOAD CHAPTERS
   ========================================================= */

async function loadChapterCatalogue() {

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


        chapterCatalogue =
            data.chapters || [];


        console.log(
            `Loaded ${chapterCatalogue.length} chapters.`
        );


    } catch (error) {

        console.error(
            "Unable to load chapter catalogue:",
            error
        );

        chapterCatalogue = [];

    }

}


/* =========================================================
   7. URL HELPERS
   ========================================================= */

function getComicIdFromURL() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    return (
        parameters.get("id") ||
        parameters.get("comic")
    );

}


function getChapterIdFromURL() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    return parameters.get(
        "chapter"
    );

}


/* =========================================================
   8. FIND COMIC
   ========================================================= */

function findComicById(
    id
) {

    return comicCatalogue.find(
        comic =>
            String(
                comic.id
            )
            ===
            String(
                id
            )
    );

}


/* =========================================================
   9. FIND CHAPTER
   ========================================================= */

function findChapterById(
    id
) {

    return chapterCatalogue.find(
        chapter =>
            String(
                chapter.id
            )
            ===
            String(
                id
            )
    );

}


/* =========================================================
   10. FIND COMIC CHAPTERS
   ========================================================= */

function getChaptersForComic(
    comicId
) {

    return chapterCatalogue
        .filter(
            chapter =>
                String(
                    chapter.comicId
                )
                ===
                String(
                    comicId
                )
        )
        .sort(
            (a, b) =>
                Number(
                    b.chapterNumber
                )
                -
                Number(
                    a.chapterNumber
                )
        );

}


/* =========================================================
   11. COMIC DETAILS RENDERING
   ========================================================= */

function renderComicDetails(
    comic
) {

    renderBasicInformation(
        comic
    );


    renderFormat(
        comic
    );


    renderGenres(
        comic
    );


    renderTags(
        comic
    );


    renderAgeRating(
        comic
    );


    renderCreators(
        comic
    );


    renderDescription(
        comic
    );


    renderChapterInformation(
        comic
    );


    setupFirstChapterButton(
        comic
    );

}


/* =========================================================
   12. BASIC COMIC INFORMATION
   ========================================================= */

function renderBasicInformation(
    comic
) {

    const banner =
        document.querySelector(
            "#comicBanner"
        );


    const cover =
        document.querySelector(
            "#comicCover"
        );


    const title =
        document.querySelector(
            "#comicTitle"
        );


    const ratingSummary =
        document.querySelector(
            "#comicRatingSummary"
        );


    const ratingScore =
        document.querySelector(
            "#comicRatingScore"
        );


    const ratingStars =
        document.querySelector(
            "#comicRatingStars"
        );


    const ratingCount =
        document.querySelector(
            "#comicRatingCount"
        );


    const status =
        document.querySelector(
            "#comicStatus"
        );


    if (banner) {

        banner.src =
            comic.banner ||
            comic.cover ||
            "../assets/images/hero-placeholder.jpg";

        banner.alt =
            `${comic.title || "Comic"} banner`;

    }


    if (cover) {

        cover.src =
            comic.cover ||
            "../assets/images/comic-placeholder.jpg";

        cover.alt =
            `${comic.title || "Comic"} cover`;

    }


    if (title) {

        title.textContent =
            comic.title ||
            "Untitled Comic";

        document.title =
            `${comic.title || "Comic"} | Ever Joy Comics`;

    }


    /*
        Compact rating shown beside
        the comic title.

        This is intentionally small.
        The detailed rating/review
        section is handled separately.
    */

    const rating =
        getComicRating(
            comic
        );


    if (ratingSummary) {

        ratingSummary.hidden = false;

    }


    if (ratingScore) {

        ratingScore.textContent =
            rating !== null
                ? rating.toFixed(1)
                : "—";

    }


    if (ratingStars) {

        ratingStars.textContent =
            createRatingStars(
                rating,
                false
            );

        ratingStars.setAttribute(
            "aria-label",
            rating !== null
                ? `Rated ${rating.toFixed(1)} out of 5`
                : "No ratings yet"
        );

    }


    if (ratingCount) {

        const count =
            getComicRatingCount(
                comic
            );


        ratingCount.textContent =
            count > 0
                ? `${count} ${
                    count === 1
                        ? "rating"
                        : "ratings"
                  }`
                : "No ratings yet";

    }


    if (status) {

        status.textContent =
            formatStatus(
                comic.status
            );

    }

}


/* =========================================================
   13. COMIC RATING HELPERS
   ========================================================= */

function getComicRating(
    comic
) {

    const possibleRatings = [

        comic.rating,

        comic.averageRating,

        comic.overallRating

    ];


    for (
        const value of possibleRatings
    ) {

        const number =
            Number(
                value
            );


        if (
            Number.isFinite(
                number
            )
            &&
            number >= 0
            &&
            number <= 5
        ) {

            return number;

        }

    }


    return null;

}


function getComicRatingCount(
    comic
) {

    const possibleCounts = [

        comic.ratingCount,

        comic.ratingsCount,

        comic.totalRatings

    ];


    for (
        const value of possibleCounts
    ) {

        const number =
            Number(
                value
            );


        if (
            Number.isFinite(
                number
            )
            &&
            number >= 0
        ) {

            return number;

        }

    }


    return 0;

}


/*
    Generates the small five-star
    visual used throughout the
    details page.

    Gold is handled by CSS.
*/

function createRatingStars(
    rating,
    interactive = false
) {

    if (
        rating === null ||
        rating === undefined
    ) {

        return "☆☆☆☆☆";

    }


    const numericRating =
        Number(
            rating
        );


    let result = "";


    for (
        let index = 1;
        index <= 5;
        index++
    ) {

        if (
            numericRating >= index
        ) {

            result += "★";

        } else if (
            numericRating >= index - 0.5
        ) {

            result += "★";

        } else {

            result += "☆";

        }

    }


    return result;

}


/* =========================================================
   14. STATUS FORMATTER
   ========================================================= */

function formatStatus(
    status
) {

    if (!status) {

        return "Unknown";

    }


    return status
        .charAt(0)
        .toUpperCase()
        +
        status.slice(1);

}


/* =========================================================
   15. FORMAT
   ========================================================= */

function renderFormat(
    comic
) {

    const container =
        document.querySelector(
            "#comicFormat"
        );


    if (!container) return;


    const format =
        comic.format ||
        comic.type ||
        comic.contentFormat ||
        "";


    if (!format) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML = `

        <span class="comic-format-label">
            Format
        </span>

        <span class="comic-format-value">
            ${escapeHTML(
                format
            )}
        </span>

    `;

}


/* =========================================================
   16. GENRES
   ========================================================= */

function renderGenres(
    comic
) {

    const container =
        document.querySelector(
            "#comicGenres"
        );


    if (!container) return;


    container.innerHTML = "";


    const genres =
        Array.isArray(
            comic.genres
        )
            ? comic.genres
            : [];


    if (!genres.length) {

        return;

    }


    genres.forEach(
        genre => {

            const tag =
                document.createElement(
                    "span"
                );


            tag.className =
                "genre-tag";


            tag.textContent =
                genre;


            container.appendChild(
                tag
            );

        }
    );

}


/* =========================================================
   17. TAGS
   ========================================================= */

function renderTags(
    comic
) {

    const container =
        document.querySelector(
            "#comicTags"
        );


    if (!container) return;


    container.innerHTML = "";


    const tags =
        Array.isArray(
            comic.tags
        )
            ? comic.tags
            : [];


    if (!tags.length) {

        return;

    }


    tags.forEach(
        tagValue => {

            const tag =
                document.createElement(
                    "span"
                );


            tag.className =
                "comic-tag";


            tag.textContent =
                tagValue;


            container.appendChild(
                tag
            );

        }
    );

}


/* =========================================================
   18. AGE RATING
   ========================================================= */

function renderAgeRating(
    comic
) {

    const container =
        document.querySelector(
            "#comicAgeRating"
        );


    if (!container) return;


    const ageRating =
        comic.ageRating ||
        comic.contentRating ||
        comic.ageRatingCode ||
        "";


    if (!ageRating) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML = `

        <span class="age-rating-label">
            Age Rating
        </span>

        <span class="age-rating-value">
            ${escapeHTML(
                ageRating
            )}
        </span>

    `;

}


/* =========================================================
   19. CREATORS
   ========================================================= */

function renderCreators(
    comic
) {

    const container =
        document.querySelector(
            "#comicCreators"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        !comic.creators
    ) {

        return;

    }


    const roles = [

        {
            key: "writer",
            label: "Writer"
        },

        {
            key: "artist",
            label: "Artist"
        },

        {
            key: "colorist",
            label: "Colorist"
        },

        {
            key: "creator",
            label: "Creator"
        }

    ];


    roles.forEach(
        role => {

            const creator =
                comic.creators[
                    role.key
                ];


            if (!creator) {

                return;

            }


            const creatorName =
                typeof creator === "string"
                    ? creator
                    : creator.name;


            if (!creatorName) {

                return;

            }


            const creatorCard =
                document.createElement(
                    "div"
                );


            creatorCard.className =
                "creator-card";


            creatorCard.innerHTML = `

                <span class="creator-role">

                    ${escapeHTML(
                        role.label
                    )}

                </span>


                <span class="creator-name">

                    ${escapeHTML(
                        creatorName
                    )}

                </span>

            `;


            container.appendChild(
                creatorCard
            );

        }
    );

}


/* =========================================================
   20. DESCRIPTION
   ========================================================= */

function renderDescription(
    comic
) {

    const description =
        document.querySelector(
            "#comicDescription"
        );


    if (!description) return;


    description.textContent =
        comic.description ||
        "No description available.";

}


/* =========================================================
   21. CHAPTER LIST
   ========================================================= */

function renderChapterInformation(
    comic
) {

    const count =
        document.querySelector(
            "#chapterCount"
        );


    const chapterList =
        document.querySelector(
            "#chapterList"
        );


    const chapters =
        getChaptersForComic(
            comic.id
        );


    if (count) {

        count.textContent =
            `${chapters.length} ${
                chapters.length === 1
                    ? "Chapter"
                    : "Chapters"
            }`;

    }


    if (!chapterList) {

        return;

    }


    chapterList.innerHTML = "";


    if (!chapters.length) {

        chapterList.innerHTML = `

            <div class="chapter-empty">

                No chapters available yet.

            </div>

        `;

        return;

    }


    chapters.forEach(
        chapter => {

            const element =
                createChapterElement(
                    comic,
                    chapter
                );


            chapterList.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   22. CHAPTER CARD
   ========================================================= */

function createChapterElement(
    comic,
    chapter
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "chapter-item";


    /*
        Temporary price.

        Automatic pricing will
        replace this later.
    */

    const price =
        comic.access?.defaultChapterPrice ||
        30;


    const priceLabel =
        chapter.access?.type === "free"
            ? "Free"
            : `${price} ◈`;


    article.innerHTML = `

        <a
            href="../comic/chapter.html?id=${encodeURIComponent(
                comic.id
            )}&chapter=${encodeURIComponent(
                chapter.id
            )}"
        >

            <div class="chapter-info">

                <span class="chapter-number">

                    Chapter ${chapter.chapterNumber}

                    ${
                        chapter.title
                            ? ` — ${escapeHTML(
                                chapter.title
                              )}`
                            : ""
                    }

                </span>


                <span class="chapter-price">

                    ${priceLabel}

                </span>

            </div>

        </a>

    `;


    return article;

}


/* =========================================================
   23. FIRST CHAPTER BUTTON
   ========================================================= */

function setupFirstChapterButton(
    comic
) {

    const button =
        document.querySelector(
            "#readFirstChapter"
        );


    if (!button) return;


    const chapters =
        getChaptersForComic(
            comic.id
        );


    if (!chapters.length) {

        button.textContent =
            "No Chapters Yet";


        button.removeAttribute(
            "href"
        );


        button.style.opacity =
            "0.5";


        button.style.pointerEvents =
            "none";


        return;

    }


    const firstChapter =
        chapters[
            chapters.length - 1
        ];


    button.href =
        `../comic/chapter.html?id=${encodeURIComponent(
            comic.id
        )}&chapter=${encodeURIComponent(
            firstChapter.id
        )}`;

}


/* =========================================================
   24. CHAPTER PAGE RENDERING
   ========================================================= */

function renderChapterPage(
    comic,
    chapter
) {

    const comicTitle =
        document.querySelector(
            "#chapterComicTitle"
        );


    const chapterLabel =
        document.querySelector(
            "#chapterLabel"
        );


    const chapterTitle =
        document.querySelector(
            "#chapterTitle"
        );


    const chapterMeta =
        document.querySelector(
            "#chapterMeta"
        );


    const chapterPrice =
        document.querySelector(
            "#chapterPrice"
        );


    const backToComic =
        document.querySelector(
            "#backToComic"
        );


    const readButton =
        document.querySelector(
            "#readChapterButton"
        );


    /*
        Header title.
    */

    if (comicTitle) {

        comicTitle.textContent =
            comic.title;

    }


    /*
        Chapter number.
    */

    if (chapterLabel) {

        chapterLabel.textContent =
            `CHAPTER ${chapter.chapterNumber}`;

    }


    /*
        Chapter title.
    */

    if (chapterTitle) {

        chapterTitle.textContent =
            chapter.title ||
            `Chapter ${chapter.chapterNumber}`;

    }


    /*
        Chapter metadata.
    */

    if (chapterMeta) {

        chapterMeta.textContent =
            `${chapter.pageCount || 0} pages`;

    }


    /*
        Temporary price.

        Automatic Gem pricing will
        be connected later.
    */

    const price =
        comic.access?.defaultChapterPrice ||
        30;


    if (chapterPrice) {

        if (
            chapter.access?.type ===
            "free"
        ) {

            chapterPrice.textContent =
                "Free";

        } else {

            chapterPrice.textContent =
                `${price} Ever Gems`;

        }

    }


    /*
        Back to comic.
    */

    if (backToComic) {

        backToComic.href =
            `../comic/details.html?id=${encodeURIComponent(
                comic.id
            )}`;

    }


    /*
        Reader button.
    */

    if (readButton) {

        readButton.onclick = () => {

            openReader(
                comic,
                chapter
            );

        };

    }


    /*
        Browser title.
    */

    document.title =
        `${comic.title} — Chapter ${
            chapter.chapterNumber
        } | Ever Joy Comics`;

}


/* =========================================================
   25. OPEN READER
   ========================================================= */

function openReader(
    comic,
    chapter
) {

    window.location.href =
        `../comic/reader.html?id=${encodeURIComponent(
            comic.id
        )}&chapter=${encodeURIComponent(
            chapter.id
        )}`;

}


/* =========================================================
   26. COMIC ERROR
   ========================================================= */

function showComicError(
    message
) {

    const container =
        document.querySelector(
            "#comicDetails"
        );


    if (!container) return;


    container.innerHTML = `

        <section class="comic-error">

            <h1>
                Oops!
            </h1>


            <p>
                ${escapeHTML(
                    message
                )}
            </p>


            <a
                href="../index.html"
                class="read-first-btn"
            >

                Return Home

            </a>

        </section>

    `;

}


/* =========================================================
   27. CHAPTER ERROR
   ========================================================= */

function showChapterError(
    message
) {

    const container =
        document.querySelector(
            "#chapterPage"
        );


    if (!container) return;


    container.innerHTML = `

        <section class="comic-error">

            <h1>
                Oops!
            </h1>


            <p>
                ${escapeHTML(
                    message
                )}
            </p>


            <a
                href="../index.html"
                class="read-first-btn"
            >

                Return Home

            </a>

        </section>

    `;

}


/* =========================================================
   28. HTML ESCAPE HELPER
   ========================================================= */

function escapeHTML(
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
   LIBRARY CONNECTION
   Comic Details Page
   ========================================================= */


/* =========================================================
   29. LIBRARY STORAGE KEY
   ========================================================= */

const COMICS_LIBRARY_KEY =
    "everJoyLibrary";


/* =========================================================
   30. GET SAVED COMICS
   ========================================================= */

function getComicLibrary() {

    try {

        return JSON.parse(
            localStorage.getItem(
                COMICS_LIBRARY_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Could not load Ever Joy Library:",
            error
        );

        return [];

    }

}


/* =========================================================
   31. SAVE LIBRARY
   ========================================================= */

function saveComicLibrary(
    library
) {

    localStorage.setItem(
        COMICS_LIBRARY_KEY,
        JSON.stringify(
            library
        )
    );

}


/* =========================================================
   32. GET CURRENT COMIC ID
   ========================================================= */

function getCurrentComicId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("id") ||
        params.get("comic")
    );

}


/* =========================================================
   33. CHECK IF COMIC IS SAVED
   ========================================================= */

function isComicSaved(
    comicId
) {

    const library =
        getComicLibrary();


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
   34. UPDATE BUTTON APPEARANCE
   ========================================================= */

function updateLibraryButton(
    button,
    saved
) {

    if (!button) {

        return;

    }


    if (saved) {

        button.classList.add(
            "saved"
        );


        button.innerHTML = `
            ♥
            <span>
                Saved
            </span>
        `;


        button.setAttribute(
            "aria-label",
            "Remove comic from library"
        );

    } else {

        button.classList.remove(
            "saved"
        );


        button.innerHTML = `
            ♡
            <span>
                Save
            </span>
        `;


        button.setAttribute(
            "aria-label",
            "Save comic to library"
        );

    }

}


/* =========================================================
   35. ADD COMIC TO LIBRARY
   ========================================================= */

function addComicToLibrary(
    comicId
) {

    const library =
        getComicLibrary();


    const exists =
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


    if (exists) {

        return;

    }


    library.push({

        comicId:
            comicId,

        addedAt:
            new Date().toISOString()

    });


    saveComicLibrary(
        library
    );

}


/* =========================================================
   36. REMOVE COMIC FROM LIBRARY
   ========================================================= */

function removeComicFromLibrary(
    comicId
) {

    const library =
        getComicLibrary()
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


    saveComicLibrary(
        library
    );

}


/* =========================================================
   37. LIBRARY BUTTON
   ========================================================= */

function setupComicLibraryButton() {

    const button =
        document.querySelector(
            "#saveToLibraryBtn"
        );


    if (!button) {

        return;

    }


    const comicId =
        getCurrentComicId();


    if (!comicId) {

        console.warn(
            "Ever Joy: No comic ID found for Library button."
        );

        return;

    }


    /*
        Set the correct state when
        the details page loads.
    */

    updateLibraryButton(
        button,
        isComicSaved(
            comicId
        )
    );


    /*
        Prevent duplicate listeners.
    */

    button.onclick = () => {

        const currentlySaved =
            isComicSaved(
                comicId
            );


        if (currentlySaved) {

            removeComicFromLibrary(
                comicId
            );


            updateLibraryButton(
                button,
                false
            );

        } else {

            addComicToLibrary(
                comicId
            );


            updateLibraryButton(
                button,
                true
            );

        }

    };

}


/* =========================================================
   38. REVIEW SYSTEM CONNECTION
   ========================================================= */

/*
    This function does not render reviews itself.

    It connects the comic details page
    to reviews.js.

    reviews.js should expose:

        initializeComicReviews(comic)

    That function will be responsible for:

        - Loading ratings
        - Calculating the overall rating
        - Rendering the small rating
        - Rendering the rating breakdown
        - Loading reader reviews
        - Showing the first four reviews
        - Connecting "View All"
        - Handling the review page
*/

function initializeComicReviews(
    comic
) {

    if (
        typeof initializeComicReviewsSystem
        ===
        "function"
    ) {

        initializeComicReviewsSystem(
            comic
        );

        return;

    }


    /*
        Backward-compatible fallback.

        If reviews.js currently exposes
        initializeComicReviews instead,
        use that function.
    */

    if (
        typeof window.initializeComicReviews
        ===
        "function"
        &&
        window.initializeComicReviews !==
        initializeComicReviews
    ) {

        window.initializeComicReviews(
            comic
        );

        return;

    }


    /*
        Reviews.js may not have been
        connected yet.

        The details page should still
        function normally.
    */

    console.info(
        "Ever Joy: reviews.js is loaded, but its initialization function is not available yet."
    );

}
/* =========================================================
   EVER JOY COMICS
   ADD-ON: RATE & REVIEW SYSTEM
   ========================================================= */


/* =========================================================
   1. STORAGE
   ========================================================= */

const EVERJOY_REVIEW_STORAGE =
    "everJoyComicReviews";


function everJoyGetReviews() {

    try {

        return JSON.parse(
            localStorage.getItem(
                EVERJOY_REVIEW_STORAGE
            )
        ) || {};

    } catch (error) {

        console.error(
            "Ever Joy: Could not load reviews.",
            error
        );

        return {};

    }

}


function everJoySaveReviews(
    reviews
) {

    localStorage.setItem(
        EVERJOY_REVIEW_STORAGE,
        JSON.stringify(
            reviews
        )
    );

}


/* =========================================================
   2. CURRENT COMIC
   ========================================================= */

function everJoyGetReviewComicId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("id") ||
        params.get("comic")
    );

}


/* =========================================================
   3. CREATE RATE & REVIEW BUTTON
   ========================================================= */

function everJoyCreateRateButton() {

    const reviewsSection =
        document.querySelector(
            "#comicReviews"
        );


    if (!reviewsSection) {

        return;

    }


    /*
        Prevent duplicate buttons.
    */

    if (
        document.querySelector(
            "#everJoyRateReviewButton"
        )
    ) {

        return;

    }


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.id =
        "everJoyRateReviewButton";


    button.className =
        "everjoy-rate-review-button";


    button.innerHTML = `

        <span class="everjoy-rate-review-icon">
            ☆
        </span>

        <span>
            Rate & Review
        </span>

    `;


    /*
        Put the button directly
        below the Reviews heading.
    */

    const heading =
        reviewsSection.querySelector(
            ".reviews-heading"
        );


    if (heading) {

        heading.insertAdjacentElement(
            "afterend",
            button
        );

    } else {

        reviewsSection.prepend(
            button
        );

    }


    button.addEventListener(
        "click",
        everJoyOpenReviewPanel
    );

}


/* =========================================================
   4. CREATE REVIEW PANEL
   ========================================================= */

function everJoyCreateReviewPanel() {

    if (
        document.querySelector(
            "#everJoyReviewPanel"
        )
    ) {

        return;

    }


    const panel =
        document.createElement(
            "div"
        );


    panel.id =
        "everJoyReviewPanel";


    panel.className =
        "everjoy-review-panel";


    panel.hidden =
        true;


    panel.innerHTML = `

        <div class="everjoy-review-panel-inner">

            <div class="everjoy-review-panel-header">

                <div>

                    <span class="everjoy-review-eyebrow">
                        YOUR EXPERIENCE
                    </span>

                    <h3>
                        Rate this comic
                    </h3>

                </div>


                <button
                    type="button"
                    class="everjoy-review-close"
                    id="everJoyCloseReview"
                    aria-label="Close review panel"
                >
                    ×
                </button>

            </div>


            <div
                class="everjoy-star-picker"
                id="everJoyStarPicker"
                role="radiogroup"
                aria-label="Choose a rating"
            >

                <button
                    type="button"
                    class="everjoy-star"
                    data-rating="1"
                    aria-label="1 star"
                >
                    ☆
                </button>

                <button
                    type="button"
                    class="everjoy-star"
                    data-rating="2"
                    aria-label="2 stars"
                >
                    ☆
                </button>

                <button
                    type="button"
                    class="everjoy-star"
                    data-rating="3"
                    aria-label="3 stars"
                >
                    ☆
                </button>

                <button
                    type="button"
                    class="everjoy-star"
                    data-rating="4"
                    aria-label="4 stars"
                >
                    ☆
                </button>

                <button
                    type="button"
                    class="everjoy-star"
                    data-rating="5"
                    aria-label="5 stars"
                >
                    ☆
                </button>

            </div>


            <div
                class="everjoy-selected-rating"
                id="everJoySelectedRating"
            >
                Select a rating
            </div>


            <label
                class="everjoy-review-label"
                for="everJoyReviewText"
            >
                Your review
            </label>


            <textarea
                id="everJoyReviewText"
                class="everjoy-review-textarea"
                maxlength="1000"
                placeholder="What did you think about this comic?"
            ></textarea>


            <div class="everjoy-review-footer">

                <span
                    class="everjoy-review-counter"
                    id="everJoyReviewCounter"
                >
                    0 / 1000
                </span>


                <button
                    type="button"
                    class="everjoy-submit-review"
                    id="everJoySubmitReview"
                >
                    Submit Review
                </button>

            </div>


            <div
                class="everjoy-review-message"
                id="everJoyReviewMessage"
                aria-live="polite"
            ></div>

        </div>

    `;


    const reviewsSection =
        document.querySelector(
            "#comicReviews"
        );


    if (reviewsSection) {

        reviewsSection
            .appendChild(
                panel
            );

    }


    everJoySetupReviewPanel();

}


/* =========================================================
   5. REVIEW PANEL EVENTS
   ========================================================= */

let everJoySelectedRating =
    0;


function everJoySetupReviewPanel() {

    const stars =
        document.querySelectorAll(
            ".everjoy-star"
        );


    const textarea =
        document.querySelector(
            "#everJoyReviewText"
        );


    const closeButton =
        document.querySelector(
            "#everJoyCloseReview"
        );


    const submitButton =
        document.querySelector(
            "#everJoySubmitReview"
        );


    const counter =
        document.querySelector(
            "#everJoyReviewCounter"
        );


    stars.forEach(
        star => {

            star.addEventListener(
                "click",
                () => {

                    everJoySelectedRating =
                        Number(
                            star.dataset.rating
                        );


                    everJoyUpdateStars();


                    const selectedText =
                        document.querySelector(
                            "#everJoySelectedRating"
                        );


                    if (selectedText) {

                        selectedText.textContent =
                            `${everJoySelectedRating} ${
                                everJoySelectedRating === 1
                                    ? "star"
                                    : "stars"
                            }`;

                    }

                }
            );


            star.addEventListener(
                "mouseenter",
                () => {

                    everJoyPreviewStars(
                        Number(
                            star.dataset.rating
                        )
                    );

                }
            );

        }
    );


    const picker =
        document.querySelector(
            "#everJoyStarPicker"
        );


    if (picker) {

        picker.addEventListener(
            "mouseleave",
            () => {

                everJoyUpdateStars();

            }
        );

    }


    if (textarea) {

        textarea.addEventListener(
            "input",
            () => {

                if (counter) {

                    counter.textContent =
                        `${textarea.value.length} / 1000`;

                }

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            everJoyCloseReviewPanel
        );

    }


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            everJoySubmitReview
        );

    }

}


/* =========================================================
   6. STAR DISPLAY
   ========================================================= */

function everJoyUpdateStars() {

    const stars =
        document.querySelectorAll(
            ".everjoy-star"
        );


    stars.forEach(
        star => {

            const value =
                Number(
                    star.dataset.rating
                );


            star.textContent =
                value <=
                everJoySelectedRating
                    ? "★"
                    : "☆";


            star.classList.toggle(
                "selected",
                value <=
                everJoySelectedRating
            );

        }
    );

}


function everJoyPreviewStars(
    rating
) {

    const stars =
        document.querySelectorAll(
            ".everjoy-star"
        );


    stars.forEach(
        star => {

            const value =
                Number(
                    star.dataset.rating
                );


            star.textContent =
                value <= rating
                    ? "★"
                    : "☆";

        }
    );

}


/* =========================================================
   7. OPEN PANEL
   ========================================================= */

function everJoyOpenReviewPanel() {

    const panel =
        document.querySelector(
            "#everJoyReviewPanel"
        );


    if (!panel) {

        return;

    }


    panel.hidden =
        false;


    requestAnimationFrame(
        () => {

            panel.classList.add(
                "visible"
            );

        }
    );


    const firstStar =
        document.querySelector(
            ".everjoy-star"
        );


    if (firstStar) {

        firstStar.focus();

    }

}


/* =========================================================
   8. CLOSE PANEL
   ========================================================= */

function everJoyCloseReviewPanel() {

    const panel =
        document.querySelector(
            "#everJoyReviewPanel"
        );


    if (!panel) {

        return;

    }


    panel.classList.remove(
        "visible"
    );


    setTimeout(
        () => {

            panel.hidden =
                true;

        },
        180
    );

}


/* =========================================================
   9. SUBMIT REVIEW
   ========================================================= */

function everJoySubmitReview() {

    const comicId =
        everJoyGetReviewComicId();


    if (!comicId) {

        return;

    }


    if (
        everJoySelectedRating < 1
    ) {

        everJoyShowReviewMessage(
            "Please choose a star rating first."
        );

        return;

    }


    const textarea =
        document.querySelector(
            "#everJoyReviewText"
        );


    const text =
        textarea
            ? textarea.value.trim()
            : "";


    /*
        A reader may submit
        only a rating.
    */

    const reviews =
        everJoyGetReviews();


    if (
        !reviews[comicId]
    ) {

        reviews[comicId] =
            [];

    }


    /*
        Demo/local identity.

        This can later be replaced
        by the authenticated Ever Joy
        user account.
    */

    const review = {

        id:
            `review_${Date.now()}`,

        comicId:
            comicId,

        rating:
            everJoySelectedRating,

        text:
            text,

        username:
            "You",

        avatar:
            "",

        createdAt:
            new Date().toISOString()

    };


    reviews[comicId].push(
        review
    );


    everJoySaveReviews(
        reviews
    );


    everJoyShowReviewMessage(
        "Your rating has been saved."
    );


    /*
        Update visible review
        information without
        refreshing the page.
    */

    everJoyRefreshRatingDisplay(
        comicId
    );


    setTimeout(
        () => {

            everJoyCloseReviewPanel();

        },
        700
    );

}


/* =========================================================
   10. REFRESH RATING DISPLAY
   ========================================================= */

function everJoyRefreshRatingDisplay(
    comicId
) {

    const reviews =
        everJoyGetReviews();


    const comicReviews =
        reviews[comicId] || [];


    if (
        !comicReviews.length
    ) {

        return;

    }


    const total =
        comicReviews.reduce(
            (
                sum,
                review
            ) =>
                sum +
                Number(
                    review.rating
                ),
            0
        );


    const average =
        total /
        comicReviews.length;


    /*
        Compact hero rating.
    */

    const heroScore =
        document.querySelector(
            "#comicRatingScore"
        );


    const heroStars =
        document.querySelector(
            "#comicRatingStars"
        );


    const heroCount =
        document.querySelector(
            "#comicRatingCount"
        );


    if (heroScore) {

        heroScore.textContent =
            average.toFixed(1);

    }


    if (heroStars) {

        heroStars.textContent =
            "★★★★★";

    }


    if (heroCount) {

        heroCount.textContent =
            `${comicReviews.length} ${
                comicReviews.length === 1
                    ? "rating"
                    : "ratings"
            }`;

    }


    /*
        Detailed review rating.
    */

    const overallScore =
        document.querySelector(
            "#reviewsOverallScore"
        );


    const overallStars =
        document.querySelector(
            "#reviewsOverallStars"
        );


    const totalCount =
        document.querySelector(
            "#reviewsTotalCount"
        );


    if (overallScore) {

        overallScore.textContent =
            average.toFixed(1);

    }


    if (overallStars) {

        overallStars.textContent =
            "★★★★★";

    }


    if (totalCount) {

        totalCount.textContent =
            `${comicReviews.length} ${
                comicReviews.length === 1
                    ? "rating"
                    : "ratings"
            }`;

    }


    /*
        Add the newly submitted
        review to the visible list.
    */

    const reviewList =
        document.querySelector(
            "#reviewsList"
        );


    if (
        reviewList
        &&
        typeof renderReviews ===
        "function"
    ) {

        try {

            renderReviews(
                comicReviews
            );

        } catch (error) {

            console.warn(
                "Ever Joy: Existing review renderer could not refresh.",
                error
            );

        }

    }

}


/* =========================================================
   11. MESSAGE
   ========================================================= */

function everJoyShowReviewMessage(
    message
) {

    const element =
        document.querySelector(
            "#everJoyReviewMessage"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(
        () => {

            element.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================================
   12. INITIALIZE ADD-ON
   ========================================================= */

function everJoyInitializeRatingAddon() {

    /*
        Wait until the existing
        comic/review page has loaded.
    */

    const reviewsSection =
        document.querySelector(
            "#comicReviews"
        );


    if (!reviewsSection) {

        return;

    }


    everJoyCreateRateButton();

    everJoyCreateReviewPanel();

}


/*
    Run after DOM is ready.
*/

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            setTimeout(
                everJoyInitializeRatingAddon,
                100
            );

        }
    );

} else {

    setTimeout(
        everJoyInitializeRatingAddon,
        100
    );

}
/* =========================================================
   EVER JOY COMICS
   FOLLOW BUTTON
   ========================================================= */

const EVER_JOY_FOLLOW_KEY =
    "everJoyFollowingComics";


function getEverJoyFollowedComics() {

    try {

        const saved =
            localStorage.getItem(
                EVER_JOY_FOLLOW_KEY
            );

        return saved
            ? JSON.parse(saved)
            : [];

    } catch (error) {

        console.error(
            "Ever Joy: Could not load followed comics.",
            error
        );

        return [];

    }

}


function saveEverJoyFollowedComics(
    comics
) {

    localStorage.setItem(
        EVER_JOY_FOLLOW_KEY,
        JSON.stringify(comics)
    );

}


function setupEverJoyFollowButton() {

    const button =
        document.querySelector(
            "#followComicBtn"
        );


    if (!button) {

        console.warn(
            "Ever Joy: Follow button was not found."
        );

        return;

    }


    const parameters =
        new URLSearchParams(
            window.location.search
        );


    const comicId =
        parameters.get("id") ||
        parameters.get("comic");


    if (!comicId) {

        console.warn(
            "Ever Joy: Comic ID was not found."
        );

        return;

    }


    let followedComics =
        getEverJoyFollowedComics();


    const isFollowing =
        followedComics.some(
            id =>
                String(id) ===
                String(comicId)
        );


    updateEverJoyFollowButton(
        button,
        isFollowing
    );


    button.addEventListener(
        "click",
        function () {

            let comics =
                getEverJoyFollowedComics();


            const currentlyFollowing =
                comics.some(
                    id =>
                        String(id) ===
                        String(comicId)
                );


            if (currentlyFollowing) {

                comics =
                    comics.filter(
                        id =>
                            String(id) !==
                            String(comicId)
                    );


                saveEverJoyFollowedComics(
                    comics
                );


                updateEverJoyFollowButton(
                    button,
                    false
                );

            } else {

                comics.push(
                    comicId
                );


                saveEverJoyFollowedComics(
                    comics
                );


                updateEverJoyFollowButton(
                    button,
                    true
                );

            }

        }
    );

}


function updateEverJoyFollowButton(
    button,
    following
) {

    if (following) {

        button.classList.add(
            "following"
        );


        button.innerHTML =
            "Following";


        button.setAttribute(
            "aria-label",
            "Unfollow comic"
        );

    } else {

        button.classList.remove(
            "following"
        );


        button.innerHTML =
            "Follow";


        button.setAttribute(
            "aria-label",
            "Follow comic"
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupEverJoyFollowButton();

    }
);