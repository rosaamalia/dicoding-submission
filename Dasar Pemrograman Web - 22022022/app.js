window.onscroll = function() {
    const nav = document.getElementById("nav");

    if(document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
        nav.style.backgroundColor = "white";
        nav.style.boxShadow = "0px 10px 60px rgba(38, 45, 118, 0.08)";
    } else {
        nav.style.backgroundColor = null;
        nav.style.boxShadow = null;
    }
}

const navSlide = () => {
    const menu = document.querySelector(".menu");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");
  
    menu.addEventListener("click", () => {
      nav.classList.toggle("nav-active");
  
      //animasi links
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navFade 0.5s ease forwards ${index / 5 + 0.5}s`;
        }
      });
  
      //animasi menu
      menu.classList.toggle("toggle");
    });
};

navSlide();