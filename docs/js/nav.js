// In-page navigatie.
//
// De links in de header dragen echte href="#id"-waarden, zodat ze werken
// zonder JavaScript en vindbaar zijn voor zoekmachines. Dit script voegt
// alleen het vloeiend scrollen toe en sluit het mobiele menu.
//
// Twee eigenaardigheden van deze pagina bepalen de aanpak hieronder:
//   1. Door html{overflow:hidden} + body{overflow:auto} scrollt body zelf.
//      De ingebouwde smooth-scroll van de browser animeert die scroller niet
//      (scrollIntoView, scrollTo en scroll-behavior:smooth doen er niets),
//      dus animeren we met de hand via requestAnimationFrame.
//   2. Het mobiele menu is een modale <dialog>. Zolang die openstaat is
//      scrollen geblokkeerd, dus die moet eerst dicht. dialog.close() alleen
//      is niet genoeg: <el-dialog> zet het open-attribuut terug.

var SCROLL_DURATION = 500;

function close_mobile_menu() {
  var dialog = document.getElementById("mobile-menu");
  if (!dialog || !dialog.hasAttribute("open")) return;
  try {
    dialog.close();
  } catch (error) {
    /* dialog was al gesloten */
  }
  dialog.removeAttribute("open");
}

function scroll_to_element(element) {
  var scroller = document.body;
  var max = scroller.scrollHeight - scroller.clientHeight;
  var target = Math.max(0, Math.min(element.offsetTop, max));
  var start = scroller.scrollTop;
  var distance = target - start;
  if (distance === 0) return;

  // Spring direct naar het doel wanneer animeren niet kan of niet gewenst is.
  // In een verborgen tab staat requestAnimationFrame stil, dus zonder deze
  // controle zou er helemaal niet gescrold worden.
  var reduce_motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce_motion || document.visibilityState === "hidden" ||
      typeof requestAnimationFrame !== "function") {
    scroller.scrollTop = target;
    return;
  }

  var begin = null;
  function step(now) {
    if (begin === null) begin = now;
    var t = Math.min((now - begin) / SCROLL_DURATION, 1);
    // easeInOutCubic
    var eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    scroller.scrollTop = start + distance * eased;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.addEventListener("click", function (event) {
  var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
  if (!link) return;

  var id = link.getAttribute("href").slice(1);
  var element = id ? document.getElementById(id) : null;
  if (!element) return;

  event.preventDefault();
  close_mobile_menu();
  scroll_to_element(element);
  history.replaceState(null, "", "#" + id);
});
