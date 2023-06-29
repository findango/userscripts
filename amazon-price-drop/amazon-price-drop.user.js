// ==UserScript==
// @name         Amazon Price Drop Cleaner
// @namespace    http://finlaycannon.com
// @version      1.0
// @description  Hide the Amazon Wishlist price drops caused by minor currency fluctuations to clean up your wishlist
// @author       Finlay Cannon
// @match        https://www.amazon.com/hz/wishlist/ls/*
// @match        https://www.amazon.ca/hz/wishlist/ls/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    "use strict";

    const style = `
        div.itemPriceDrop span.a-text-bold {
            background-color: #fad419;
            padding: 2px 2px 3px 5px;
        }
    `;
    GM_addStyle(style);

    function runScript() {
        const priceDrops = document.querySelectorAll("div.itemPriceDrop");

        for (const drop of priceDrops) {
            if (drop.textContent.includes("Price dropped by $")) {
                // hide the ones that dropped by a few cents
                drop.style.display = "none";
            } else if (drop.textContent.includes("%")) {
                // hide the ones that dropped by less than 5%
                const match = drop.textContent.match(/Price dropped (\d+)%/);
                if (match) {
                    const amt = Number.parseInt(match[1]);
                    if (amt < 5) {
                        drop.style.display = "none";
                    }
                }
            }
        }
    }

    let scheduled;
    function throttledScript() {
        if (scheduled) {
            clearTimeout(scheduled);
        }
        scheduled = setTimeout(function () {
            scheduled = null;
            runScript();
        }, 1000);
    }

    // re-run after scrolling to catch new elements
    window.addEventListener("scroll", throttledScript);

    // run once on page load
    throttledScript();
})();
