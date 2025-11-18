alert('Welcome to the KAOS Sign-Up Form! Prepare for an unpredictable experience.');

/* Utilities */
const $ = id => document.getElementById(id);
const toast = (msg, ms = 1800) => {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), ms);
}

/* 1) Name field clears itself every 5s */
const nameInput = $('name');
setInterval(() => {
    if (nameInput.value.trim().length > 0) {
        nameInput.value = '';
        toast('Name field decided to start over. Try again.');
    }
}, 5000 + Math.floor(Math.random() * 4000)); // jittered

/* 2) Email validation: uppercase only + at least 3 emojis */
const emailInput = $('email');
function countEmojis(s) {
    // crude emoji matcher
    const emojiRegex = /(\p{Extended_Pictographic}|\uFE0F)/gu;
    const matches = s.match(emojiRegex);
    return matches ? matches.length : 0;
}
emailInput.addEventListener('input', () => {
    const v = emailInput.value;
    // force uppercase suggestion
    if (v !== v.toUpperCase()) {
        // do not forcibly transform, but display toast
        // intentionally annoying: reject lowercase characters visually
        emailInput.style.borderColor = '#ff6b6b';
    } else {
        emailInput.style.borderColor = '';
    }
});

/* 3) Password validator (ridiculous) */
const pwd = $('password');
const confirm = $('confirm');
pwd.addEventListener('input', () => {
    const v = pwd.value;
    let errs = [];
    if (!/[A-Z]/.test(v)) errs.push('uppercase');
    if (!/[a-z]/.test(v)) errs.push('lowercase');
    if (!/[0-9]/.test(v)) errs.push('number');
    if (!/[IVX]/.test(v)) errs.push('Roman numeral (I,V,X)');
    if (countEmojis(v) < 1) errs.push('emoji');
    if (v.length < 10) errs.push('more feelings (>=10 chars)');
    if (errs.length > 0) {
        pwd.style.borderColor = '#ff6b6b';
        pwd.title = 'Missing: ' + errs.join(', ');
    } else {
        pwd.style.borderColor = '';
        pwd.title = 'Strong enough to haunt your dreams.';
    }
    // show password in giant letters (intentional)
    if (v.length > 0) {
        pwd.type = 'text';
        pwd.style.fontSize = '22px';
    } else {
        pwd.type = 'password';
        pwd.style.fontSize = '';
    }
});

/* 4) Confirm password delay: enable after 3s when focused */
confirm.addEventListener('focus', () => {
    confirm.disabled = true;
    setTimeout(() => confirm.disabled = false, 3000);
});

/* 5) Gender select: populate 200 options & autoscroll */
const gender = $('gender');
const silly = ["Chaotic Neutral", "Eldritch Mist", "Left-Handed Pixel", "Nonconforming Blob", "Pigeon Person", "Quantum Femme", "Neutral-ish", "Binary-ish", "Sprite", "Glitter Ghost", "Pixel Queen", "Retro User"];
for (let i = 0; i < 200; i++) {
    const opt = document.createElement('option');
    opt.value = 'option' + i;
    opt.textContent = silly[i % silly.length] + (i > silly.length ? ' ' + i : '');
    gender.appendChild(opt);
}
let gScroll = 0;
setInterval(() => {
    gScroll += 1;
    gender.scrollTop = (gScroll * 14) % (gender.scrollHeight || 1);
}, 900);

/* 6) DOB day/month/year (year reversed 3022 -> 1800) */
const day = $('day'), month = $('month'), year = $('year');
for (let d = 1; d <= 31; d++) { const o = document.createElement('option'); o.value = d; o.textContent = d; day.appendChild(o) }
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
months.forEach((m, i) => { const o = document.createElement('option'); o.value = i + 1; o.textContent = m; month.appendChild(o) })
for (let y = 3022; y >= 1800; y--) { const o = document.createElement('option'); o.value = y; o.textContent = y; year.appendChild(o) }

