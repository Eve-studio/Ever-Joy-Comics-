/* =========================================================
EVER JOY COMICS
CREATOR STUDIO — UPLOAD / CREATE COMIC

Handles:

- Creator access
- Comic creation
- Comic editing
- Comic metadata
- Genre and tags
- Content rating
- LocalStorage persistence
- Validation
- Save feedback
- Redirect to My Comics

Prototype storage:
everJoyComics

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

    const currentUser =
        typeof getEverJoyCurrentUser === "function"
            ? getEverJoyCurrentUser()
            : null;


    /* -------------------------------------------------
       INITIALIZE FORM
       ------------------------------------------------- */

    initializeCreatorUpload(
        currentUser
    );

}
);


/* =========================================================
3. INITIALIZE UPLOAD PAGE
========================================================= */

function initializeCreatorUpload(
currentUser
) {

const form =
    document.getElementById(
        "creatorComicForm"
    );


if (!form) {

    return;

}


setupComicForm(
    form,
    currentUser
);


loadComicForEditing(
    currentUser
);

}


/* =========================================================
4. GET COMICS
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
5. SAVE COMICS
========================================================= */

function saveEverJoyComics(
comics
) {

try {

    localStorage.setItem(
        EVER_JOY_COMICS_KEY,
        JSON.stringify(
            comics
        )
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
6. CATALOG DATA
========================================================= */

let creatorCatalog = null;


/* =========================================================
LOAD CREATOR CATALOG
========================================================= */

async function loadCreatorCatalog() {

try {

    const response =
        await fetch(
            "../data/catalog.json"
        );


    if (!response.ok) {

        throw new Error(
            `Failed to load catalog: ${response.status}`
        );

    }


    creatorCatalog =
        await response.json();


    populateFormatOptions();

    populateGenreOptions();

    populateTagOptions();


    console.log(
        "Ever Joy creator catalog loaded."
    );


}

catch (error) {

    console.error(
        "Ever Joy could not load creator catalog:",
        error
    );

}

}


/* =========================================================
FORMAT OPTIONS
========================================================= */

function populateFormatOptions() {

const select =
    document.getElementById(
        "comicFormat"
    );


if (
    !select ||
    !creatorCatalog ||
    !Array.isArray(
        creatorCatalog.formats
    )
) {

    return;

}


select.innerHTML = `

    <option value="">
        Select a format
    </option>

`;


creatorCatalog.formats.forEach(
    format => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            normalizeCatalogValue(
                format
            );


        option.textContent =
            format;


        select.appendChild(
            option
        );

    }
);

}


/* =========================================================
GENRE OPTIONS
========================================================= */

function populateGenreOptions() {

const primarySelect =
    document.getElementById(
        "comicGenre"
    );


const additionalSelect =
    document.getElementById(
        "comicGenres"
    );


if (
    !creatorCatalog ||
    !Array.isArray(
        creatorCatalog.genres
    )
) {

    return;

}


if (primarySelect) {

    primarySelect.innerHTML = `

        <option value="">
            Select a genre
        </option>

    `;

}


if (additionalSelect) {

    additionalSelect.innerHTML = "";

}


creatorCatalog.genres.forEach(
    genre => {

        const value =
            normalizeCatalogValue(
                genre
            );


        if (primarySelect) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                value;


            option.textContent =
                genre;


            primarySelect.appendChild(
                option
            );

        }


        if (additionalSelect) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                value;


            option.textContent =
                genre;


            additionalSelect.appendChild(
                option
            );

        }

    }
);

}


/* =========================================================
TAG OPTIONS
========================================================= */

function populateTagOptions() {

const select =
    document.getElementById(
        "comicTags"
    );


if (
    !select ||
    !creatorCatalog ||
    !creatorCatalog.tagGroups
) {

    return;

}


select.innerHTML = "";


Object.entries(
    creatorCatalog.tagGroups
).forEach(
    ([groupName, tags]) => {

        if (
            !Array.isArray(tags) ||
            !tags.length
        ) {

            return;

        }


        const group =
            document.createElement(
                "optgroup"
            );


        group.label =
            groupName;


        tags.forEach(
            tag => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    normalizeCatalogValue(
                        tag
                    );


                option.textContent =
                    tag;


                group.appendChild(
                    option
                );

            }
        );


        select.appendChild(
            group
        );

    }
);

}


