/* =========================================================
   EVER JOY COMICS
   CREATOR STUDIO — COLLABORATION POOL

   Handles:

   - Creator discovery
   - Search
   - Role filtering
   - Genre filtering
   - Collaboration availability
   - Collaboration profiles
   - Collaboration requests
   - Sent / received requests
   - Accept / decline
   - Automatic availability lock
   - Active collaboration
   - Collaboration profile modal

   IMPORTANT:

   No authentication redirects.
   No creator kicking.
   No navigation interception.

   This is a localStorage prototype.
========================================================= */


/* =========================================================
   1. STORAGE KEYS
========================================================= */

const EVER_JOY_COLLAB_CREATORS_KEY =
    "everJoyCollabCreators";

const EVER_JOY_COLLAB_REQUESTS_KEY =
    "everJoyCollabRequests";

const EVER_JOY_ACTIVE_COLLABS_KEY =
    "everJoyActiveCollaborations";

const EVER_JOY_COLLAB_PROFILE_KEY =
    "everJoyMyCollabProfile";


/* =========================================================
   2. INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeCreatorCollaborations();

    }
);


/* =========================================================
   3. INITIALIZATION
========================================================= */

function initializeCreatorCollaborations() {

    seedDemoCreators();

    setupCollabSearch();

    setupCollabFilters();

    setupAvailabilityToggle();

    setupRequestTabs();

    setupCollabProfileButton();

    setupNotificationButton();

    renderCollaborationPage();

}


/* =========================================================
   4. CURRENT USER
========================================================= */

function getCollabCurrentUser() {

    if (
        typeof getEverJoyCurrentUser !==
        "function"
    ) {

        return null;

    }

    return getEverJoyCurrentUser();

}


/* =========================================================
   5. STORAGE HELPERS
========================================================= */

function readCollabStorage(
    key,
    fallback = []
) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed =
            JSON.parse(value);

        return parsed;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not read collaboration storage.",
            error
        );

        return fallback;

    }

}


function writeCollabStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not save collaboration data.",
            error
        );

        return false;

    }

}


/* =========================================================
   6. DEMO CREATOR DATA
========================================================= */

function seedDemoCreators() {

    const existing =
        readCollabStorage(
            EVER_JOY_COLLAB_CREATORS_KEY,
            []
        );

    if (existing.length) {
        return;
    }


    const demoCreators = [

        {
            id: "demo_creator_01",
            username: "LunaInk",
            role: "Writer",
            genres: [
                "romance",
                "drama"
            ],
            skills: [
                "Storytelling",
                "Dialogue",
                "Character Development"
            ],
            bio:
                "Romance and drama writer looking for artists and creative partners for character-driven stories.",
            available: true,
            avatar: "",
            joinedAt: new Date().toISOString()
        },


        {
            id: "demo_creator_02",
            username: "KuroCanvas",
            role: "Artist",
            genres: [
                "fantasy",
                "action"
            ],
            skills: [
                "Character Art",
                "Concept Art",
                "Comic Panels"
            ],
            bio:
                "Digital artist interested in fantasy worlds, expressive characters, and long-form comic projects.",
            available: true,
            avatar: "",
            joinedAt: new Date().toISOString()
        },


        {
            id: "demo_creator_03",
            username: "MikaColors",
            role: "Colorist",
            genres: [
                "fantasy",
                "romance",
                "action"
            ],
            skills: [
                "Coloring",
                "Lighting",
                "Atmosphere"
            ],
            bio:
                "Colorist focused on cinematic lighting, atmospheric scenes, and polished comic visuals.",
            available: true,
            avatar: "",
            joinedAt: new Date().toISOString()
        }

    ];


    writeCollabStorage(
        EVER_JOY_COLLAB_CREATORS_KEY,
        demoCreators
    );

}


/* =========================================================
   7. SEARCH
========================================================= */

function setupCollabSearch() {

    const input =
        document.getElementById(
            "collabSearch"
        );

    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            renderCreatorPool();

        }
    );

}


/* =========================================================
   8. FILTERS
========================================================= */

function setupCollabFilters() {

    const roleFilter =
        document.getElementById(
            "collabRoleFilter"
        );

    const genreFilter =
        document.getElementById(
            "collabGenreFilter"
        );


    if (roleFilter) {

        roleFilter.addEventListener(
            "change",
            () => {

                renderCreatorPool();

            }
        );

    }


    if (genreFilter) {

        genreFilter.addEventListener(
            "change",
            () => {

                renderCreatorPool();

            }
        );

    }

}


