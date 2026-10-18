const I18N = {
  zh: {
    appTitle: "四象限时间管理",
    todayLine: "把要做的事，一件件贴出来",
    newNote: "＋ 新建便签",
    hint: "拖动便签右下角可调节大小 · 点击方框完成任务",
    empty: "还没有便签，点右上角 ＋ 添加一条",
    modalTitle: "新建便签",
    what: "要做的事",
    whatPh: "例如：回复客户紧急邮件",
    timeLabel: "时间（可选）",
    which: "放在哪个象限",
    cancel: "取消",
    add: "添加",
    markDone: "标记为完成",
    markUndone: "标记为未完成",
    del: "删除",
    resize: "拖动右下角调节大小",
    toDo: "待完成",
    todoLabel: "待办",
    addHere: "添加便签",
    today: "今天",
    tomorrow: "明天",
    yesterday: "昨天",
    q: {
      ui: { name: "重要且紧急", tag: "马上去做" },
      iu: { name: "重要不紧急", tag: "计划去做" },
      un: { name: "紧急不重要", tag: "委托他人" },
      nn: { name: "不紧急不重要", tag: "尽量不做" }
    }
  },
  en: {
    appTitle: "Quadrant Time Manager",
    todayLine: "Pin everything you need to do",
    newNote: "+ New Note",
    hint: "Drag the corner to resize · click the box to complete",
    empty: "No notes yet — click + to add one",
    modalTitle: "New Note",
    what: "Task",
    whatPh: "e.g. Reply to client email",
    timeLabel: "Time (optional)",
    which: "Choose a quadrant",
    cancel: "Cancel",
    add: "Add",
    markDone: "Mark as done",
    markUndone: "Mark as not done",
    del: "Delete",
    resize: "Drag the corner to resize",
    toDo: "To-do",
    todoLabel: "To-do",
    addHere: "Add note",
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
    q: {
      ui: { name: "Urgent & Important", tag: "Do it now" },
      iu: { name: "Important, Not Urgent", tag: "Schedule it" },
      un: { name: "Urgent, Not Important", tag: "Delegate it" },
      nn: { name: "Not Urgent, Not Important", tag: "Drop it" }
    }
  }
};

const QMETA = {
  ui: { accent: "#e65a4c", note: "#ffd9d3" },
  iu: { accent: "#3d7fd6", note: "#d9e9ff" },
  un: { accent: "#e0a01f", note: "#fff0c4" },
  nn: { accent: "#3a9d68", note: "#daf3e1" }
};

const ORDER = ["ui", "iu", "un", "nn"];
const WD_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const WD_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 1.8"/></svg>';
const KEY = "qsn.notes.v1";
const LANG_KEY = "qsn.lang.v1";

function $(id) { return document.getElementById(id); }

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function pad(n) { return String(n).padStart(2, "0"); }

function localDT(dayOffset, h, m) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) +
    "T" + pad(h) + ":" + pad(m);
}

function seedNotes() {
  return [
    { id: uid(), text: "提交项目周报", time: localDT(0, 18, 0), q: "ui", done: false, w: 230, h: 160, tilt: -1.2 },
    { id: uid(), text: "回复客户紧急邮件", time: localDT(0, 15, 30), q: "ui", done: false, w: 220, h: 150, tilt: 1.1 },
    { id: uid(), text: "制定下季度学习计划", time: localDT(1, 10, 0), q: "iu", done: false, w: 240, h: 170, tilt: -0.8 },
    { id: uid(), text: "健身 30 分钟", time: localDT(0, 20, 0), q: "iu", done: false, w: 210, h: 140, tilt: 0.6 },
    { id: uid(), text: "整理今天的会议记录", time: localDT(0, 17, 0), q: "un", done: false, w: 230, h: 150, tilt: 1.4 },
    { id: uid(), text: "整理电脑桌面", time: null, q: "nn", done: false, w: 210, h: 130, tilt: -1.0 }
  ];
}

function load() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const a = JSON.parse(s);
      if (Array.isArray(a)) return a;
    }
  } catch (e) {}
  return seedNotes();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {}
}

