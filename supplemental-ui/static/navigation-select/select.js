document.addEventListener('DOMContentLoaded', function() {
  const getAbsolutePath = (relative) => {
    return  new URL(relative, document.baseURI).href;
  };
  const navSelectList = document.querySelectorAll('.navigation-select');

  navSelectList.forEach((node) => {
    node.addEventListener('change', (e) => {
      const href = e.target.options[e.target.options.selectedIndex].getAttribute('href')
      const fullTargetUrl = getAbsolutePath(href);
      window.location.assign(fullTargetUrl);
    });
  });
});