/* =========================================================
CATALOG VALUE NORMALIZATION
========================================================= */

function normalizeCatalogValue(
value
) {

return String(
    value || ""
)
    .trim()
    .toLowerCase();

}


/* =========================================================
FORM SETUP
========================================================= */

function setupComicForm(
form,
currentUser
) {

const titleInput =
    document.getElementById(
        "comicTitle"
    );


const descriptionInput =
    document.getElementById(
        "comicDescription"
    );


const coverInput =
    document.getElementById(
        "comicCover"
    );


const formatInput =
    document.getElementById(
        "comicFormat"
    );


const genreInput =
    document.getElementById(
        "comicGenre"
    );


const genresInput =
    document.getElementById(
        "comicGenres"
    );


const statusInput =
    document.getElementById(
        "comicStatus"
    );


const ratingInput =
    document.getElementById(
        "comicRating"
    );


const tagsInput =
    document.getElementById(
        "comicTags"
    );


const submitButton =
    document.getElementById(
        "creatorComicSubmit"
    );


/*
    Load the centralized catalog
    before the creator uses the form.
*/

loadCreatorCatalog();


form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        clearComicMessage();


        removeInvalidFields();


        /* =============================================
           READ FORM VALUES
           ============================================= */

        const title =
            titleInput
                ? titleInput.value.trim()
                : "";


        const description =
            descriptionInput
                ? descriptionInput.value.trim()
                : "";


        const cover =
            coverInput
                ? coverInput.value.trim()
                : "";


        const format =
            formatInput
                ? formatInput.value
                : "";


        const primaryGenre =
            genreInput
                ? genreInput.value
                : "";


        const selectedGenres =
            genresInput
                ? Array.from(
                    genresInput.selectedOptions
                ).map(
                    option =>
                        option.value
                )
                : [];


        /*
            Always keep the primary genre
            as the first genre.
        */

        if (
            primaryGenre &&
            !selectedGenres.includes(
                primaryGenre
            )
        ) {

            selectedGenres.unshift(
                primaryGenre
            );

        }


        const status =
            statusInput
                ? statusInput.value
                : "draft";


        const rating =
            ratingInput
                ? ratingInput.value
                : "all";


        const selectedTags =
            tagsInput
                ? Array.from(
                    tagsInput.selectedOptions
                ).map(
                    option =>
                        option.value
                )
                : [];


        /* =============================================
           VALIDATION
           ============================================= */

        if (!title) {

            showComicMessage(
                "Please enter a title for your comic.",
                "error"
            );

            markInvalid(
                titleInput
            );

            if (titleInput) {
                titleInput.focus();
            }

            return;

        }


        if (title.length < 2) {

            showComicMessage(
                "Your comic title is too short.",
                "error"
            );

            markInvalid(
                titleInput
            );

            if (titleInput) {
                titleInput.focus();
            }

            return;

        }


        if (!description) {

            showComicMessage(
                "Please add a description for your comic.",
                "error"
            );

            markInvalid(
                descriptionInput
            );

            if (descriptionInput) {
                descriptionInput.focus();
            }

            return;

        }


        if (description.length < 20) {

            showComicMessage(
                "Please give your story a little more detail.",
                "error"
            );

            markInvalid(
                descriptionInput
            );

            if (descriptionInput) {
                descriptionInput.focus();
            }

            return;

        }


        /* =============================================
           COVER VALIDATION
           ============================================= */

        if (cover && !isValidCoverURL(cover)) {

            showComicMessage(
                "Please enter a valid cover image URL.",
                "error"
            );

            markInvalid(
                coverInput
            );

            if (coverInput) {
                coverInput.focus();
            }

            return;

        }


        /* =============================================
           DISABLE BUTTON
           ============================================= */

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Saving...";

        }


        /* =============================================
           CHECK EDIT MODE
           ============================================= */

        const editingComicId =
            sessionStorage.getItem(
                "everJoyEditingComic"
            );


        const comics =
            getEverJoyComics();


        /* =============================================
           EDIT EXISTING COMIC
           ============================================= */

        if (editingComicId) {

            const comicIndex =
                comics.findIndex(
                    comic =>
                        comic.id ===
                        editingComicId
                );


            if (comicIndex === -1) {

                showComicMessage(
                    "The comic you are trying to edit could not be found.",
                    "error"
                );


                resetSubmitButton(
                    submitButton
                );


                sessionStorage.removeItem(
                    "everJoyEditingComic"
                );


                return;

            }


            const comic =
                comics[comicIndex];


            /* -----------------------------------------
               SECURITY CHECK
               ----------------------------------------- */

            if (
                currentUser &&
                comic.creatorId !==
                currentUser.id
            ) {

                showComicMessage(
                    "You do not have permission to edit this comic.",
                    "error"
                );


                resetSubmitButton(
                    submitButton
                );


                return;

            }


            /* -----------------------------------------
               UPDATE COMIC
               ----------------------------------------- */

            comic.title =
                title;


            comic.description =
                description;


            comic.cover =
                cover;


            comic.format =
                format;


            comic.genres =
                selectedGenres;


            comic.status =
                status;


            comic.rating =
                rating;


            comic.tags =
                selectedTags;


            comic.updatedAt =
                new Date().toISOString();


            const saved =
                saveEverJoyComics(
                    comics
                );


            if (!saved) {

                showComicMessage(
                    "Your changes could not be saved. Please try again.",
                    "error"
                );


                resetSubmitButton(
                    submitButton
                );


                return;

            }


            sessionStorage.removeItem(
                "everJoyEditingComic"
            );


            showComicMessage(
                "Comic updated successfully. Opening My Comics...",
                "success"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "./comics.html";

                },
                700
            );


            return;

        }


        /* =============================================
           CREATE NEW COMIC
           ============================================= */

        const newComic = {

            id:
                createComicID(),


            creatorId:
                currentUser
                    ? currentUser.id
                    : null,


            title:
                title,


            description:
                description,


            cover:
                cover,


            format:
                format,


            genres:
                selectedGenres,


            status:
                status,


            rating:
                rating,


            tags:
                selectedTags,


            reads:
                0,


            subscribers:
                0,


            chapters:
                [],


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

            showComicMessage(
                "Your comic could not be saved. Please try again.",
                "error"
            );


            resetSubmitButton(
                submitButton
            );


            return;

        }


        /* =============================================
           SUCCESS
           ============================================= */

        showComicMessage(
            "Comic created successfully. Opening My Comics...",
            "success"
        );


        if (submitButton) {

            submitButton.textContent =
                "Saved ✓";

        }


        setTimeout(
            () => {

                window.location.href =
                    "./comics.html";

            },
            700
        );

    }

);

}


