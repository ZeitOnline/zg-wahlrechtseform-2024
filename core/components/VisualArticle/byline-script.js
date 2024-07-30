(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const metadata = document.querySelector('.article-header .byline');
    if (metadata) {
      const page = document.querySelector('.article-page');
      const container = document.createElement('div');
      container.className = 'CLASSNAME x-content-column';
      page.appendChild(container);

      container.appendChild(metadata);
    }
  });
})();
