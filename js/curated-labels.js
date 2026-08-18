/* =========================================================
   EVER JOY COMICS
   CURATED LABEL SYSTEM
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CURATED LABEL DEFINITIONS
       ===================================================== */

    const CURATED_LABELS = {

        staffPick: {
            label: "Staff Pick",
            className: "staff-pick",
            description:
                "Selected by the Ever Joy team."
        },

        editorPick: {
            label: "Editor's Pick",
            className: "editor-pick",
            description:
                "Personally recommended by Ever Joy's editorial team."
        },

        featured: {
            label: "Featured",
            className: "featured",
            description:
                "Currently highlighted by Ever Joy."
        },

        rising: {
            label: "Rising",
            className: "rising",
            description:
                "A work gaining attention."
        },

        hiddenGem: {
            label: "Hidden Gem",
            className: "hidden-gem",
            description:
                "A work deserving more discovery."
        }

    };


    /* =====================================================
       CREATE A CURATED LABEL
       ===================================================== */

    window.createCuratedLabel = function (type) {

        const definition = CURATED_LABELS[type];

        if (!definition) {
            return null;
        }


        const badge = document.createElement("span");

        badge.className =
            "ej-curated-label " +
            definition.className;

        badge.textContent =
            definition.label;

        badge.setAttribute(
            "title",
            definition.description
        );

        badge.setAttribute(
            "aria-label",
            definition.label
        );


        return badge;

    };


    /* =====================================================
       CREATE ALL LABELS FOR A COMIC
       ===================================================== */

    window.createCuratedLabels = function (comic) {

        const container =
            document.createElement("div");

        container.className =
            "ej-curated-labels";


        if (!comic) {
            return container;
        }


        const labels = [

            "staffPick",
            "editorPick",
            "featured",
            "rising",
            "hiddenGem"

        ];


        labels.forEach(function (type) {

            if (comic[type] === true) {

                const badge =
                    createCuratedLabel(type);

                if (badge) {

                    container.appendChild(
                        badge
                    );

                }

            }

        });


        return container;

    };


    /* =====================================================
       GET LABEL INFORMATION
       ===================================================== */

    window.getCuratedLabel =
        function (type) {

            return CURATED_LABELS[type]
                || null;

        };


})();