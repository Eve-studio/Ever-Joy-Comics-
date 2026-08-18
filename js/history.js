/* =========================================================
EVER JOY COMICS
READING HISTORY SYSTEM
========================================================= */

/* =========================================================

1. HISTORY STORAGE
   ========================================================= */

const EVER_JOY_HISTORY_KEY =
"everJoyReadingHistory";

/* =========================================================
2. GET HISTORY
========================================================= */

function getEverJoyReadingHistory() {

try {

    const stored =
        localStorage.getItem(
            EVER_JOY_HISTORY_KEY
        );


    if (!stored) {

        return [];

    }


    const history =
        JSON.parse(stored);


    return Array.isArray(history)
        ? history
        : [];

} catch (error) {

    console.error(
        "Ever Joy: Could not load reading history.",
        error
    );


    return [];

}

}

/* =========================================================
3. SAVE HISTORY
========================================================= */

function saveEverJoyReadingHistory(
history
) {

try {

    localStorage.setItem(

        EVER_JOY_HISTORY_KEY,

        JSON.stringify(
            history
        )

    );

} catch (error) {

    console.error(
        "Ever Joy: Could not save reading history.",
        error
    );

}

}

/* =========================================================
4. SAVE / UPDATE READING PROGRESS
========================================================= */

function saveReadingProgress(
comicId,
chapterId,
chapterTitle,
progress
) {

if (
    !comicId ||
    !chapterId
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

            &&

            String(
                item.chapterId
            )
            ===
            String(
                chapterId
            )

    );


const safeProgress =
    Math.round(
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    progress
                ) || 0
            )
        )
    );


const now =
    new Date().toISOString();


const historyEntry = {

    comicId:
        comicId,

    chapterId:
        chapterId,

    chapterTitle:
        chapterTitle || "",

    progress:
        safeProgress,

    lastReadAt:
        now

};


/*
    Update existing entry.
*/

if (
    existingIndex !== -1
) {

    history[
        existingIndex
    ] = {

        ...history[
            existingIndex
        ],

        ...historyEntry

    };

}


/*
    Create a new entry.
*/

else {

    history.unshift(
        historyEntry
    );

}


/*
    Keep the most recently
    updated chapter at the top.
*/

history.sort(
    (
        a,
        b
    ) =>

        new Date(
            b.lastReadAt
        )
        -
        new Date(
            a.lastReadAt
        )

);


/*
    Prevent unlimited growth.
    The most recent 100 entries
    are enough for a reading history.
*/

saveEverJoyReadingHistory(
    history.slice(
        0,
        100
    )
);

}

/* =========================================================
5. REMOVE HISTORY ENTRY
========================================================= */

function removeEverJoyHistoryEntry(
comicId,
chapterId
) {

const history =
    getEverJoyReadingHistory()
        .filter(
            item =>

                !(
                    String(
                        item.comicId
                    )
                    ===
                    String(
                        comicId
                    )

                    &&

                    String(
                        item.chapterId
                    )
                    ===
                    String(
                        chapterId
                    )
                )
        );


saveEverJoyReadingHistory(
    history
);


renderEverJoyHistory();

}

/* =========================================================
6. CLEAR ALL HISTORY
========================================================= */

function clearEverJoyReadingHistory() {

localStorage.removeItem(
    EVER_JOY_HISTORY_KEY
);


renderEverJoyHistory();

}

/* =========================================================
7. LOAD COMIC CATALOGUE
========================================================= */

async function loadHistoryComics() {

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


    return Array.isArray(data)
        ? data
        : (
            Array.isArray(
                data.comics
            )
                ? data.comics
                : []
        );

} catch (error) {

    console.error(
        "Ever Joy: Could not load comics catalogue.",
        error
    );


    return [];

}

}

/* =========================================================
8. LOAD CHAPTER CATALOGUE
========================================================= */

async function loadHistoryChapters() {

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


    return Array.isArray(data)
        ? data
        : (
            Array.isArray(
                data.chapters
            )
                ? data.chapters
                : []
        );

} catch (error) {

    console.error(
        "Ever Joy: Could not load chapters catalogue.",
        error
    );


    return [];

}

}

/* =========================================================
9. FIND COMIC
========================================================= */

