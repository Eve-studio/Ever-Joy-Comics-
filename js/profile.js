/* =========================================================
   EVER JOY COMICS
   PROFILE PAGE

   Handles ONLY:
   - Current user information
   - Profile identity
   - Account information
   - Creator Studio visibility/navigation
   - Edit Profile
   - Profile picture
   - Profile frame
   - Profile banner
   - Notifications
   - Appearance
   - Profile menu
   - Gems button hook

   DO NOT MODIFY:
   - Creator Studio functionality
   - Collab Pool functionality
   - Membership functionality
   - Reader Settings functionality
   ========================================================= */


/* =========================================================
   1. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const currentUser =
            getEverJoyCurrentUser();


        if (!currentUser) {

            window.location.replace(
                "../account/auth.html"
            );

            return;

        }


        loadEverJoyProfile(
            currentUser
        );


        setupProfileButtons();

    }
);


/* =========================================================
   2. LOAD PROFILE
   ========================================================= */

function loadEverJoyProfile(
    user
) {

    if (!user) {
        return;
    }


    /* =====================================================
       PROFILE IDENTITY
       ===================================================== */

    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileUsername =
        document.getElementById(
            "profileUsername"
        );


    const profileBio =
        document.getElementById(
            "profileBio"
        );


    if (profileName) {

        profileName.textContent =
            user.username ||
            "Ever Joy User";

    }


    if (profileUsername) {

        profileUsername.textContent =
            user.username
                ? `@${user.username}`
                : "@username";

    }


    if (profileBio) {

        profileBio.textContent =
            user.profile?.bio ||
            "Welcome to Ever Joy.";

    }


    /* =====================================================
       PROFILE PICTURE
       ===================================================== */

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    if (
        profileAvatar &&
        user.profile?.avatar
    ) {

        profileAvatar.src =
            user.profile.avatar;

    }


    /* =====================================================
       PROFILE BANNER
       ===================================================== */

    const profileCover =
        document.getElementById(
            "profileCover"
        );


    if (
        profileCover &&
        user.profile?.banner
    ) {

        profileCover.src =
            user.profile.banner;

    }


    /* =====================================================
       PROFILE FRAME
       ===================================================== */

    const profileAvatarFrame =
        document.getElementById(
            "profileAvatarFrame"
        );


    if (
        profileAvatarFrame &&
        user.profile?.frame
    ) {

        profileAvatarFrame.dataset.frame =
            user.profile.frame;

        applyProfileFrame(
            profileAvatarFrame,
            user.profile.frame
        );

    }


    /* =====================================================
       ACCOUNT INFORMATION
       ===================================================== */

    const accountUsername =
        document.getElementById(
            "accountUsername"
        );


    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    const accountMemberSince =
        document.getElementById(
            "accountMemberSince"
        );


    if (accountUsername) {

        accountUsername.textContent =
            user.username
                ? `@${user.username}`
                : "@username";

    }


    if (accountEmail) {

        accountEmail.textContent =
            user.email ||
            "Not connected";

    }


    if (
        accountMemberSince &&
        user.createdAt
    ) {

        const memberDate =
            new Date(
                user.createdAt
            );


        accountMemberSince.textContent =
            memberDate.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

    }


    /* =====================================================
       GEMS

       We only DISPLAY the current balance here.
       Existing gem/payment systems remain untouched.
       ===================================================== */

    const gemsBalance =
        document.getElementById(
            "gemsBalance"
        );


    if (
        gemsBalance &&
        typeof user.gems !== "undefined"
    ) {

        gemsBalance.textContent =
            user.gems;

    }


    /* =====================================================
       CREATOR STUDIO

       EXISTING CREATOR FUNCTIONALITY PRESERVED.
       ===================================================== */

    setupCreatorStudio(
        user
    );

}


/* =========================================================
   3. CREATOR STUDIO
   ========================================================= */

function setupCreatorStudio(
    user
) {

    const creatorEntry =
        document.getElementById(
            "creatorProfileEntry"
        );


    const creatorButton =
        document.getElementById(
            "creatorStudioButton"
        );


    if (!creatorEntry) {
        return;
    }


    const isCreator =
        user.creator &&
        user.creator.enabled === true;


    if (!isCreator) {

        creatorEntry.hidden =
            true;

        return;

    }


    creatorEntry.hidden =
        false;


    if (
        creatorButton &&
        !creatorButton.dataset.bound
    ) {

        creatorButton.dataset.bound =
            "true";


        creatorButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../creator-studio/dashboard.html";

            }
        );

    }

}