function loadLang() {
  try {
    const l = localStorage.getItem(LANG_KEY);
    if (l === "en" || l === "zh") return l;
  } catch (e) {}
  return "zh";
}

function saveLang() {
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
}

function t(key) { return I18N[lang][key]; }

function parseLocal(s) {
  if (!s) return null;
  const parts = s.split("T");
  const d = parts[0].split("-").map(Number);
  const tm = (parts[1] || "00:00").split(":").map(Number);
  return new Date(d[0], d[1] - 1, d[2], tm[0], tm[1]);
}

function dayDiff(d) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const that = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((that - today) / 86400000);
}

function fmtTime(s) {
  const d = parseLocal(s);
  if (!d) return "";
  const L = I18N[lang];
  const hm = pad(d.getHours()) + ":" + pad(d.getMinutes());
  const diff = dayDiff(d);
  if (diff === 0) return L.today + " " + hm;
  if (diff === 1) return L.tomorrow + " " + hm;
  if (diff === -1) return L.yesterday + " " + hm;
  if (lang === "en") return MON_EN[d.getMonth()] + " " + d.getDate() + " · " + hm;
  const now = new Date();
  if (d.getFullYear() === now.getFullYear()) return (d.getMonth() + 1) + "月" + d.getDate() + "日 " + hm;
  return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + hm;
}

function isOverdue(s) {
  const d = parseLocal(s);
  return d && d < new Date();
}

function fmtHeaderDate() {
  const d = new Date();
  const L = I18N[lang];
  if (lang === "en") {
    return WD_EN[d.getDay()] + ", " + MON_EN[d.getMonth()] + " " + d.getDate() + ", " +
      d.getFullYear() + " · " + L.todayLine;
  }
  return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 星期" +
    WD_ZH[d.getDay()] + " · " + L.todayLine;
}

function sortNotes(a, b) {
  if (a.done !== b.done) return a.done ? 1 : -1;
  const ta = a.time ? parseLocal(a.time).getTime() : Infinity;
  const tb = b.time ? parseLocal(b.time).getTime() : Infinity;
  return ta - tb;
}

function renderNote(n) {
  const el = document.createElement("article");
  el.className = "note" + (n.done ? " done" : "");
  el.dataset.id = n.id;
  el.style.cssText =
    "--note:" + QMETA[n.q].note + ";" +
    "--accent:" + QMETA[n.q].accent + ";" +
    "width:" + n.w + "px;height:" + n.h + "px;" +
    "--tilt:" + n.tilt + "deg;";

  el.innerHTML =
    '<div class="note__top">' +
      '<label class="check" title="' + (n.done ? t("markUndone") : t("markDone")) + '">' +
        '<input type="checkbox"' + (n.done ? " checked" : "") + ">" +
        '<span class="box"></span>' +
      "</label>" +
      '<button class="note__del" title="' + t("del") + '" aria-label="' + t("del") + '">×</button>' +
    "</div>" +
    '<p class="note__text">' + esc(n.text) + "</p>" +
    (n.time
      ? '<div class="note__time' + (isOverdue(n.time) && !n.done ? " overdue" : "") + '">' +
          CLOCK_SVG + "<span>" + esc(fmtTime(n.time)) + "</span></div>"
      : "") +
    '<span class="note__resize" title="' + t("resize") + '"></span>';

  el.querySelector("input").addEventListener("change", function (e) {
    n.done = e.target.checked;
    save();
    renderAll();
  });

  el.querySelector(".note__del").addEventListener("click", function () {
    notes = notes.filter(function (x) { return x.id !== n.id; });
    save();
    renderAll();
  });

  el.querySelector(".note__resize").addEventListener("pointerdown", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const rz = e.currentTarget;
    const sw = n.w, sh = n.h, sx = e.clientX, sy = e.clientY;
    rz.setPointerCapture(e.pointerId);
    function move(ev) {
      n.w = Math.max(170, Math.min(480, sw + ev.clientX - sx));
      n.h = Math.max(120, Math.min(460, sh + ev.clientY - sy));
      el.style.width = n.w + "px";
      el.style.height = n.h + "px";
    }
    function end() {
      rz.removeEventListener("pointermove", move);
      rz.removeEventListener("pointerup", end);
      rz.removeEventListener("pointercancel", end);
      save();
    }
    rz.addEventListener("pointermove", move);
    rz.addEventListener("pointerup", end);
    rz.addEventListener("pointercancel", end);
  });

  return el;
}

