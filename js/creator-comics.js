/* =========================================================
   EVER JOY COMICS
   CREATOR STUDIO — MY COMICS

   Handles:

   - Loading comics
   - Status filtering
   - Empty state
   - Comic card rendering
   - Edit navigation
   - Delete functionality
   - Future upload integration

   Prototype data is stored in localStorage.

   NOTE:
   Access protection is intentionally disabled during
   development so the Creator Studio can be tested freely.
   ========================================================= */


/* =========================================================
   1. STORAGE KEY
   ========================================================= */

const EVER_JOY_COMICS_KEY =
    "everJoyComics";


/* =========================================================
   2. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           No login/creator redirect here.

           We're still developing and testing the
           Creator Studio pages, so the page should
           simply open normally.
        */

        initializeCreatorComics();

    }
);


/* =========================================================
   3. INITIALIZE COMICS PAGE
   ========================================================= */

function initializeCreatorComics() {

    setupComicFilter();

    loadCreatorComics();

}


/* =========================================================
   4. GET CURRENT USER
   ========================================================= */

function getCreatorForComics() {

    if (
        typeof getEverJoyCurrentUser !==
        "function"
    ) {

        return null;

    }


    return getEverJoyCurrentUser();

}


/* =========================================================
   5. GET ALL COMICS
   ========================================================= */

function getEverJoyComics() {

    try {

        const storedComics =
            localStorage.getItem(
                EVER_JOY_COMICS_KEY
            );


        if (!storedComics) {

            return [];

        }


        const comics =
            JSON.parse(
                storedComics
            );


        if (!Array.isArray(comics)) {

            return [];

        }


        return comics;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not read comics.",
            error
        );

        return [];

    }

}


/* =========================================================
   6. SAVE ALL COMICS
   ========================================================= */

function saveEverJoyComics(
    comics
) {

    try {

        localStorage.setItem(
            EVER_JOY_COMICS_KEY,
            JSON.stringify(comics)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not save comics.",
            error
        );

        return false;

    }

}


/* =========================================================
   7. LOAD CREATOR COMICS
   ========================================================= */

function loadCreatorComics() {

    const currentUser =
        getCreatorForComics();


    const comics =
        getEverJoyComics();


    /*
       If a logged-in creator exists,
       show their comics.

       During development, if there is no
       current user, the page simply shows
       the normal empty state instead of
       kicking the user away.
    */

    let creatorComics =
        comics;


    if (currentUser) {

        creatorComics =
            comics.filter(
                comic =>
                    comic.creatorId ===
                    currentUser.id
            );

    }


    renderCreatorComics(
        creatorComics
    );

}


/* =========================================================
   8. RENDER COMICS
   ========================================================= */

function renderCreatorComics(
    comics
) {

    const grid =
        document.getElementById(
            "creatorComicsGrid"
        );


    const emptyState =
        document.getElementById(
            "creatorComicsEmpty"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        "";


    if (!comics.length) {

        grid.hidden =
            true;


        if (emptyState) {

            emptyState.hidden =
                false;

        }


        return;

    }


    if (emptyState) {

        emptyState.hidden =
            true;

    }


    grid.hidden =
        false;


    comics.forEach(
        comic => {

            const card =
                createComicCard(
                    comic
                );


            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   9. CREATE COMIC CARD
   ========================================================= */

function createComicCard(
    comic
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "creator-comic-card";


    const cover =
        comic.cover ||
        "../assets/images/default-comic-cover.png";


    const title =
        comic.title ||
        "Untitled Comic";


    const status =
        comic.status ||
        "draft";


    const description =
        comic.description ||
        "No description available.";


    const reads =
        Number(
            comic.reads || 0
        );


    const subscribers =
        Number(
            comic.subscribers || 0
        );


    article.innerHTML = `

        <div class="creator-comic-cover-wrapper">

            <img
                src="${escapeComicHTML(cover)}"
                alt="${escapeComicHTML(title)} cover"
                class="creator-comic-cover"
                loading="lazy"
            >

        </div>


        <div class="creator-comic-content">

            <span class="creator-comic-status">
                ${escapeComicHTML(
                    formatComicStatus(status)
                )}
            </span>


            <h3 class="creator-comic-title">
                ${escapeComicHTML(title)}
            </h3>


            <p class="creator-comic-description">
                ${escapeComicHTML(description)}
            </p>


            <div class="creator-comic-meta">

                <span>
                    ${reads} reads
                </span>

                <span>
                    ${subscribers} subscribers
                </span>

            </div>


            <div class="creator-comic-actions">

                <button
                    type="button"
                    class="creator-comic-edit"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="creator-comic-delete"
                >
                    Delete
                </button>

            </div>

        </div>

    `;


    setupComicCardButtons(
        article,
        comic
    );


    return article;

}


/* =========================================================
   10. COMIC CARD BUTTONS
   ========================================================= */

function setupComicCardButtons(
    card,
    comic
) {

    const editButton =
        card.querySelector(
            ".creator-comic-edit"
        );


    const deleteButton =
        card.querySelector(
            ".creator-comic-delete"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            () => {

                editCreatorComic(
                    comic
                );

            }
        );

    }


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                deleteCreatorComic(
                    comic.id
                );

            }
        );

    }

}