/* 7) Moving checkbox: moves slightly when cursor approaches */
const agree = $('agree');
agree.addEventListener('mouseover', () => {
    const offsetX = (Math.random() * 40) - 20;
    const offsetY = (Math.random() * 12) - 6;
    agree.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    setTimeout(() => agree.style.transform = '', 900);
});

/* 8) Submit button moves away from cursor */
const submit = $('submitBtn');
let chasing = false;
submit.addEventListener('mousemove', (e) => {
    // move the button away a bit randomly
    const rect = submit.getBoundingClientRect();
    const dx = (Math.random() * 200) - 100;
    const dy = (Math.random() * 80) - 40;
    submit.style.transform = `translate(${dx}px, ${dy}px)`;
});
submit.addEventListener('click', () => {
    // sometimes decide not to sign you up
    if (Math.random() < 0.6) {
        toast('Error 999: We don\'t feel like signing you up right now.');
        // clear fields
        document.querySelectorAll('input').forEach(i => i.value = '');
        // spawn confetti and insult
        spawnConfetti();
        setTimeout(() => {
            toast('Try again later. Or don\'t.');
        }, 1800);
    } else {
        // success path (rare)
        toast('You caught it! Submitting...');
        setTimeout(() => {
            alert('Signed up! Welcome to KAOS. (This is probably a bug.)');
        }, 900);
    }
});

/* 9) Random validation popups/messages placed 'randomly' */
function randomInsult() {
    const list = ["Try harder.", "Not even close.", "My 3-year-old cousin can type better.", "I don't think you understand how forms work."];
    const msg = list[Math.floor(Math.random() * list.length)];
    const div = document.createElement('div'); div.textContent = msg;
    div.style.position = 'absolute'; div.style.left = (Math.random() * 70 + 10) + '%'; div.style.top = (Math.random() * 70 + 10) + '%';
    div.style.background = '#fff7ed'; div.style.border = '2px solid #ffd6e6'; div.style.padding = '6px 8px'; div.style.borderRadius = '8px'; div.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000 + Math.random() * 3000);
}
setInterval(randomInsult, 6000 + Math.random() * 6000);

/* 10) Floating popup timer */
let start = Date.now();
setInterval(() => {
    const s = Math.floor((Date.now() - start) / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    $('timeOn').textContent = `${mm}:${ss}`;
}, 1000);
/* mockSupport button leads to an unhelpful modal */
$('mockSupport').addEventListener('click', () => {
    toast('Support: Sorry, we are busy with chaos. Try chanting KAOS thrice.');
});

/* 11) Confetti generator (random colors) */
function spawnConfetti() {
    const conf = $('confetti');
    conf.innerHTML = '';
    const colors = ['#ffd1e8', '#ffefb6', '#bff5d0', '#dfe7ff', '#ffd6e6'];
    for (let i = 0; i < 30; i++) {
        const el = document.createElement('i');
        el.style.left = (Math.random() * 100) + '%';
        el.style.top = (Math.random() * 20 - 10) + '%';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.transform = `rotate(${Math.random() * 360}deg)`;
        el.style.animationDelay = (Math.random() * 0.6) + 's';
        conf.appendChild(el);
    }
    // let them go
    setTimeout(() => conf.innerHTML = '', 3500);
}

/* 12) Auto-play sparkly sound (attempt, may be blocked) */
const sparkle = new Audio();
sparkle.src = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAA..."; // tiny placeholder base64 (empty) - browsers ignore
// try to play on hover over form
document.querySelector('.form-wrap').addEventListener('mouseover', () => {
    try { sparkle.play().catch(() => { }); } catch (e) { }
});

/* 13) Email emoji enforcement on submit simulation: check unrealistic rules (and intentionally fail) */
function countEmojiChars(s) {
    const re = /(\p{Extended_Pictographic}|\uFE0F)/gu;
    const m = s.match(re);
    return m ? m.length : 0;
}

/* 14) Final 'onbeforeunload' encouraging chaos */
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = "Are you leaving? The form misses you!";
});

/* Accessibility note: intentionally absent */
