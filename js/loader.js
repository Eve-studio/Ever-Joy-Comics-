/* =========================================================
   EVER JOY COMICS
   GLOBAL LOADING SYSTEM
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       GET LOADER
    ===================================================== */

    function getLoader() {

        return document.getElementById("everjoyLoader");

    }


    /* =====================================================
       SHOW LOADER
    ===================================================== */

    window.showEverJoyLoader = function () {

        const loader = getLoader();

        if (!loader) return;

        loader.classList.remove("is-hidden");

        document.documentElement.classList.add(
            "everjoy-loading-active"
        );

        document.body.classList.add(
            "everjoy-loading-active"
        );

    };


    /* =====================================================
       HIDE LOADER
    ===================================================== */

    window.hideEverJoyLoader = function () {

        const loader = getLoader();

        if (!loader) return;

        loader.classList.add("is-hidden");

        document.documentElement.classList.remove(
            "everjoy-loading-active"
        );

        document.body.classList.remove(
            "everjoy-loading-active"
        );

    };


    /* =====================================================
       INITIAL PAGE LOAD
    ===================================================== */

    window.addEventListener("load", function () {

        const loader = getLoader();

        if (!loader) return;


        /*
           Give the animation a short moment to be visible.
        */

        setTimeout(function () {

            hideEverJoyLoader();

        }, 20);

    });


})();