/* =========================================================
   4. SAVE PROFILE
   ========================================================= */

function saveProfileChanges(
    changes
) {

    const currentUser =
        getEverJoyCurrentUser();


    if (!currentUser) {
        return null;
    }


    if (!currentUser.profile) {

        currentUser.profile = {};

    }


    Object.keys(changes).forEach(
        key => {

            if (
                key === "profile"
            ) {

                Object.assign(
                    currentUser.profile,
                    changes.profile
                );

            }
            else {

                currentUser[key] =
                    changes[key];

            }

        }
    );


    /*
       auth.js owns the actual user-storage system.

       Use the existing setter when available.
    */

    if (
        typeof window.setEverJoyCurrentUser ===
        "function"
    ) {

        window.setEverJoyCurrentUser(
            currentUser
        );

    }
    else {

        /*
           Fallback for the current local-storage
           implementation.
        */

        localStorage.setItem(
            "everJoyCurrentUser",
            JSON.stringify(
                currentUser
            )
        );

    }


    return currentUser;

}


/* =========================================================
   5. EDIT PROFILE
   ========================================================= */

function openEditProfile() {

    const currentUser =
        getEverJoyCurrentUser();


    if (!currentUser) {
        return;
    }


    const currentUsername =
        currentUser.username ||
        "";


    const currentBio =
        currentUser.profile?.bio ||
        "";


    const username =
        window.prompt(
            "Enter your username:",
            currentUsername
        );


    if (username === null) {
        return;
    }


    const cleanUsername =
        username.trim();


    if (!cleanUsername) {

        window.alert(
            "Your username cannot be empty."
        );

        return;

    }


    const bio =
        window.prompt(
            "Enter your profile bio:",
            currentBio
        );


    if (bio === null) {
        return;
    }


    const cleanBio =
        bio.trim();


    const updatedUser =
        saveProfileChanges(
            {
                username:
                    cleanUsername,

                profile:
                    {
                        bio:
                            cleanBio
                    }
            }
        );


    if (!updatedUser) {
        return;
    }


    loadEverJoyProfile(
        updatedUser
    );


    window.alert(
        "Your profile has been updated successfully."
    );

}
/* =========================================================
   6. IMAGE FILE PICKER
   ========================================================= */

function selectImage(
    callback
) {

    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        "image/*";


    input.style.display =
        "none";


    document.body.appendChild(
        input
    );


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files &&
                input.files[0];


            if (!file) {

                input.remove();

                return;

            }


            /*
               Keep the implementation simple and
               compatible with the current local
               profile system.

               Data URL is stored in the user's
               profile object.
            */

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    callback(
                        reader.result
                    );

                    input.remove();

                };


            reader.onerror =
                () => {

                    EverJoyPopup.open({
    type: "error",
    title: "Image Couldn't Be Loaded",
    message: "Ever Joy couldn't load that image. Please try another one.",
    confirmText: "Okay"
});

                    input.remove();

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    input.click();

}


/* =========================================================
   7. PROFILE PICTURE
   ========================================================= */

function changeProfilePicture() {

    selectImage(
        imageData => {

            const updatedUser =
                saveProfileChanges(
                    {
                        profile:
                            {
                                avatar:
                                    imageData
                            }
                    }
                );


            if (!updatedUser) {
                return;
            }


            const avatar =
                document.getElementById(
                    "profileAvatar"
                );


            if (avatar) {

                avatar.src =
                    imageData;

            }


            window.alert(
                "Your new profile picture has been applied successfully."
            );

        }
    );

}
/* =========================================================
   8. PROFILE BANNER
   ========================================================= */

function changeProfileBanner() {

    selectImage(
        imageData => {

            const updatedUser =
                saveProfileChanges(
                    {
                        profile:
                            {
                                banner:
                                    imageData
                            }
                    }
                );


            if (!updatedUser) {
                return;
            }


            const cover =
                document.getElementById(
                    "profileCover"
                );


            if (cover) {

                cover.src =
                    imageData;

            }


            window.alert(
                "Your new profile banner has been applied successfully."
            );

        }
    );

}
/* =========================================================
   9. PROFILE FRAME
   ========================================================= */

