const modal = document.querySelector(".modal");
const button_submit = document.querySelector(".btn-sub");
const form = document.querySelector("form");
const time = document.querySelector(".time");
const phase = document.querySelector("h3");
const close = document.querySelector(".close");
const svg = document.querySelector("svg");

let currentTimer = "pomodoro";
let timer;

const settings = {
  pomodoro: 25,
  short: 5,
  long: 10,
  count: 0,
  color: "#f87070",
  state: "paused",
  sec: 0,
  min: 0,
};

window.addEventListener("load", () => {
  let sec = `${(settings.pomodoro * 60) % 60}`.padStart(2, 0);
  time.textContent = `${settings.pomodoro}:${sec}`;
});

close.addEventListener("click", () => {
  modal.classList.add("modal-hideout");
});

document.querySelector(".settings").addEventListener("click", () => {
  modal.classList.remove("modal-hideout");
});

button_submit.addEventListener("click", (e) => {
  e.preventDefault();

  modal.classList.add("modal-hideout");
});

document.querySelector(".modal__fonts .wrap").addEventListener("click", (e) => {
  const target = e.target.closest("label");
  if (!target) return;
  document.querySelector("body").style.fontFamily = target.dataset.font;
});

document.querySelector("ul").addEventListener("click", (e) => {
  const target = e.target.closest("button");
  if (!target) return;
  Array.from(document.querySelectorAll(".timer__btn")).forEach((el) => {
    el.classList.remove("timer__btn-active");
    el.style.backgroundColor = "inherit";
    svg.classList.remove("anim");
  });

  target.classList.add("timer__btn-active");
  let sec = `${(settings.pomodoro * 60) % 60}`.padStart(2, 0);
  let min = `${settings[target.dataset.timer]}`.padStart(2, 0);
  time.textContent = `${min}:${sec}`;
  target.style.backgroundColor = settings.color;
  settings.sec = 0;
  settings.min = 0;
  phase.textContent = "start";
  currentTimer = target.dataset.timer;
  clearInterval(timer);
});

document
  .querySelector(".modal__colors .wrap")
  .addEventListener("click", (e) => {
    const target = e.target.closest("label");
    if (!target) return;
    document.querySelector("circle").style.stroke = target.dataset.color;
    document.querySelector(".timer__btn-active").style.backgroundColor =
      target.dataset.color;
    settings.color = target.dataset.color;
  });

phase.addEventListener("click", (e) => {
  if (settings.state === "paused") {
    e.target.textContent = "pause";
    //  document.querySelector('svg').style
    svg.classList.add("anim");
    svg.style.animationDuration = `${settings[currentTimer] * 60}s`;
    svg.style.animationPlayState = "running";
    //  settings[document.querySelector(".timer__btn-active").dataset.timer]
    settings.state = "started";
    if (settings.sec === 0 && settings.min === 0) {
      interval(settings[currentTimer] * 60);
    } else {
      interval(settings.sec + settings.min * 60);
    }
  } else if (settings.state === "started") {
    clearInterval(timer);
    svg.style.animationPlayState = "paused";
    settings.state = "paused";
    e.target.textContent = "start";
  } else if (settings.state === "ended") {
    interval(settings[currentTimer] * 60);
    e.target.textContent = "pause";
    svg.style.animationDuration = `${settings[currentTimer] * 60}s`;
    svg.style.animationPlayState = "running";
    settings.state = "started";
    svg.classList.add("anim");
  }
});

function interval(t) {
  const tick = function () {
    settings.min = Math.trunc(t / 60);
    settings.sec = t % 60;
    let sec = `${settings.sec}`.padStart(2, 0);
    let min = `${settings.min}`.padStart(2, 0);

    time.textContent = `${min}:${sec}`;

    if (t === 0) {
      clearInterval(timer);
      settings.state = "ended";
      phase.textContent = "restart";
      svg.classList.remove("anim");
      timeOver();
    }
    t--;
  };
  tick();
  timer = setInterval(tick, 1000);
}

document
  .querySelector(".modal__timers .wrap")
  .addEventListener("click", (e) => {
    if (!e.target.className) return;
    const add = e.target.closest("btn-add");
    const sub = e.target.closest("btn-subs");
    const label = e.target.closest("label");

    if (!label) return;

    const input = label.querySelector("input");
    input.focus();
    if (e.target.className === "btn-add" && input) {
      input.value = +input.value + 1;
    } else if (e.target.className === "btn-subs") {
      input.value = +input.value - 1;
    }

    input.blur();
  });

Array.from(document.querySelectorAll("input[type=number]")).forEach((el) => {
  el.addEventListener("blur", (e) => {
    if (+e.target.value <= +e.target.max && +e.target.value > 0) {
      e.target.style.backgroundColor = "";
      e.target.style.border = "";
      button_submit.style.pointerEvents = "";
      close.style.pointerEvents = "";

      change(e.target.name, e.target.value);
    } else {
      e.target.focus();
      e.target.style.border = "1px solid red";
      button_submit.style.pointerEvents = "none";
      close.style.pointerEvents = "none";
    }
  });
});

function change(timer, value) {
  settings[timer] = +value;
  let min = settings[currentTimer];
  time.textContent = `${min.toString().padStart(2, 0)}:00`;
}

function timeOver() {
  const audio = document.createElement("audio");
  audio.style.visibility = "hidden";
  audio.src = "./assets/ding_AOS01920.mp3";
  document.body.insertAdjacentElement("afterend", audio);
  audio.play();
  audio.onended = () => audio.remove();
}