/* =========================================================
   9. AVAILABILITY
========================================================= */

function setupAvailabilityToggle() {

    const toggle =
        document.getElementById(
            "collabAvailabilityToggle"
        );

    if (!toggle) {
        return;
    }


    toggle.addEventListener(
        "change",
        () => {

            const active =
                getActiveCollaborationForCurrentUser();


            /*
               A creator cannot return to the pool
               while already collaborating.
            */

            if (active) {

                toggle.checked = false;

                showCollabToast(
                    "Your availability is locked while you have an active collaboration."
                );

                return;

            }


            const profile =
                getMyCollabProfile();


            profile.available =
                toggle.checked;


            saveMyCollabProfile(
                profile
            );


            updateCreatorAvailability(
                profile.available
            );


            renderCollaborationPage();


            showCollabToast(
                profile.available
                    ? "You are now open to collaboration."
                    : "You are no longer visible in the collaboration pool."
            );

        }
    );

}


/* =========================================================
   10. MY COLLAB PROFILE
========================================================= */

function getMyCollabProfile() {

    const stored =
        readCollabStorage(
            EVER_JOY_COLLAB_PROFILE_KEY,
            null
        );


    if (stored) {
        return stored;
    }


    const user =
        getCollabCurrentUser();


    return {

        id:
            user?.id ||
            "local_creator",

        username:
            user?.username ||
            "Creator",

        role:
            "Writer",

        genres: [],

        skills: [],

        bio:
            "Creator on Ever Joy Comics.",

        available:
            false

    };

}


function saveMyCollabProfile(
    profile
) {

    return writeCollabStorage(
        EVER_JOY_COLLAB_PROFILE_KEY,
        profile
    );

}


/* =========================================================
   11. UPDATE CREATOR AVAILABILITY
========================================================= */

function updateCreatorAvailability(
    available
) {

    const profile =
        getMyCollabProfile();


    const creators =
        readCollabStorage(
            EVER_JOY_COLLAB_CREATORS_KEY,
            []
        );


    const index =
        creators.findIndex(
            creator =>
                creator.id ===
                profile.id
        );


    if (index === -1) {

        creators.push({

            ...profile,

            available:
                available

        });

    }
    else {

        creators[index].available =
            available;

    }


    writeCollabStorage(
        EVER_JOY_COLLAB_CREATORS_KEY,
        creators
    );

}


/* =========================================================
   12. RENDER ENTIRE PAGE
========================================================= */

function renderCollaborationPage() {

    renderMyAvailability();

    renderCreatorPool();

    renderRequests();

    renderActiveCollaboration();

}


/* =========================================================
   13. AVAILABILITY DISPLAY
========================================================= */

function renderMyAvailability() {

    const toggle =
        document.getElementById(
            "collabAvailabilityToggle"
        );

    const title =
        document.getElementById(
            "creatorCollabStatusTitle"
        );

    const message =
        document.getElementById(
            "creatorCollabStatusMessage"
        );

    const card =
        document.getElementById(
            "creatorCollabStatusCard"
        );

    const lockNotice =
        document.getElementById(
            "creatorCollabLockNotice"
        );


    if (
        !toggle ||
        !title ||
        !message ||
        !card
    ) {
        return;
    }


    const profile =
        getMyCollabProfile();


    const active =
        getActiveCollaborationForCurrentUser();


    if (active) {

        toggle.checked = false;
        toggle.disabled = true;

        card.classList.remove(
            "is-available"
        );

        card.classList.add(
            "is-locked"
        );

        title.textContent =
            "You're currently collaborating.";

        message.textContent =
            "Your availability has automatically been turned off while your current collaboration is active.";

        if (lockNotice) {
            lockNotice.hidden = false;
        }

        return;

    }


    toggle.disabled = false;

    toggle.checked =
        profile.available === true;


    card.classList.toggle(
        "is-available",
        profile.available === true
    );

    card.classList.remove(
        "is-locked"
    );


    if (lockNotice) {
        lockNotice.hidden = true;
    }


    if (profile.available) {

        title.textContent =
            "You're open to collaboration.";

        message.textContent =
            "Your profile is currently visible to creators looking for collaborators.";

    }
    else {

        title.textContent =
            "You're currently unavailable.";

        message.textContent =
            "Turn on collaboration availability when you're ready to work with another creator.";

    }

}


/* =========================================================
   14. CREATOR POOL
========================================================= */

