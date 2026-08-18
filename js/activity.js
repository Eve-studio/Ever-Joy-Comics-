/* =========================================================
   EVER JOY COMICS
   ACTIVITY / FIRE INDICATOR
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CREATE FIRE INDICATOR
       ===================================================== */

    window.createActivityIndicator = function (level) {

        const fire = document.createElement("span");

        fire.className = "ej-activity-fire";

        fire.setAttribute(
            "aria-label",
            "Active comic"
        );

        fire.setAttribute(
            "title",
            "Active"
        );


        /*
         * Only show the fire for recognised activity levels.
         */

        if (
            level !== "active" &&
            level !== "trending" &&
            level !== "hot"
        ) {
            return null;
        }


        fire.textContent = "🔥";


        /*
         * Stronger activity gets a slightly larger indicator.
         */

        if (level === "hot") {

            fire.classList.add("large");

            fire.setAttribute(
                "aria-label",
                "Hot comic"
            );

            fire.setAttribute(
                "title",
                "Hot"
            );

        }

        else if (level === "active") {

            fire.classList.add("small");

            fire.setAttribute(
                "aria-label",
                "Active comic"
            );

            fire.setAttribute(
                "title",
                "Active"
            );

        }


        return fire;

    };


})();