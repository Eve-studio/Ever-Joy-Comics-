/* =========================================================
   EVER JOY COMICS
   PUBLIC CREATOR PROFILE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. CREATOR STATE
   ========================================================= */

let creatorProfileCatalogue = [];

let creatorProfileComics = [];

let currentCreatorProfile = null;


/* =========================================================
   2. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCreatorProfile();

    }
);


async function initializeCreatorProfile() {

    /*
        Get creator ID from URL.
        Example:

        creator-profile.html?id=creator_001
    */

    const creatorId =
        getCreatorProfileId();


    /*
        Make sure an ID exists.
    */

    if (!creatorId) {

        showCreatorProfileError();

        return;

    }


    /*
        Load creator and comic data.
    */

    await Promise.all([

        loadCreatorProfiles(),

        loadCreatorProfileComics()

    ]);


    /*
        Find requested creator.
    */

    currentCreatorProfile =
        creatorProfileCatalogue.find(
            creator =>
                creator.id === creatorId
        );


    /*
        Creator doesn't exist.
    */

    if (!currentCreatorProfile) {

        showCreatorProfileError();

        return;

    }


    /*
        Render profile.
    */

    renderCreatorProfile();


    /*
        Hide loading state.
    */

    hideCreatorProfileLoading();


}


/* =========================================================
   3. GET CREATOR ID
   ========================================================= */

function getCreatorProfileId() {

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    return parameters.get(
        "id"
    );

}


/* =========================================================
   4. LOAD CREATORS
   ========================================================= */

async function loadCreatorProfiles() {

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


        creatorProfileCatalogue =
            data.creators || [];


    } catch (error) {

        console.error(
            "Ever Joy: Could not load creators.",
            error
        );

    }

}


/* =========================================================
   5. LOAD COMICS
   ========================================================= */

async function loadCreatorProfileComics() {

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


        creatorProfileComics =
            data.comics || [];


    } catch (error) {

        console.error(
            "Ever Joy: Could not load comics.",
            error
        );

    }

}


/* =========================================================
   6. RENDER PROFILE
   ========================================================= */

function renderCreatorProfile() {

    if (!currentCreatorProfile) {

        return;

    }


    renderCreatorIdentity();

    renderCreatorBio();

    renderCreatorInformation();

    renderCreatorWorks();

    updateCreatorPageTitle();

    showCreatorProfileSections();

}


/* =========================================================
   7. CREATOR IDENTITY
   ========================================================= */

function renderCreatorIdentity() {

    const name =
        document.querySelector(
            "#creatorProfileName"
        );


    const username =
        document.querySelector(
            "#creatorProfileUsername"
        );


    const avatar =
        document.querySelector(
            "#creatorProfileAvatar"
        );


    const roles =
        document.querySelector(
            "#creatorProfileRoles"
        );


    /*
        Creator name.
    */

    if (name) {

        name.textContent =
            currentCreatorProfile.name ||
            "Creator";

    }


    /*
        Username.
    */

    if (username) {

        const usernameValue =
            currentCreatorProfile.username;


        if (usernameValue) {

            username.textContent =
                usernameValue.startsWith("@")
                    ? usernameValue
                    : `@${usernameValue}`;

        } else {

            username.textContent =
                "";

        }

    }


    /*
        Avatar.
    */

    if (avatar) {

        if (
            currentCreatorProfile.avatar
        ) {

            avatar.src =
                currentCreatorProfile.avatar;

        } else {

            avatar.src =
                "../assets/images/default-avatar.webp";

        }


        avatar.alt =
            `${currentCreatorProfile.name || "Creator"} profile picture`;

    }


    /*
        Roles.
    */

    renderCreatorRoles(
        roles
    );

}


/* =========================================================
   8. CREATOR ROLES
   ========================================================= */

function renderCreatorRoles(
    container
) {

    if (!container) {

        return;

    }


    container.innerHTML = "";


    let roles =
        currentCreatorProfile.roles;


    /*
        Allow either:

        roles: ["Writer", "Artist"]

        OR

        role: "Writer"
    */

    if (!Array.isArray(roles)) {

        if (
            currentCreatorProfile.role
        ) {

            roles = [
                currentCreatorProfile.role
            ];

        } else {

            roles = [];

        }

    }


    roles.forEach(
        role => {

            if (!role) {

                return;

            }


            const badge =
                document.createElement(
                    "span"
                );


            badge.className =
                "creator-role";


            badge.textContent =
                role;


            container.appendChild(
                badge
            );

        }
    );


}


/* =========================================================
   9. BIO
   ========================================================= */

function renderCreatorBio() {

    const bioSection =
        document.querySelector(
            "#creatorBioSection"
        );


    const bio =
        document.querySelector(
            "#creatorProfileBio"
        );


    if (!bioSection || !bio) {

        return;

    }


    if (
        currentCreatorProfile.bio
    ) {

        bio.textContent =
            currentCreatorProfile.bio;


        bioSection.hidden =
            false;

    } else {

        bio.textContent =
            "This creator has not added a bio yet.";


        bioSection.hidden =
            false;

    }

}


/* =========================================================
   10. CREATOR INFORMATION
   ========================================================= */

