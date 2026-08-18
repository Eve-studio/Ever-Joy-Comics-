/* =========================================================
   EVER JOY COMICS
   SHARED AUTHENTICATION SYSTEM
   =========================================================

   Prototype authentication using localStorage.

   Used by:
   - signup.js
   - login.js
   - forgot-password.js
   - profile.js
   - auth gates
   - Creator Studio

   IMPORTANT:
   This is a frontend prototype system.
   It is NOT production-grade authentication.
   ========================================================= */


/* =========================================================
   1. STORAGE KEYS
   ========================================================= */

const EVER_JOY_USERS_KEY =
    "everJoyUsers";

const EVER_JOY_CURRENT_USER_KEY =
    "everJoyCurrentUser";


/* =========================================================
   2. CREATOR ACCESS CODE
   ========================================================= */

const EVER_JOY_CREATOR_CODE =
    "EVERJOY";


/* =========================================================
   3. GET ALL USERS
   ========================================================= */

function getEverJoyUsers() {

    try {

        const storedUsers =
            localStorage.getItem(
                EVER_JOY_USERS_KEY
            );


        if (!storedUsers) {

            return [];

        }


        const users =
            JSON.parse(
                storedUsers
            );


        if (!Array.isArray(users)) {

            return [];

        }


        return users;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not read users.",
            error
        );

        return [];

    }

}


/* =========================================================
   4. SAVE ALL USERS
   ========================================================= */

function saveEverJoyUsers(
    users
) {

    try {

        localStorage.setItem(
            EVER_JOY_USERS_KEY,
            JSON.stringify(users)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not save users.",
            error
        );

        return false;

    }

}


/* =========================================================
   5. FIND USER BY EMAIL
   ========================================================= */

function findEverJoyUserByEmail(
    email
) {

    if (!email) {

        return null;

    }


    const normalizedEmail =
        email
            .trim()
            .toLowerCase();


    const users =
        getEverJoyUsers();


    return (
        users.find(
            user =>
                user.email &&
                user.email
                    .toLowerCase() ===
                    normalizedEmail
        )
        || null
    );

}


/* =========================================================
   6. FIND USER BY USERNAME
   ========================================================= */

function findEverJoyUserByUsername(
    username
) {

    if (!username) {

        return null;

    }


    const normalizedUsername =
        username
            .trim()
            .toLowerCase();


    const users =
        getEverJoyUsers();


    return (
        users.find(
            user =>
                user.username &&
                user.username
                    .toLowerCase() ===
                    normalizedUsername
        )
        || null
    );

}


/* =========================================================
   7. VERIFY CREATOR CODE
   ========================================================= */

function verifyEverJoyCreatorCode(
    code
) {

    if (!code) {

        return false;

    }


    return (
        String(code)
            .trim()
            .toUpperCase()
        ===
        EVER_JOY_CREATOR_CODE
    );

}


/* =========================================================
   8. CREATE USER
   ========================================================= */

