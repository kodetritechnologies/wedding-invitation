// Royal Wedding Countdown & Interactive Animations
document.addEventListener("DOMContentLoaded", () => {
  const weddingDateStr = document.body.dataset.weddingDate;
  if (!weddingDateStr) return;

  const targetDate = new Date(weddingDateStr).getTime();
  if (isNaN(targetDate)) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minutesEl = document.getElementById("cd-minutes");
    const secondsEl = document.getElementById("cd-seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance < 0) {
      daysEl.innerText = "0";
      hoursEl.innerText = "0";
      minutesEl.innerText = "0";
      secondsEl.innerText = "0";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = days;
    hoursEl.innerText = hours;
    minutesEl.innerText = minutes;
    secondsEl.innerText = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