function renderCreatorInformation() {

    const infoSection =
        document.querySelector(
            "#creatorInfoSection"
        );


    const creatorType =
        document.querySelector(
            "#creatorProfileCreatorType"
        );


    const workCount =
        document.querySelector(
            "#creatorProfileWorkCount"
        );


    if (!infoSection) {

        return;

    }


    /*
        Creator type.
    */

    if (creatorType) {

        creatorType.textContent =
            currentCreatorProfile.type ||
            "Creator";

    }


    /*
        Count works belonging
        to this creator.
    */

    const works =
        getCreatorWorks();


    if (workCount) {

        workCount.textContent =
            works.length;

    }


    infoSection.hidden =
        false;

}


/* =========================================================
   11. GET CREATOR WORKS
   ========================================================= */

function getCreatorWorks() {

    if (
        !currentCreatorProfile ||
        !currentCreatorProfile.id
    ) {

        return [];

    }


    const creatorId =
        currentCreatorProfile.id;


    return creatorProfileComics.filter(
        comic => {

            if (
                !comic.creators
            ) {

                return false;

            }


            const creators =
                comic.creators;


            /*
                Check writer.
            */

            if (
                creators.writer &&
                creators.writer.id ===
                creatorId
            ) {

                return true;

            }


            /*
                Check artist.
            */

            if (
                creators.artist &&
                creators.artist.id ===
                creatorId
            ) {

                return true;

            }


            /*
                Check colorist.
            */

            if (
                creators.colorist &&
                creators.colorist.id ===
                creatorId
            ) {

                return true;

            }


            return false;

        }
    );

}


/* =========================================================
   12. RENDER WORKS
   ========================================================= */

function renderCreatorWorks() {

    const section =
        document.querySelector(
            "#creatorWorksSection"
        );


    const grid =
        document.querySelector(
            "#creatorWorksGrid"
        );


    if (!section || !grid) {

        return;

    }


    grid.innerHTML = "";


    const works =
        getCreatorWorks();


    /*
        No works.
    */

    if (!works.length) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "creator-works-empty";


        empty.textContent =
            "This creator has no published works yet.";


        grid.appendChild(
            empty
        );


        section.hidden =
            false;


        return;

    }


    /*
        Render every work.
    */

    works.forEach(
        comic => {

            const card =
                createCreatorWorkCard(
                    comic
                );


            grid.appendChild(
                card
            );

        }
    );


    section.hidden =
        false;

}


/* =========================================================
   13. CREATE WORK CARD
   ========================================================= */

function createCreatorWorkCard(
    comic
) {

    const link =
        document.createElement(
            "a"
        );


    link.className =
        "creator-work-card";


    link.href =
        `../comic/details.html?id=${encodeURIComponent(
            comic.id
        )}`;


    /*
        Cover.
    */

    const cover =
        document.createElement(
            "div"
        );


    cover.className =
        "creator-work-cover";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        comic.cover ||
        "../assets/images/default-comic.webp";


    image.alt =
        comic.title ||
        "Comic";


    image.loading =
        "lazy";


    image.addEventListener(
        "error",
        () => {

            image.src =
                "../assets/images/default-comic.webp";

        }
    );


    cover.appendChild(
        image
    );


    /*
        Title.
    */

    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        comic.title ||
        "Untitled Comic";


    link.appendChild(
        cover
    );


    link.appendChild(
        title
    );


    return link;

}


/* =========================================================
   14. SHOW PROFILE SECTIONS
   ========================================================= */

function showCreatorProfileSections() {

    const identity =
        document.querySelector(
            "#creatorIdentity"
        );


    if (identity) {

        identity.hidden =
            false;

    }

}


/* =========================================================
   15. HIDE LOADING
   ========================================================= */

function hideCreatorProfileLoading() {

    const loading =
        document.querySelector(
            "#creatorProfileLoading"
        );


    if (loading) {

        loading.hidden =
            true;

    }

}


/* =========================================================
   16. SHOW ERROR
   ========================================================= */

function showCreatorProfileError() {

    const loading =
        document.querySelector(
            "#creatorProfileLoading"
        );


    const error =
        document.querySelector(
            "#creatorProfileError"
        );


    const identity =
        document.querySelector(
            "#creatorIdentity"
        );


    const bio =
        document.querySelector(
            "#creatorBioSection"
        );


    const info =
        document.querySelector(
            "#creatorInfoSection"
        );


    const works =
        document.querySelector(
            "#creatorWorksSection"
        );


    if (loading) {

        loading.hidden =
            true;

    }


    if (identity) {

        identity.hidden =
            true;

    }


    if (bio) {

        bio.hidden =
            true;

    }


    if (info) {

        info.hidden =
            true;

    }


    if (works) {

        works.hidden =
            true;

    }


    if (error) {

        error.hidden =
            false;

    }

}


/* =========================================================
   17. PAGE TITLE
   ========================================================= */

function updateCreatorPageTitle() {

    if (
        !currentCreatorProfile
    ) {

        return;

    }


    document.title =
        `${currentCreatorProfile.name || "Creator"} | Ever Joy Comics`;

}


/* =========================================================
   18. BACK BUTTON
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const backButton =
            document.querySelector(
                "#creatorBackButton"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    if (
                        window.history.length >
                        1
                    ) {

                        history.back();

                    } else {

                        window.location.href =
                            "creators.html";

                    }

                }
            );

        }

    }
);