function createEverJoyUser(
    userData
) {

    if (!userData) {

        return {

            success: false,

            message:
                "No account information was provided."

        };

    }


    const username =
        String(
            userData.username || ""
        )
        .trim();


    const email =
        String(
            userData.email || ""
        )
        .trim()
        .toLowerCase();


    const password =
        String(
            userData.password || ""
        );


    const gender =
        String(
            userData.gender || ""
        )
        .trim();


    const dateOfBirth =
        String(
            userData.dateOfBirth || ""
        )
        .trim();


    /*
       Creator code is OPTIONAL.

       Empty code:
       → normal reader account

       EVERJOY:
       → creator account
    */

    const creatorCode =
        String(
            userData.creatorCode || ""
        )
        .trim()
        .toUpperCase();


    const isCreator =
        verifyEverJoyCreatorCode(
            creatorCode
        );


    const accountType =
        isCreator
            ? "creator"
            : "reader";


    const termsAccepted =
        userData.termsAccepted !== false;



    /* =====================================================
       BASIC VALIDATION
       ===================================================== */

    if (!username) {

        return {

            success: false,

            message:
                "Username is required."

        };

    }


    if (!email) {

        return {

            success: false,

            message:
                "Email is required."

        };

    }


    if (!password) {

        return {

            success: false,

            message:
                "Password is required."

        };

    }


    if (password.length < 8) {

        return {

            success: false,

            message:
                "Password must be at least 8 characters."

        };

    }


    if (!termsAccepted) {

        return {

            success: false,

            message:
                "You must agree to the Terms of Service and Privacy Policy."

        };

    }



    /* =====================================================
       GET CURRENT USERS
       ===================================================== */

    const users =
        getEverJoyUsers();



    /* =====================================================
       EMAIL DUPLICATE
       ===================================================== */

    const emailExists =
        users.some(
            user =>
                user.email &&
                user.email
                    .toLowerCase() ===
                    email
        );


    if (emailExists) {

        return {

            success: false,

            message:
                "An account with this email already exists."

        };

    }



    /* =====================================================
       USERNAME DUPLICATE
       ===================================================== */

    const usernameExists =
        users.some(
            user =>
                user.username &&
                user.username
                    .toLowerCase() ===
                    username.toLowerCase()
        );


    if (usernameExists) {

        return {

            success: false,

            message:
                "This username is already taken."

        };

    }



    /* =====================================================
       CREATE USER ID
       ===================================================== */

    const userId =
        "user_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10);



    /* =====================================================
       CREATE USER OBJECT
       ===================================================== */

    const newUser = {

        id:
            userId,

        username:
            username,

        email:
            email,

        password:
            password,

        gender:
            gender,

        dateOfBirth:
            dateOfBirth,

        termsAccepted:
            true,


        /* =================================================
           ACCOUNT TYPE
           ================================================= */

        accountType:
            accountType,


        /* =================================================
           CREATOR INFORMATION
           ================================================= */

        creator: {

            enabled:
                isCreator,

            codeVerified:
                isCreator,

            joinedAt:
                isCreator
                    ? new Date().toISOString()
                    : null

        },


        /* =================================================
           ACCOUNT CREATION DATE
           ================================================= */

        createdAt:
            new Date().toISOString(),


        /* =================================================
           PROFILE
           ================================================= */

        profile: {

            avatar:
                "",

            bio:
                "",

            favoriteGenre:
                "",

            readingGoal:
                0

        }

    };



    /* =====================================================
       SAVE USER
       ===================================================== */

    users.push(
        newUser
    );


    const saved =
        saveEverJoyUsers(
            users
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Your account could not be saved. Please try again."

        };

    }



    /* =====================================================
       RETURN SAFE USER
       ===================================================== */

    const safeUser =
        removePassword(
            newUser
        );


    return {

        success: true,

        message:
            isCreator
                ? "Creator account created successfully."
                : "Account created successfully.",

        user:
            safeUser

    };

}


/* =========================================================
   9. REMOVE PASSWORD FROM USER OBJECT
   ========================================================= */

function removePassword(
    user
) {

    if (!user) {

        return null;

    }


    const safeUser = {
        ...user
    };


    delete safeUser.password;


    return safeUser;

}


/* =========================================================
   10. SET CURRENT USER
   ========================================================= */

function setEverJoyCurrentUser(
    user
) {

    if (!user) {

        localStorage.removeItem(
            EVER_JOY_CURRENT_USER_KEY
        );

        return false;

    }


    try {

        const safeUser =
            removePassword(
                user
            );


        localStorage.setItem(
            EVER_JOY_CURRENT_USER_KEY,
            JSON.stringify(
                safeUser
            )
        );


        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not save current user.",
            error
        );

        return false;

    }

}


/* =========================================================
   11. GET CURRENT USER
   ========================================================= */

function getEverJoyCurrentUser() {

    try {

        const storedUser =
            localStorage.getItem(
                EVER_JOY_CURRENT_USER_KEY
            );


        if (!storedUser) {

            return null;

        }


        return JSON.parse(
            storedUser
        );

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not read current user.",
            error
        );

        return null;

    }

}


/* =========================================================
   12. CHECK IF LOGGED IN
   ========================================================= */

function isEverJoyLoggedIn() {

    return (
        getEverJoyCurrentUser()
        !==
        null
    );

}


/* =========================================================
   13. CHECK IF CURRENT USER IS CREATOR
   ========================================================= */

function isEverJoyCreator() {

    const currentUser =
        getEverJoyCurrentUser();


    if (!currentUser) {

        return false;

    }


    return (
        currentUser.creator &&
        currentUser.creator.enabled === true
    );

}


/* =========================================================
   14. LOGIN
   ========================================================= */