function renderCreatorPool() {

    const grid =
        document.getElementById(
            "creatorCollabGrid"
        );

    const empty =
        document.getElementById(
            "creatorCollabEmpty"
        );

    const count =
        document.getElementById(
            "collabResultCount"
        );


    if (!grid) {
        return;
    }


    const profile =
        getMyCollabProfile();


    const searchInput =
        document.getElementById(
            "collabSearch"
        );

    const roleFilter =
        document.getElementById(
            "collabRoleFilter"
        );

    const genreFilter =
        document.getElementById(
            "collabGenreFilter"
        );


    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedRole =
        roleFilter
            ? roleFilter.value
            : "all";


    const selectedGenre =
        genreFilter
            ? genreFilter.value
            : "all";


    const creators =
        readCollabStorage(
            EVER_JOY_COLLAB_CREATORS_KEY,
            []
        );


    let availableCreators =
        creators.filter(
            creator =>
                creator.available === true &&
                creator.id !== profile.id
        );


    if (searchTerm) {

        availableCreators =
            availableCreators.filter(
                creator => {

                    const searchable =
                        [
                            creator.username,
                            creator.role,
                            creator.bio,
                            ...(creator.skills || []),
                            ...(creator.genres || [])
                        ]
                        .join(" ")
                        .toLowerCase();


                    return searchable.includes(
                        searchTerm
                    );

                }
            );

    }


    if (
        selectedRole !== "all"
    ) {

        availableCreators =
            availableCreators.filter(
                creator =>
                    String(
                        creator.role || ""
                    )
                    .toLowerCase()
                    ===
                    selectedRole.toLowerCase()
            );

    }


    if (
        selectedGenre !== "all"
    ) {

        availableCreators =
            availableCreators.filter(
                creator =>
                    (
                        creator.genres || []
                    )
                    .map(
                        genre =>
                            String(
                                genre
                            )
                            .toLowerCase()
                    )
                    .includes(
                        selectedGenre.toLowerCase()
                    )
            );

    }


    grid.innerHTML = "";


    if (count) {

        count.textContent =
            `${availableCreators.length} ${
                availableCreators.length === 1
                    ? "creator"
                    : "creators"
            } available`;

    }


    if (!availableCreators.length) {

        grid.hidden = true;

        if (empty) {
            empty.hidden = false;
        }

        return;

    }


    grid.hidden = false;

    if (empty) {
        empty.hidden = true;
    }


    availableCreators.forEach(
        creator => {

            grid.appendChild(
                createCreatorCard(
                    creator
                )
            );

        }
    );

}


/* =========================================================
   15. CREATOR CARD
========================================================= */

function createCreatorCard(
    creator
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "creator-collab-card";


    const initial =
        String(
            creator.username ||
            "C"
        )
        .charAt(0)
        .toUpperCase();


    const avatarHTML =
        creator.avatar
            ? `
                <img
                    src="${escapeCollabHTML(
                        creator.avatar
                    )}"
                    alt=""
                >
              `
            : initial;


    const tags =
        [
            ...(creator.skills || []),
            ...(creator.genres || [])
        ]
        .slice(0, 5)
        .map(
            tag =>
                `
                <span class="creator-collab-tag">
                    ${escapeCollabHTML(tag)}
                </span>
                `
        )
        .join("");


    article.innerHTML = `

        <div class="creator-collab-card-top">

            <div class="creator-collab-avatar">
                ${avatarHTML}
            </div>

            <span
                class="creator-collab-available-dot"
                title="Available"
            ></span>

        </div>


        <div class="creator-collab-card-body">

            <h3 class="creator-collab-card-name">
                ${escapeCollabHTML(
                    creator.username ||
                    "Creator"
                )}
            </h3>


            <span class="creator-collab-card-role">
                ${escapeCollabHTML(
                    creator.role ||
                    "Creator"
                )}
            </span>


            <p class="creator-collab-card-bio">
                ${escapeCollabHTML(
                    creator.bio ||
                    "Open to creative collaboration."
                )}
            </p>


            <div class="creator-collab-tags">
                ${tags}
            </div>


            <div class="creator-collab-card-actions">

                <button
                    type="button"
                    data-action="profile"
                >
                    View Profile
                </button>


                <button
                    type="button"
                    class="primary"
                    data-action="request"
                >
                    Invite
                </button>

            </div>

        </div>

    `;


    const profileButton =
        article.querySelector(
            '[data-action="profile"]'
        );

    const requestButton =
        article.querySelector(
            '[data-action="request"]'
        );


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            () => {

                openCreatorProfile(
                    creator
                );

            }
        );

    }


    if (requestButton) {

        requestButton.addEventListener(
            "click",
            () => {

                openCollaborationRequest(
                    creator
                );

            }
        );

    }


    return article;

}


