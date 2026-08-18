/* =========================================================
   EVER JOY COMICS
   ADMIN SYSTEM
   Shared Admin JavaScript
   ========================================================= */


/* =========================================================
   1. ADMIN CONFIGURATION
   ========================================================= */

const EVER_JOY_ADMIN_CONFIG = {

    /*
        Admin access is handled by the
        authenticated admin session.

        Your existing auth system remains
        untouched.
    */

    dashboardPath:
        "../admin/admin-dashboard.html",

    moderationPath:
        "../admin/moderation.html",

    reportsPath:
        "../admin/reports.html"

};


/* =========================================================
   2. ADMIN PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAdminSystem();

    }
);


function initializeAdminSystem() {

    /*
        Make sure this page is actually
        an admin page.
    */

    const adminPage =
        document.querySelector(
            "[data-admin-page]"
        );


    if (!adminPage) {

        return;

    }


    /*
        Check whether the current user
        has admin access.
    */

    checkAdminAccess();


    /*
        Initialize whichever admin
        interface is currently open.
    */

    initializeAdminNavigation();

    initializeAdminLogout();

    initializeAdminDashboard();

}


/* =========================================================
   3. ADMIN ACCESS CHECK
   ========================================================= */

function checkAdminAccess() {

    /*
        This reads the authenticated user
        information created by the existing
        authentication system.

        We are NOT modifying auth.js here.
    */

    let currentUser = null;


    try {

        const storedUser =
            localStorage.getItem(
                "everJoyCurrentUser"
            );


        if (storedUser) {

            currentUser =
                JSON.parse(
                    storedUser
                );

        }

    } catch (error) {

        console.error(
            "Ever Joy Admin: Unable to read current user.",
            error
        );

    }


    /*
        If no authenticated user exists,
        send them back to login.
    */

    if (!currentUser) {

        redirectToAdminLogin();

        return false;

    }


    /*
        Accept several possible admin
        indicators so the authentication
        system can be connected later
        without rewriting this file.
    */

    const isAdmin =
        currentUser.isAdmin === true ||
        currentUser.role === "admin" ||
        currentUser.accountType === "admin";


    if (!isAdmin) {

        showAdminAccessDenied();

        return false;

    }


    /*
        Display admin identity if the
        dashboard contains the elements.
    */

    renderAdminIdentity(
        currentUser
    );


    return true;

}


/* =========================================================
   4. ADMIN IDENTITY
   ========================================================= */

function renderAdminIdentity(
    user
) {

    const name =
        document.querySelector(
            "#adminName"
        );


    const email =
        document.querySelector(
            "#adminEmail"
        );


    const avatar =
        document.querySelector(
            "#adminAvatar"
        );


    if (name) {

        name.textContent =
            user.displayName ||
            user.username ||
            user.name ||
            "Administrator";

    }


    if (email) {

        email.textContent =
            user.email ||
            "";

    }


    if (
        avatar &&
        user.profilePicture
    ) {

        avatar.src =
            user.profilePicture;

    }

}


/* =========================================================
   5. ADMIN NAVIGATION
   ========================================================= */

function initializeAdminNavigation() {

    const dashboardLinks =
        document.querySelectorAll(
            "[data-admin-dashboard]"
        );


    const moderationLinks =
        document.querySelectorAll(
            "[data-admin-moderation]"
        );


    const reportsLinks =
        document.querySelectorAll(
            "[data-admin-reports]"
        );


    dashboardLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.location.href =
                        EVER_JOY_ADMIN_CONFIG
                            .dashboardPath;

                }
            );

        }
    );


    moderationLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.location.href =
                        EVER_JOY_ADMIN_CONFIG
                            .moderationPath;

                }
            );

        }
    );


    reportsLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.location.href =
                        EVER_JOY_ADMIN_CONFIG
                            .reportsPath;

                }
            );

        }
    );

}


/* =========================================================
   6. ADMIN LOGOUT
   ========================================================= */

function initializeAdminLogout() {

    const logoutButtons =
        document.querySelectorAll(
            "[data-admin-logout]"
        );


    logoutButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    logoutAdmin();

                }
            );

        }
    );

}


/* =========================================================
   7. LOGOUT ADMIN
   ========================================================= */