function loginEverJoyUser(
    email,
    password
) {

    if (!email || !password) {

        return {

            success: false,

            message:
                "Please enter your email and password."

        };

    }


    const normalizedEmail =
        email
            .trim()
            .toLowerCase();


    const users =
        getEverJoyUsers();


    const user =
        users.find(
            existingUser =>
                existingUser.email &&
                existingUser.email
                    .toLowerCase() ===
                    normalizedEmail
        );


    if (!user) {

        return {

            success: false,

            message:
                "No Ever Joy account was found with that email."

        };

    }


    if (
        user.password !==
        password
    ) {

        return {

            success: false,

            message:
                "Incorrect password. Please try again."

        };

    }


    /*
       Older accounts may not have
       Creator information.

       Give them safe reader defaults.
    */

    if (!user.accountType) {

        user.accountType =
            "reader";

    }


    if (!user.creator) {

        user.creator = {

            enabled:
                false,

            codeVerified:
                false,

            joinedAt:
                null

        };

    }


    const safeUser =
        removePassword(
            user
        );


    setEverJoyCurrentUser(
        safeUser
    );

checkEverJoyAdminRedirect(
    safeUser.email
);

    return {

        success: true,

        message:
            "Login successful.",

        user:
            safeUser

    };

}


/* =========================================================
   15. UPDATE PASSWORD
   ========================================================= */

function updateEverJoyUserPassword(
    email,
    newPassword
) {

    if (!email || !newPassword) {

        return {

            success: false,

            message:
                "Email and new password are required."

        };

    }


    if (
        newPassword.length < 8
    ) {

        return {

            success: false,

            message:
                "Password must be at least 8 characters."

        };

    }


    const users =
        getEverJoyUsers();


    const normalizedEmail =
        email
            .trim()
            .toLowerCase();


    const userIndex =
        users.findIndex(
            user =>
                user.email &&
                user.email
                    .toLowerCase() ===
                    normalizedEmail
        );


    if (
        userIndex === -1
    ) {

        return {

            success: false,

            message:
                "No account was found with that email."

        };

    }


    users[userIndex].password =
        newPassword;


    const saved =
        saveEverJoyUsers(
            users
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Your password could not be updated."

        };

    }


    return {

        success: true,

        message:
            "Password updated successfully."

    };

}


/* =========================================================
   16. LOGOUT
   ========================================================= */

function logoutEverJoyUser() {

    localStorage.removeItem(
        EVER_JOY_CURRENT_USER_KEY
    );


    return true;

}


/* =========================================================
   17. GET USER BY ID
   ========================================================= */

function getEverJoyUserById(
    userId
) {

    if (!userId) {

        return null;

    }


    const users =
        getEverJoyUsers();


    return (
        users.find(
            user =>
                user.id ===
                userId
        )
        || null
    );

}


/* =========================================================
   18. UPDATE CURRENT USER PROFILE
   ========================================================= */

function updateEverJoyCurrentUser(
    updates
) {

    const currentUser =
        getEverJoyCurrentUser();


    if (!currentUser) {

        return {

            success: false,

            message:
                "No user is currently logged in."

        };

    }


    const users =
        getEverJoyUsers();


    const userIndex =
        users.findIndex(
            user =>
                user.id ===
                currentUser.id
        );


    if (
        userIndex === -1
    ) {

        return {

            success: false,

            message:
                "Account could not be found."

        };

    }


    const allowedUpdates = {

        username:
            updates?.username,

        gender:
            updates?.gender,

        dateOfBirth:
            updates?.dateOfBirth,

        profile:
            updates?.profile

    };


    Object.keys(
        allowedUpdates
    ).forEach(
        key => {

            if (
                allowedUpdates[key]
                !==
                undefined
            ) {

                users[userIndex][key] =
                    allowedUpdates[key];

            }

        }
    );


    const saved =
        saveEverJoyUsers(
            users
        );


    if (!saved) {

        return {

            success: false,

            message:
                "Changes could not be saved."

        };

    }


    const updatedUser =
        removePassword(
            users[userIndex]
        );


    setEverJoyCurrentUser(
        updatedUser
    );


    return {

        success: true,

        user:
            updatedUser

    };

}


/* =========================================================
   19. CLEAR AUTH DATA
   =========================================================

   Useful during development if you want
   to completely reset the prototype.

   Do NOT call this automatically.
   ========================================================= */

function clearEverJoyAuthData() {

    localStorage.removeItem(
        EVER_JOY_USERS_KEY
    );


    localStorage.removeItem(
        EVER_JOY_CURRENT_USER_KEY
    );


    return true;

}
/* =========================================================
EVER JOY — TEMPORARY ADMIN REDIRECT
========================================================= */

const EVER_JOY_ADMIN_EMAIL =
"evekitsuneflateef@gmail.com";

function checkEverJoyAdminRedirect(email) {

if (!email) {

    return;

}


if (
    email.trim().toLowerCase() ===
    EVER_JOY_ADMIN_EMAIL.trim().toLowerCase()
) {

    window.location.href =
        "../admin/admin-dashboard.html";

}

}