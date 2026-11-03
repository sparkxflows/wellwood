/* ==========================================================================
   WELLWOOD STABILIZER — interactions & animations
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- sticky header ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector(".burger");
  var drawer = document.querySelector(".drawer");
  var scrim = document.querySelector(".scrim");
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    scrim && scrim.classList.remove("on");
    document.body.style.overflow = "";
  }
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      drawer.classList.add("open");
      scrim && scrim.classList.add("on");
      document.body.style.overflow = "hidden";
    });
    scrim && scrim.addEventListener("click", closeDrawer);
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
    document.querySelectorAll("[data-close-drawer]").forEach(function (b) {
      b.addEventListener("click", closeDrawer);
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- button ripple ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn, .icon-btn, .wa-card, .socials a");
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height);
    var s = document.createElement("span");
    s.className = "ripple";
    s.style.width = s.style.height = size + "px";
    s.style.left = (e.clientX - r.left - size / 2) + "px";
    s.style.top = (e.clientY - r.top - size / 2) + "px";
    btn.appendChild(s);
    setTimeout(function () { s.remove(); }, 700);
  });

  /* ---------- toast helper ---------- */
  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.innerHTML =
        '<svg class="ic" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(t);
    }
    t.querySelector("span").textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove("show"); }, 3600);
  }

  /* ---------- product rails ---------- */
  document.querySelectorAll("[data-rail]").forEach(function (wrap) {
    var rail = wrap.querySelector(".rail");
    if (!rail) return;
    var step = function () {
      var card = rail.querySelector(":scope > *");
      return card ? (card.getBoundingClientRect().width + 20) * 1.5 : 360;
    };
    var prevBtns = wrap.querySelectorAll(".rail-nav.prev, .rail-head-btn.prev");
    var nextBtns = wrap.querySelectorAll(".rail-nav.next, .rail-head-btn.next");
    prevBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        rail.scrollBy({ left: -step(), behavior: "smooth" });
      });
    });
    nextBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        rail.scrollBy({ left: step(), behavior: "smooth" });
      });
    });
  });

  /* ---------- before / after interactive comparison slider ---------- */
  var baBoxes = document.querySelectorAll("[data-ba-box]");
  baBoxes.forEach(function (box) {
    var wrap = box.querySelector("[data-ba-wrap]");
    var line = box.querySelector("[data-ba-line]");
    var input = box.querySelector("[data-ba-input]");
    if (!wrap || !line || !input) return;

    var updatePos = function (val) {
      wrap.style.width = val + "%";
      line.style.left = val + "%";
    };

    input.addEventListener("input", function () {
      updatePos(this.value);
    });

    // Optional subtle auto-sweep on initial reveal to teach interaction
    var swept = false;
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !swept) {
            swept = true;
            obs.unobserve(box);
            var start = 50;
            var target = 32;
            var t0 = null;
            var anim = function (now) {
              if (!t0) t0 = now;
              var p = Math.min(1, (now - t0) / 900);
              var cur = start + Math.sin(p * Math.PI) * -16;
              input.value = cur;
              updatePos(cur);
              if (p < 1) requestAnimationFrame(anim);
              else {
                input.value = 50;
                updatePos(50);
              }
            };
            setTimeout(function () { requestAnimationFrame(anim); }, 400);
          }
        });
      }, { threshold: 0.35 });
      obs.observe(box);
    }
  });

  /* ---------- hero slider (products page) ---------- */
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var track = slider.querySelector(".slides");
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (sl) { track.appendChild(sl.cloneNode(true)); }); // clones for looping
    var per = window.matchMedia("(max-width:1024px)").matches ? 1 : 2;
    var idx = 0;
    var moving = false;
    var setPos = function (n, animate) {
      idx = n;
      track.style.transition = animate ? "" : "none";
      track.style.transform = "translate3d(-" + idx * (100 / per) + "%,0,0)";
      if (!animate) { void track.offsetWidth; track.style.transition = ""; }
    };
    var go = function (n) {
      if (moving) return;
      moving = true;
      if (n < 0) { setPos(originals.length, false); n = originals.length - 1; }
      setPos(n, true);
      setTimeout(function () {
        if (idx >= originals.length) setPos(idx - originals.length, false);
        moving = false;
      }, 780);
    };
    var prev = slider.querySelector(".slider-nav.prev");
    var next = slider.querySelector(".slider-nav.next");
    prev && prev.addEventListener("click", function () { go(idx - 1); });
    next && next.addEventListener("click", function () { go(idx + 1); });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(function () { go(idx + 1); }, 6500);
    }
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        co.unobserve(el);
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1500, t0 = null;
        var tick = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- product filters (products page) ---------- */
  var filterForm = document.querySelector("[data-filters]");
  if (filterForm) {
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-cat]"));
    var empty = document.querySelector(".empty");
    var first = true;
    var apply = function () {
      if (first) { first = false; return; }
      var checked = Array.prototype.slice
        .call(filterForm.querySelectorAll("input[data-filter]:checked"))
        .map(function (i) { return i.value; });
      var shown = 0;
      cards.forEach(function (card) {
        var tags = card.getAttribute("data-cat").split(" ");
        var ok = checked.length === 0 || checked.some(function (c) { return tags.indexOf(c) > -1; });
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    };
    filterForm.addEventListener("change", apply);
    var reset = filterForm.querySelector("[data-reset]");
    reset &&
      reset.addEventListener("click", function (e) {
        e.preventDefault();
        filterForm.querySelectorAll("input[data-filter]").forEach(function (i) { i.checked = false; });
        apply();
        toast("Filters cleared");
      });
    var fhead = document.querySelector(".filters-head");
    fhead && fhead.addEventListener("click", function () {
      document.querySelector(".filters").classList.toggle("open");
    });
    apply();
  }

  /* ---------- forms ---------- */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll(".field[required]").forEach(function (f) {
        var val = (f.value || "").trim();
        var valid = val.length > 0;
        if (f.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        if (f.type === "tel") valid = /^[0-9+\-\s()]{7,}$/.test(val);
        f.classList.toggle("invalid", !valid);
        if (!valid && ok) f.focus();
        if (!valid) ok = false;
      });
      if (!ok) { toast("Please fill the highlighted fields"); return; }
      var btn = form.querySelector(".btn");
      var label = btn.querySelector("span");
      var original = label ? label.textContent : "";
      if (label) label.textContent = "Sending…";
      btn.disabled = true;

      // Save to inquiries database
      try {
        var nameVal = form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : '';
        var phoneVal = form.querySelector('[name="phone"]') ? form.querySelector('[name="phone"]').value : '';
        var emailVal = form.querySelector('[name="email"]') ? form.querySelector('[name="email"]').value : '';
        var productVal = form.querySelector('[name="product"]') ? form.querySelector('[name="product"]').value : 'General Enquiry';
        var messageVal = form.querySelector('[name="message"]') ? form.querySelector('[name="message"]').value : '';
        var inqList = JSON.parse(localStorage.getItem('wellwood_enquiries') || '[]');
        inqList.push({
          date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }),
          name: nameVal,
          phone: phoneVal,
          email: emailVal,
          product: productVal,
          message: messageVal
        });
        localStorage.setItem('wellwood_enquiries', JSON.stringify(inqList));
      } catch(err) {}

      setTimeout(function () {
        if (label) label.textContent = original;
        btn.disabled = false;
        form.reset();
        toast("Thank you! Your message has been sent.");
      }, 1100);
    });
    form.querySelectorAll(".field").forEach(function (f) {
      f.addEventListener("input", function () { f.classList.remove("invalid"); });
    });
  });

  /* ---------- URL params autofill (contact page) ---------- */
  var urlParams = new URLSearchParams(window.location.search);
  var preProduct = urlParams.get('product');
  if (preProduct) {
    var selectField = document.querySelector('select[name="product"]');
    if (selectField) {
      var found = false;
      for (var i = 0; i < selectField.options.length; i++) {
        if (selectField.options[i].value.toLowerCase().includes(preProduct.toLowerCase()) || 
            preProduct.toLowerCase().includes(selectField.options[i].value.toLowerCase())) {
          selectField.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        var opt = document.createElement('option');
        opt.value = preProduct;
        opt.textContent = preProduct;
        opt.selected = true;
        selectField.appendChild(opt);
      }
    }
    var msgArea = document.querySelector('textarea[name="message"]');
    if (msgArea && !msgArea.value) {
      msgArea.value = "Hi, I am interested in " + preProduct + ". Please provide price and details.";
    }
  }

  /* ---------- Dynamic Custom Products from Admin Panel ---------- */
  try {
    var customProds = JSON.parse(localStorage.getItem('wellwood_custom_products') || '[]');
    var userAdded = customProds.filter(function(p){ return p.id > 100; });
    if (userAdded.length) {
      var stabRail = document.getElementById('stab-rail');
      var tvRail = document.getElementById('tv-rail');
      var stabGrid = document.querySelector('.grid-4');
      var tvGrid = document.querySelector('.grid-5');

      userAdded.forEach(function(p) {
        if (p.cat === 'stabilizer') {
          if (stabRail) {
            var art = document.createElement('article');
            art.className = 'p-card';
            art.innerHTML = '<div class="p-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
              '<h4>' + p.name + '</h4>' +
              '<p class="sub">' + p.specs + '</p>' +
              '<a class="btn sm" href="contact.html?product=' + encodeURIComponent(p.name) + '" style="margin-top:auto;padding:8px 12px;font-size:12.5px"><span>Enquire</span><svg class="ic"><use href="#i-arrow"/></svg></a>';
            stabRail.insertBefore(art, stabRail.firstChild);
          }
          if (stabGrid) {
            var artG = document.createElement('article');
            artG.className = 'prod-card';
            artG.setAttribute('data-cat', 'stabilizer ' + (p.tag.toLowerCase()));
            artG.innerHTML = '<div class="p-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
              '<h4>' + p.name + '</h4>' +
              '<p class="kv">' + p.specs + '</p>' +
              '<span class="chip">' + p.tag + '</span>' +
              '<a class="btn" href="contact.html?product=' + encodeURIComponent(p.name) + '"><span>Enquire Now</span><svg class="ic"><use href="#i-arrow"/></svg></a>';
            stabGrid.insertBefore(artG, stabGrid.firstChild);
          }
        } else if (p.cat === 'tv') {
          if (tvRail) {
            var artTV = document.createElement('article');
            artTV.className = 'p-card';
            artTV.innerHTML = '<div class="p-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
              '<h4>' + p.name + '</h4>' +
              '<p class="sub">' + p.specs + '</p>' +
              '<a class="btn sm" href="contact.html?product=' + encodeURIComponent(p.name) + '" style="margin-top:auto;padding:8px 12px;font-size:12.5px"><span>Enquire</span><svg class="ic"><use href="#i-arrow"/></svg></a>';
            tvRail.insertBefore(artTV, tvRail.firstChild);
          }
          if (tvGrid) {
            var artTVG = document.createElement('article');
            artTVG.className = 'prod-card';
            artTVG.setAttribute('data-cat', 'tv');
            artTVG.innerHTML = '<div class="p-thumb"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
              '<h4>' + p.name + '</h4>' +
              '<p class="kv">' + p.specs + '</p>' +
              '<a class="btn" href="contact.html?product=' + encodeURIComponent(p.name) + '"><span>Enquire Now</span><svg class="ic"><use href="#i-arrow"/></svg></a>';
            tvGrid.insertBefore(artTVG, tvGrid.firstChild);
          }
        }
      });
    }
  } catch(e) {}

  /* ---------- year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
