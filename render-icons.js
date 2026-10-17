const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

app.disableHardwareAcceleration();

const outDir = path.join(__dirname, "build");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
app.setPath("userData", path.join(outDir, "userData"));

function note(x, y, w, h, fill, dark, rot, cx, cy) {
  return (
    '<g transform="rotate(' + rot + " " + cx + " " + cy + ')">' +
    '<rect x="' + (x + 8) + '" y="' + (y + 10) + '" width="' + w + '" height="' + h + '" rx="18" fill="#000000" opacity="0.12"/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="18" fill="' + fill + '"/>' +
    '<path d="M' + (x + w) + " " + (y + h) + " L" + (x + w) + " " + (y + h - 34) + " L" + (x + w - 34) + " " + (y + h) + ' Z" fill="' + dark + '"/>' +
    "</g>"
  );
}

const icons = [
  {
    name: "style-1-grid-notes",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
      '<defs><linearGradient id="b1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faf5e9"/><stop offset="1" stop-color="#eee0c4"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="512" height="512" rx="112" fill="url(#b1)"/>' +
      note(86, 86, 150, 150, "#e65a4c", "#c94236", -4, 161, 161) +
      note(276, 86, 150, 150, "#3d7fd6", "#2f68b8", 4, 351, 161) +
      note(86, 276, 150, 150, "#e0a01f", "#c18715", 3, 161, 351) +
      note(276, 276, 150, 150, "#3a9d68", "#2d8252", -3, 351, 351) +
      "</svg>"
  },
  {
    name: "style-2-quadrant-wheel",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
      '<defs><linearGradient id="b2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4238"/><stop offset="1" stop-color="#2f2a24"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="512" height="512" rx="112" fill="url(#b2)"/>' +
      '<circle cx="256" cy="256" r="148" fill="#ffffff"/>' +
      '<path d="M256 108 A148 148 0 0 1 404 256 L256 256 Z" fill="#e65a4c"/>' +
      '<path d="M404 256 A148 148 0 0 1 256 404 L256 256 Z" fill="#3d7fd6"/>' +
      '<path d="M256 404 A148 148 0 0 1 108 256 L256 256 Z" fill="#e0a01f"/>' +
      '<path d="M108 256 A148 148 0 0 1 256 108 L256 256 Z" fill="#3a9d68"/>' +
      '<line x1="256" y1="108" x2="256" y2="404" stroke="#ffffff" stroke-width="7"/>' +
      '<line x1="108" y1="256" x2="404" y2="256" stroke="#ffffff" stroke-width="7"/>' +
      '<circle cx="256" cy="256" r="52" fill="#ffffff"/>' +
      '<path d="M232 256 L248 272 L284 236" stroke="#e65a4c" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
  },
  {
    name: "style-3-single-note",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
      '<defs><linearGradient id="b3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#faf5e9"/><stop offset="1" stop-color="#eee0c4"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="512" height="512" rx="112" fill="url(#b3)"/>' +
      '<g transform="rotate(-4 250 250)">' +
      '<rect x="152" y="154" width="220" height="220" rx="20" fill="#000000" opacity="0.14"/>' +
      '<rect x="140" y="140" width="220" height="220" rx="20" fill="#f6c445"/>' +
      '<path d="M360 360 L360 328 L328 360 Z" fill="#d9a52d"/>' +
      '<path d="M204 260 L242 298 L300 226" stroke="#b84532" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</g>" +
      "</svg>"
  },
  {
    name: "style-4-flat-tiles",
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
      '<rect x="0" y="0" width="512" height="512" rx="112" fill="#332c22"/>' +
      '<rect x="112" y="112" width="132" height="132" rx="30" fill="#e65a4c"/>' +
      '<rect x="268" y="112" width="132" height="132" rx="30" fill="#3d7fd6"/>' +
      '<rect x="112" y="268" width="132" height="132" rx="30" fill="#e0a01f"/>' +
      '<rect x="268" y="268" width="132" height="132" rx="30" fill="#3a9d68"/>' +
      '<path d="M148 180 L170 202 L208 158" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
  }
];

function wrap(svg) {
  return '<!doctype html><html><body style="margin:0;background:transparent">' + svg + "</body></html>";
}

function loadAndPaint(win, p) {
  return new Promise(function (resolve, reject) {
    win.webContents.once("did-fail-load", function (e, code, desc) { reject(new Error(desc)); });
    win.webContents.once("did-finish-load", function () {
      setTimeout(resolve, 350);
    });
    win.loadFile(p);
  });
}

app.whenReady().then(async function () {
  const win = new BrowserWindow({
    width: 512,
    height: 512,
    show: false,
    frame: false,
    webPreferences: { offscreen: true }
  });
  const htmlPath = path.join(outDir, ".tmp-icon.html");
  for (const ic of icons) {
    fs.writeFileSync(htmlPath, wrap(ic.svg));
    await loadAndPaint(win, htmlPath);
    const img = await win.webContents.capturePage({ x: 0, y: 0, width: 512, height: 512 });
    fs.writeFileSync(path.join(outDir, ic.name + ".png"), img.toPNG());
    console.log("wrote " + ic.name + ".png");
  }
  win.destroy();
  fs.rmSync(htmlPath, { force: true });
  app.quit();
});
