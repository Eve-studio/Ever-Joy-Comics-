/* =========================================================
   EVER JOY COMICS
   DYNAMIC READER WATERMARK
   ========================================================= */


/* =========================================================
   1. WATERMARK CONFIGURATION
   ========================================================= */

const EVERJOY_WATERMARK_CONFIG = {

    enabled: true,

    platformName:
        "EVER JOY COMICS",

    opacity:
        0.18,

    rotation:
        -18,

    fontSize:
        13,

    spacingX:
        220,

    spacingY:
        150

};


/* =========================================================
   2. CREATE WATERMARK LAYER
   ========================================================= */

function createReaderWatermarkLayer() {

    if (
        !EVERJOY_WATERMARK_CONFIG.enabled
    ) {

        return null;

    }


    const existing =
        document.querySelector(
            "#everjoyWatermarkLayer"
        );


    if (existing) {

        return existing;

    }


    const layer =
        document.createElement(
            "div"
        );


    layer.id =
        "everjoyWatermarkLayer";


    layer.setAttribute(
        "aria-hidden",
        "true"
    );


    layer.style.position =
        "fixed";


    layer.style.inset =
        "0";


    layer.style.pointerEvents =
        "none";


    layer.style.zIndex =
        "9999";


    layer.style.overflow =
        "hidden";


    layer.style.userSelect =
        "none";


    document.body.appendChild(
        layer
    );


    return layer;

}


/* =========================================================
   3. CREATE WATERMARK
   ========================================================= */

function createEverJoyWatermark(
    text,
    x,
    y
) {

    const watermark =
        document.createElement(
            "span"
        );


    watermark.textContent =
        text;


    watermark.style.position =
        "absolute";


    watermark.style.left =
        `${x}px`;


    watermark.style.top =
        `${y}px`;


    watermark.style.color =
        "rgba(255,255,255,0.18)";


    watermark.style.fontSize =
        `${EVERJOY_WATERMARK_CONFIG.fontSize}px`;


    watermark.style.fontFamily =
        "Arial, sans-serif";


    watermark.style.fontWeight =
        "600";


    watermark.style.letterSpacing =
        "1.5px";


    watermark.style.whiteSpace =
        "nowrap";


    watermark.style.transform =
        `rotate(${EVERJOY_WATERMARK_CONFIG.rotation}deg)`;


    watermark.style.textShadow =
        "0 1px 3px rgba(0,0,0,0.45)";


    return watermark;

}


/* =========================================================
   4. GENERATE WATERMARK GRID
   ========================================================= */

function generateReaderWatermarks() {

    const layer =
        createReaderWatermarkLayer();


    if (!layer) {

        return;

    }


    layer.innerHTML =
        "";


    const comic =
        window.readerCurrentComic;


    const chapter =
        window.readerCurrentChapter;


    const comicTitle =
        comic?.title ||
        "Ever Joy Comics";


    const chapterNumber =
        chapter?.chapterNumber ||
        "";


    const text =
        chapterNumber
            ? `EVER JOY COMICS • ${comicTitle} • CHAPTER ${chapterNumber}`
            : `EVER JOY COMICS • ${comicTitle}`;


    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    const spacingX =
        EVERJOY_WATERMARK_CONFIG.spacingX;


    const spacingY =
        EVERJOY_WATERMARK_CONFIG.spacingY;


    for (
        let y = -100;
        y < height + 200;
        y += spacingY
    ) {

        for (
            let x = -100;
            x < width + 200;
            x += spacingX
        ) {

            const watermark =
                createEverJoyWatermark(
                    text,
                    x,
                    y
                );


            layer.appendChild(
                watermark
            );

        }

    }

}


/* =========================================================
   5. REFRESH ON RESIZE
   ========================================================= */

let watermarkResizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            watermarkResizeTimer
        );


        watermarkResizeTimer =
            setTimeout(
                () => {

                    generateReaderWatermarks();

                },
                250
            );

    }
);


/* =========================================================
   6. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            () => {

                generateReaderWatermarks();

            },
            300
        );

    }
);