/* =========================================================
   16. PROFILE MODAL
========================================================= */

function openCreatorProfile(
    creator
) {

    const modal =
        createCollabModal();


    modal.innerHTML = `

        <div
            class="creator-collab-modal-card"
            role="dialog"
            aria-modal="true"
        >

            <div class="creator-collab-modal-header">

                <div>

                    <span class="creator-eyebrow">
                        CREATOR PROFILE
                    </span>

                    <h2>
                        ${escapeCollabHTML(
                            creator.username ||
                            "Creator"
                        )}
                    </h2>

                    <p>
                        ${escapeCollabHTML(
                            creator.role ||
                            "Creator"
                        )}
                    </p>

                </div>


                <button
                    type="button"
                    class="creator-collab-modal-close"
                    data-close-modal
                >
                    ×
                </button>

            </div>


            <div class="creator-collab-modal-body">

                <div class="creator-profile-preview">

                    <div class="creator-profile-preview-avatar">
                        ${escapeCollabHTML(
                            String(
                                creator.username ||
                                "C"
                            )
                            .charAt(0)
                            .toUpperCase()
                        )}
                    </div>

                    <div>

                        <strong>
                            Currently available
                        </strong>

                        <span>
                            Open to collaboration
                        </span>

                    </div>

                </div>


                <p class="creator-collab-card-bio">
                    ${escapeCollabHTML(
                        creator.bio ||
                        "No creator biography yet."
                    )}
                </p>


                <div class="creator-collab-tags">

                    ${(creator.skills || [])
                        .map(
                            skill =>
                                `
                                <span class="creator-collab-tag">
                                    ${escapeCollabHTML(skill)}
                                </span>
                                `
                        )
                        .join("")}

                </div>


                <div class="creator-collab-form-actions">

                    <button
                        type="button"
                        class="creator-collab-form-cancel"
                        data-close-modal
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        class="creator-collab-form-submit"
                        id="profileInviteButton"
                    >
                        Send Collaboration Request
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    setupModalClose(
        modal
    );


    const inviteButton =
        modal.querySelector(
            "#profileInviteButton"
        );


    if (inviteButton) {

        inviteButton.addEventListener(
            "click",
            () => {

                modal.remove();

                openCollaborationRequest(
                    creator
                );

            }
        );

    }

}


/* =========================================================
   17. REQUEST FORM
========================================================= */

function openCollaborationRequest(
    creator
) {

    if (!creator) {
        return;
    }


    const active =
        getActiveCollaborationForCurrentUser();


    if (active) {

        showCollabToast(
            "You already have an active collaboration."
        );

        return;

    }


    const modal =
        createCollabModal();


    modal.innerHTML = `

        <div
            class="creator-collab-modal-card"
            role="dialog"
            aria-modal="true"
        >

            <div class="creator-collab-modal-header">

                <div>

                    <span class="creator-eyebrow">
                        COLLABORATION REQUEST
                    </span>

                    <h2>
                        Invite ${escapeCollabHTML(
                            creator.username
                        )}
                    </h2>

                    <p>
                        Tell them about the project before
                        they decide.
                    </p>

                </div>


                <button
                    type="button"
                    class="creator-collab-modal-close"
                    data-close-modal
                >
                    ×
                </button>

            </div>


            <div class="creator-collab-modal-body">

                <form
                    class="creator-collab-form"
                    id="collabRequestForm"
                >

                    <div class="creator-profile-preview">

                        <div class="creator-profile-preview-avatar">
                            ${escapeCollabHTML(
                                String(
                                    creator.username
                                )
                                .charAt(0)
                                .toUpperCase()
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeCollabHTML(
                                    creator.username
                                )}
                            </strong>

                            <span>
                                ${escapeCollabHTML(
                                    creator.role ||
                                    "Creator"
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="creator-collab-form-group">

                        <label for="collabProjectTitle">
                            Project title
                        </label>

                        <input
                            type="text"
                            id="collabProjectTitle"
                            name="projectTitle"
                            placeholder="e.g. Moonlit Hearts"
                            maxlength="100"
                            required
                        >

                    </div>


                    <div class="creator-collab-form-row">

                        <div class="creator-collab-form-group">

                            <label for="collabProjectType">
                                Project type
                            </label>

                            <select
                                id="collabProjectType"
                                name="projectType"
                                required
                            >

                                <option value="">
                                    Select type
                                </option>

                                <option value="comic">
                                    Comic
                                </option>

                                <option value="webtoon">
                                    Webtoon
                                </option>

                                <option value="illustrated-story">
                                    Illustrated Story
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div class="creator-collab-form-group">

                            <label for="collabNeededRole">
                                Role needed
                            </label>

                            <select
                                id="collabNeededRole"
                                name="neededRole"
                                required
                            >

                                <option value="">
                                    Select role
                                </option>

                                <option value="writer">
                                    Writer
                                </option>

                                <option value="artist">
                                    Artist
                                </option>

                                <option value="colorist">
                                    Colorist
                                </option>

                                <option value="editor">
                                    Editor
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="creator-collab-form-group">

                        <label for="collabRequestMessage">
                            Project description
                        </label>

                        <textarea
                            id="collabRequestMessage"
                            name="message"
                            placeholder="Explain the project, what you want to create together, and why you think this creator would be a good fit..."
                            maxlength="1200"
                            required
                        ></textarea>

                    </div>


                    <div class="creator-collab-form-actions">

                        <button
                            type="button"
                            class="creator-collab-form-cancel"
                            data-close-modal
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="creator-collab-form-submit"
                        >
                            Send Request
                        </button>

                    </div>

                </form>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    setupModalClose(
        modal
    );


    const form =
        modal.querySelector(
            "#collabRequestForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const currentUser =
                getCollabCurrentUser();


            const profile =
                getMyCollabProfile();


            const request = {

                id:
                    "collab_request_" +
                    Date.now(),

                senderId:
                    currentUser?.id ||
                    profile.id,

                senderName:
                    currentUser?.username ||
                    profile.username ||
                    "Creator",

                receiverId:
                    creator.id,

                receiverName:
                    creator.username,

                projectTitle:
                    form.projectTitle.value.trim(),

                projectType:
                    form.projectType.value,

                neededRole:
                    form.neededRole.value,

                message:
                    form.message.value.trim(),

                status:
                    "pending",

                createdAt:
                    new Date().toISOString()

            };


            const requests =
                readCollabStorage(
                    EVER_JOY_COLLAB_REQUESTS_KEY,
                    []
                );


            requests.push(
                request
            );


            writeCollabStorage(
                EVER_JOY_COLLAB_REQUESTS_KEY,
                requests
            );


            modal.remove();


            renderRequests();


            showCollabToast(
                "Collaboration request sent successfully."
            );

        }
    );

}


/* =========================================================
   18. MODAL HELPERS
========================================================= */

function createCollabModal() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "creator-collab-modal";


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );


    return modal;

}


