function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);

  if (!targetElement) return;

  targetElement.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

export default function runNavigation(action) {
  if (action === "work") {
    scrollToSection("recent-work");
    return;
  }

  if (action === "about") {
    window.dispatchEvent(new CustomEvent("openAboutMe"));
    return;
  }

  if (action === "research") {
    window.dispatchEvent(new CustomEvent("openResearchSection"));
    return;
  }

  if (action === "case-studies") {
    window.dispatchEvent(new CustomEvent("openCaseStudies"));
    return;
  }

  if (action === "side-quests") {
    scrollToSection("side-quests");
    return;
  }

  if (action === "contact") {
    window.dispatchEvent(new CustomEvent("openContactPopup"));
  }
}