/* =========================================================
7. LOAD COMIC FOR EDITING
========================================================= */

function loadComicForEditing(
currentUser
) {

const editingComicId =
    sessionStorage.getItem(
        "everJoyEditingComic"
    );


if (!editingComicId) {

    return;

}


const comics =
    getEverJoyComics();


const comic =
    comics.find(
        item =>
            item.id ===
            editingComicId
    );


if (!comic) {

    sessionStorage.removeItem(
        "everJoyEditingComic"
    );

    return;

}


/* -----------------------------------------------------
   SECURITY CHECK
   ----------------------------------------------------- */

if (
    currentUser &&
    comic.creatorId !==
    currentUser.id
) {

    sessionStorage.removeItem(
        "everJoyEditingComic"
    );

    return;

}


/* -----------------------------------------------------
   CHANGE PAGE HEADING
   ----------------------------------------------------- */

const heading =
    document.querySelector(
        ".creator-page-heading h1"
    );


if (heading) {

    heading.textContent =
        "Edit Comic";

}


const introHeading =
    document.querySelector(
        ".creator-welcome-content h2"
    );


if (introHeading) {

    introHeading.textContent =
        "Continue building your story.";

}


const submitButton =
    document.getElementById(
        "creatorComicSubmit"
    );


if (submitButton) {

    submitButton.textContent =
        "Save Changes";

}


/* -----------------------------------------------------
   FILL FORM
   ----------------------------------------------------- */

setInputValue(
    "comicTitle",
    comic.title
);


setInputValue(
    "comicDescription",
    comic.description
);


setInputValue(
    "comicCover",
    comic.cover
);


setInputValue(
    "comicFormat",
    comic.format
);

/* -----------------------------------------------------
   FILL PRIMARY GENRE
   ----------------------------------------------------- */

setInputValue(
    "comicGenre",
    Array.isArray(comic.genres)
        ? comic.genres[0] || ""
        : comic.genre || ""
);


/* -----------------------------------------------------
   FILL ADDITIONAL GENRES
   ----------------------------------------------------- */

const additionalGenres =
    document.getElementById(
        "comicGenres"
    );


if (
    additionalGenres &&
    Array.isArray(
        comic.genres
    )
) {

    const genresToSelect =
        comic.genres.slice(
            1
        );


    Array.from(
        additionalGenres.options
    ).forEach(
        option => {

            option.selected =
                genresToSelect.includes(
                    option.value
                );

        }
    );

}


setInputValue(
    "comicStatus",
    comic.status
);


setInputValue(
    "comicRating",
    comic.rating
);


/* -----------------------------------------------------
   FILL TAGS
   ----------------------------------------------------- */

const comicTags =
    document.getElementById(
        "comicTags"
    );


if (
    comicTags &&
    Array.isArray(
        comic.tags
    )
) {

    Array.from(
        comicTags.options
    ).forEach(
        option => {

            option.selected =
                comic.tags.includes(
                    option.value
                );

        }
    );

}

}