function setupModalClose(
    modal
) {

    modal
        .querySelectorAll(
            "[data-close-modal]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        modal.remove();

                    }
                );

            }
        );

}


/* =========================================================
   19. REQUEST TABS
========================================================= */

function setupRequestTabs() {

    const tabs =
        document.querySelectorAll(
            ".creator-request-tab"
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


                    const selected =
                        tab.dataset.requestTab;


                    const received =
                        document.getElementById(
                            "receivedRequests"
                        );

                    const sent =
                        document.getElementById(
                            "sentRequests"
                        );


                    if (selected === "received") {

                        if (received) {
                            received.hidden = false;
                        }

                        if (sent) {
                            sent.hidden = true;
                        }

                    }
                    else {

                        if (received) {
                            received.hidden = true;
                        }

                        if (sent) {
                            sent.hidden = false;
                        }

                    }


                    renderRequests();

                }
            );

        }
    );

}


/* =========================================================
   20. REQUESTS
========================================================= */

function renderRequests() {

    const currentUser =
        getCollabCurrentUser();

    const profile =
        getMyCollabProfile();


    const userId =
        currentUser?.id ||
        profile.id;


    const requests =
        readCollabStorage(
            EVER_JOY_COLLAB_REQUESTS_KEY,
            []
        );


    const received =
        requests.filter(
            request =>
                request.receiverId ===
                userId &&
                request.status ===
                "pending"
        );


    const sent =
        requests.filter(
            request =>
                request.senderId ===
                userId
        );


    const receivedContainer =
        document.getElementById(
            "receivedRequests"
        );

    const sentContainer =
        document.getElementById(
            "sentRequests"
        );

    const receivedCount =
        document.getElementById(
            "receivedRequestCount"
        );

    const sentCount =
        document.getElementById(
            "sentRequestCount"
        );

    const empty =
        document.getElementById(
            "requestEmpty"
        );


    if (receivedCount) {
        receivedCount.textContent =
            received.length;
    }


    if (sentCount) {
        sentCount.textContent =
            sent.length;
    }


    if (receivedContainer) {

        receivedContainer.innerHTML =
            received
                .map(
                    request =>
                        createRequestHTML(
                            request,
                            true
                        )
                )
                .join("");

    }


    if (sentContainer) {

        sentContainer.innerHTML =
            sent
                .map(
                    request =>
                        createRequestHTML(
                            request,
                            false
                        )
                )
                .join("");

    }


    const activeTab =
        document.querySelector(
            ".creator-request-tab.active"
        );


    const activeType =
        activeTab?.dataset.requestTab ||
        "received";


    const activeRequests =
        activeType === "received"
            ? received
            : sent;


    if (empty) {

        empty.hidden =
            activeRequests.length > 0;

    }


    setupRequestButtons();

}


