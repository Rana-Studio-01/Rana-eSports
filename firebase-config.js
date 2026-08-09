/* ==========================================================================
   RANA ESPORTS — FIREBASE REALTIME DATABASE GLUE (firebase-config.js)
   ========================================================================== */

/* -------- 1. CONFIG -------- */
const RANA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyC4CSsSxnX1iXTrMdmgiDx0w65XPGjb92I",
  authDomain: "rana-esports-c2b89.firebaseapp.com",
  databaseURL: "https://rana-esports-c2b89-default-rtdb.firebaseio.com",
  projectId: "rana-esports-c2b89",
  storageBucket: "rana-esports-c2b89.firebasestorage.app",
  messagingSenderId: "353708444099",
  appId: "1:353708444099:web:25a41a2782d4f13c121576"
};

/* -------- 2. INIT (compat SDK, loaded via CDN in index.html) -------- */
firebase.initializeApp(RANA_FIREBASE_CONFIG);
const ranaDB = firebase.database();

const COUNTERS_REF = ranaDB.ref("stats/counters");
const REVIEWS_REF = ranaDB.ref("reviews");

/* How many reviews are visible before "Read More" is needed. */
const RANA_REVIEW_PREVIEW_COUNT = 10;
let ranaShowAllReviews = false;
let ranaReviewsCache = [];

/* -------- 3. VISITOR COUNTER --------
   Counts once per browser tab session (sessionStorage guard) so a refresh
   or scroll doesn't inflate the number. */
function ranaCountVisitor() {
  try {
    if (sessionStorage.getItem("rana_visit_counted")) return;
    sessionStorage.setItem("rana_visit_counted", "1");
    COUNTERS_REF.child("visitors").set(firebase.database.ServerValue.increment(1));
  } catch (err) {
    console.warn("Rana Esports: visitor count skipped", err);
  }
}

/* -------- 4. DOWNLOAD COUNTER --------
   Call this from any download button's click handler. */
function ranaCountDownload() {
  try {
    COUNTERS_REF.child("downloads").set(firebase.database.ServerValue.increment(1));
  } catch (err) {
    console.warn("Rana Esports: download count skipped", err);
  }
}

/* -------- 5. LIVE COUNTER DISPLAY --------
   Listens in real time and fills any element with [data-rana-stat="downloads"]
   or [data-rana-stat="visitors"]. */
function ranaWatchCounters() {
  COUNTERS_REF.on("value", (snap) => {
    const data = snap.val() || {};
    const downloads = data.downloads || 0;
    const visitors = data.visitors || 0;
    document.querySelectorAll('[data-rana-stat="downloads"]').forEach((el) => {
      el.textContent = ranaFormatCount(downloads);
    });
    document.querySelectorAll('[data-rana-stat="visitors"]').forEach((el) => {
      el.textContent = ranaFormatCount(visitors);
    });
  }, (err) => console.warn("Rana Esports: counter listener failed", err));
}

function ranaFormatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  return String(n);
}

/* -------- 6. RATING & REVIEW SYSTEM --------
   Pushes { rating (1-5 int), text, name, role, createdAt } to /reviews.
   Reviews are immutable once created (see Realtime Database rules). */
