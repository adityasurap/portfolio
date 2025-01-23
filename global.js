console.log('IT’S ALIVE!');

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/adityasurap', title: 'Profile'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');
const BASE_PATH = '/portfolio';

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!ARE_WE_HOME && !url.startsWith('http')) {
    url = BASE_PATH + '/' + url;
  }
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  localStorage.colorScheme = colorScheme;
}

const select = document.querySelector('.color-scheme select');

if ("colorScheme" in localStorage) {
  const savedColorScheme = localStorage.colorScheme;
  setColorScheme(savedColorScheme);
  select.value = savedColorScheme;
}
else {
  setColorScheme('light dark');
  select.value = 'light dark';
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  setColorScheme(event.target.value);
});

const form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  const data = new FormData(form);
  let url = form.action + "?";

  for (let [name, value] of data) {
    let encodedValue = encodeURIComponent(value);
    encodedValue = encodedValue.replace(/\+/g, '%20');

    url += `${encodeURIComponent(name)}=${encodedValue}&`;
  }

  url = url.slice(0, -1);

  location.href = url;
});