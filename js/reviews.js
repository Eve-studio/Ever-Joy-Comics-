/* =========================================================
   EVER JOY COMICS
   REVIEWS & RATINGS
   =========================================================

   Handles:

   - Comic rating display
   - Overall rating calculation
   - Individual reader reviews
   - Star ratings
   - Review cards
   - Review submission
   - Review visibility
   - View all reviews
   - LocalStorage persistence

   Prototype storage:
   everJoyReviews

========================================================= */


/* =========================================================
1. STORAGE KEY
========================================================= */

const EVER_JOY_REVIEWS_KEY =
    "everJoyReviews";


/* =========================================================
2. INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeReviewsPage();

    }
);


/* =========================================================
3. INITIALIZE REVIEWS PAGE
========================================================= */

function initializeReviewsPage() {

    const comicId =
        getComicIdFromURL();


    if (!comicId) {

        console.error(
            "Ever Joy Reviews: Comic ID could not be found."
        );

        return;

    }


    loadReviewsPage(
        comicId
    );

}


/* =========================================================
4. GET COMIC ID
========================================================= */

function getComicIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("id") ||
        params.get("comic")
    );

}


/* =========================================================
5. GET REVIEWS
========================================================= */

function getEverJoyReviews() {

    try {

        const storedReviews =
            localStorage.getItem(
                EVER_JOY_REVIEWS_KEY
            );


        if (!storedReviews) {

            return [];

        }


        const reviews =
            JSON.parse(
                storedReviews
            );


        if (!Array.isArray(reviews)) {

            return [];

        }


        return reviews;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not read reviews.",
            error
        );

        return [];

    }

}


/* =========================================================
6. SAVE REVIEWS
========================================================= */

function saveEverJoyReviews(
    reviews
) {

    try {

        localStorage.setItem(
            EVER_JOY_REVIEWS_KEY,
            JSON.stringify(
                reviews
            )
        );


        return true;

    }

    catch (error) {

        console.error(
            "Ever Joy: Could not save reviews.",
            error
        );

        return false;

    }

}


/* =========================================================
7. LOAD REVIEWS PAGE
========================================================= */

function loadReviewsPage(
    comicId
) {

    const reviews =
        getEverJoyReviews()
            .filter(
                review =>
                    review.comicId ===
                    comicId
            );


    renderOverallRating(
        reviews
    );


    renderReviews(
        reviews
    );


    setupReviewForm(
        comicId
    );


    setupViewAllReviews(
        comicId
    );

}


/* =========================================================
8. CALCULATE OVERALL RATING
========================================================= */

function calculateOverallRating(
    reviews
) {

    if (
        !reviews ||
        !reviews.length
    ) {

        return 0;

    }


    const total =
        reviews.reduce(
            (
                sum,
                review
            ) =>
                sum +
                Number(
                    review.rating || 0
                ),
            0
        );


    return (
        total /
        reviews.length
    );

}


/* =========================================================
9. RATING DISPLAY
========================================================= */

function renderOverallRating(
    reviews
) {

    const rating =
        calculateOverallRating(
            reviews
        );


    const ratingValue =
        document.getElementById(
            "overallRatingValue"
        );


    const ratingStars =
        document.getElementById(
            "overallRatingStars"
        );


    const ratingCount =
        document.getElementById(
            "overallRatingCount"
        );


    if (ratingValue) {

        ratingValue.textContent =
            rating
                ? rating.toFixed(1)
                : "0.0";

    }


    if (ratingStars) {

        ratingStars.innerHTML =
            createStarDisplay(
                rating
            );

    }


    if (ratingCount) {

        ratingCount.textContent =
            `${reviews.length} ${
                reviews.length === 1
                    ? "review"
                    : "reviews"
            }`;

    }

}


/* =========================================================
10. CREATE STAR DISPLAY
========================================================= */

function createStarDisplay(
    rating
) {

    const roundedRating =
        Math.round(
            Number(rating)
        );


    let stars = "";


    for (
        let index = 1;
        index <= 5;
        index++
    ) {

        stars +=
            index <= roundedRating
                ? "★"
                : "☆";

    }


    return stars;

}


/* =========================================================
11. RENDER REVIEWS
========================================================= */

function renderReviews(
    reviews
) {

    const container =
        document.getElementById(
            "reviewsList"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (!reviews.length) {

        renderEmptyReviews(
            container
        );

        return;

    }


    const visibleReviews =
        reviews.slice(
            0,
            4
        );


    visibleReviews.forEach(
        review => {

            container.appendChild(
                createReviewCard(
                    review
                )
            );

        }
    );

}


/* =========================================================
12. REVIEW CARD
========================================================= */

function createReviewCard(
    review
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "review-card";


    const date =
        formatReviewDate(
            review.createdAt
        );


    card.innerHTML = `

        <div class="review-card-header">

            <div class="review-user">

                <div class="review-avatar">

                    ${
                        review.avatar
                            ? `<img
                                src="${escapeHTML(
                                    review.avatar
                                )}"
                                alt=""
                            >`
                            : escapeHTML(
                                getInitials(
                                    review.username
                                )
                            )
                    }

                </div>


                <div class="review-user-info">

                    <strong>
                        ${escapeHTML(
                            review.username ||
                            "Ever Joy Reader"
                        )}
                    </strong>

                    <span>
                        ${date}
                    </span>

                </div>

            </div>


            <div class="review-stars"
                 aria-label="${review.rating} out of 5 stars">

                ${createStarDisplay(
                    review.rating
                )}

            </div>

        </div>


        <div class="review-card-body">

            <p>
                ${escapeHTML(
                    review.text
                )}
            </p>

        </div>

    `;


    return card;

}


