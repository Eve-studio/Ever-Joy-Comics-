/* =========================================================
   EVER JOY COMICS
   GLOBAL JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMenu();

});


/* =========================================================
   2. MOBILE MENU
   ========================================================= */

function initializeMenu() {

    const menuButton = document.querySelector(".menu-btn");

    if (!menuButton) return;

    menuButton.addEventListener("click", () => {

        document.body.classList.toggle("menu-open");

    });

}


/* =========================================================
   3. GLOBAL UTILITY FUNCTIONS
   ========================================================= */


/*
    Select a single element.
*/

function select(selector, parent = document) {

    return parent.querySelector(selector);

}


/*
    Select multiple elements.
*/

function selectAll(selector, parent = document) {

    return [...parent.querySelectorAll(selector)];

}


/*
    Create an HTML element.
*/

function createElement(tag, className = "") {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    return element;

}


/*
    Safely escape text before inserting
    user-generated content into the page.
*/

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =========================================================
   4. ACTIVE NAVIGATION
   ========================================================= */

function setActiveNavigation(selector) {

    const items = selectAll(selector);

    items.forEach(item => {

        item.classList.remove("active");

    });

}


/* =========================================================
   5. BODY SCROLL CONTROL
   ========================================================= */

function lockBodyScroll() {

    document.body.classList.add("no-scroll");

}


function unlockBodyScroll() {

    document.body.classList.remove("no-scroll");

}


/* =========================================================
   6. GLOBAL EVENT HELPERS
   ========================================================= */

function on(element, event, callback) {

    if (!element) return;

    element.addEventListener(event, callback);

}


/* =========================================================
   7. PAGE INITIALIZATION
   ========================================================= */

function initializePage() {

    document.documentElement.classList.add("page-ready");

}