/* =========================================================
8. CREATE COMIC ID
========================================================= */

function createComicID() {

return (
    "comic_" +
    Date.now() +
    "_" +
    Math.random()
        .toString(36)
        .slice(2, 10)
);

}


/* =========================================================
9. VALIDATE COVER URL
========================================================= */

function isValidCoverURL(
value
) {

try {

    const url =
        new URL(
            value
        );


    return (
        url.protocol ===
            "http:" ||
        url.protocol ===
            "https:"
    );

}

catch {

    return false;

}

}


/* =========================================================
10. SET INPUT VALUE
========================================================= */

function setInputValue(
id,
value
) {

const element =
    document.getElementById(
        id
    );


if (!element) {

    return;

}


element.value =
    value ?? "";

}


/* =========================================================
11. SHOW MESSAGE
========================================================= */

function showComicMessage(
text,
type
) {

const message =
    document.getElementById(
        "creatorComicMessage"
    );


if (!message) {

    return;

}


message.textContent =
    text;


message.className =
    `creator-form-message ${type}`;

}


/* =========================================================
12. CLEAR MESSAGE
========================================================= */

function clearComicMessage() {

const message =
    document.getElementById(
        "creatorComicMessage"
    );


if (!message) {

    return;

}


message.textContent =
    "";


message.className =
    "creator-form-message";

}


/* =========================================================
13. MARK INVALID
========================================================= */

function markInvalid(
element
) {

if (!element) {

    return;

}


element.classList.add(
    "invalid"
);

}


/* =========================================================
14. REMOVE INVALID STATES
========================================================= */

function removeInvalidFields() {

document
    .querySelectorAll(
        ".creator-input.invalid, .creator-textarea.invalid, .creator-form-select.invalid"
    )
    .forEach(
        element => {

            element.classList.remove(
                "invalid"
            );

        }
    );

}


/* =========================================================
15. RESET SUBMIT BUTTON
========================================================= */

function resetSubmitButton(
button
) {

if (!button) {

    return;

}


button.disabled =
    false;


button.textContent =
    "Save Comic";

}

