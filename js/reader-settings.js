/* =========================================================
   EVER JOY COMICS
   READER SETTINGS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const readerSettingsButton =
        document.getElementById("readerSettingsButton");

    /*
     * OPEN READER SETTINGS
     */

    if (readerSettingsButton) {

        readerSettingsButton.addEventListener("click", () => {

            window.location.href = "reader-settings.html";

        });

    }


    /*
     * BACK BUTTON
     *
     * This works if reader-settings.html has
     * an element with id="readerSettingsBackButton".
     */

    const backButton =
        document.getElementById("readerSettingsBackButton");

    if (backButton) {

        backButton.addEventListener("click", () => {

            if (window.history.length > 1) {

                window.history.back();

            } else {

                window.location.href = "profile.html";

            }

        });

    }

});