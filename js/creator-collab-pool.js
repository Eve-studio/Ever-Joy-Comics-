/* =====================================================
   EVER JOY COMICS
   COLLAB POOL
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
    ================================================= */

    const grid = document.getElementById("collabPoolGrid");
    const searchInput = document.getElementById("collabPoolSearch");
    const roleFilter = document.getElementById("collabPoolRoleFilter");
    const genreFilter = document.getElementById("collabPoolGenreFilter");

    const availableCount =
        document.getElementById("collabPoolAvailableCount");

    const loading =
        document.getElementById("collabPoolLoading");

    const emptyState =
        document.getElementById("collabPoolEmpty");

    const endState =
        document.getElementById("collabPoolEnd");

    const backButton =
        document.getElementById("collabPoolBackButton");

    const menuButton =
        document.getElementById("collabPoolMenuButton");


    /* =================================================
       SETTINGS
    ================================================= */

    const BATCH_SIZE = 12;

    let currentPage = 0;

    let isLoading = false;

    let hasMoreCreators = true;

    let allCreators = [];

    let filteredCreators = [];

    let currentUserId = null;


    /* =================================================
       CURRENT USER
    ================================================= */

    function getCurrentUser() {

        try {

            const possibleKeys = [
                "everJoyCurrentUser",
                "currentUser",
                "everjoyCurrentUser",
                "user"
            ];

            for (const key of possibleKeys) {

                const stored = localStorage.getItem(key);

                if (!stored) {
                    continue;
                }

                const parsed = JSON.parse(stored);

                if (parsed) {

                    currentUserId =
                        parsed.id ||
                        parsed.userId ||
                        parsed.username ||
                        null;

                    return parsed;
                }

            }

        } catch (error) {

            console.warn(
                "Ever Joy: Could not read current user.",
                error
            );

        }

        return null;
    }


    /* =================================================
       LOAD CREATOR DATA
    ================================================= */

    async function loadCreators() {

        try {

            /*
             * The Collab Pool first attempts to use the
             * platform creator data stored locally.
             *
             * This keeps the page compatible with the
             * current HTML/JS architecture while the
             * backend/database is still being developed.
             */

            const possibleFiles = [
                "../data/creators.json",
                "../data/users.json",
                "../data/accounts.json"
            ];

            for (const file of possibleFiles) {

                try {

                    const response =
                        await fetch(file, {
                            cache: "no-store"
                        });

                    if (!response.ok) {
                        continue;
                    }

                    const data = await response.json();

                    if (Array.isArray(data)) {

                        allCreators = data;
                        return;

                    }

                    if (
                        data &&
                        Array.isArray(data.creators)
                    ) {

                        allCreators = data.creators;
                        return;

                    }

                } catch (error) {

                    /*
                     * Try the next possible source.
                     */

                }

            }

        } catch (error) {

            console.error(
                "Ever Joy: Failed to load creator data.",
                error
            );

        }

        /*
         * If there is currently no creator database,
         * the feed simply remains empty.
         *
         * This prevents fake creators from appearing
         * in the real application.
         */

        allCreators = [];

    }


    /* =================================================
       CREATOR AVAILABILITY
    ================================================= */

    function isCreatorAvailable(creator) {

        if (!creator) {
            return false;
        }

        /*
         * Creator must actually be a creator.
         */

        const creatorEnabled =
            creator.creator?.enabled ??
            creator.isCreator ??
            creator.creatorEnabled ??
            false;

        if (!creatorEnabled) {
            return false;
        }


        /*
         * Creator must have collaboration enabled.
         */

        const collaborationEnabled =
            creator.creator?.collaboration?.available ??
            creator.creator?.collaborationAvailable ??
            creator.collaborationAvailable ??
            creator.collaboration?.available ??
            creator.collabAvailable ??
            false;

        if (!collaborationEnabled) {
            return false;
        }


        /*
         * A creator already involved in a collaboration
         * must automatically disappear from the pool.
         */

        const activeCollaboration =
            creator.creator?.collaboration?.active ??
            creator.creator?.activeCollaboration ??
            creator.activeCollaboration ??
            creator.collaboration?.active ??
            false;

        if (activeCollaboration) {
            return false;
        }


        /*
         * Some systems may use a collaboration status.
         */

        const status =
            creator.creator?.collaboration?.status ??
            creator.collaborationStatus ??
            creator.collabStatus ??
            null;

        if (
            status &&
            [
                "active",
                "busy",
                "unavailable",
                "collaborating"
            ].includes(
                String(status).toLowerCase()
            )
        ) {

            return false;

        }


        return true;

    }


    /* =================================================
       NORMALIZE CREATOR
    ================================================= */

    function normalizeCreator(creator) {

        const creatorData =
            creator.creator || creator;

        const profile =
            creator.profile || {};

        const username =
            creator.username ||
            profile.username ||
            creatorData.username ||
            "Creator";

        const displayName =
            creator.displayName ||
            profile.displayName ||
            creatorData.displayName ||
            username;

        const avatar =
            creator.avatar ||
            creator.profilePicture ||
            profile.avatar ||
            profile.profilePicture ||
            creatorData.avatar ||
            "../assets/images/profile-placeholder.jpg";

        const bio =
            creatorData.collaborationBio ||
            creator.collaborationBio ||
            creatorData.bio ||
            profile.bio ||
            "";

        const roles =
            creatorData.roles ||
            creator.roles ||
            [];

        const genres =
            creatorData.genres ||
            creator.genres ||
            [];

        const skills =
            creatorData.skills ||
            creator.skills ||
            [];

        return {

            id:
                creator.id ||
                creator.userId ||
                username,

            username,

            displayName,

            avatar,

            bio,

            roles:
                Array.isArray(roles)
                    ? roles
                    : [roles],

            genres:
                Array.isArray(genres)
                    ? genres
                    : [genres],

            skills:
                Array.isArray(skills)
                    ? skills
                    : [skills]

        };

    }


    /* =================================================
       PREPARE AVAILABLE CREATORS
    ================================================= */

    function getAvailableCreators() {

        const seen = new Set();

        return allCreators

            .filter(isCreatorAvailable)

            .map(normalizeCreator)

            .filter(creator => {

                if (seen.has(creator.id)) {
                    return false;
                }

                seen.add(creator.id);

                /*
                 * Don't display the logged-in creator
                 * inside their own collaboration pool.
                 */

                if (
                    currentUserId &&
                    String(creator.id) ===
                    String(currentUserId)
                ) {

                    return false;

                }

                return true;

            });

    }


    /* =================================================
       SEARCH & FILTER
    ================================================= */

    function applyFilters() {

        const query =
            String(
                searchInput?.value || ""
            )
                .trim()
                .toLowerCase();

        const selectedRole =
            String(
                roleFilter?.value || "all"
            )
                .toLowerCase();

        const selectedGenre =
            String(
                genreFilter?.value || "all"
            )
                .toLowerCase();


        const available =
            getAvailableCreators();


        filteredCreators =
            available.filter(creator => {

                const searchableText = [

                    creator.displayName,

                    creator.username,

                    creator.bio,

                    ...creator.roles,

                    ...creator.genres,

                    ...creator.skills

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !query ||
                    searchableText.includes(query);


                const normalizedRoles =
                    creator.roles
                        .map(role =>
                            String(role)
                                .toLowerCase()
                                .trim()
                        );


                const normalizedGenres =
                    creator.genres
                        .map(genre =>
                            String(genre)
                                .toLowerCase()
                                .trim()
                        );


                const matchesRole =
                    selectedRole === "all" ||
                    normalizedRoles.includes(
                        selectedRole
                    );


                const matchesGenre =
                    selectedGenre === "all" ||
                    normalizedGenres.includes(
                        selectedGenre
                    );


                return (
                    matchesSearch &&
                    matchesRole &&
                    matchesGenre
                );

            });


        currentPage = 0;

        hasMoreCreators = true;

        if (grid) {
            grid.innerHTML = "";
        }

        if (endState) {
            endState.hidden = true;
        }

        renderNextBatch();

    }


    /* =================================================
       UPDATE AVAILABLE COUNT
    ================================================= */

    function updateAvailableCount() {

        if (!availableCount) {
            return;
        }

        const count =
            filteredCreators.length;


        availableCount.textContent =
            count === 1
                ? "1 creator currently open to collaboration"
                : `${count} creators currently open to collaboration`;

    }


    /* =================================================
       CREATE CREATOR CARD
    ================================================= */

    function createCreatorCard(creator) {

        const card =
            document.createElement("article");

        card.className =
            "collab-pool-card";


        /*
         * Relevant collaboration information only.
         */

        const roles =
            creator.roles.length
                ? creator.roles.slice(0, 3).join(" • ")
                : "Creator";


        const genres =
            creator.genres.length
                ? creator.genres.slice(0, 3).join(" • ")
                : "";


        const skills =
            creator.skills.length
                ? creator.skills.slice(0, 4)
                : [];


        card.innerHTML = `

            <div class="collab-pool-card-avatar">

                <img
                    src="${escapeHTML(creator.avatar)}"
                    alt="${escapeHTML(creator.displayName)}"
                    loading="lazy"
                >

            </div>


            <div class="collab-pool-card-content">

                <div class="collab-pool-card-heading">

                    <h3>
                        ${escapeHTML(
                            creator.displayName
                        )}
                    </h3>

                    <span>
                        @${escapeHTML(
                            creator.username
                        )}
                    </span>

                </div>


                <p class="collab-pool-card-role">
                    ${escapeHTML(roles)}
                </p>


                ${
                    genres
                        ? `
                            <p class="collab-pool-card-genres">
                                ${escapeHTML(genres)}
                            </p>
                          `
                        : ""
                }


                ${
                    creator.bio
                        ? `
                            <p class="collab-pool-card-bio">
                                ${escapeHTML(
                                    creator.bio
                                )}
                            </p>
                          `
                        : ""
                }


                ${
                    skills.length
                        ? `
                            <div class="collab-pool-card-skills">

                                ${skills
                                    .map(skill => `
                                        <span>
                                            ${escapeHTML(
                                                skill
                                            )}
                                        </span>
                                    `)
                                    .join("")}

                            </div>
                          `
                        : ""
                }


                <div class="collab-pool-card-actions">

                    <button
                        type="button"
                        class="collab-pool-view-button"
                        data-action="view"
                        data-creator-id="${escapeHTML(
                            creator.id
                        )}"
                    >
                        View Profile
                    </button>


                    <button
                        type="button"
                        class="collab-pool-invite-button"
                        data-action="invite"
                        data-creator-id="${escapeHTML(
                            creator.id
                        )}"
                    >
                        Invite
                    </button>

                </div>

            </div>

        `;


        return card;

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =================================================
       RENDER NEXT BATCH
    ================================================= */

    function renderNextBatch() {

        if (isLoading) {
            return;
        }


        if (!grid) {
            return;
        }


        if (!filteredCreators.length) {

            if (emptyState) {
                emptyState.hidden = false;
            }

            if (endState) {
                endState.hidden = true;
            }

            updateAvailableCount();

            return;

        }


        if (emptyState) {
            emptyState.hidden = true;
        }


        const start =
            currentPage * BATCH_SIZE;

        const end =
            start + BATCH_SIZE;


        const batch =
            filteredCreators.slice(
                start,
                end
            );


        if (!batch.length) {

            hasMoreCreators = false;

            if (endState) {
                endState.hidden = false;
            }

            return;

        }


        isLoading = true;

        if (loading) {
            loading.hidden = false;
        }


        /*
         * Small delay gives the endless feed a natural
         * loading transition without requiring a backend.
         */

        setTimeout(() => {

            batch.forEach(creator => {

                grid.appendChild(
                    createCreatorCard(
                        creator
                    )
                );

            });


            currentPage++;

            isLoading = false;

            if (loading) {
                loading.hidden = true;
            }


            if (
                currentPage * BATCH_SIZE >=
                filteredCreators.length
            ) {

                hasMoreCreators = false;

                if (endState) {
                    endState.hidden = false;
                }

            }


        }, 250);

    }


    /* =================================================
       INFINITE SCROLL
    ================================================= */

    function handleInfiniteScroll() {

        if (!hasMoreCreators) {
            return;
        }


        const scrollPosition =
            window.innerHeight +
            window.scrollY;


        const threshold =
            document.documentElement
                .scrollHeight - 700;


        if (
            scrollPosition >= threshold
        ) {

            renderNextBatch();

        }

    }


/* =================================================
       VIEW PROFILE
    ================================================= */

    function viewCreatorProfile(creatorId) {

        const creator =
            filteredCreators.find(
                item =>
                    String(item.id) ===
                    String(creatorId)
            );


        if (!creator) {
            return;
        }


        /*
         * The profile route can be connected to the
         * shared Ever Joy profile system later.
         *
         * For now we preserve the selected creator.
         */

        localStorage.setItem(
            "everJoySelectedCreator",
            JSON.stringify(creator)
        );


        /*
         * If the shared profile page exists, use it.
         */

        window.location.href =
            "../account/profile.html";

    }


    /* =================================================
       INVITATION
    ================================================= */

    function inviteCreator(creatorId) {

        const creator =
            filteredCreators.find(
                item =>
                    String(item.id) ===
                    String(creatorId)
            );


        if (!creator) {
            return;
        }


        /*
         * Store the creator temporarily.
         *
         * The actual invitation system will eventually
         * create a structured collaboration request in
         * the creator's account data.
         */

        localStorage.setItem(
            "everJoyCollabInviteTarget",
            JSON.stringify(creator)
        );


        /*
         * For now we notify the user.
         *
         * The actual request form / invitation flow can
         * be connected once the collaboration data system
         * is implemented.
         */

        alert(
            `You selected ${creator.displayName} for a collaboration invitation.`
        );

    }


    /* =================================================
       CARD ACTIONS
    ================================================= */

    if (grid) {

        grid.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {
                    return;
                }


                const creatorId =
                    button.dataset.creatorId;

                const action =
                    button.dataset.action;


                if (action === "view") {

                    viewCreatorProfile(
                        creatorId
                    );

                }


                if (action === "invite") {

                    inviteCreator(
                        creatorId
                    );

                }

            }
        );

    }


    /* =================================================
       SEARCH
    ================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    /* =================================================
       ROLE FILTER
    ================================================= */

    if (roleFilter) {

        roleFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    /* =================================================
       GENRE FILTER
    ================================================= */

    if (genreFilter) {

        genreFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    /* =================================================
       BACK BUTTON
    ================================================= */

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                } else {

                    window.location.href =
                        "../index.html";

                }

            }
        );

    }


    /* =================================================
       MENU BUTTON
    ================================================= */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                /*
                 * Reserved for the Collab Pool menu.
                 * Nothing is changed here until the menu
                 * itself is designed.
                 */

                console.log(
                    "Ever Joy: Collab Pool menu opened."
                );

            }
        );

    }


    /* =================================================
       SCROLL LISTENER
    ================================================= */

    window.addEventListener(
        "scroll",
        handleInfiniteScroll,
        {
            passive: true
        }
    );


    /* =================================================
       INITIALIZE
    ================================================= */

    async function initializeCollabPool() {

        getCurrentUser();

        await loadCreators();

        applyFilters();

    }


    initializeCollabPool();

});