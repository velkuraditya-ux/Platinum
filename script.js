(function () {
  "use strict";

  // ---- Sticky header shadow ----
  var header = document.querySelector("header.site");
  var toTop = document.querySelector(".to-top");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 700);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- Mobile nav ----
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---- Year ----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Contact form -> mailto (no backend) ----
  var form = document.getElementById("quote-form");
  var status = document.getElementById("form-status");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var phone = form.elements["phone"].value.trim();
      var service = form.elements["service"].value;
      var message = form.elements["message"].value.trim();

      if (!name || !email || !message) {
        if (status) {
          status.textContent = "Please fill in your name, email, and a short message.";
          status.className = "form-status show";
        }
        return;
      }

      var subject = "Free Quote Request — " + (service || "General Inquiry");
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + (phone || "-") + "\n" +
        "Service: " + (service || "-") + "\n\n" +
        "Message:\n" + message;

      var mailto =
        "mailto:info@platinumcontractorscorp.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      if (status) {
        status.textContent = "Opening your email app to send this request to Platinum Contractors Corp…";
        status.className = "form-status show ok";
      }
    });
  }
})();
