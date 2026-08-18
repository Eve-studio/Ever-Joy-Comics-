/* =========================================================
EVER JOY COMICS
CREATOR STUDIO — SETTINGS

Handles:

- Creator profile settings
- Creator avatar preview
- Profile visibility
- Publishing preferences
- Collaboration availability display
- Notification preferences
- Creator Studio preferences
- Creator mode deactivation
- Sign out
- LocalStorage persistence

DEVELOPMENT NOTE:

Access protection is intentionally disabled.

This page should open normally during development.
========================================================= */

/* =========================================================

1. STORAGE KEYS
   ========================================================= */

const EVER_JOY_SETTINGS_KEY =
"everJoyCreatorSettings";

const EVER_JOY_COLLAB_KEY =
"everJoyCollaborationSettings";

/* =========================================================
2. INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    initializeCreatorSettings();

}

);

/* =========================================================
3. INITIALIZE SETTINGS
========================================================= */

function initializeCreatorSettings() {

const currentUser =
    getCreatorSettingsUser();


loadCreatorProfile(
    currentUser
);


loadCreatorSettings();


loadCollaborationStatus(
    currentUser
);


setupProfileForm();


setupPublishingSettings();


setupNotificationSettings();


setupStudioPreferences();


setupCollaborationButton();


setupAccountActions();


setupAvatarPreview();


setupLiveSettingUpdates();

}

/* =========================================================
4. CURRENT USER
========================================================= */

function getCreatorSettingsUser() {

if (
    typeof getEverJoyCurrentUser !==
    "function"
) {

    return null;

}


return getEverJoyCurrentUser();

}

/* =========================================================
5. DEFAULT SETTINGS
========================================================= */

function getDefaultCreatorSettings() {

return {

    displayName: "",

    bio: "",

    avatar: "",

    publicProfile: true,

    showComics: true,

    showCollabStatus: true,

    defaultStatus: "draft",

    confirmSubmission: true,

    keepCompleted: true,

    notifications: {

        publishing: true,

        collaboration: true,

        earnings: true,

        announcements: true

    },

    studio: {

        analyticsRange: "30",

        compactCards: false

    }

};

}

/* =========================================================
6. LOAD SETTINGS
========================================================= */

function getCreatorSettings() {

const defaults =
    getDefaultCreatorSettings();


try {

    const stored =
        localStorage.getItem(
            EVER_JOY_SETTINGS_KEY
        );


    if (!stored) {

        return defaults;

    }


    const parsed =
        JSON.parse(
            stored
        );


    return {

        ...defaults,

        ...parsed,

        notifications: {

            ...defaults.notifications,

            ...(parsed.notifications || {})

        },

        studio: {

            ...defaults.studio,

            ...(parsed.studio || {})

        }

    };

}

catch (error) {

    console.error(
        "Ever Joy: Could not load creator settings.",
        error
    );


    return defaults;

}

}

/* =========================================================
7. SAVE SETTINGS
========================================================= */

function saveCreatorSettings(
settings
) {

try {

    localStorage.setItem(
        EVER_JOY_SETTINGS_KEY,
        JSON.stringify(settings)
    );

    return true;

}

catch (error) {

    console.error(
        "Ever Joy: Could not save creator settings.",
        error
    );

    return false;

}

}

/* =========================================================
8. LOAD CREATOR PROFILE
========================================================= */

function loadCreatorProfile(
user
) {

const settings =
    getCreatorSettings();


const displayName =
    settings.displayName ||
    user?.username ||
    "Creator";


const displayNameInput =
    document.getElementById(
        "creatorDisplayName"
    );


const bioInput =
    document.getElementById(
        "creatorBio"
    );


const avatarInput =
    document.getElementById(
        "creatorAvatarUrl"
    );


const previewName =
    document.getElementById(
        "settingsPreviewName"
    );


const settingsAvatar =
    document.getElementById(
        "settingsAvatar"
    );


const topAvatar =
    document.getElementById(
        "creatorAvatar"
    );


const topAccountName =
    document.getElementById(
        "creatorAccountName"
    );


if (displayNameInput) {

    displayNameInput.value =
        settings.displayName ||
        user?.username ||
        "";

}


if (bioInput) {

    bioInput.value =
        settings.bio ||
        "";

}


if (avatarInput) {

    avatarInput.value =
        settings.avatar ||
        user?.profile?.avatar ||
        "";

}


if (previewName) {

    previewName.textContent =
        displayName;

}


updateAvatarElement(
    settingsAvatar,
    displayName,
    settings.avatar ||
    user?.profile?.avatar
);


updateAvatarElement(
    topAvatar,
    displayName,
    settings.avatar ||
    user?.profile?.avatar
);


if (topAccountName) {

    topAccountName.textContent =
        displayName;

}

}