function logoutAdmin() {

    /*
        Remove the current authenticated
        user session.

        We deliberately do not touch
        other application data.
    */

    localStorage.removeItem(
        "everJoyCurrentUser"
    );


    /*
        Return to the normal login page.
    */

    window.location.href =
        "../account/login.html";

}


/* =========================================================
   8. ADMIN DASHBOARD
   ========================================================= */

function initializeAdminDashboard() {

    const dashboard =
        document.querySelector(
            "[data-admin-dashboard]"
        );


    if (!dashboard) {

        return;

    }


    /*
        These currently act as placeholders.

        Later they can be connected to
        Firebase / Firestore and display
        real platform statistics.
    */

    loadAdminDashboardStats();

}


/* =========================================================
   9. DASHBOARD STATISTICS
   ========================================================= */

function loadAdminDashboardStats() {

    const users =
        document.querySelector(
            "#adminTotalUsers"
        );


    const creators =
        document.querySelector(
            "#adminTotalCreators"
        );


    const comics =
        document.querySelector(
            "#adminTotalComics"
        );


    const reports =
        document.querySelector(
            "#adminTotalReports"
        );


    /*
        Keep the values as placeholders
        until the database connection
        is implemented.
    */

    if (users) {

        users.textContent =
            "--";

    }


    if (creators) {

        creators.textContent =
            "--";

    }


    if (comics) {

        comics.textContent =
            "--";

    }


    if (reports) {

        reports.textContent =
            "--";

    }

}


/* =========================================================
   10. ADMIN ACCESS DENIED
   ========================================================= */

function showAdminAccessDenied() {

    const container =
        document.querySelector(
            "[data-admin-page]"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <section class="admin-access-denied">

            <div class="admin-access-icon">
                🔒
            </div>


            <h1>
                Access Denied
            </h1>


            <p>
                You do not have permission
                to access the Ever Joy
                administration area.
            </p>


            <button
                type="button"
                class="admin-back-home"
                onclick="window.location.href='../index.html'"
            >
                Return Home
            </button>

        </section>

    `;

}


/* =========================================================
   11. ADMIN LOGIN REDIRECT
   ========================================================= */

function redirectToAdminLogin() {

    window.location.href =
        "../account/login.html";

}


/* =========================================================
   12. ADMIN PAGE HELPER
   ========================================================= */

function isAdminPage() {

    return Boolean(
        document.querySelector(
            "[data-admin-page]"
        )
    );

}


/* =========================================================
   13. ADMIN NOTIFICATION
   ========================================================= */

function showAdminNotification(
    message,
    type = "info"
) {

    const existing =
        document.querySelector(
            ".admin-notification"
        );


    if (existing) {

        existing.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        `admin-notification admin-notification-${type}`;


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    requestAnimationFrame(
        () => {

            notification.classList.add(
                "visible"
            );

        }
    );


    setTimeout(
        () => {

            notification.classList.remove(
                "visible"
            );


            setTimeout(
                () => {

                    notification.remove();

                },
                250
            );

        },
        3000
    );

}


/* =========================================================
   14. ADMIN DATE FORMATTER
   ========================================================= */

function formatAdminDate(
    date
) {

    if (!date) {

        return "--";

    }


    const parsedDate =
        new Date(
            date
        );


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "--";

    }


    return parsedDate.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================================
   15. ADMIN NUMBER FORMATTER
   ========================================================= */

function formatAdminNumber(
    value
) {

    const number =
        Number(
            value
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return "0";

    }


    return number.toLocaleString();

}


/* =========================================================
   16. GLOBAL ADMIN HELPERS
   ========================================================= */

window.EverJoyAdmin = {

    checkAccess:
        checkAdminAccess,

    logout:
        logoutAdmin,

    notify:
        showAdminNotification,

    formatDate:
        formatAdminDate,

    formatNumber:
        formatAdminNumber

};
/* =========================================================
   EVER JOY COMICS
   ADMIN SIDEBAR MENU
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const menuButton =
            document.querySelector(
                "#adminMenuBtn"
            );

        const sidebar =
            document.querySelector(
                "#adminSidebar"
            );


        if (
            !menuButton ||
            !sidebar
        ) {

            return;

        }


        menuButton.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );


        /*
            Close sidebar when a navigation
            link is selected on smaller screens.
        */

        const navigationLinks =
            sidebar.querySelectorAll(
                "a"
            );


        navigationLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        sidebar.classList.remove(
                            "open"
                        );

                    }
                );

            }
        );

    }
);