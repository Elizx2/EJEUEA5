window.scrollTo(0, document.body.scrollHeight);

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".img, .img1");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("v");
            } else {
                entry.target.classList.remove("v"); // Se quita para que se repita la animación
            }
        });
    }, { threshold: 1.2 }); // Se activa cuando el 30% del elemento es visible

    images.forEach(img => observer.observe(img));
});

