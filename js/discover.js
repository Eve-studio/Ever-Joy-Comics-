/* =========================================================
   EVER JOY COMICS
   DISCOVER PAGE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. DISCOVER STATE
   ========================================================= */

let allComics = [];

let filteredComics = [];

let displayedComics = [];

let currentSection = "all";

let currentSearch = "";

let currentGenre = "";

let currentFormat = "";

let currentStatus = "";

let currentSort = "default";

let currentAccess = "all";

let currentRating = "all";

let visibleCount = 12;

const LOAD_AMOUNT = 12;


/* =========================================================
   2. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeDiscover
);


async function initializeDiscover() {

    await loadComics();

    initializeSearch();

    initializeTabs();

    initializeGenres();

    initializeFormatSections();

    initializeFilters();

    initializeSorting();

    initializeLoadMore();

    initializeClearButtons();

    initializeSearchParameters();

    renderDiscover();

}


/* =========================================================
   3. LOAD COMICS
   ========================================================= */

async function loadComics() {

    try {

        const response = await fetch(
            "data/comics.json"
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load comics: ${response.status}`
            );

        }


        const data =
            await response.json();


        allComics =
            Array.isArray(data.comics)
                ? data.comics
                : [];


        console.log(
            `Ever Joy Discover loaded ${allComics.length} comics.`
        );


    } catch (error) {

        console.error(
            "Ever Joy could not load comic data:",
            error
        );

        allComics = [];

    }

}


/* =========================================================
   4. SEARCH
   ========================================================= */

function initializeSearch() {

    const input =
        document.querySelector(
            "#discoverSearch"
        );


    const clearButton =
        document.querySelector(
            "#clearSearchButton"
        );


    if (!input) return;


    input.addEventListener(
        "input",
        () => {

            currentSearch =
                input.value
                    .trim()
                    .toLowerCase();


            visibleCount =
                LOAD_AMOUNT;


            updateClearSearchButton();

            renderSearchSuggestions();

            renderDiscover();

        }
    );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearSearch
        );

    }

}


/* =========================================================
   5. SEARCH SUGGESTIONS
   ========================================================= */

function renderSearchSuggestions() {

    const container =
        document.querySelector(
            "#searchSuggestions"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        !currentSearch ||
        currentSearch.length < 2
    ) {

        container.classList.remove(
            "visible"
        );

        return;

    }


    const matches =
        allComics
            .filter(comic =>
                comicMatchesSearch(
                    comic,
                    currentSearch
                )
            )
            .slice(0, 5);


    if (!matches.length) {

        container.classList.remove(
            "visible"
        );

        return;

    }


    matches.forEach(
        comic => {

            const item =
                document.createElement(
                    "button"
                );


            item.type = "button";

            item.className =
                "search-suggestion";


            item.innerHTML = `

                <img
                    src="${escapeHTML(
                        comic.cover || ""
                    )}"
                    alt="${escapeHTML(
                        comic.title || ""
                    )}"
                >

                <span>

                    <strong>
                        ${escapeHTML(
                            comic.title || "Untitled"
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            getPrimaryGenre(
                                comic
                            )
                        )}
                    </small>

                </span>

            `;


            item.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `comic/details.html?id=${encodeURIComponent(
                            comic.id
                        )}`;

                }
            );


            container.appendChild(
                item
            );

        }
    );


    container.classList.add(
        "visible"
    );

}


/* =========================================================
   6. SEARCH MATCHING
   ========================================================= */

function comicMatchesSearch(
    comic,
    query
) {

    const title =
        String(
            comic.title || ""
        ).toLowerCase();


    const description =
        String(
            comic.description || ""
        ).toLowerCase();


    const author =
        String(
            comic.author ||
            comic.creator ||
            comic.authorName ||
            ""
        ).toLowerCase();


    const genres =
        Array.isArray(
            comic.genres
        )
            ? comic.genres
                .join(" ")
                .toLowerCase()
            : "";


    const format =
        String(
            comic.format || ""
        ).toLowerCase();


    return (
        title.includes(query) ||
        description.includes(query) ||
        author.includes(query) ||
        genres.includes(query) ||
        format.includes(query)
    );

}


/* =========================================================
   7. CLEAR SEARCH
   ========================================================= */

function clearSearch() {

    const input =
        document.querySelector(
            "#discoverSearch"
        );


    if (input) {

        input.value = "";

    }


    currentSearch = "";


    updateClearSearchButton();

    renderSearchSuggestions();

    visibleCount =
        LOAD_AMOUNT;


    renderDiscover();

}


function updateClearSearchButton() {

    const button =
        document.querySelector(
            "#clearSearchButton"
        );


    if (!button) return;


    button.hidden =
        !currentSearch;

}


/* =========================================================
   8. TABS
   ========================================================= */

function initializeTabs() {

    const tabs =
        document.querySelectorAll(
            ".discover-tab"
        );


    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    tabs.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    tab.classList.add(
                        "active"
                    );


                    currentSection =
                        tab.dataset.section ||
                        "all";


                    currentStatus = "";


                    if (
                        currentSection ===
                        "completed"
                    ) {

                        currentStatus =
                            "completed";

                    }


                    if (
                        currentSection ===
                        "ongoing"
                    ) {

                        currentStatus =
                            "ongoing";

                    }


                    visibleCount =
                        LOAD_AMOUNT;


                    renderDiscover();

                }
            );

        }
    );

}


/* =========================================================
   9. GENRES
   ========================================================= */

function initializeGenres() {

    const container =
        document.querySelector(
            "#genreList"
        );


    if (!container) return;


    const genres =
        collectGenres();


    container.innerHTML = "";


    genres.forEach(
        genre => {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "genre-chip";


            button.textContent =
                genre;


            button.addEventListener(
                "click",
                () => {

                    currentGenre =
                        genre;


                    visibleCount =
                        LOAD_AMOUNT;


                    updateGenreState();

                    renderDiscover();

                    scrollToResults();

                }
            );


            container.appendChild(
                button
            );

        }
    );


    const allGenresButton =
        document.querySelector(
            "#allGenresButton"
        );


    if (allGenresButton) {

        allGenresButton.addEventListener(
            "click",
            () => {

                currentGenre = "";

                updateGenreState();

                renderDiscover();

            }
        );

    }

}


/* =========================================================
   10. COLLECT GENRES
   ========================================================= */

function collectGenres() {

    const genreSet =
        new Set();


    allComics.forEach(
        comic => {

            if (
                !Array.isArray(
                    comic.genres
                )
            ) {

                return;

            }


            comic.genres.forEach(
                genre => {

                    if (
                        genre &&
                        typeof genre === "string"
                    ) {

                        genreSet.add(
                            genre.trim()
                        );

                    }

                }
            );

        }
    );


    return Array.from(
        genreSet
    ).sort(
        (a, b) =>
            a.localeCompare(b)
    );

}


/* =========================================================
   11. GENRE STATE
   ========================================================= */

function updateGenreState() {

    const buttons =
        document.querySelectorAll(
            ".genre-chip"
        );


    buttons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.textContent ===
                    currentGenre
            );

        }
    );

}


/* =========================================================
   12. FORMAT SECTIONS
   ========================================================= */

function initializeFormatSections() {

    const sections =
        document.querySelectorAll(
            ".format-section"
        );


    sections.forEach(
        section => {

            const format =
                section.dataset.format;


            if (!format) return;


            const row =
                section.querySelector(
                    ".discover-horizontal-row"
                );


            if (!row) return;


            const comics =
                getComicsByFormat(
                    format
                );


            if (!comics.length) {

                section.hidden = true;

                return;

            }


            section.hidden = false;


            renderFormatRow(
                row,
                comics
            );


            const seeAll =
                section.querySelector(
                    ".discover-see-all"
                );


            if (seeAll) {

                seeAll.addEventListener(
                    "click",
                    () => {

                        currentFormat =
                            format;


                        currentSection =
                            "all";


                        currentGenre = "";

                        currentStatus = "";

                        visibleCount =
                            LOAD_AMOUNT;


                        updateActiveTab(
                            "all"
                        );


                        renderDiscover();

                        scrollToResults();

                    }
                );

            }

        }
    );

}


/* =========================================================
   13. FORMAT MATCHING
   ========================================================= */

function getComicsByFormat(
    format
) {

    return allComics.filter(
        comic =>
            normalizeFormat(
                comic.format
            ) === normalizeFormat(
                format
            )
    );

}


function normalizeFormat(
    format
) {

    return String(
        format || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /[\s_]+/g,
            "-"
        );

}


/* =========================================================
   14. FORMAT ROW
   ========================================================= */

function renderFormatRow(
    container,
    comics
) {

    container.innerHTML = "";


    comics
        .slice(0, 8)
        .forEach(
            comic => {

                container.appendChild(
                    createDiscoverCard(
                        comic,
                        "horizontal"
                    )
                );

            }
        );

}


/* =========================================================
   15. FILTERS
   ========================================================= */

function initializeFilters() {

    const button =
        document.querySelector(
            "#filterButton"
        );


    const panel =
        document.querySelector(
            "#filterPanel"
        );


    const closeButton =
        document.querySelector(
            "#closeFilterButton"
        );


    if (
        button &&
        panel
    ) {

        button.addEventListener(
            "click",
            () => {

                panel.classList.add(
                    "open"
                );

                panel.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }
        );

    }


    if (
        closeButton &&
        panel
    ) {

        closeButton.addEventListener(
            "click",
            closeFilterPanel
        );

    }


    /*
        Support any filter controls
        already present in the HTML.
    */

    document.querySelectorAll(
        "[data-filter]"
    ).forEach(
        control => {

            control.addEventListener(
                "change",
                () => {

                    applyFilterControl(
                        control
                    );

                }
            );

        }
    );


    document.querySelectorAll(
        ".filter-option"
    ).forEach(
        control => {

            control.addEventListener(
                "click",
                () => {

                    applyFilterControl(
                        control
                    );

                }
            );

        }
    );

}


function closeFilterPanel() {

    const panel =
        document.querySelector(
            "#filterPanel"
        );


    if (!panel) return;


    panel.classList.remove(
        "open"
    );


    panel.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   16. FILTER CONTROL HANDLER
   ========================================================= */

function applyFilterControl(
    control
) {

    const filter =
        control.dataset.filter;


    const value =
        control.dataset.value ||
        control.value ||
        "";


    if (!filter) return;


    switch (filter) {

        case "format":

            currentFormat =
                normalizeFormat(
                    value
                );

            break;


        case "genre":

            currentGenre =
                value;

            break;


        case "status":

            currentStatus =
                value
                    .toLowerCase();

            break;


        case "access":

            currentAccess =
                value
                    .toLowerCase();

            break;


        case "rating":

            currentRating =
                value;

            break;

    }


    visibleCount =
        LOAD_AMOUNT;


    renderDiscover();

}


/* =========================================================
   17. SORTING
   ========================================================= */

function initializeSorting() {

    const button =
        document.querySelector(
            "#sortButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                cycleSort();

            }
        );

    }


    document.querySelectorAll(
        "[data-sort]"
    ).forEach(
        control => {

            control.addEventListener(
                "click",
                () => {

                    currentSort =
                        control.dataset.sort ||
                        "default";


                    renderDiscover();

                }
            );

        }
    );

}


function cycleSort() {

    const order = [
        "default",
        "rating",
        "newest",
        "title"
    ];


    const index =
        order.indexOf(
            currentSort
        );


    currentSort =
        order[
            (index + 1) %
            order.length
        ];


    renderDiscover();


    updateSortLabel();

}


function updateSortLabel() {

    const button =
        document.querySelector(
            "#sortButton"
        );


    if (!button) return;


    const labels = {

        default: "Sort",

        rating: "Highest Rated",

        newest: "Newest",

        title: "A–Z"

    };


    const label =
        labels[currentSort] ||
        "Sort";


    const textNode =
        Array.from(
            button.childNodes
        ).find(
            node =>
                node.nodeType ===
                Node.TEXT_NODE &&
                node.textContent.trim()
        );


    if (textNode) {

        textNode.textContent =
            ` ${label}`;

    }

}


/* =========================================================
   18. RENDER DISCOVER
   ========================================================= */

function renderDiscover() {

    filteredComics =
        filterComics();


    filteredComics =
        sortComics(
            filteredComics
        );


    displayedComics =
        filteredComics.slice(
            0,
            visibleCount
        );


    renderResultsHeader();

    renderGrid();

    renderEmptyState();

    updateLoadMore();

}

/* =========================================================
   19. FILTER COMICS
   ========================================================= */

function filterComics() {

    return allComics.filter(
        comic => {

            if (
                currentSearch &&
                !comicMatchesSearch(
                    comic,
                    currentSearch
                )
            ) {

                return false;

            }


            if (
                currentGenre &&
                !comicHasGenre(
                    comic,
                    currentGenre
                )
            ) {

                return false;

            }


            if (
                currentFormat &&
                normalizeFormat(
                    comic.format
                ) !==
                currentFormat
            ) {

                return false;

            }


            if (
                currentStatus &&
                !comicHasStatus(
                    comic,
                    currentStatus
                )
            ) {

                return false;

            }


            if (
                currentAccess !==
                "all" &&
                currentAccess
            ) {

                if (
                    !comicHasAccess(
                        comic,
                        currentAccess
                    )
                ) {

                    return false;

                }

            }


            if (
                currentRating !==
                "all" &&
                currentRating
            ) {

                const rating =
                    Number(
                        comic.rating || 0
                    );


                const minimum =
                    Number(
                        currentRating
                    );


                if (
                    rating <
                    minimum
                ) {

                    return false;

                }

            }


            switch (
                currentSection
            ) {

                case "popular":

                    return (
                        comic.popular === true ||
                        comic.trending === true
                    );


                case "new":

                    return (
                        comic.newlyArrived === true
                    );


                case "rising":

                    return (
                        comic.rising === true
                    );


                case "completed":

                    return comicHasStatus(
                        comic,
                        "completed"
                    );


                case "ongoing":

                    return comicHasStatus(
                        comic,
                        "ongoing"
                    );


                case "all":

                default:

                    return true;

            }

        }
    );

}


/* =========================================================
   20. GENRE MATCH
   ========================================================= */

function comicHasGenre(
    comic,
    genre
) {

    if (
        !Array.isArray(
            comic.genres
        )
    ) {

        return false;

    }


    return comic.genres.some(
        item =>
            String(item)
                .toLowerCase() ===
            String(genre)
                .toLowerCase()
    );

}


/* =========================================================
   21. STATUS MATCH
   ========================================================= */

function comicHasStatus(
    comic,
    status
) {

    const comicStatus =
        String(
            comic.status || ""
        )
            .trim()
            .toLowerCase();


    return (
        comicStatus ===
        status
    );

}


/* =========================================================
   22. ACCESS MATCH
   ========================================================= */

function comicHasAccess(
    comic,
    access
) {

    const type =
        comic.access &&
        comic.access.type
            ? String(
                comic.access.type
            ).toLowerCase()
            : "free";


    return type === access;

}


/* =========================================================
   23. SORT COMICS
   ========================================================= */

function sortComics(
    comics
) {

    const result =
        [...comics];


    switch (
        currentSort
    ) {

        case "rating":

            return result.sort(
                (a, b) =>
                    Number(
                        b.rating || 0
                    ) -
                    Number(
                        a.rating || 0
                    )
            );


        case "newest":

            return result.sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.updatedAt ||
                            a.createdAt ||
                            0
                        ).getTime();


                    const dateB =
                        new Date(
                            b.updatedAt ||
                            b.createdAt ||
                            0
                        ).getTime();


                    return dateB - dateA;

                }
            );


        case "title":

            return result.sort(
                (a, b) =>
                    String(
                        a.title || ""
                    ).localeCompare(
                        String(
                            b.title || ""
                        )
                    )
            );


        case "default":

        default:

            return result;

    }

}


/* =========================================================
   24. RESULTS HEADER
   ========================================================= */

function renderResultsHeader() {

    const title =
        document.querySelector(
            "#resultsTitle"
        );


    const eyebrow =
        document.querySelector(
            "#resultsEyebrow"
        );


    const count =
        document.querySelector(
            "#resultCount"
        );


    if (title) {

        title.textContent =
            getResultsTitle();

    }


    if (eyebrow) {

        eyebrow.textContent =
            currentSearch
                ? "Search"
                : currentGenre
                    ? "Genre"
                    : currentFormat
                        ? "Format"
                        : "Discover";

    }


    if (count) {

        count.textContent =
            `${filteredComics.length} ${
                filteredComics.length === 1
                    ? "work"
                    : "works"
            }`;

    }

}


function getResultsTitle() {

    if (currentSearch) {

        return `Results for "${currentSearch}"`;

    }


    if (currentGenre) {

        return currentGenre;

    }


    if (currentFormat) {

        return formatTitle(
            currentFormat
        );

    }


    switch (
        currentSection
    ) {

        case "popular":

            return "Popular Comics";


        case "new":

            return "New Comics";


        case "rising":

            return "Rising Comics";


        case "completed":

            return "Completed Comics";


        case "ongoing":

            return "Ongoing Comics";


        default:

            return "All Comics";

    }

}


/* =========================================================
   25. RENDER GRID
   ========================================================= */

function renderGrid() {

    const grid =
        document.querySelector(
            "#discoverGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    displayedComics.forEach(
        comic => {

            grid.appendChild(
                createDiscoverCard(
                    comic
                )
            );

        }
    );

}


/* =========================================================
   26. DISCOVER CARD
   ========================================================= */

function createDiscoverCard(
    comic,
    mode = "grid"
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        mode === "horizontal"
            ? "discover-card horizontal"
            : "discover-card";


    const genre =
        getPrimaryGenre(
            comic
        );


    const rating =
        comic.rating
            ? `★ ${escapeHTML(
                String(
                    comic.rating
                )
            )}`
            : "New";


    const access =
        getAccessLabel(
            comic
        );


    const format =
        formatTitle(
            comic.format
        );


    article.innerHTML = `

        <a
            href="comic/details.html?id=${encodeURIComponent(
                comic.id
            )}"
            class="discover-card-link"
        >

            <div class="discover-cover">

                <img
                    src="${escapeHTML(
                        comic.cover || ""
                    )}"
                    alt="${escapeHTML(
                        comic.title || "Comic"
                    )} cover"
                    loading="lazy"
                >

            </div>


            <div class="discover-card-info">

                <h3>
                    ${escapeHTML(
                        comic.title ||
                        "Untitled"
                    )}
                </h3>


                <div class="discover-card-meta">

                    <span>
                        ${escapeHTML(
                            genre
                        )}
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        ${rating}
                    </span>

                </div>


                <div class="discover-card-bottom">

                    <span>
                        ${escapeHTML(
                            format
                        )}
                    </span>


                    <span>
                        ${escapeHTML(
                            access
                        )}
                    </span>

                </div>

            </div>

        </a>

    `;


    return article;

}


/* =========================================================
   27. PRIMARY GENRE
   ========================================================= */

function getPrimaryGenre(
    comic
) {

    if (
        Array.isArray(
            comic.genres
        ) &&
        comic.genres.length
    ) {

        return comic.genres[0];

    }


    return "Comic";

}


/* =========================================================
   28. FORMAT TITLE
   ========================================================= */

function formatTitle(
    format
) {

    const names = {

        manga:
            "Manga",

        manhwa:
            "Manhwa",

        manhua:
            "Manhua",

        webtoon:
            "Webtoon",

        "western-comics":
            "Western Comics",

        bd:
            "Bande dessinée",

        "graphic-novel":
            "Graphic Novels",

        "comic-strip":
            "Comic Strips",

        indie:
            "Indie Comics",

        webcomic:
            "Webcomics",

        doujinshi:
            "Doujinshi",

        manfra:
            "Manfra",

        "oel-manga":
            "OEL Manga",

        "digital-comic":
            "Digital Comics",

        "motion-comic":
            "Motion Comics",

        original:
            "Ever Joy Originals"

    };


    return (
        names[
            normalizeFormat(
                format
            )
        ] ||
        format ||
        "Comic"
    );

}


/* =========================================================
   29. ACCESS LABEL
   ========================================================= */

function getAccessLabel(
    comic
) {

    if (
        comic.access &&
        comic.access.type === "paid"
    ) {

        const price =
            comic.access
                .defaultChapterPrice;


        if (price) {

            return `${price} ◈`;

        }


        return "Paid";

    }


    return "Free";

}


/* =========================================================
   30. EMPTY STATE
   ========================================================= */

function renderEmptyState() {

    const empty =
        document.querySelector(
            "#discoverEmpty"
        );


    if (!empty) return;


    empty.hidden =
        displayedComics.length !== 0;

}


/* =========================================================
   31. LOAD MORE
   ========================================================= */

function initializeLoadMore() {

    const button =
        document.querySelector(
            "#loadMoreButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            visibleCount +=
                LOAD_AMOUNT;


            renderDiscover();

        }
    );

}


function updateLoadMore() {

    const button =
        document.querySelector(
            "#loadMoreButton"
        );


    if (!button) return;


    const shouldShow =
        visibleCount <
        filteredComics.length;


    button.hidden =
        !shouldShow;

}


/* =========================================================
   32. CLEAR FILTERS
   ========================================================= */

function initializeClearButtons() {

    const button =
        document.querySelector(
            "#clearFiltersButton"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        clearAllFilters
    );

}


function clearAllFilters() {

    currentSearch = "";

    currentGenre = "";

    currentFormat = "";

    currentStatus = "";

    currentSection = "all";

    currentAccess = "all";

    currentRating = "all";

    currentSort = "default";


    visibleCount =
        LOAD_AMOUNT;


    const search =
        document.querySelector(
            "#discoverSearch"
        );


    if (search) {

        search.value = "";

    }


    updateClearSearchButton();

    updateGenreState();

    updateActiveTab(
        "all"
    );

    updateSortLabel();

    closeFilterPanel();

    renderSearchSuggestions();

    renderDiscover();

}


/* =========================================================
   33. UPDATE ACTIVE TAB
   ========================================================= */

function updateActiveTab(
    section
) {

    document.querySelectorAll(
        ".discover-tab"
    ).forEach(
        tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.section ===
                    section
            );

        }
    );

}


/* =========================================================
   34. URL SEARCH PARAMETERS
   ========================================================= */

function initializeSearchParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const search =
        params.get(
            "search"
        );


    const genre =
        params.get(
            "genre"
        );


    const format =
        params.get(
            "format"
        );


    if (search) {

        currentSearch =
            search
                .trim()
                .toLowerCase();


        const input =
            document.querySelector(
                "#discoverSearch"
            );


        if (input) {

            input.value =
                search;

        }

    }


    if (genre) {

        currentGenre =
            genre;

    }


    if (format) {

        currentFormat =
            normalizeFormat(
                format
            );

    }


    updateClearSearchButton();

    updateGenreState();

}


/* =========================================================
   35. SCROLL TO RESULTS
   ========================================================= */

function scrollToResults() {

    const results =
        document.querySelector(
            ".results-header"
        );


    if (!results) return;


    setTimeout(
        () => {

            results.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        50
    );

}


/* =========================================================
   36. ESCAPE HTML
   ========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
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
   37. DEBUG HELPER
   ========================================================= */

window.everJoyDiscover = {

    get comics() {

        return allComics;

    },

    get filtered() {

        return filteredComics;

    },

    reset() {

        clearAllFilters();

    }

};
