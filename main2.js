const downButton1 = document.getElementById('downbutton1');

downButton1.addEventListener('mousemove', function(event) {
    const rect = downButton1.getBoundingClientRect();
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
    
    downButton1.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0px)`;
});