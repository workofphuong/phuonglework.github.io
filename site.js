(function () {
  // ---------- home: filter the experience cards by stage ----------
  var chips = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('[data-stages]');
  var count = document.getElementById('count');
  if (chips.length && cards.length) {
    var totalExp = [].filter.call(cards, function (c) { return c.dataset.kind === 'experience'; }).length;
    var totalProj = cards.length - totalExp;
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.filter, exp = 0, proj = 0;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        cards.forEach(function (card) {
          var ok = f === 'all' || (f === 'work' && card.dataset.kind === 'experience') || card.dataset.stages.split(' ').indexOf(f) > -1;
          card.hidden = !ok;
          if (ok) { if (card.dataset.kind === 'project') proj++; else exp++; }
        });
        if (count) {
          var part = function (n, total, noun) { return n === total ? n + ' ' + noun : n + ' of ' + total + ' ' + noun; };
          var parts = [];
          if (exp) parts.push(part(exp, totalExp, 'experiences'));
          if (proj) parts.push(part(proj, totalProj, 'projects'));
          count.textContent = parts.join(' · ');
        }
      });
    });
  }

  // ---------- work pages: click an image to enlarge it ----------
  var imgs = document.querySelectorAll('.frame img');
  if (imgs.length && typeof HTMLDialogElement !== 'undefined') {
    var dlg = document.createElement('dialog');
    dlg.className = 'zoom';
    dlg.setAttribute('aria-label', 'Enlarged image');
    dlg.innerHTML = '<div class="zoom-inner"><img alt=""></div><button class="close" type="button">Close</button>';
    document.body.appendChild(dlg);
    var big = dlg.querySelector('img');
    imgs.forEach(function (img) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'zoomable';
      b.setAttribute('aria-label', 'Enlarge image: ' + img.alt);
      img.parentNode.insertBefore(b, img);
      b.appendChild(img);
      b.addEventListener('click', function () {
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        var nw = img.naturalWidth || parseInt(img.getAttribute('width'), 10) || 600;
        big.style.width = Math.min(window.innerWidth * 0.94, nw * 1.8) + 'px';
        dlg.showModal();
        dlg.scrollTop = 0;
      });
    });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.className === 'zoom-inner' || e.target.className === 'close') dlg.close();
    });
  }
})();