/* =========================================================
9. AVATAR ELEMENT
========================================================= */

function updateAvatarElement(
element,
name,
avatar
) {

if (!element) {

    return;

}


if (avatar) {

    element.textContent =
        "";

    element.style.backgroundImage =
        `url("${escapeAttribute(avatar)}")`;

    element.style.backgroundSize =
        "cover";

    element.style.backgroundPosition =
        "center";

    element.style.backgroundRepeat =
        "no-repeat";

}

else {

    element.style.backgroundImage =
        "";

    element.textContent =
        String(
            name ||
            "E"
        )
        .charAt(0)
        .toUpperCase();

}

}

/* =========================================================
10. PROFILE FORM
========================================================= */

function setupProfileForm() {

const form =
    document.getElementById(
        "creatorProfileForm"
    );


if (!form) {

    return;

}


form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const settings =
            getCreatorSettings();


        const displayNameInput =
            document.getElementById(
                "creatorDisplayName"
            );


        const bioInput =
            document.getElementById(
                "creatorBio"
            );


        const avatarInput =
            document.getElementById(
                "creatorAvatarUrl"
            );


        settings.displayName =
            String(
                displayNameInput?.value ||
                ""
            )
            .trim();


        settings.bio =
            String(
                bioInput?.value ||
                ""
            )
            .trim();


        settings.avatar =
            String(
                avatarInput?.value ||
                ""
            )
            .trim();


        const saved =
            saveCreatorSettings(
                settings
            );


        showSettingsMessage(
            "creatorProfileMessage",
            saved
                ? "Creator profile saved."
                : "Your profile could not be saved.",
            saved
        );


        if (saved) {

            loadCreatorProfile(
                getCreatorSettingsUser()
            );

        }

    }
);

}

/* =========================================================
11. PUBLISHING SETTINGS
========================================================= */

function setupPublishingSettings() {

const saveButton =
    document.getElementById(
        "savePublishingSettings"
    );


if (saveButton) {

    saveButton.addEventListener(
        "click",
        () => {

            const settings =
                getCreatorSettings();


            const defaultStatus =
                document.getElementById(
                    "creatorDefaultStatus"
                );


            const confirmSubmission =
                document.getElementById(
                    "creatorConfirmSubmission"
                );


            const keepCompleted =
                document.getElementById(
                    "creatorKeepCompleted"
                );


            settings.defaultStatus =
                defaultStatus?.value ||
                "draft";


            settings.confirmSubmission =
                Boolean(
                    confirmSubmission?.checked
                );


            settings.keepCompleted =
                Boolean(
                    keepCompleted?.checked
                );


            const saved =
                saveCreatorSettings(
                    settings
                );


            showSettingsMessage(
                "publishingMessage",
                saved
                    ? "Publishing preferences saved."
                    : "Publishing preferences could not be saved.",
                saved
            );

        }
    );

}


loadPublishingSettings();

}

/* =========================================================
12. LOAD PUBLISHING SETTINGS
========================================================= */

function loadPublishingSettings() {

const settings =
    getCreatorSettings();


const defaultStatus =
    document.getElementById(
        "creatorDefaultStatus"
    );


const confirmSubmission =
    document.getElementById(
        "creatorConfirmSubmission"
    );


const keepCompleted =
    document.getElementById(
        "creatorKeepCompleted"
    );


if (defaultStatus) {

    defaultStatus.value =
        settings.defaultStatus ||
        "draft";

}


if (confirmSubmission) {

    confirmSubmission.checked =
        settings.confirmSubmission;

}


if (keepCompleted) {

    keepCompleted.checked =
        settings.keepCompleted;

}

}