/* =========================================================
   21. REQUEST CARD HTML
========================================================= */

function createRequestHTML(
    request,
    received
) {

    const statusLabel =
        formatRequestStatus(
            request.status
        );


    const person =
        received
            ? request.senderName
            : request.receiverName;


    return `

        <article
            class="creator-collab-request"
            data-request-id="${escapeCollabHTML(
                request.id
            )}"
        >

            <div class="creator-request-avatar">

                ${escapeCollabHTML(
                    String(
                        person ||
                        "C"
                    )
                    .charAt(0)
                    .toUpperCase()
                )}

            </div>


            <div class="creator-request-content">

                <strong>
                    ${escapeCollabHTML(
                        person ||
                        "Creator"
                    )}
                </strong>


                <span class="creator-request-meta">

                    ${received
                        ? "Sent you a collaboration request"
                        : `Request to ${escapeCollabHTML(
                            request.receiverName
                        )}`
                    }

                    ·

                    ${escapeCollabHTML(
                        request.projectTitle
                    )}

                </span>


                <p class="creator-request-message">
                    ${escapeCollabHTML(
                        request.message
                    )}
                </p>


                <span class="creator-request-meta">
                    ${statusLabel}
                </span>

            </div>


            <div class="creator-request-actions">

                ${
                    received &&
                    request.status === "pending"
                        ? `
                            <button
                                type="button"
                                class="accept"
                                data-request-action="accept"
                                data-request-id="${escapeCollabHTML(
                                    request.id
                                )}"
                            >
                                Accept
                            </button>

                            <button
                                type="button"
                                class="decline"
                                data-request-action="decline"
                                data-request-id="${escapeCollabHTML(
                                    request.id
                                )}"
                            >
                                Decline
                            </button>
                          `
                        : ""
                }

            </div>

        </article>

    `;

}


/* =========================================================
   22. REQUEST BUTTONS
========================================================= */

