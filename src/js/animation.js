const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
    console.log(entry)
      el_show = entry.target;
      while (!el_show.classList.contains("animated-entry")){
        el_show = el_show.parentElement;
      }
      el_show.classList.add('show');
    } else {
    }
  });
});

const hiddenElements = document.querySelectorAll('.trigger');
hiddenElements.forEach((el) => observer.observe(el));