/* =========================================================
13. NOTIFICATIONS
========================================================= */

function setupNotificationSettings() {

const settings =
    getCreatorSettings();


const publishing =
    document.getElementById(
        "notifyPublishing"
    );


const collaboration =
    document.getElementById(
        "notifyCollaboration"
    );


const earnings =
    document.getElementById(
        "notifyEarnings"
    );


const announcements =
    document.getElementById(
        "notifyAnnouncements"
    );


if (publishing) {

    publishing.checked =
        settings.notifications.publishing;

    publishing.addEventListener(
        "change",
        saveNotificationSettings
    );

}


if (collaboration) {

    collaboration.checked =
        settings.notifications.collaboration;

    collaboration.addEventListener(
        "change",
        saveNotificationSettings
    );

}


if (earnings) {

    earnings.checked =
        settings.notifications.earnings;

    earnings.addEventListener(
        "change",
        saveNotificationSettings
    );

}


if (announcements) {

    announcements.checked =
        settings.notifications.announcements;

    announcements.addEventListener(
        "change",
        saveNotificationSettings
    );

}

}

/* =========================================================
14. SAVE NOTIFICATIONS
========================================================= */

function saveNotificationSettings() {

const settings =
    getCreatorSettings();


settings.notifications = {

    publishing:
        Boolean(
            document.getElementById(
                "notifyPublishing"
            )?.checked
        ),

    collaboration:
        Boolean(
            document.getElementById(
                "notifyCollaboration"
            )?.checked
        ),

    earnings:
        Boolean(
            document.getElementById(
                "notifyEarnings"
            )?.checked
        ),

    announcements:
        Boolean(
            document.getElementById(
                "notifyAnnouncements"
            )?.checked
        )

};


saveCreatorSettings(
    settings
);

}

/* =========================================================
15. STUDIO PREFERENCES
========================================================= */

function setupStudioPreferences() {

const settings =
    getCreatorSettings();


const analyticsRange =
    document.getElementById(
        "analyticsDefaultRange"
    );


const compactCards =
    document.getElementById(
        "creatorCompactCards"
    );


if (analyticsRange) {

    analyticsRange.value =
        settings.studio.analyticsRange;

}


if (compactCards) {

    compactCards.checked =
        settings.studio.compactCards;

}


const saveButton =
    document.getElementById(
        "saveStudioPreferences"
    );


if (saveButton) {

    saveButton.addEventListener(
        "click",
        () => {

            const currentSettings =
                getCreatorSettings();


            currentSettings.studio = {

                analyticsRange:
                    analyticsRange?.value ||
                    "30",

                compactCards:
                    Boolean(
                        compactCards?.checked
                    )

            };


            const saved =
                saveCreatorSettings(
                    currentSettings
                );


            showSettingsMessage(
                "studioPreferencesMessage",
                saved
                    ? "Studio preferences saved."
                    : "Preferences could not be saved.",
                saved
            );

        }
    );

}

}

/* =========================================================
16. COLLABORATION STATUS
========================================================= */

function getCollaborationSettings() {

try {

    const stored =
        localStorage.getItem(
            EVER_JOY_COLLAB_KEY
        );


    if (!stored) {

        return {

            available:
                true,

            activeCollaboration:
                null

        };

    }


    const parsed =
        JSON.parse(
            stored
        );


    return {

        available:
            parsed.available !== false,

        activeCollaboration:
            parsed.activeCollaboration ||
            null

    };

}

catch (error) {

    console.error(
        "Ever Joy: Could not load collaboration settings.",
        error
    );


    return {

        available:
            true,

        activeCollaboration:
            null

    };

}

}

/* =========================================================
17. LOAD COLLABORATION STATUS
========================================================= */