/* =========================================================
   11. EDIT COMIC
   ========================================================= */

function editCreatorComic(
    comic
) {

    if (
        !comic ||
        !comic.id
    ) {

        return;

    }


    sessionStorage.setItem(
        "everJoyEditingComic",
        comic.id
    );


    window.location.href =
        "./upload.html";

}


/* =========================================================
   12. DELETE COMIC
   ========================================================= */

function deleteCreatorComic(
    comicId
) {

    if (!comicId) {

        return;

    }


    const confirmed =
        window.confirm(
            "Delete this comic? This action cannot be undone."
        );


    if (!confirmed) {

        return;

    }


    const comics =
        getEverJoyComics();


    const updatedComics =
        comics.filter(
            comic =>
                comic.id !==
                comicId
        );


    const saved =
        saveEverJoyComics(
            updatedComics
        );


    if (!saved) {

        window.alert(
            "The comic could not be deleted. Please try again."
        );

        return;

    }


    loadCreatorComics();

}


/* =========================================================
   13. STATUS FILTER
   ========================================================= */

function setupComicFilter() {

    const filter =
        document.getElementById(
            "comicFilter"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        () => {

            filterCreatorComics();

        }
    );

}


/* =========================================================
   14. FILTER COMICS
   ========================================================= */

function filterCreatorComics() {

    const currentUser =
        getCreatorForComics();


    const filter =
        document.getElementById(
            "comicFilter"
        );


    const selectedStatus =
        filter
            ? filter.value
            : "all";


    const comics =
        getEverJoyComics();


    let creatorComics =
        comics;


    if (currentUser) {

        creatorComics =
            comics.filter(
                comic =>
                    comic.creatorId ===
                    currentUser.id
            );

    }


    if (
        selectedStatus &&
        selectedStatus !== "all"
    ) {

        creatorComics =
            creatorComics.filter(
                comic => {

                    const status =
                        String(
                            comic.status ||
                            "draft"
                        )
                        .toLowerCase();


                    return (
                        status ===
                        selectedStatus.toLowerCase()
                    );

                }
            );

    }


    renderCreatorComics(
        creatorComics
    );

}


/* =========================================================
   15. STATUS LABEL
   ========================================================= */

function formatComicStatus(
    status
) {

    const normalized =
        String(
            status || "draft"
        )
        .toLowerCase();


    switch (
        normalized
    ) {

        case "published":
            return "Published";

        case "pending":
            return "Pending Review";

        case "draft":
            return "Draft";

        case "ongoing":
            return "Ongoing";

        case "completed":
            return "Completed";

        case "scheduled":
            return "Scheduled";

        default:
            return "Draft";

    }

}


/* =========================================================
   16. SAFE HTML
   ========================================================= */

function escapeComicHTML(
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
   17. CREATE NEW COMIC
   ========================================================= */

function createEverJoyComic(
    comicData
) {

    const currentUser =
        getCreatorForComics();


    const comics =
        getEverJoyComics();


    const newComic = {

        id:
            "comic_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 9),


        creatorId:
            currentUser?.id || "development",


        title:
            String(
                comicData?.title || ""
            )
            .trim(),


        description:
            String(
                comicData?.description || ""
            )
            .trim(),


        cover:
            comicData?.cover || "",


        status:
            comicData?.status ||
            "draft",


        reads:
            0,


        subscribers:
            0,


        createdAt:
            new Date().toISOString(),


        updatedAt:
            new Date().toISOString()

    };


    comics.push(
        newComic
    );


    const saved =
        saveEverJoyComics(
            comics
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Comic could not be saved."

        };

    }


    return {

        success: true,

        message:
            "Comic created successfully.",

        comic:
            newComic

    };

}


/* =========================================================
   18. UPDATE EXISTING COMIC
   ========================================================= */

function updateEverJoyComic(
    comicId,
    updates
) {

    if (!comicId) {

        return {

            success: false,

            message:
                "Comic ID is required."

        };

    }


    const currentUser =
        getCreatorForComics();


    const comics =
        getEverJoyComics();


    const index =
        comics.findIndex(
            comic =>
                comic.id ===
                comicId &&
                (
                    !currentUser ||
                    comic.creatorId ===
                    currentUser.id
                )
        );


    if (index === -1) {

        return {

            success: false,

            message:
                "Comic could not be found."

        };

    }


    if (
        updates?.title !==
        undefined
    ) {

        comics[index].title =
            String(
                updates.title
            )
            .trim();

    }


    if (
        updates?.description !==
        undefined
    ) {

        comics[index].description =
            String(
                updates.description
            )
            .trim();

    }


    if (
        updates?.cover !==
        undefined
    ) {

        comics[index].cover =
            updates.cover;

    }


    if (
        updates?.status !==
        undefined
    ) {

        comics[index].status =
            updates.status;

    }


    comics[index].updatedAt =
        new Date().toISOString();


    const saved =
        saveEverJoyComics(
            comics
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Comic changes could not be saved."

        };

    }


    return {

        success: true,

        message:
            "Comic updated successfully.",

        comic:
            comics[index]

    };

}