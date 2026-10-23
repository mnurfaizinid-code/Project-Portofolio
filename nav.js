export const VIEWS = ['home', 'skills', 'hobi', 'proyek', 'contact', 'hubungi'];

function currentView() {
  const id = location.hash.slice(1);
  return VIEWS.includes(id) ? id : 'home'; // hanya id dari daftar yang diterima
}

function render() {
  const active = currentView();

  document.querySelectorAll('.view').forEach((el) => {
    el.classList.toggle('active', el.id === active);
  });

  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('current', a.dataset.nav === active);
  });

  document.querySelector('#subMenu')?.classList.remove('open');
  document.querySelector('#toggleSubmenu')?.classList.remove('open');
  window.scrollTo(0, 0);
}

export function showView(id) {
  if (VIEWS.includes(id)) location.hash = id;
}

window.addEventListener('hashchange', render);
render();