function loadCollaborationStatus(
user
) {

const statusElement =
    document.getElementById(
        "creatorCollaborationStatus"
    );


if (!statusElement) {

    return;

}


const collaboration =
    getCollaborationSettings();


if (
    collaboration.activeCollaboration
) {

    statusElement.classList.add(
        "is-unavailable"
    );


    statusElement.innerHTML = `

        <span class="creator-status-dot"></span>

        <div>

            <strong>
                Currently collaborating
            </strong>

            <p>
                Your active collaboration has
                temporarily removed you from the
                collaboration market.
            </p>

        </div>

    `;

    return;

}


statusElement.classList.remove(
    "is-unavailable"
);


statusElement.innerHTML = `

    <span class="creator-status-dot"></span>

    <div>

        <strong>
            Available for collaboration
        </strong>

        <p>
            You can currently receive collaboration
            invitations.
        </p>

    </div>

`;

}

/* =========================================================
18. COLLABORATION BUTTON
========================================================= */

function setupCollaborationButton() {

const button =
    document.getElementById(
        "manageCollaborationButton"
    );


if (!button) {

    return;

}


button.addEventListener(
    "click",
    () => {

        window.location.href =
            "./collaborations.html";

    }
);

}

/* =========================================================
19. ACCOUNT ACTIONS
========================================================= */

function setupAccountActions() {

const signOutButton =
    document.getElementById(
        "creatorSignOut"
    );


const deactivateButton =
    document.getElementById(
        "deactivateCreator"
    );


if (signOutButton) {

    signOutButton.addEventListener(
        "click",
        handleCreatorSignOut
    );

}


if (deactivateButton) {

    deactivateButton.addEventListener(
        "click",
        handleCreatorDeactivation
    );

}

}

/* =========================================================
20. SIGN OUT
========================================================= */

function handleCreatorSignOut() {

const confirmed =
    window.confirm(
        "Sign out of Ever Joy?"
    );


if (!confirmed) {

    return;

}


/*
   Use the existing shared logout
   function if the authentication
   system provides one.
*/

if (
    typeof logoutEverJoyUser ===
    "function"
) {

    logoutEverJoyUser();

}
else if (
    typeof signOutEverJoyUser ===
    "function"
) {

    signOutEverJoyUser();

}
else {

    /*
       Development fallback.

       We intentionally avoid deleting
       unrelated creator data.
    */

    localStorage.removeItem(
        "everJoyCurrentUser"
    );

    localStorage.removeItem(
        "everJoyCurrentUserId"
    );

}


window.location.href =
    "../account/auth.html";

}

/* =========================================================
21. DEACTIVATE CREATOR MODE
========================================================= */

function handleCreatorDeactivation() {

const confirmed =
    window.confirm(
        "Deactivate Creator Mode? Your comics will remain stored, but your creator workspace will be disabled."
    );


if (!confirmed) {

    return;

}


const user =
    getCreatorSettingsUser();


if (!user) {

    showSettingsMessage(
        "publishingMessage",
        "No creator account was found.",
        false
    );

    return;

}


/*
   Update the local user object if the
   shared authentication prototype stores
   users in a user collection.
*/

if (user.creator) {

    user.creator.enabled =
        false;

}


saveUpdatedCurrentUser(
    user
);


/*
   Keep comics untouched.

   Only creator mode is changed.
*/

window.alert(
    "Creator Mode has been deactivated. Your comics remain stored."
);

}
/* =========================================================22. SAVE UPDATED CURRENT USER========================================================= */

function saveUpdatedCurrentUser(user) {

try {

    /*
       Try common current-user keys
       used by the prototype.
    */

    localStorage.setItem(
        "everJoyCurrentUser",
        JSON.stringify(user)
    );


    if (user.id) {

        localStorage.setItem(
            "everJoyCurrentUserId",
            user.id
        );

    }


    /*
       If a user collection exists,
       update the matching user too.
    */

    const storedUsers =
        localStorage.getItem(
            "everJoyUsers"
        );


    if (storedUsers) {

        const users =
            JSON.parse(
                storedUsers
            );


        if (Array.isArray(users)) {

            const index =
                users.findIndex(
                    item =>
                        item.id ===
                        user.id
                );


            if (index !== -1) {

                users[index] =
                    user;


                localStorage.setItem(
                    "everJoyUsers",
                    JSON.stringify(users)
                );

            }

        }

    }


    return true;

}

catch (error) {

    console.error(
        "Ever Joy: Could not update creator account.",
        error
    );


    return false;

}

}

