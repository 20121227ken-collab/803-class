"use strict";
(() => {
  const button = document.getElementById("teacher-menu");
  const menu = document.getElementById("teacher-mobile-nav");
  if (button && menu) {
    const close = () => { menu.hidden = true; button.setAttribute("aria-expanded", "false"); button.setAttribute("aria-label", "展開導覽選單"); };
    button.addEventListener("click", () => {
      const opening = menu.hidden;
      menu.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      button.setAttribute("aria-label", opening ? "收合導覽選單" : "展開導覽選單");
    });
    menu.addEventListener("click", event => { if (event.target.closest("a")) close(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
    document.addEventListener("click", event => { if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) close(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 850) close(); });
  }
  const photo = document.getElementById("teacher-photo");
  if (photo) {
    const paths = ["teacher.jpg", "images/teacher.jpg", "teacher.jpeg", "teacher.png", "missing-photo.svg"];
    let index = 0;
    photo.addEventListener("error", () => {
      index++;
      if (index < paths.length) photo.src = paths[index];
      else { photo.removeAttribute("src"); photo.alt = "老師照片暫時無法顯示"; }
    });
  }
})();
