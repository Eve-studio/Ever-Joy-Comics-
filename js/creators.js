/* =========================================================
   EVER JOY COMICS
   PUBLIC CREATOR DISCOVERY
   creators.js

   Handles:

   - Loading creators
   - Creator search
   - Creator cards
   - Creator profile navigation
   - Loading state
   - Empty state
   - Search clearing
   ========================================================= */


/* =========================================================
   1. CREATOR STATE
   ========================================================= */

let publicCreatorCatalogue = [];

let filteredCreatorCatalogue = [];


/* =========================================================
   2. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCreatorsPage();

    }
);


async function initializeCreatorsPage() {

    setupCreatorBackButton();

    setupCreatorSearch();

    await loadPublicCreators();

    renderCreators();

}


/* =========================================================
   3. LOAD CREATORS
   ========================================================= */

async function loadPublicCreators() {

    showCreatorLoading();

    try {

        const response =
            await fetch(
                "../data/creators.json"
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load creators: ${response.status}`
            );

        }


        const data =
            await response.json();


        /*
            Support either:

            {
                "creators": []
            }

            or a direct array.
        */

        if (
            Array.isArray(data)
        ) {

            publicCreatorCatalogue =
                data;

        }
        else {

            publicCreatorCatalogue =
                Array.isArray(
                    data.creators
                )
                    ? data.creators
                    : [];

        }


        filteredCreatorCatalogue =
            [
                ...publicCreatorCatalogue
            ];


    }
    catch (error) {

        console.error(
            "Ever Joy: Could not load creators.",
            error
        );


        publicCreatorCatalogue =
            [];

        filteredCreatorCatalogue =
            [];

    }

}


/* =========================================================
   4. SEARCH
   ========================================================= */

function setupCreatorSearch() {

    const searchInput =
        document.querySelector(
            "#creatorSearchInput"
        );


    const clearButton =
        document.querySelector(
            "#creatorSearchClear"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            filterCreators(
                query
            );


            if (clearButton) {

                clearButton.hidden =
                    query.length === 0;

            }

        }
    );


    if (clearButton) {

        clearButton.hidden =
            true;


        clearButton.addEventListener(
            "click",
            () => {

                searchInput.value =
                    "";


                searchInput.focus();


                filterCreators(
                    ""
                );


                clearButton.hidden =
                    true;

            }
        );

    }

}


/* =========================================================
   5. FILTER CREATORS
   ========================================================= */

function filterCreators(
    query
) {

    if (!query) {

        filteredCreatorCatalogue =
            [
                ...publicCreatorCatalogue
            ];

    }
    else {

        filteredCreatorCatalogue =
            publicCreatorCatalogue.filter(
                creator => {

                    const name =
                        getCreatorDisplayName(
                            creator
                        )
                        .toLowerCase();


                    const username =
                        getCreatorUsername(
                            creator
                        )
                        .toLowerCase();


                    const penName =
                        String(
                            creator.penName ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        name.includes(
                            query
                        )

                        ||

                        username.includes(
                            query
                        )

                        ||

                        penName.includes(
                            query
                        )

                    );

                }
            );

    }


    renderCreators();

}


/* =========================================================
   6. RENDER CREATORS
   ========================================================= */

function renderCreators() {

    const grid =
        document.querySelector(
            "#creatorGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        "";


    updateCreatorResultCount();


    if (
        !filteredCreatorCatalogue.length
    ) {

        renderCreatorEmptyState();

        return;

    }


    filteredCreatorCatalogue.forEach(
        creator => {

            const card =
                createCreatorCard(
                    creator
                );


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   7. CREATE CREATOR CARD
   ========================================================= */

function createCreatorCard(
    creator
) {

    const card =
        document.createElement(
            "a"
        );


    card.className =
        "creator-card";


    card.href =
        getCreatorProfileUrl(
            creator
        );


    card.setAttribute(
        "aria-label",
        `View ${getCreatorDisplayName(creator)}'s profile`
    );


    /*
        Avatar
    */

    const avatar =
        createCreatorAvatar(
            creator
        );


    card.appendChild(
        avatar
    );


    /*
        Information
    */

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "creator-card-info";


    const name =
        document.createElement(
            "h3"
        );


    name.className =
        "creator-card-name";


    name.textContent =
        getCreatorDisplayName(
            creator
        );


    /*
        Verification
    */

    if (
        creator.verified === true
    ) {

        const verified =
            document.createElement(
                "span"
            );


        verified.className =
            "creator-verified";


        verified.textContent =
            "✓";


        verified.setAttribute(
            "aria-label",
            "Verified creator"
        );


        name.appendChild(
            verified
        );

    }


    info.appendChild(
        name
    );


    /*
        Username
    */

    const username =
        document.createElement(
            "div"
        );


    username.className =
        "creator-card-username";


    const usernameValue =
        getCreatorUsername(
            creator
        );


    username.textContent =
        usernameValue
            ? `@${usernameValue}`
            : "";


    info.appendChild(
        username
    );


    /*
        Meta
    */

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "creator-card-meta";


    const workCount =
        getCreatorWorkCount(
            creator
        );


    meta.textContent =
        workCount !== null
            ? `${workCount} ${
                workCount === 1
                    ? "work"
                    : "works"
            }`
            : "Creator";


    info.appendChild(
        meta
    );


    card.appendChild(
        info
    );


    /*
        Arrow
    */

    const arrow =
        document.createElement(
            "span"
        );


    arrow.className =
        "creator-card-arrow";


    arrow.textContent =
        "›";


    arrow.setAttribute(
        "aria-hidden",
        "true"
    );


    card.appendChild(
        arrow
    );


    return card;

}


/* =========================================================
   8. CREATOR AVATAR
   ========================================================= */

function createCreatorAvatar(
    creator
) {

    const avatarSource =
        creator.avatar ||
        creator.profilePicture ||
        creator.profile?.avatar ||
        "";


    if (avatarSource) {

        const image =
            document.createElement(
                "img"
            );


        image.className =
            "creator-card-avatar";


        image.src =
            avatarSource;


        image.alt =
            `${getCreatorDisplayName(creator)} profile picture`;


        image.loading =
            "lazy";


        image.addEventListener(
            "error",
            () => {

                const placeholder =
                    createCreatorAvatarPlaceholder(
                        creator
                    );


                image.replaceWith(
                    placeholder
                );

            }
        );


        return image;

    }


    return createCreatorAvatarPlaceholder(
        creator
    );

}


/* =========================================================
   9. AVATAR PLACEHOLDER
   ========================================================= */

function createCreatorAvatarPlaceholder(
    creator
) {

    const placeholder =
        document.createElement(
            "div"
        );


    placeholder.className =
        "creator-card-avatar-placeholder";


    placeholder.textContent =
        getCreatorInitial(
            creator
        );


    placeholder.setAttribute(
        "aria-hidden",
        "true"
    );


    return placeholder;

}


/* =========================================================
   10. CREATOR NAME
   ========================================================= */

function getCreatorDisplayName(
    creator
) {

    if (!creator) {

        return "Ever Joy Creator";

    }


    return (

        creator.displayName ||

        creator.name ||

        creator.penName ||

        creator.username ||

        "Ever Joy Creator"

    );

}


/* =========================================================
   11. CREATOR USERNAME
   ========================================================= */

function getCreatorUsername(
    creator
) {

    if (!creator) {

        return "";

    }


    return (

        creator.username ||

        creator.handle ||

        ""

    )
        .replace(
            /^@/,
            ""
        );

}


/* =========================================================
   12. CREATOR INITIAL
   ========================================================= */

function getCreatorInitial(
    creator
) {

    const name =
        getCreatorDisplayName(
            creator
        );


    return name
        .charAt(0)
        .toUpperCase();

}


/* =========================================================
   13. CREATOR WORK COUNT
   ========================================================= */

function getCreatorWorkCount(
    creator
) {

    if (!creator) {

        return null;

    }


    if (
        Array.isArray(
            creator.works
        )
    ) {

        return creator.works.length;

    }


    if (
        Array.isArray(
            creator.comics
        )
    ) {

        return creator.comics.length;

    }


    if (
        typeof creator.workCount ===
        "number"
    ) {

        return creator.workCount;

    }


    return null;

}


/* =========================================================
   14. CREATOR PROFILE URL
   ========================================================= */

function getCreatorProfileUrl(
    creator
) {

    const creatorId =
        creator.id ||
        creator.creatorId ||
        creator.username;


    return `creator-profile.html?id=${
        encodeURIComponent(
            creatorId
        )
    }`;

}


/* =========================================================
   15. RESULT COUNT
   ========================================================= */

function updateCreatorResultCount() {

    const resultCount =
        document.querySelector(
            "#creatorResultCount"
        );


    if (!resultCount) {

        return;

    }


    const count =
        filteredCreatorCatalogue.length;


    resultCount.textContent =
        `${count} ${
            count === 1
                ? "creator"
                : "creators"
        }`;

}


/* =========================================================
   16. EMPTY STATE
   ========================================================= */

function renderCreatorEmptyState() {

    const grid =
        document.querySelector(
            "#creatorGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = `

        <div class="creator-empty">

            <div
                class="creator-empty-icon"
                aria-hidden="true"
            >
                ◌
            </div>

            <h2>
                No creators found
            </h2>

            <p>
                Try searching with another
                creator name or username.
            </p>

        </div>

    `;

}


/* =========================================================
   17. LOADING STATE
   ========================================================= */

function showCreatorLoading() {

    const grid =
        document.querySelector(
            "#creatorGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = `

        <div class="creator-loading">

            <div
                class="creator-loader"
                aria-hidden="true"
            ></div>

            <span>
                Finding creators...
            </span>

        </div>

    `;

}


/* =========================================================
   18. BACK BUTTON
   ========================================================= */

function setupCreatorBackButton() {

    const button =
        document.querySelector(
            "#creatorBackButton"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            }
            else {

                window.location.href =
                    "../index.html";

            }

        }
    );

}


/* =========================================================
   19. PUBLIC HELPERS
   ========================================================= */

window.EverJoyCreators = {

    getAll() {

        return [
            ...publicCreatorCatalogue
        ];

    },


    getById(
        creatorId
    ) {

        return publicCreatorCatalogue.find(
            creator => {

                return (

                    creator.id ===
                    creatorId

                );

            }
        );

    },


    search(
        query
    ) {

        const normalized =
            String(
                query || ""
            )
            .trim()
            .toLowerCase();


        return publicCreatorCatalogue.filter(
            creator => {

                return (

                    getCreatorDisplayName(
                        creator
                    )
                    .toLowerCase()
                    .includes(
                        normalized
                    )

                    ||

                    getCreatorUsername(
                        creator
                    )
                    .toLowerCase()
                    .includes(
                        normalized
                    )

                );

            }
        );

    }

};