// China Survival Chinese · audio player. Tap a line to play it; "Play all" runs the main lines in order.
(function () {
  var au = document.getElementById("au"), dir = window.AUDIO_DIR || "";
  var lines = [].slice.call(document.querySelectorAll(".ln"));
  var main = [].slice.call(document.querySelectorAll("ol.main .ln"));
  var allBtn = document.getElementById("all");
  var slow = false, queue = [], current = null;
  try { slow = localStorage.getItem("csc-speed") === "s"; } catch (e) {}

  function setSpeed(s) {
    slow = s;
    document.querySelectorAll(".speed button").forEach(function (b) {
      b.setAttribute("aria-pressed", String((b.dataset.sp === "s") === slow));
    });
    try { localStorage.setItem("csc-speed", slow ? "s" : "n"); } catch (e) {}
  }
  function mark(li) {
    lines.forEach(function (x) { x.classList.toggle("on", x === li); });
    current = li;
  }
  function play(li) {
    au.src = dir + (slow ? li.dataset.s : li.dataset.n);
    mark(li);
    var p = au.play();
    if (p && p.catch) p.catch(function () { li.classList.add("miss"); next(); });
  }
  function next() {
    if (queue.length) { setTimeout(function () { play(queue.shift()); }, 600); }
    else { mark(null); allBtn && allBtn.setAttribute("aria-pressed", "false"); }
  }
  function stop() { queue = []; au.pause(); mark(null); allBtn && allBtn.setAttribute("aria-pressed", "false"); }

  au.addEventListener("ended", next);
  au.addEventListener("error", function () { if (current) current.classList.add("miss"); next(); });

  lines.forEach(function (li) {
    li.querySelector(".play").addEventListener("click", function () {
      if (current === li && !au.paused) { stop(); return; }
      queue = []; allBtn && allBtn.setAttribute("aria-pressed", "false"); play(li);
    });
    li.querySelector(".tx").addEventListener("click", function () { li.querySelector(".play").click(); });
  });
  if (allBtn) allBtn.addEventListener("click", function () {
    if (allBtn.getAttribute("aria-pressed") === "true") { stop(); return; }
    allBtn.setAttribute("aria-pressed", "true");
    queue = main.slice(); play(queue.shift());
  });
  document.querySelectorAll(".speed button").forEach(function (b) {
    b.addEventListener("click", function () { setSpeed(b.dataset.sp === "s"); });
  });
  setSpeed(slow);
})();