function setupRequestButtons() {

    document
        .querySelectorAll(
            "[data-request-action]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const action =
                            button.dataset.requestAction;

                        const requestId =
                            button.dataset.requestId;


                        if (
                            action ===
                            "accept"
                        ) {

                            acceptCollaborationRequest(
                                requestId
                            );

                        }


                        if (
                            action ===
                            "decline"
                        ) {

                            declineCollaborationRequest(
                                requestId
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   23. ACCEPT REQUEST
========================================================= */

function acceptCollaborationRequest(
requestId
) {

    const requests =
        readCollabStorage(
            EVER_JOY_COLLAB_REQUESTS_KEY,
            []
        );


    const request =
        requests.find(
            item =>
                item.id ===
                requestId
        );


    if (
        !request ||
        request.status !==
        "pending"
    ) {

        return;

    }


    /*
       IMPORTANT FAIRNESS RULE:

       Accepting a request automatically
       creates an active collaboration and
       turns the receiving creator OFF the
       collaboration market.
    */


    request.status =
        "accepted";

    request.acceptedAt =
        new Date().toISOString();


    writeCollabStorage(
        EVER_JOY_COLLAB_REQUESTS_KEY,
        requests
    );


    const currentUser =
        getCollabCurrentUser();

    const profile =
        getMyCollabProfile();


    const userId =
        currentUser?.id ||
        profile.id;


    const activeCollaborations =
        readCollabStorage(
            EVER_JOY_ACTIVE_COLLABS_KEY,
            []
        );


    const collaboration = {

        id:
            "active_collab_" +
            Date.now(),

        requestId:
            request.id,

        creatorA:
            request.senderId,

        creatorAName:
            request.senderName,

        creatorB:
            userId,

        creatorBName:
            request.receiverName,

        projectTitle:
            request.projectTitle,

        projectType:
            request.projectType,

        roleNeeded:
            request.neededRole,

        description:
            request.message,

        status:
            "active",

        startedAt:
            new Date().toISOString()

    };


    activeCollaborations.push(
        collaboration
    );


    writeCollabStorage(
        EVER_JOY_ACTIVE_COLLABS_KEY,
        activeCollaborations
    );


    /*
       AUTOMATICALLY REMOVE RECEIVING CREATOR
       FROM THE AVAILABLE POOL.
    */

    const myProfile =
        getMyCollabProfile();


    myProfile.available =
        false;


    saveMyCollabProfile(
        myProfile
    );


    updateCreatorAvailability(
        false
    );


    renderCollaborationPage();


    showCollabToast(
        "Collaboration accepted. Your profile is now off the market."
    );

}


/* =========================================================
   24. DECLINE REQUEST
========================================================= */

function declineCollaborationRequest(
requestId
) {

    const requests =
        readCollabStorage(
            EVER_JOY_COLLAB_REQUESTS_KEY,
            []
        );


    const request =
        requests.find(
            item =>
                item.id ===
                requestId
        );


    if (!request) {
        return;
    }


    request.status =
        "declined";


    request.declinedAt =
        new Date().toISOString();


    writeCollabStorage(
        EVER_JOY_COLLAB_REQUESTS_KEY,
        requests
    );


    renderRequests();


    showCollabToast(
        "Collaboration request declined."
    );

}


/* =========================================================
   25. ACTIVE COLLABORATION
========================================================= */

function getActiveCollaborationForCurrentUser() {

    const currentUser =
        getCollabCurrentUser();

    const profile =
        getMyCollabProfile();


    const userId =
        currentUser?.id ||
        profile.id;


    const collaborations =
        readCollabStorage(
            EVER_JOY_ACTIVE_COLLABS_KEY,
            []
        );


    return (
        collaborations.find(
            collaboration =>
                (
                    collaboration.creatorA ===
                    userId
                )
                ||
                (
                    collaboration.creatorB ===
                    userId
                )
        )
        ||
        null
    );

}


function renderActiveCollaboration() {

    const container =
        document.getElementById(
            "activeCollaboration"
        );


    if (!container) {
        return;
    }


    const active =
        getActiveCollaborationForCurrentUser();


    if (!active) {

        container.innerHTML = `

            <div class="creator-collab-empty">

                <div class="creator-empty-icon">
                    ✦
                </div>

                <h3>
                    No active collaboration
                </h3>

                <p>
                    When you accept a collaboration request,
                    your active project will appear here.
                </p>

            </div>

        `;

        return;

    }


    const currentUser =
        getCollabCurrentUser();

    const profile =
        getMyCollabProfile();


    const userId =
        currentUser?.id ||
        profile.id;


    const partner =
        active.creatorA === userId
            ? active.creatorBName
            : active.creatorAName;


    container.innerHTML = `

        <article class="creator-active-project">

            <span class="creator-active-project-label">
                ● ACTIVE COLLABORATION
            </span>


            <h3>
                ${escapeCollabHTML(
                    active.projectTitle
                )}
            </h3>


            <p>
                ${escapeCollabHTML(
                    active.description
                )}
            </p>


            <div class="creator-active-project-meta">

                <span>
                    Partner: ${escapeCollabHTML(
                        partner
                    )}
                </span>


                <span>
                    ${escapeCollabHTML(
                        active.projectType
                    )}
                </span>


                <span>
                    Started ${formatCollabDate(
                        active.startedAt
                    )}
                </span>

            </div>

        </article>

    `;

}


/* =========================================================
   26. PROFILE BUTTON
========================================================= */

function setupCollabProfileButton() {

    const button =
        document.getElementById(
            "openCollabProfileButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            openMyCollabProfileEditor();

        }
    );

}


/* =========================================================
   27. MY PROFILE EDITOR
========================================================= */

function openMyCollabProfileEditor() {

    const profile =
        getMyCollabProfile();


    const modal =
        createCollabModal();


    modal.innerHTML = `

        <div
            class="creator-collab-modal-card"
            role="dialog"
            aria-modal="true"
        >

            <div class="creator-collab-modal-header">

                <div>

                    <span class="creator-eyebrow">
                        YOUR PROFILE
                    </span>

                    <h2>
                        Collaboration profile
                    </h2>

                    <p>
                        Tell other creators what you bring
                        to a project.
                    </p>

                </div>


                <button
                    type="button"
                    class="creator-collab-modal-close"
                    data-close-modal
                >
                    ×
                </button>

            </div>


            <div class="creator-collab-modal-body">

                <form
                    class="creator-collab-form"
                    id="myCollabProfileForm"
                >

                    <div class="creator-collab-form-group">

                        <label for="myCollabRole">
                            Primary role
                        </label>

                        <select
                            id="myCollabRole"
                            name="role"
                            required
                        >

                            <option value="Writer">
                                Writer
                            </option>

                            <option value="Artist">
                                Artist
                            </option>

                            <option value="Colorist">
                                Colorist
                            </option>

                            <option value="Editor">
                                Editor
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    <div class="creator-collab-form-group">

                        <label for="myCollabSkills">
                            Skills
                        </label>

                        <input
                            type="text"
                            id="myCollabSkills"
                            name="skills"
                            placeholder="e.g. Character art, dialogue, coloring"
                        >

                    </div>


                    <div class="creator-collab-form-group">

                        <label for="myCollabGenres">
                            Genres
                        </label>

                        <input
                            type="text"
                            id="myCollabGenres"
                            name="genres"
                            placeholder="e.g. Romance, Fantasy, Drama"
                        >

                    </div>


                    <div class="creator-collab-form-group">

                        <label for="myCollabBio">
                            Collaboration bio
                        </label>

                        <textarea
                            id="myCollabBio"
                            name="bio"
                            maxlength="500"
                            placeholder="Tell creators what kind of projects you enjoy working on..."
                        ></textarea>

                    </div>


                    <div class="creator-collab-form-actions">

                        <button
                            type="button"
                            class="creator-collab-form-cancel"
                            data-close-modal
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="creator-collab-form-submit"
                        >
                            Save Profile
                        </button>

                    </div>

                </form>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    setupModalClose(
        modal
    );


    const form =
        modal.querySelector(
            "#myCollabProfileForm"
        );


    form.role.value =
        profile.role ||
        "Writer";


    form.skills.value =
        (
            profile.skills ||
            []
        )
        .join(", ");


    form.genres.value =
        (
            profile.genres ||
            []
        )
        .join(", ");


    form.bio.value =
        profile.bio ||
        "";


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const updatedProfile = {

                ...profile,

                role:
                    form.role.value,

                skills:
                    form.skills.value
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean),

                genres:
                    form.genres.value
                        .split(",")
                        .map(
                            item =>
                                item
                                    .trim()
                                    .toLowerCase()
                        )
                        .filter(Boolean),

                bio:
                    form.bio.value.trim()

            };


            saveMyCollabProfile(
                updatedProfile
            );


            updateCreatorAvailability(
                updatedProfile.available === true
            );


            modal.remove();


            renderCollaborationPage();


            showCollabToast(
                "Your collaboration profile has been updated."
            );

        }
    );

}



/* =========================================================
   28. NOTIFICATIONS
========================================================= */

function setupNotificationButton() {

    const button =
        document.getElementById(
            "creatorNotificationButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            showCollabToast(
                "No new collaboration notifications."
            );

        }
    );

}


/* =========================================================
   29. TOAST
========================================================= */

function showCollabToast(
message
) {

    const existing =
        document.querySelector(
            ".creator-collab-toast"
        );


    if (existing) {
        existing.remove();
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "creator-collab-toast";


    toast.textContent =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        2800
    );

}


/* =========================================================
   30. STATUS LABEL
========================================================= */

function formatRequestStatus(
status
) {

    switch (
        String(
            status ||
            ""
        )
        .toLowerCase()
    ) {

        case "accepted":
            return "Accepted";

        case "declined":
            return "Declined";

        case "pending":
            return "Awaiting response";

        default:
            return "Unknown";

    }

}


/* =========================================================
   31. DATE FORMAT
========================================================= */

function formatCollabDate(
date
) {

    if (!date) {
        return "recently";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return "recently";

    }


    return parsed.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   32. SAFE HTML
========================================================= */

function escapeCollabHTML(
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