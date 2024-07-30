(function () {
  const siteHeader = document.querySelector('.header');
  if (siteHeader) {
    siteHeader.classList.add('header--force-mobile');
    if (siteHeader.classList.contains('header--sticky')) {
      siteHeader.classList.remove('header--sticky');
    }
  }
})();