function openProfileFrameSelector() {

    const frames = [

        {
            id:
                "default",

            name:
                "Default",

            style:
                ""
        },

        {
            id:
                "gold",

            name:
                "Gold",

            style:
                "3px solid #d4af37"
        },

        {
            id:
                "silver",

            name:
                "Silver",

            style:
                "3px solid #c0c0c0"
        },

        {
            id:
                "crimson",

            name:
                "Crimson",

            style:
                "3px solid #8b1e2d"
        },

        {
            id:
                "midnight",

            name:
                "Midnight",

            style:
                "3px solid #243b64"
        }

    ];


    const currentUser =
        getEverJoyCurrentUser();


    const currentFrame =
        currentUser?.profile?.frame ||
        "default";


    const choice =
        window.prompt(
            "Choose a profile frame:\n\n" +
            "1. Default\n" +
            "2. Gold\n" +
            "3. Silver\n" +
            "4. Crimson\n" +
            "5. Midnight\n\n" +
            "Enter 1 - 5:",
            String(
                frames.findIndex(
                    frame =>
                        frame.id ===
                        currentFrame
                ) + 1
            )
        );


    if (choice === null) {
        return;
    }


    const index =
        Number(choice) - 1;


    if (
        !Number.isInteger(index) ||
        !frames[index]
    ) {

        window.alert(
            "Please choose a valid profile frame."
        );

        return;

    }


    const selectedFrame =
        frames[index];


    const updatedUser =
        saveProfileChanges(
            {
                profile:
                    {
                        frame:
                            selectedFrame.id
                    }
            }
        );


    if (!updatedUser) {
        return;
    }


    const avatarFrame =
        document.getElementById(
            "profileAvatarFrame"
        );


    if (avatarFrame) {

        applyProfileFrame(
            avatarFrame,
            selectedFrame.id
        );

    }


    window.alert(
        `${selectedFrame.name} frame has been applied to your profile.`
    );

}
/* =========================================================
   10. APPLY PROFILE FRAME
   ========================================================= */

function applyProfileFrame(
    element,
    frame
) {

    if (!element) {
        return;
    }


    element.style.border =
        "";


    element.style.boxShadow =
        "";


    if (frame === "gold") {

        element.style.border =
            "3px solid #d4af37";

        element.style.boxShadow =
            "0 0 15px rgba(212,175,55,0.35)";

    }


    if (frame === "silver") {

        element.style.border =
            "3px solid #c0c0c0";

        element.style.boxShadow =
            "0 0 15px rgba(192,192,192,0.3)";

    }


    if (frame === "crimson") {

        element.style.border =
            "3px solid #8b1e2d";

        element.style.boxShadow =
            "0 0 15px rgba(139,30,45,0.4)";

    }


    if (frame === "midnight") {

        element.style.border =
            "3px solid #243b64";

        element.style.boxShadow =
            "0 0 15px rgba(36,59,100,0.45)";

    }

}

/* =========================================================
   READER SETTINGS
   ========================================================= */

function openReaderSettings() {

    window.location.href = "reader-settings.html";

}
const readerSettingsButton =
    document.getElementById("readerSettingsButton");

if (readerSettingsButton) {

    readerSettingsButton.addEventListener(
        "click",
        openReaderSettings
    );

}
/* =========================================================
   11. NOTIFICATIONS
   ========================================================= */

function openNotificationSettings() {

    const enabled =
        localStorage.getItem(
            "everJoyNotifications"
        ) !== "false";


    const choice =
        window.confirm(
            enabled
                ? "Notifications are currently ON.\n\nTurn them OFF?"
                : "Notifications are currently OFF.\n\nTurn them ON?"
        );


    if (!choice) {
        return;
    }


    localStorage.setItem(
        "everJoyNotifications",
        String(
            !enabled
        )
    );


    window.alert(
        !enabled
            ? "Notifications are now ON."
            : "Notifications are now OFF."
    );

}
/* =========================================================
   12. APPEARANCE
   ========================================================= */