/* =========================================================23. AVATAR PREVIEW========================================================= */

function setupAvatarPreview() {

const avatarInput =
    document.getElementById(
        "creatorAvatarUrl"
    );


if (!avatarInput) {

    return;

}


avatarInput.addEventListener(
    "input",
    () => {

        const nameInput =
            document.getElementById(
                "creatorDisplayName"
            );


        const name =
            nameInput?.value ||
            "Creator";


        updateAvatarElement(
            document.getElementById(
                "settingsAvatar"
            ),
            name,
            avatarInput.value.trim()
        );

    }
);

}

/* =========================================================24. LIVE SETTING UPDATES========================================================= */

function setupLiveSettingUpdates() {

const displayNameInput =
    document.getElementById(
        "creatorDisplayName"
    );


if (displayNameInput) {

    displayNameInput.addEventListener(
        "input",
        () => {

            const name =
                displayNameInput.value.trim() ||
                "Creator";


            const preview =
                document.getElementById(
                    "settingsPreviewName"
                );


            if (preview) {

                preview.textContent =
                    name;

            }


            const avatar =
                document.getElementById(
                    "settingsAvatar"
                );


            if (
                avatar &&
                !document.getElementById(
                    "creatorAvatarUrl"
                )?.value.trim()
            ) {

                updateAvatarElement(
                    avatar,
                    name,
                    ""
                );

            }

        }
    );

}


const toggles =
    document.querySelectorAll(
        ".creator-toggle"
    );


toggles.forEach(
    toggle => {

        toggle.addEventListener(
            "change",
            () => {

                saveBasicToggleSettings();

            }
        );

    }
);

}

/* =========================================================25. SAVE BASIC TOGGLES========================================================= */

function saveBasicToggleSettings() {

const settings =
    getCreatorSettings();


settings.publicProfile =
    Boolean(
        document.getElementById(
            "creatorPublicProfile"
        )?.checked
    );


settings.showComics =
    Boolean(
        document.getElementById(
            "creatorShowComics"
        )?.checked
    );


settings.showCollabStatus =
    Boolean(
        document.getElementById(
            "creatorShowCollabStatus"
        )?.checked
    );


saveCreatorSettings(
    settings
);

}

/* =========================================================26. LOAD BASIC TOGGLES========================================================= */

function loadCreatorSettings() {

const settings =
    getCreatorSettings();


const publicProfile =
    document.getElementById(
        "creatorPublicProfile"
    );


const showComics =
    document.getElementById(
        "creatorShowComics"
    );


const showCollabStatus =
    document.getElementById(
        "creatorShowCollabStatus"
    );


if (publicProfile) {

    publicProfile.checked =
        settings.publicProfile;

}


if (showComics) {

    showComics.checked =
        settings.showComics;

}


if (showCollabStatus) {

    showCollabStatus.checked =
        settings.showCollabStatus;

}

}

/* =========================================================27. SETTINGS MESSAGE========================================================= */

function showSettingsMessage(elementId,message,success) {

const element =
    document.getElementById(
        elementId
    );


if (!element) {

    return;

}


element.textContent =
    message;


element.classList.toggle(
    "is-success",
    Boolean(success)
);


element.classList.toggle(
    "is-error",
    !success
);


clearTimeout(
    element._everJoyMessageTimer
);


element._everJoyMessageTimer =
    setTimeout(
        () => {

            element.textContent =
                "";

        },
        3500
    );

}

/* =========================================================28. SAFE ATTRIBUTE========================================================= */

function escapeAttribute(value) {

return String(
    value ?? ""
)
.replace(
    /&/g,
    "&amp;"
)
.replace(
    /"/g,
    "&quot;"
)
.replace(
    /</g,
    "&lt;"
)
.replace(
    />/g,
    "&gt;"
);

}