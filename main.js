// BY VEXIKOFF
// BY VEXIKOFF
// BY VEXIKOFF
// BY VEXIKOFF
// BY VEXIKOFF

const downButton = document.getElementById('downbutton');
const maxRotationX = -2.5;
const maxRotationY = -0.5;
const maxTranslation = 3;

downButton.addEventListener('mousemove', function(event) {
    const rect = downButton.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;
    const rotateX = percentY * maxRotationX;
    const rotateY = percentX * maxRotationY;
    const translateX = percentX * maxTranslation;
    const translateY = percentY * maxTranslation;
    
    downButton.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0px)`;
});

downButton.addEventListener('mouseleave', function() {
    downButton.style.transform = 'rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)';
});

const screenshot = document.getElementById('screenshot');

const maxRotationXc = -0.1;
const maxRotationYc = -2.5;
const maxTranslationc = 0.5;

screenshot.addEventListener('mousemove', function(event) {
    const rect = downButton.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;
    const rotateX = percentY * maxRotationXc;
    const rotateY = percentX * maxRotationYc;
    const translateX = percentX * maxTranslationc;
    const translateY = percentY * maxTranslationc;

    screenshot.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0px)`;
});

screenshot.addEventListener('mouseleave', function() {
    screenshot.style.transform = 'rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)';
});

const screenshotw = document.getElementById('screenshotw');

screenshotw.addEventListener('mousemove', function(event) {
    const rect = downButton.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (mouseX - centerX) / centerX;
    const percentY = (mouseY - centerY) / centerY;
    const rotateX = percentY * maxRotationXc;
    const rotateY = percentX * maxRotationYc;
    const translateX = percentX * maxTranslationc;
    const translateY = percentY * maxTranslationc;

    screenshotw.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0px)`;
});

screenshotw.addEventListener('mouseleave', function() {
    screenshotw.style.transform = 'rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)';
});

function towhite() {
    screenshotw.classList.remove("hidden")
    screenshot.classList.add("hidden")
}

function todark() {
    screenshotw.classList.add("hidden")
    screenshot.classList.remove("hidden")
}

function goto(url) {
    window.location.href = url;
}