function openAppearanceSettings() {

    const currentTheme =
        localStorage.getItem(
            "everJoyAppearance"
        ) ||
        "dark";


    const choice =
        window.prompt(
            "Choose Ever Joy appearance:\n\n" +
            "1. Dark\n" +
            "2. Light\n\n" +
            "Enter 1 or 2:",
            currentTheme === "light"
                ? "2"
                : "1"
        );


    if (choice === null) {
        return;
    }


    let theme;


    if (choice === "1") {

        theme =
            "dark";

    }
    else if (choice === "2") {

        theme =
            "light";

    }
    else {

        window.alert(
            "Please choose 1 or 2."
        );

        return;

    }


    localStorage.setItem(
        "everJoyAppearance",
        theme
    );


    document.documentElement.dataset.theme =
        theme;


    window.alert(
        theme === "dark"
            ? "Dark appearance has been applied."
            : "Light appearance has been applied."
    );

}
/* =========================================================
   13. LOAD APPEARANCE
   ========================================================= */

function loadAppearance() {

    const theme =
        localStorage.getItem(
            "everJoyAppearance"
        );


    if (theme) {

        document.documentElement.dataset.theme =
            theme;

    }

}


/* =========================================================
   14. PROFILE MENU
   ========================================================= */

function openProfileMenu() {

    const choice =
        window.prompt(
            "Ever Joy Profile\n\n" +
            "1. Refresh profile\n" +
            "2. Log out\n\n" +
            "Enter 1 or 2:"
        );


    if (choice === null) {
        return;
    }


    if (choice === "1") {

        window.location.reload();

        return;

    }


    if (choice === "2") {

        const confirmLogout =
            window.confirm(
                "Are you sure you want to log out?"
            );


        if (!confirmLogout) {
            return;
        }


        if (
            typeof window.logoutEverJoyUser ===
            "function"
        ) {

            window.logoutEverJoyUser();

        }
        else {

            localStorage.removeItem(
                "everJoyCurrentUser"
            );

            window.location.replace(
                "../account/auth.html"
            );

        }

    }

}
/* =========================================================
   15. PROFILE BUTTONS
   ========================================================= */

function setupProfileButtons() {

    /* =====================================================
       BACK
       ===================================================== */

    const backButton =
        document.getElementById(
            "profileBackButton"
        );


    if (backButton) {

        backButton.addEventListener(
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


    /* =====================================================
       EDIT PROFILE
       ===================================================== */

    const editButton =
        document.getElementById(
            "editProfileButton"
        );


    if (editButton) {

        editButton.addEventListener(
            "click",
            openEditProfile
        );

    }


    /* =====================================================
       PROFILE PICTURE
       ===================================================== */

    const avatarButton =
        document.getElementById(
            "changeAvatarButton"
        );


    if (avatarButton) {

        avatarButton.addEventListener(
            "click",
            changeProfilePicture
        );

    }


    /* =====================================================
       PROFILE FRAME
       ===================================================== */

    const frameButton =
        document.getElementById(
            "profileFrameButton"
        );


    if (frameButton) {

        frameButton.addEventListener(
            "click",
            openProfileFrameSelector
        );

    }


    /* =====================================================
       PROFILE BANNER
       ===================================================== */

    const bannerButton =
        document.getElementById(
            "profileBannerButton"
        );


    if (bannerButton) {

        bannerButton.addEventListener(
            "click",
            changeProfileBanner
        );

    }


    /* =====================================================
       NOTIFICATIONS

       Reader settings intentionally untouched.
       ===================================================== */

    const notificationsButton =
        document.getElementById(
            "notificationsButton"
        );


    if (notificationsButton) {

        notificationsButton.addEventListener(
            "click",
            openNotificationSettings
        );

    }


    /* =====================================================
       APPEARANCE
       ===================================================== */

    const appearanceButton =
        document.getElementById(
            "appearanceButton"
        );


    if (appearanceButton) {

        appearanceButton.addEventListener(
            "click",
            openAppearanceSettings
        );

    }


    /* =====================================================
       PROFILE MENU
       ===================================================== */

    const menuButton =
        document.getElementById(
            "profileMenuButton"
        );


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openProfileMenu
        );

    }


    /* =====================================================
       GEMS

       Hook only. Existing currency system remains
       untouched.
       ===================================================== */

    const gemsButton =
        document.getElementById(
            "gemsBalanceButton"
        );


    if (gemsButton) {

        gemsButton.addEventListener(
            "click",
            () => {

                console.log(
                    "Ever Joy: Gems opened."
                );

            }
        );

    }


    /*
       IMPORTANT:

       Reader Settings is deliberately NOT
       given new behaviour here.
    */

}


/* =========================================================
   16. LOAD SAVED APPEARANCE
   ========================================================= */

loadAppearance();