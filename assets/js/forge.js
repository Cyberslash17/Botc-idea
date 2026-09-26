(function () {
  'use strict';

  var INK = { townsfolk: 'good', outsider: 'good', minion: 'evil', demon: 'evil', traveller: 'traveller', fabled: 'fabled' };
  var ACCENT_POS = { tl: '2 2', tr: '56 2', bl: '2 56', br: '56 56', center: '29 29' };
  var SVGNS = 'http://www.w3.org/2000/svg';
  var defs = document.getElementById('glyph-defs');
  var SYMBOLS = Array.prototype.map.call(defs.querySelectorAll('symbol'), function (s) { return s.id.slice(2); });

  var $ = function (id) { return document.getElementById(id); };
  var state = { name: 'New Character', team: 'townsfolk', symbol: 'eye', accent: '', accent_pos: 'br', rotate: 0, scale: 1, flip: false };

  // Mirrors _includes/glyph.html so what you see here is what the site renders.
  function glyphMarkup(s) {
    var ink = INK[s.team] || 'good';
    var sx = s.flip ? -s.scale : s.scale;
    var out = '<g fill="url(#ink-' + ink + ')" stroke="#1b0f0a" stroke-width="2.5" stroke-linejoin="round" filter="url(#glyph-shadow)">' +
      '<use href="#g-' + s.symbol + '" width="100" height="100" transform="translate(50 50) rotate(' + s.rotate + ') scale(' + sx + ' ' + s.scale + ') translate(-50 -50)"/>';
    if (s.accent) out += '<use href="#g-' + s.accent + '" width="42" height="42" transform="translate(' + (ACCENT_POS[s.accent_pos] || ACCENT_POS.br) + ')"/>';
    return out + '</g>';
  }

  function escapeXml(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function tokenMarkup(s) {
    return '<svg class="token" viewBox="0 0 200 200" role="img" aria-label="Token preview">' +
      '<circle cx="100" cy="100" r="96" fill="url(#parchment)"/>' +
      '<circle cx="100" cy="100" r="96" fill="#fff" filter="url(#paper-grain)" opacity=".55"/>' +
      '<circle cx="100" cy="100" r="95" fill="none" stroke="#2b1c10" stroke-width="3"/>' +
      '<circle cx="100" cy="100" r="88" fill="none" stroke="#8a6a3c" stroke-width="1" opacity=".6"/>' +
      '<svg x="47" y="26" width="106" height="106" viewBox="0 0 100 100">' + glyphMarkup(s) + '</svg>' +
      '<path id="forge-arc" d="M 24 100 A 76 76 0 0 0 176 100" fill="none"/>' +
      '<text class="token-name"><textPath href="#forge-arc" startOffset="50%" text-anchor="middle">' + escapeXml(s.name) + '</textPath></text></svg>';
  }

  function symbolButton(name, group) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.value = name;
    b.title = name || 'none';
    b.setAttribute('aria-label', name || 'No accent');
    if (name) {
      b.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="url(#ink-good)" stroke="#1b0f0a" stroke-width="2.5" stroke-linejoin="round"><use href="#g-' + name + '" width="100" height="100"/></g></svg>';
    } else {
      b.innerHTML = '<span class="none">None</span>';
    }
    b.addEventListener('click', function () { state[group] = name; render(); });
    return b;
  }

  function buildPickers() {
    var main = $('f-symbols'), acc = $('f-accents');
    acc.appendChild(symbolButton('', 'accent'));
    SYMBOLS.forEach(function (n) {
      main.appendChild(symbolButton(n, 'symbol'));
      acc.appendChild(symbolButton(n, 'accent'));
    });
  }

  function snippet(s) {
    var lines = ['glyph:', '  symbol: ' + s.symbol];
    if (s.accent) { lines.push('  accent: ' + s.accent); if (s.accent_pos !== 'br') lines.push('  accent_pos: ' + s.accent_pos); }
    if (+s.rotate) lines.push('  rotate: ' + s.rotate);
    if (+s.scale !== 1) lines.push('  scale: ' + s.scale);
    if (s.flip) lines.push('  flip: true');
    return lines.join('\n');
  }

  function render() {
    var ink = INK[state.team];
    $('f-token').innerHTML = tokenMarkup(state);
    $('f-icon').innerHTML = glyphMarkup(state);
    $('f-icon-dark').innerHTML = glyphMarkup(state);
    $('f-snippet').value = snippet(state);
    $('f-rotate-val').textContent = state.rotate + '°';
    $('f-scale-val').textContent = Math.round(state.scale * 100) + '%';
    [['f-symbols', 'symbol'], ['f-accents', 'accent']].forEach(function (p) {
      Array.prototype.forEach.call($(p[0]).children, function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.value === state[p[1]]));
        var g = b.querySelector('g');
        if (g) g.setAttribute('fill', 'url(#ink-' + ink + ')');
      });
    });
    $('f-name').value !== state.name && ($('f-name').value = state.name);
    $('f-team').value = state.team;
    $('f-accent-pos').value = state.accent_pos;
    $('f-rotate').value = state.rotate;
    $('f-scale').value = state.scale;
    $('f-flip').checked = state.flip;
  }

  function slug() {
    return (state.name || 'glyph').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'glyph';
  }

  // Standalone SVG with only the defs this glyph needs, so it renders outside the page.
  function standaloneSvg(size) {
    var ink = INK[state.team];
    var ids = ['ink-' + ink, 'glyph-shadow', 'g-' + state.symbol];
    if (state.accent) ids.push('g-' + state.accent);
    var d = ids.map(function (id) { return document.getElementById(id).outerHTML; }).join('');
    return '<svg xmlns="' + SVGNS + '" viewBox="0 0 100 100" width="' + size + '" height="' + size + '"><defs>' + d + '</defs>' + glyphMarkup(state) + '</svg>';
  }

  function loadImage(svgText) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
    });
  }

  function download(url, filename) {
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
  }

  function downloadCanvas(canvas, filename) {
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      download(url, filename);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }, 'image/png');
  }

  function iconPng() {
    var size = 512;
    loadImage(standaloneSvg(size)).then(function (img) {
      var c = document.createElement('canvas');
      c.width = c.height = size;
      c.getContext('2d').drawImage(img, 0, 0, size, size);
      downloadCanvas(c, slug() + '-icon.png');
    });
  }

  function iconSvg() {
    var blob = new Blob([standaloneSvg(512)], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    download(url, slug() + '-icon.svg');
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // Token is drawn on a canvas (rather than rasterising the SVG) so the web font is used for the name.
  function tokenPng() {
    var size = 600, k = size / 200;
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var ctx = c.getContext('2d');
    ctx.scale(k, k);

    ctx.save();
    ctx.beginPath(); ctx.arc(100, 100, 96, 0, Math.PI * 2); ctx.clip();
    var g = ctx.createRadialGradient(90, 80, 0, 90, 80, 130);
    g.addColorStop(0, '#f6ecd2'); g.addColorStop(0.75, '#e6d3aa'); g.addColorStop(1, '#c9ae7c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 200, 200);
    for (var i = 0; i < 2500; i++) {
      ctx.fillStyle = 'rgba(90,60,30,' + (Math.random() * 0.12).toFixed(3) + ')';
      ctx.fillRect(Math.random() * 200, Math.random() * 200, 0.6, 0.6);
    }
    ctx.restore();
    ctx.lineWidth = 3; ctx.strokeStyle = '#2b1c10';
    ctx.beginPath(); ctx.arc(100, 100, 95, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(138,106,60,.6)';
    ctx.beginPath(); ctx.arc(100, 100, 88, 0, Math.PI * 2); ctx.stroke();

    Promise.all([loadImage(standaloneSvg(318)), document.fonts ? document.fonts.load('19px "IM Fell English SC"') : null])
      .then(function (res) {
        ctx.drawImage(res[0], 47, 26, 106, 106);
        ctx.fillStyle = '#221610';
        ctx.font = '19px "IM Fell English SC", Georgia, serif';
        ctx.textBaseline = 'alphabetic';
        // Same arc as the SVG token: radius 76 around the token centre.
        var r = 76, cy = 100, chars = state.name.split('');
        var widths = chars.map(function (ch) { return ctx.measureText(ch).width + 0.8; });
        var total = widths.reduce(function (a, b) { return a + b; }, 0);
        var theta = Math.PI / 2 + total / r / 2;
        chars.forEach(function (ch, idx) {
          var half = widths[idx] / 2 / r;
          theta -= half;
          ctx.save();
          ctx.translate(100 + r * Math.cos(theta), cy + r * Math.sin(theta));
          ctx.rotate(theta - Math.PI / 2);
          ctx.fillText(ch, -ctx.measureText(ch).width / 2, 0);
          ctx.restore();
          theta -= half;
        });
        downloadCanvas(c, slug() + '-token.png');
      });
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randomise() {
    state.symbol = pick(SYMBOLS);
    state.accent = Math.random() < 0.45 ? pick(SYMBOLS.filter(function (s) { return s !== state.symbol; })) : '';
    state.accent_pos = pick(['br', 'br', 'bl', 'tr', 'tl']);
    state.rotate = Math.random() < 0.6 ? 0 : pick([-30, -15, 15, 30, 45]);
    state.scale = state.accent ? 0.85 : 1;
    state.flip = Math.random() < 0.3;
    render();
  }

  function readQuery() {
    var q = new URLSearchParams(location.search);
    if (q.get('name')) state.name = q.get('name');
    if (INK[q.get('team')]) state.team = q.get('team');
    if (SYMBOLS.indexOf(q.get('symbol')) !== -1) state.symbol = q.get('symbol');
    else if (!q.get('symbol') && q.get('team')) state.symbol = { outsider: 'moon', minion: 'dagger', demon: 'horns', traveller: 'hourglass', fabled: 'star' }[state.team] || 'eye';
    if (SYMBOLS.indexOf(q.get('accent')) !== -1) state.accent = q.get('accent');
    if (ACCENT_POS[q.get('accent_pos')]) state.accent_pos = q.get('accent_pos');
    if (q.get('rotate')) state.rotate = +q.get('rotate') || 0;
    if (q.get('scale')) state.scale = +q.get('scale') || 1;
    state.flip = q.get('flip') === '1';
  }

  buildPickers();
  readQuery();
  $('f-name').addEventListener('input', function (e) { state.name = e.target.value; render(); });
  $('f-team').addEventListener('change', function (e) { state.team = e.target.value; render(); });
  $('f-accent-pos').addEventListener('change', function (e) { state.accent_pos = e.target.value; render(); });
  $('f-rotate').addEventListener('input', function (e) { state.rotate = +e.target.value; render(); });
  $('f-scale').addEventListener('input', function (e) { state.scale = +e.target.value; render(); });
  $('f-flip').addEventListener('change', function (e) { state.flip = e.target.checked; render(); });
  $('f-random').addEventListener('click', randomise);
  $('f-dl-icon').addEventListener('click', iconPng);
  $('f-dl-svg').addEventListener('click', iconSvg);
  $('f-dl-token').addEventListener('click', tokenPng);
  $('f-copy').addEventListener('click', function () {
    var t = $('f-snippet');
    (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject())
      .catch(function () { t.select(); document.execCommand('copy'); })
      .then(function () { $('f-copy').textContent = 'Copied!'; setTimeout(function () { $('f-copy').textContent = 'Copy snippet'; }, 1500); });
  });
  render();
})();
