/* =========================================================
   EVER JOY COMICS
   PROTECTED COMIC ASSET SYSTEM

   Firebase-ready architecture.

   IMPORTANT:
   This does NOT make public image URLs secure yet.
   Firebase Storage security rules will enforce access
   once Firebase is integrated.
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const EVERJOY_ASSET_SECURITY = {

    enabled: true,

    requireAuthentication: true,

    requireChapterAccess: true,

    preventDirectAccess: true

};


/* =========================================================
   2. CHECK SECURITY STATUS
   ========================================================= */

function isAssetProtectionEnabled() {

    return (
        EVERJOY_ASSET_SECURITY.enabled === true
    );

}


/* =========================================================
   3. CHECK USER AUTHENTICATION
   ========================================================= */

function canAccessProtectedComic() {

    /*
        Firebase authentication will eventually
        become the authoritative source here.

        For now we use the existing Ever Joy
        current-user system if available.
    */

    if (
        typeof getEverJoyCurrentUser !==
        "function"
    ) {

        /*
            Firebase has not been connected yet.

            Do not block development.
        */

        return true;

    }


    const user =
        getEverJoyCurrentUser();


    if (!user) {

        return false;

    }


    return true;

}


/* =========================================================
   4. CHECK CHAPTER ACCESS
   ========================================================= */

function canAccessComicChapter(
    comic,
    chapter
) {

    if (
        !comic ||
        !chapter
    ) {

        return false;

    }


    /*
        Free chapters are always accessible.
    */

    if (
        chapter.access === "free"
    ) {

        return true;

    }


    /*
        Firebase/payment entitlement
        will eventually be checked here.

        For now we allow development access.
    */

    return true;

}


/* =========================================================
   5. BUILD ASSET REQUEST
   ========================================================= */

function buildComicAssetRequest(
    comic,
    chapter,
    pageId
) {

    if (
        !comic ||
        !chapter ||
        !pageId
    ) {

        return null;

    }


    return {

        comicId:
            comic.id,

        chapterId:
            chapter.id,

        pageId:
            pageId,

        /*
            Firebase Storage will eventually
            provide the actual protected URL.
        */

        storagePath:
            `comics/${comic.id}/chapters/${chapter.id}/${pageId}.jpg`

    };

}


/* =========================================================
   6. GET PROTECTED COMIC PAGE
   ========================================================= */

async function getProtectedComicPage(
    comic,
    chapter,
    pageId
) {

    if (
        !isAssetProtectionEnabled()
    ) {

        return buildFallbackComicAssetUrl(
            comic,
            chapter,
            pageId
        );

    }


    /*
        Authentication check.
    */

    if (
        !canAccessProtectedComic()
    ) {

        throw new Error(
            "Authentication required."
        );

    }


    /*
        Chapter access check.
    */

    if (
        !canAccessComicChapter(
            comic,
            chapter
        )
    ) {

        throw new Error(
            "You do not have access to this chapter."
        );

    }


    /*
        Prepare the asset request.
    */

    const request =
        buildComicAssetRequest(
            comic,
            chapter,
            pageId
        );


    if (!request) {

        throw new Error(
            "Invalid comic asset request."
        );

    }


    /*
        =====================================================
        FIREBASE INTEGRATION POINT
        =====================================================

        Later this section will:

        1. Verify Firebase Authentication.
        2. Verify chapter entitlement.
        3. Request the Firebase Storage asset.
        4. Receive a temporary/download URL.
        5. Return that URL to the reader.

        DO NOT put Firebase code here yet.
    */


    return buildFallbackComicAssetUrl(
        comic,
        chapter,
        pageId
    );

}


/* =========================================================
   7. DEVELOPMENT FALLBACK
   ========================================================= */

function buildFallbackComicAssetUrl(
    comic,
    chapter,
    pageId
) {

    if (
        !comic ||
        !chapter ||
        !pageId
    ) {

        return "";

    }


    return (
        `../assets/images/comics/` +
        `${encodeURIComponent(comic.id)}/` +
        `${encodeURIComponent(chapter.id)}/` +
        `${encodeURIComponent(pageId)}.jpg`
    );

}


/* =========================================================
   8. PROTECTED IMAGE LOADER
   ========================================================= */

async function loadProtectedComicImage(
    image,
    comic,
    chapter,
    pageId
) {

    if (!image) {

        return false;

    }


    try {

        const assetUrl =
            await getProtectedComicPage(
                comic,
                chapter,
                pageId
            );


        if (!assetUrl) {

            throw new Error(
                "Comic page URL unavailable."
            );

        }


        image.src =
            assetUrl;


        return true;

    } catch (error) {

        console.error(
            "Ever Joy: Protected comic asset could not be loaded.",
            error
        );


        image.classList.add(
            "page-error"
        );


        image.alt =
            "Comic page unavailable";


        return false;

    }

}