function renderAll() {
  document.querySelectorAll(".quadrant").forEach(function (q) {
    const key = q.dataset.quadrant;
    const list = notes.filter(function (n) { return n.q === key; }).sort(sortNotes);
    const container = q.querySelector(".notes");
    container.innerHTML = "";
    q.querySelector(".quadrant__count").textContent =
      t("todoLabel") + " " + list.filter(function (n) { return !n.done; }).length;
    if (list.length === 0) {
      const div = document.createElement("div");
      div.className = "empty";
      div.textContent = t("empty");
      container.appendChild(div);
    } else {
      list.forEach(function (n) { container.appendChild(renderNote(n)); });
    }
  });
}

function buildChips() {
  const box = $("mQuads");
  box.innerHTML = "";
  ORDER.forEach(function (key) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "qchip" + (key === activeQ ? " active" : "");
    chip.dataset.q = key;
    chip.style.cssText = "--c:" + QMETA[key].accent;
    chip.innerHTML = '<span class="cdot"></span>' + I18N[lang].q[key].name;
    chip.addEventListener("click", function () {
      activeQ = key;
      buildChips();
    });
    box.appendChild(chip);
  });
}

function applyI18n() {
  const L = I18N[lang];
  document.title = L.appTitle;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  $("appTitle").textContent = L.appTitle;
  $("logoMark").textContent = lang === "zh" ? "四" : "Q";
  $("hint").textContent = L.hint;
  $("langBtn").textContent = lang === "zh" ? "EN" : "中文";
  $("globalAdd").textContent = L.newNote;
  $("today").textContent = fmtHeaderDate();

  document.querySelectorAll(".quadrant").forEach(function (q) {
    const key = q.dataset.quadrant;
    q.querySelector("h2").textContent = L.q[key].name;
    q.querySelector(".quadrant__tag").textContent = L.q[key].tag;
    q.querySelector(".quadrant__add").setAttribute("aria-label", L.addHere);
    q.querySelector(".quadrant__count").setAttribute("title", L.toDo);
  });

  $("modalTitle").textContent = L.modalTitle;
  $("labelText").textContent = L.what;
  $("mText").placeholder = L.whatPh;
  $("labelTime").textContent = L.timeLabel;
  $("labelWhich").textContent = L.which;
  $("mCancel").textContent = L.cancel;
  $("mAdd").textContent = L.add;

  buildChips();
}

let notes = load();
let lang = loadLang();
let activeQ = "ui";

const backdrop = $("backdrop");
const modal = $("modal");
const mText = $("mText");
const mTime = $("mTime");

function openModal(q) {
  activeQ = q || activeQ;
  buildChips();
  mText.value = "";
  mTime.value = "";
  backdrop.hidden = false;
  mText.focus();
}

function closeModal() {
  backdrop.hidden = true;
}

$("globalAdd").addEventListener("click", function () { openModal(activeQ); });

document.querySelectorAll(".quadrant__add").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openModal(btn.closest(".quadrant").dataset.quadrant);
  });
});

modal.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = mText.value.trim();
  if (!text) return;
  notes.push({
    id: uid(),
    text: text,
    time: mTime.value || null,
    q: activeQ,
    done: false,
    w: 230,
    h: 160,
    tilt: +(Math.random() * 3 - 1.5).toFixed(1)
  });
  save();
  renderAll();
  closeModal();
});

$("mCancel").addEventListener("click", closeModal);
backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closeModal(); });
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !backdrop.hidden) closeModal();
});

$("langBtn").addEventListener("click", function () {
  lang = lang === "zh" ? "en" : "zh";
  saveLang();
  applyI18n();
  renderAll();
});

applyI18n();
renderAll();