/* =========================================================
13. EMPTY REVIEWS
========================================================= */

function renderEmptyReviews(
    container
) {

    container.innerHTML = `

        <div class="reviews-empty">

            <div class="reviews-empty-stars">
                ☆☆☆☆☆
            </div>

            <h3>
                No reviews yet
            </h3>

            <p>
                Be the first reader to share your thoughts.
            </p>

        </div>

    `;

}


/* =========================================================
14. REVIEW FORM
========================================================= */

function setupReviewForm(
    comicId
) {

    const form =
        document.getElementById(
            "reviewForm"
        );


    if (!form) {

        return;

    }


    const ratingInput =
        document.getElementById(
            "reviewRating"
        );


    const reviewInput =
        document.getElementById(
            "reviewText"
        );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const rating =
                ratingInput
                    ? Number(
                        ratingInput.value
                    )
                    : 0;


            const text =
                reviewInput
                    ? reviewInput.value.trim()
                    : "";


            if (
                rating < 1 ||
                rating > 5
            ) {

                showReviewMessage(
                    "Please select a rating.",
                    "error"
                );

                return;

            }


            if (
                text.length < 3
            ) {

                showReviewMessage(
                    "Please write a little more about your experience.",
                    "error"
                );

                return;

            }


            submitReview(
                comicId,
                rating,
                text
            );

        }
    );

}


/* =========================================================
15. SUBMIT REVIEW
========================================================= */

function submitReview(
    comicId,
    rating,
    text
) {

    const reviews =
        getEverJoyReviews();


    const currentUser =
        typeof getEverJoyCurrentUser ===
        "function"
            ? getEverJoyCurrentUser()
            : null;


    const newReview = {

        id:
            createReviewID(),


        comicId:
            comicId,


        userId:
            currentUser
                ? currentUser.id
                : null,


        username:
            currentUser
                ? (
                    currentUser.displayName ||
                    currentUser.username ||
                    "Ever Joy Reader"
                )
                : "Ever Joy Reader",


        avatar:
            currentUser
                ? (
                    currentUser.profilePicture ||
                    currentUser.avatar ||
                    ""
                )
                : "",


        rating:
            rating,


        text:
            text,


        createdAt:
            new Date().toISOString()

    };


    reviews.unshift(
        newReview
    );


    const saved =
        saveEverJoyReviews(
            reviews
        );


    if (!saved) {

        showReviewMessage(
            "Your review could not be saved. Please try again.",
            "error"
        );

        return;

    }


    showReviewMessage(
        "Your review has been posted.",
        "success"
    );


    const form =
        document.getElementById(
            "reviewForm"
        );


    if (form) {

        form.reset();

    }


    loadReviewsPage(
        comicId
    );

}


/* =========================================================
16. VIEW ALL REVIEWS
========================================================= */

function setupViewAllReviews(
    comicId
) {

    const button =
        document.getElementById(
            "viewAllReviews"
        );


    if (!button) {

        return;

    }


    const reviews =
        getEverJoyReviews()
            .filter(
                review =>
                    review.comicId ===
                    comicId
            );


    if (
        reviews.length <= 4
    ) {

        button.style.display =
            "none";

        return;

    }


    button.style.display =
        "";


    button.addEventListener(
        "click",
        () => {

            window.location.href =
                `./reviews.html?id=${encodeURIComponent(
                    comicId
                )}&all=true`;

        }
    );

}


/* =========================================================
17. REVIEW DATE
========================================================= */

function formatReviewDate(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================================
18. USER INITIALS
========================================================= */

function getInitials(
    name
) {

    if (!name) {

        return "ER";

    }


    return String(
        name
    )
        .trim()
        .split(
            /\s+/
        )
        .slice(
            0,
            2
        )
        .map(
            part =>
                part.charAt(0)
        )
        .join("")
        .toUpperCase();

}


/* =========================================================
19. CREATE REVIEW ID
========================================================= */

function createReviewID() {

    return (
        "review_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );

}


/* =========================================================
20. SHOW REVIEW MESSAGE
========================================================= */

function showReviewMessage(
    text,
    type
) {

    const message =
        document.getElementById(
            "reviewMessage"
        );


    if (!message) {

        return;

    }


    message.textContent =
        text;


    message.className =
        `review-message ${type}`;

}


/* =========================================================
21. ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}