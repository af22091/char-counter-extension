const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// 128x128, 48x48, and 16x16 pixel PNG base64 strings (simple stylized blue square with 'A' text or similar)
// Let's write a standard simple blue circle icon
const icon16 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWklEQVQ4T2NkoBAwUqifAWJAbGws/0eOHMEOQDpxcXEGBgYGGIsJiA/EaGJgYGBg5Obmxi8IEqP5//8/tkwgJg4wMDBgK8alEKYG7OmAnp4e09TUFFwKYSYQphADAwMA71MTC5zHcvQAAAAASUVORK5CYII=';

const icon48 = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABQklEQVR4Xu2XsQrCQBBE54tYWAha+QNL0VrfWvAp/ID4AdZ+gqWlhZVNiiBic3Jic4v3lhMKh7tldm52b5Msy3LMxZg1kC2QC+QCg2ugvW+K7V0tPtdCqC+V8uFSCiE0U9/eN/NznmN8Ea0Q2sV5PpxLqX7/bL4e4xYpG9DvgVvgnzLg5a+8h1sN4L5K8b2XN1yW/900XJZjP4D7IsX3/hA0XJbjLID7IsX3B6HhshznAdwXKb7/EDRcluM8gPsixfdHpeGyHOcB3Bcpvv8UNFyWYz+A+yLF90el4bIc5wHcFym+/0w0XJZjP4D7IsX3p6Hhshw3NMDt21w1gHuB4vsP13BZHq8GeAdwL1B8/5k1XJbj1QDeMdwLFN9/loTLcry/RrxjuBcovv9WjMt6fOQY6H8Hn9U+kC2QC/wA8APpU5n7uQ4AAAAASUVORK5CYII=';

const icon128 = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACU0lEQVR4Xu3av2oUQRiA4d/NIoKlhVhpLdJZaiv6pNDGws7H0FfwtvQVrC0sbFIIFlYpAhaC2V2Tu2RvN2cVD3f/vFtm5pvh2+xM1tpYv3FrIBvIFsgGcoGjNdDeF8V2lxbfaSHUl0r5cCmFEJqpL++L+b7Osb2IVgjt4jQ/7Eqpfvx3t2e2i5QNaHfAHvhNG/D8z67hrQbYXyq+/9eGW8v2xX1b/7rBfgDbRervd91wa9ku0G4A20Xq73fc7pj93W9ggM0itcDb7mXgttj3Q7tIbXCrA26LfT/dArXBrg/cFrM/wBqozbI/wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlg3wC7QCusG2AVaYd0Au0ArrBtgF2iFdQPsAq2wboBdoBXWDbALtMK6AXaBVlj35wbYBVph3QC7QCusG2AVaMV1Az0D/c/gs9oGsgVygR/L8i4l2204wQAAAABJRU5ErkJg';

fs.writeFileSync(path.join(iconsDir, 'icon16.png'), Buffer.from(icon16, 'base64'));
fs.writeFileSync(path.join(iconsDir, 'icon48.png'), Buffer.from(icon48, 'base64'));
fs.writeFileSync(path.join(iconsDir, 'icon128.png'), Buffer.from(icon128, 'base64'));

console.log('Icons generated successfully.');
