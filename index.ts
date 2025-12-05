import './style.css';
import * as sha1lib from 'sha1';
import fullEmojiList from 'full-emoji-list';

const sha1 = sha1lib.default;
const emojiList = fullEmojiList.map((x) => x.Emoji);

const getRandomInt = (min: number, max: number) => {
  const range = max - min + 1;
  const bytes_needed = Math.ceil(Math.log2(range) / 0x8);
  const cutoff = Math.floor(0x100 ** bytes_needed / range) * range;
  const bytes = new Uint8Array(bytes_needed);
  let value;
  do {
    crypto.getRandomValues(bytes);
    value = bytes.reduce((acc, x, n) => acc + x * 0x100 ** n, 0);
  } while (value >= cutoff);
  return min + (value % range);
};

const copyContent = (str) => {
  const el = document.createElement('textarea');
  el.textContent = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

const createAPassword = (size) => {
  const createPassword = true;
  let password = ``;
  console.clear();
  if (createPassword) {
    for (let i = 0x0; i < size; i++) {
      const random = getRandomInt(0, emojiList.length - 1);
      const emoji = emojiList[random];
      password += emoji;
    }
    console.log(`Password: ${password}`);
  }
  document.querySelector('div#app p.password').innerText = password;
  const entropy = Math.floor(size * Math.log10(emojiList.length));
  const bits = Math.floor(size * Math.log2(emojiList.length));
  const sha1pass = sha1(password);
  console.log(`Size: ${size}`);
  console.log(`Bits: ${bits}`);
  console.log(`Entropy: e+${entropy}`);
  console.log(`SHA1: ${sha1pass}`);
  const info = `
  <p>Size: ${size}</p>
  <p>Bits: ${bits}</p>
  <p>Entropy: ${entropy}</p>
  <p>SHA1: ${sha1pass}</p>
  `;
  document.querySelector('div#app p.info').innerHTML = info;
};

const sizeElement = document.querySelector('div#app input#size');
sizeElement.addEventListener('change', () => {
  createAPassword(sizeElement.value);
});
createAPassword(sizeElement.value);

document
  .querySelector('div#app button.regenerate')
  .addEventListener('click', () => {
    createAPassword(sizeElement.value);
  });

document.querySelector('div#app button.copy').addEventListener('click', () => {
  copyContent(document.querySelector('div#app p.password').innerText);
});
