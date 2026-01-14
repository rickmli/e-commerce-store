export const hasCookie = (title) =>
  document.cookie.includes(`${title}=`) || localStorage.getItem(title) !== null;