function ranaSubmitReview({ rating, text, email, role }) {
  const cleanRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
  const cleanText = String(text || "").trim().slice(0, 300);
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanRole = String(role || "").trim().slice(0, 30);

  if (!cleanEmail) return Promise.reject(new Error("Email is required"));

  // Firebase key mein email use karne ke liye symbols remove karne padte hain
  const emailKey = cleanEmail.replace(/[.#$\[\]]/g, '_');

  // .set() se existing rating update ho jayegi agar usi email se dobara aayi (1 email = 1 rating)
  return REVIEWS_REF.child(emailKey).set({
    rating: cleanRating,
    text: cleanText,
    email: cleanEmail,
    role: cleanRole,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
}
/* Live-listens to the latest reviews and the running average, and renders
   into #ranaReviewList / #ranaAvgRating / #ranaRatingCount if present.
   Push keys sort chronologically, so limitToLast(50) + reverse gives us
   "newest first" without needing a createdAt index. Only the first
   RANA_REVIEW_PREVIEW_COUNT reviews show by default; "Read More" reveals
   the rest that were fetched (up to 50). */
function ranaWatchReviews() {
  REVIEWS_REF.limitToLast(50).on("value", (snap) => {
    const reviews = [];
    snap.forEach((child) => {
              if (child.val()) reviews.push(child.val());
            });
            reviews.reverse(); // newest first
            ranaReviewsCache = reviews;

            const avgEl = document.getElementById("ranaAvgRating");
            const countEl = document.getElementById("ranaRatingCount");
            const starsEl = document.getElementById("ranaAvgStars");
            const statEl = document.getElementById("ranaAvgRatingStat");
            const totalRatingsEl = document.getElementById("ranaTotalRatingsStat");
            if (totalRatingsEl) totalRatingsEl.textContent = ranaFormatCount(reviews.length);
            if (reviews.length) {
              // Safety added: Convert to Number and handle missing ratings
              const avg = reviews.reduce((sum, r) => sum + (r && r.rating ? Number(r.rating) : 5), 0) / reviews.length;
      if (avgEl) avgEl.textContent = avg.toFixed(1);
      if (statEl) statEl.textContent = avg.toFixed(1);
      if (countEl) countEl.textContent = `${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
      if (starsEl) starsEl.innerHTML = ranaStarString(Math.round(avg));
    } else {
      if (avgEl) avgEl.textContent = "0.0";
      if (statEl) statEl.textContent = "0.0";
      if (countEl) countEl.textContent = "No reviews yet";
      if (starsEl) starsEl.innerHTML = ranaStarString(0);
    }

    ranaRenderReviewList();
  }, (err) => console.warn("Rana Esports: review listener failed", err));
}

/* Renders the review list respecting the top-10 / show-all toggle, and
   shows or hides the "Read More" button as needed. */
function ranaRenderReviewList() {
  const listEl = document.getElementById("ranaReviewList");
  const readMoreBtn = document.getElementById("reviewReadMoreBtn");
  if (!listEl) return;

  const reviews = ranaReviewsCache;
  const visible = ranaShowAllReviews ? reviews : reviews.slice(0, RANA_REVIEW_PREVIEW_COUNT);

  listEl.innerHTML = visible.length
    ? visible.map(ranaRenderReviewCard).join("")
    : `<p class="review-empty">No reviews yet — be the first to rate Rana eSports!</p>`;

  if (readMoreBtn) {
    if (reviews.length > RANA_REVIEW_PREVIEW_COUNT) {
      readMoreBtn.hidden = false;
      readMoreBtn.querySelector("span").textContent = ranaShowAllReviews ? "Show Less" : "Read More Reviews";
      readMoreBtn.classList.toggle("expanded", ranaShowAllReviews);
    } else {
      readMoreBtn.hidden = true;
    }
  }
}

/* Toggled by the "Read More Reviews" button in script.js. */
function ranaToggleReviewView() {
  ranaShowAllReviews = !ranaShowAllReviews;
  ranaRenderReviewList();
  if (!ranaShowAllReviews) {
    const listEl = document.getElementById("ranaReviewList");
    listEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function ranaStarString(filled) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<i class="${i <= filled ? 'fas' : 'far'} fa-star"></i>`;
  }
  return html;
}

function maskEmailAddress(email) {
  if (!email) return "Anonymous";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  
  const namePart = parts[0];
  const domain = parts[1];
  
  // Agar email chhoti hai toh simple masking
  if (namePart.length <= 3) return namePart.substring(0, 1) + "***@" + domain;
  
  // Requirement ke hisaab se masking: Shuru ke 3 words + ***** + last ke 2 words
  return namePart.substring(0, 3) + "********" + "@" + domain;
}

function ranaRenderReviewCard(r) {
  if (!r) return ""; 
  const safeText = ranaEscapeHTML(r.text || "");
  const rawEmail = r.email || "";
  const maskedEmail = ranaEscapeHTML(maskEmailAddress(rawEmail));
  const safeRole = ranaEscapeHTML(r.role || "");
  const ratingValue = r.rating ? Number(r.rating) : 5; 
  return `
    <div class="review-card">
      <div class="review-card-top">
        <span class="review-name">${maskedEmail}${safeRole ? `<span class="review-role">${safeRole}</span>` : ""}</span>
        <span class="review-stars">${ranaStarString(ratingValue)}</span>
      </div>
      ${safeText ? `<p class="review-text">${safeText}</p>` : ""}
    </div>`;
}

function ranaEscapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* -------- 7. BOOT -------- */
document.addEventListener("DOMContentLoaded", () => {
  ranaCountVisitor();
  ranaWatchCounters();
  ranaWatchReviews();
});