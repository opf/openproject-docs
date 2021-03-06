(function() {
  const menu = document.getElementById('global-nav');

  if (!menu) {
    return;
  }

  const activeMenuItem = menu.querySelector('.nav-link .active' as any);
  const collapsedMenu = activeMenuItem ? activeMenuItem.closest('.collapse') : null;
  let resizeTimeout:number;

  expand(collapsedMenu);
  toggleSidebar();

  window.addEventListener('resize', resizeHandler);

  // Expands the menu tree for the selected menu item
  function expand(menu) {

    if(!menu) {
      return;
    }

    const collapseToggle = menu.previousElementSibling.querySelector('.collapse-toggle');

    menu.previousElementSibling.classList.add('active');
    menu.classList.add('show');

    if(collapseToggle) {
      collapseToggle.classList.remove('collapsed');
      collapseToggle.setAttribute('aria-expanded', true);
    }

    if(menu.parentElement.classList.contains('collapse')) {
      // This will traverse up until all parents are expanded
      expand(menu.parentElement);
    } else if (menu.parentElement.classList.contains('global-nav-section')) {
      menu.parentElement.classList.add('expanded');
    }
  }

  function resizeHandler() {
    const debounceDelay = 250; // the debounce ensures that we don't call the event handler unnecessarily

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(toggleSidebar, debounceDelay);
  }

  function toggleSidebar() {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const navWrapper = document.querySelector('.nav-wrapper');
    const toggleIcon = document.querySelector('.nav-toggle');
    const overlay = document.querySelector('.content-overlay');

    if (!navWrapper || !toggleIcon || !overlay) {
      return;
    }

    if (!mediaQuery.matches) {
      navWrapper.classList.add('active');
      overlay.classList.add('active');
      toggleIcon.classList.add('nav-open');
    }
  }
})();