function findHistoryComic(
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
10. FIND CHAPTER
========================================================= */

function findHistoryChapter(
chapters,
chapterId
) {

return chapters.find(
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
11. FORMAT DATE
========================================================= */

function formatHistoryDate(
dateValue
) {

if (
    !dateValue
) {

    return "Recently";

}


const date =
    new Date(
        dateValue
    );


if (
    Number.isNaN(
        date.getTime()
    )
) {

    return "Recently";

}


const now =
    new Date();


const difference =
    now.getTime()
    -
    date.getTime();


const minutes =
    Math.floor(
        difference /
        60000
    );


if (
    minutes < 1
) {

    return "Just now";

}


if (
    minutes < 60
) {

    return `${minutes}m ago`;

}


const hours =
    Math.floor(
        minutes / 60
    );


if (
    hours < 24
) {

    return `${hours}h ago`;

}


const days =
    Math.floor(
        hours / 24
    );


if (
    days < 7
) {

    return `${days}d ago`;

}


return date.toLocaleDateString(
    undefined,
    {
        day: "numeric",
        month: "short"
    }
);

}

/* =========================================================
12. CREATE HISTORY CARD
========================================================= */

function createHistoryCard(
entry,
comic,
chapter
) {

const card =
    document.createElement(
        "article"
    );


card.className =
    "history-card";


if (
    Number(
        entry.progress
    ) >= 100
) {

    card.classList.add(
        "completed"
    );

}


/*
    Comic cover.
*/

const cover =
    document.createElement(
        "div"
    );


cover.className =
    "history-cover";


const image =
    document.createElement(
        "img"
    );


image.src =
    comic?.cover
    ||
    comic?.coverImage
    ||
    comic?.coverUrl
    ||
    "../assets/images/comic-placeholder.jpg";


image.alt =
    comic?.title
    ||
    "Comic cover";


image.loading =
    "lazy";


image.addEventListener(
    "error",
    () => {

        image.src =
            "../assets/images/comic-placeholder.jpg";

    }
);


cover.appendChild(
    image
);


/*
    Main information.
*/

const info =
    document.createElement(
        "div"
    );


info.className =
    "history-info";


const comicTitle =
    document.createElement(
        "div"
    );


comicTitle.className =
    "history-comic-title";


comicTitle.textContent =
    comic?.title
    ||
    "Unknown Comic";


const chapterTitle =
    document.createElement(
        "div"
    );


chapterTitle.className =
    "history-chapter-title";


const chapterNumber =
    chapter?.chapterNumber;


chapterTitle.textContent =

    chapterNumber
        ? `Chapter ${chapterNumber}: ${
            chapter?.title
            ||
            entry.chapterTitle
            ||
            "Untitled"
        }`
        : (
            chapter?.title
            ||
            entry.chapterTitle
            ||
            "Chapter"
        );


/*
    Metadata.
*/

const meta =
    document.createElement(
        "div"
    );


meta.className =
    "history-meta";


const time =
    document.createElement(
        "span"
    );


time.textContent =
    formatHistoryDate(
        entry.lastReadAt
    );


const progressText =
    document.createElement(
        "span"
    );


const progress =
    Math.round(
        Number(
            entry.progress
        ) || 0
    );


progressText.className =
    "history-progress-text";


progressText.textContent =
    `${progress}% read`;


meta.appendChild(
    time
);


meta.appendChild(
    progressText
);


/*
    Progress bar.
*/

const progressTrack =
    document.createElement(
        "div"
    );


progressTrack.className =
    "history-progress";


const progressBar =
    document.createElement(
        "div"
    );


progressBar.className =
    "history-progress-bar";


progressBar.style.width =
    `${progress}%`;


progressTrack.appendChild(
    progressBar
);


info.appendChild(
    comicTitle
);


info.appendChild(
    chapterTitle
);


info.appendChild(
    meta
);


info.appendChild(
    progressTrack
);


/*
    Continue button.
*/

const continueButton =
    document.createElement(
        "div"
    );


continueButton.className =
    "history-continue";


continueButton.textContent =
    "›";


/*
    Continue reading.
*/

card.addEventListener(
    "click",
    () => {

        openHistoryChapter(
            entry,
            chapter
        );

    }
);


card.appendChild(
    cover
);


card.appendChild(
    info
);


card.appendChild(
    continueButton
);


return card;

}

/* =========================================================
13. OPEN CHAPTER FROM HISTORY
========================================================= */

function openHistoryChapter(
entry,
chapter
) {

if (
    !entry.comicId ||
    !entry.chapterId
) {

    return;

}


const url =
    `../comic/reader.html?comic=${
        encodeURIComponent(
            entry.comicId
        )
    }&chapter=${
        encodeURIComponent(
            entry.chapterId
        )
    }`;


window.location.href =
    url;

}

/* =========================================================
14. RENDER HISTORY
========================================================= */

async function renderEverJoyHistory() {

const list =
    document.querySelector(
        "#historyList"
    );


const empty =
    document.querySelector(
        "#historyEmpty"
    );


const count =
    document.querySelector(
        "#historyCount"
    );


if (
    !list
) {

    return;

}


list.innerHTML = `

    <div class="history-loading">
        Loading reading history...
    </div>

`;


const history =
    getEverJoyReadingHistory();


if (
    count
) {

    count.textContent =
        `${history.length} ${
            history.length === 1
                ? "chapter"
                : "chapters"
        }`;

}


/*
    No history.
*/

if (
    !history.length
) {

    list.innerHTML = "";


    if (
        empty
    ) {

        empty.hidden =
            false;

    }


    return;

}


if (
    empty
) {

    empty.hidden =
        true;

}


const [
    comics,
    chapters
] =
    await Promise.all([

        loadHistoryComics(),

        loadHistoryChapters()

    ]);


list.innerHTML = "";


history.forEach(
    entry => {

        const comic =
            findHistoryComic(
                comics,
                entry.comicId
            );


        const chapter =
            findHistoryChapter(
                chapters,
                entry.chapterId
            );


        const card =
            createHistoryCard(
                entry,
                comic,
                chapter
            );


        list.appendChild(
            card
        );

    }
);

}

/* =========================================================
15. CLEAR HISTORY CONTROL
========================================================= */

function initializeHistoryControls() {

const clearButton =
    document.querySelector(
        "#clearHistoryButton"
    );


if (
    clearButton
) {

    clearButton.addEventListener(
        "click",
        () => {

            const history =
                getEverJoyReadingHistory();


            if (
                !history.length
            ) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Clear your entire reading history?"
                );


            if (
                !confirmed
            ) {

                return;

            }


            clearEverJoyReadingHistory();

        }
    );

}

}

/* =========================================================
16. INITIALIZE HISTORY PAGE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    initializeHistoryControls();

    renderEverJoyHistory();

}

);