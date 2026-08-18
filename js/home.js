/* =========================================================
   EVER JOY COMICS
   HOME PAGE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. HOME STATE
   ========================================================= */

let allComics = [];

let currentHeroSlide = 0;

let heroTimer;


/* =========================================================
   2. INITIALIZE HOME
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeHome();

});


async function initializeHome() {

    await loadComics();

    initializeHero();

    initializeComicSections();

    initializeSearch();

}


/* =========================================================
   3. LOAD COMICS
   ========================================================= */

async function loadComics() {

    try {

        const response = await fetch(
            "data/comics.json"
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load comics: ${response.status}`
            );

        }


        const data = await response.json();


        allComics = data.comics || [];


        console.log(
            `Ever Joy loaded ${allComics.length} comics.`
        );


    } catch (error) {

        console.error(
            "Ever Joy could not load comic data:",
            error
        );

    }

}


/* =========================================================
   4. HERO DATA
   ========================================================= */

function getFeaturedComics() {

    return allComics.filter(
        comic => comic.featured === true
    );

}


/* =========================================================
   5. HERO CAROUSEL
   ========================================================= */

function initializeHero() {

    const featuredComics =
        getFeaturedComics();


    const heroSlide =
        document.querySelector(".hero-slide");


    const indicators =
        document.querySelectorAll(
            ".hero-indicators button"
        );


    if (
        !heroSlide ||
        !featuredComics.length
    ) {

        return;

    }


    /*
        Limit the homepage hero
        to a maximum of five works.
    */

    const heroComics =
        featuredComics.slice(0, 5);


    /*
        Create indicators based on
        the number of hero works.
    */

    createHeroIndicators(
        heroComics.length
    );


    renderHeroSlide(
        heroComics
    );


    /*
        Re-select indicators because
        we may have created new ones.
    */

    const updatedIndicators =
        document.querySelectorAll(
            ".hero-indicators button"
        );


    updatedIndicators.forEach(
        (indicator, index) => {

            indicator.addEventListener(
                "click",
                () => {

                    currentHeroSlide = index;

                    renderHeroSlide(
                        heroComics
                    );

                    restartHeroTimer();

                }
            );

        }
    );


    startHeroTimer(
        heroComics
    );

}


/* =========================================================
   6. CREATE HERO INDICATORS
   ========================================================= */

function createHeroIndicators(count) {

    const container =
        document.querySelector(
            ".hero-indicators"
        );


    if (!container) return;


    container.innerHTML = "";


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const button =
            document.createElement("button");


        button.setAttribute(
            "aria-label",
            `Slide ${i + 1}`
        );


        if (i === 0) {

            button.classList.add(
                "active"
            );

        }


        container.appendChild(
            button
        );

    }

}


/* =========================================================
   7. RENDER HERO SLIDE
   ========================================================= */

function renderHeroSlide(
    heroComics
) {

    const comic =
        heroComics[currentHeroSlide];


    if (!comic) return;


    const heroSlide =
        document.querySelector(
            ".hero-slide"
        );


    if (!heroSlide) return;


    const image =
        heroSlide.querySelector("img");


    const title =
        heroSlide.querySelector("h1");


    const description =
        heroSlide.querySelector("p");


    const readButton =
        heroSlide.querySelector(
            ".btn-primary"
        );


    const libraryButton =
        heroSlide.querySelector(
            ".btn-secondary"
        );


    /*
        Image
    */

    if (image) {

        image.src =
            comic.banner ||
            comic.cover;

        image.alt =
            comic.title;

    }


    /*
        Title
    */

    if (title) {

        title.textContent =
            comic.title;

    }


    /*
        Description
    */

    if (description) {

        description.textContent =
            comic.description;

    }


    /*
        Read button
    */

    if (readButton) {

        readButton.href =
            `comic/details.html?id=${encodeURIComponent(
                comic.id
            )}`;

    }


    /*
        Library button
    */

    if (libraryButton) {

        libraryButton.dataset.comicId =
            comic.id;

    }


    updateHeroIndicators();

}


/* =========================================================
   8. UPDATE HERO INDICATORS
   ========================================================= */

function updateHeroIndicators() {

    const indicators =
        document.querySelectorAll(
            ".hero-indicators button"
        );


    indicators.forEach(
        (indicator, index) => {

            indicator.classList.toggle(
                "active",
                index === currentHeroSlide
            );

        }
    );

}


/* =========================================================
   9. HERO AUTO PLAY
   ========================================================= */

function startHeroTimer(
    heroComics
) {

    clearInterval(heroTimer);


    heroTimer = setInterval(
        () => {

            currentHeroSlide =
                (
                    currentHeroSlide + 1
                ) %
                heroComics.length;


            renderHeroSlide(
                heroComics
            );

        },
        5000
    );

}


function restartHeroTimer() {

    clearInterval(heroTimer);


    const featuredComics =
        getFeaturedComics();


    const heroComics =
        featuredComics.slice(0, 5);


    if (heroComics.length) {

        startHeroTimer(
            heroComics
        );

    }

}


/* =========================================================
   10. COMIC SECTIONS
   ========================================================= */

function initializeComicSections() {

    const sections =
        document.querySelectorAll(
            ".comic-section"
        );


    sections.forEach(
        section => {

            const heading =
                section.querySelector("h2");


            const grid =
                section.querySelector(
                    ".comic-grid"
                );


            if (
                !heading ||
                !grid
            ) {

                return;

            }


            const sectionName =
                heading.textContent
                    .trim()
                    .toLowerCase();


            const comics =
                getComicsForSection(
                    sectionName
                );


            renderComicGrid(
                grid,
                comics
            );

        }
    );

}


/* =========================================================
   11. SECTION FILTERING
   ========================================================= */

function getComicsForSection(
    sectionName
) {

    switch (sectionName) {

        case "trending now":

            return allComics.filter(
                comic =>
                    comic.trending === true
            );


        case "new fiction":

            return allComics
                .filter(
                    comic =>
                        comic.newlyArrived === true
                )
                .slice(0, 6);


        case "rising fiction":

            return allComics.filter(
                comic =>
                    comic.rising === true
            );


        case "hidden gems":

            return allComics.filter(
                comic =>
                    comic.hiddenGem === true
            );


        case "newly arrived":

            return allComics.filter(
                comic =>
                    comic.newlyArrived === true
            );


        case "featured this week":

            return allComics.filter(
                comic =>
                    comic.featured === true
            );


        case "recently updated":

            /*
                Temporary rule.

                Later this will be based
                on actual chapter update dates.
            */

            return [
                ...allComics
            ].sort(
                () => Math.random() - 0.5
            );


        default:

            return [];

    }

}


/* =========================================================
   12. RENDER COMIC GRID
   ========================================================= */

function renderComicGrid(
    container,
    comics
) {

    container.innerHTML = "";


    /*
        Show a maximum of eight works
        in the homepage sections.
    */

    const visibleComics =
        comics.slice(0, 8);


    if (!visibleComics.length) {

        container.innerHTML = `

            <p class="empty-section">
                Nothing here yet.
            </p>

        `;

        return;

    }


    visibleComics.forEach(
        comic => {

            const card =
                createComicCard(
                    comic
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   13. CREATE COMIC CARD
   ========================================================= */

function createComicCard(
    comic
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "comic-card";


    /*
        Determine the access label.
    */

    let accessLabel =
        "Free";


    if (
        comic.access &&
        comic.access.type === "paid"
    ) {

        accessLabel =
            `${comic.access.defaultChapterPrice} ◈`;

    }


    /*
        Primary genre.
    */

    const genre =
        comic.genres &&
        comic.genres.length
            ? comic.genres[0]
            : "Comic";


    article.innerHTML = `

        <a
            href="comic/details.html?id=${encodeURIComponent(
                comic.id
            )}"
        >

            <div class="comic-cover">

                <img
                    src="${escapeHTML(
                        comic.cover
                    )}"
                    alt="${escapeHTML(
                        comic.title
                    )} cover"
                    loading="lazy"
                >

            </div>


            <h3>
                ${escapeHTML(
                    comic.title
                )}
            </h3>


            <div class="comic-meta">

                <span>
                    ${escapeHTML(
                        genre
                    )}
                </span>

                <span>•</span>

                <span>
                    ${comic.rating
                        ? `★ ${escapeHTML(
                            String(
                                comic.rating
                            )
                        )}`
                        : "New"}
                </span>

            </div>


            <div class="comic-access">

                ${escapeHTML(
                    accessLabel
                )}

            </div>

        </a>

    `;


    return article;

}


/* =========================================================
   14. SEARCH
   ========================================================= */

function initializeSearch() {

    const searchForm =
        document.querySelector(
            ".search-bar"
        );


    if (!searchForm) return;


    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const input =
                searchForm.querySelector(
                    "input"
                );


            const query =
                input
                    ? input.value.trim()
                    : "";


            if (!query) return;


            window.location.href =
                `discover.html?search=${encodeURIComponent(
                    query
                )}`;

        }
    );

}