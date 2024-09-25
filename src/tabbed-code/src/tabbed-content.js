function openTab(tabName, tabContainerSelector) {
   const tabs = document.querySelectorAll(`${tabContainerSelector} > .tab`);
   tabs.forEach((tab) => {
      tab.classList.remove("active");
   });

   const activeTab = document.getElementById(`${tabName}`);
   activeTab.classList.add("active");

   const buttons = document.querySelectorAll(`${tabContainerSelector} button`);
   buttons.forEach((button) => {
      button.classList.remove("active");
   });

   const activeButton = document.getElementById(`${tabName}-button`);
   activeButton.classList.add("active");
}

document.addEventListener("DOMContentLoaded", function () {
   function extractSections(groups, element) {
      var sections = [];
      var sectionId = "";

      for (let i = 0; i < element.children.length; i++) {
         const child = element.children[i];
         if (
            child.tagName.toLowerCase() === "pre" &&
            isPreTagElementPresent(sections, child)
         ) {
            continue;
         }

         const anchorTags = child.querySelectorAll("a");
         const tabAnchorTags = Array.from(anchorTags).filter(
            (anchor) =>
               anchor.getAttribute("href") &&
               anchor.getAttribute("href").startsWith("#tab")
         );

         if (
            tabAnchorTags.length === 1 &&
            sectionId != tabAnchorTags[0].getAttribute("href") &&
            sections.length != 0
         ) {
            groups.push(sections);
            sections = [];
            sectionId = "";
         }

         if (
            child.tagName.toLowerCase().startsWith("h") &&
            tabAnchorTags.length === 1 &&
            (sectionId === "" ||
               sectionId == tabAnchorTags[0].getAttribute("href"))
         ) {
            const headerTag = child;
            const preTag = getNextSibling(child, "pre");
            // Add section object to the sections array
            sections.push({
               headertag: headerTag,
               pretag: preTag,
            });
            sectionId = tabAnchorTags[0].getAttribute("href");
         } else {
            if (sections.length != 0) {
               groups.push(sections);
               sections = [];
               sectionId = "";
            }
         }
      }
      if (sections.length != 0) {
         groups.push(sections);
         sections = [];
      }

      return groups;
   }

   function isPreTagElementPresent(array, targetElement) {
      for (let i = 0; i < array.length; i++) {
         if (array[i].pretag === targetElement) {
            return true;
         }
      }
      return false;
   }

   function getNextSibling(element, startsWithMatch) {
      let nextSibling = element.nextElementSibling;
      if (
         nextSibling &&
         nextSibling.tagName.toLowerCase().startsWith(startsWithMatch)
      ) {
         return nextSibling;
      }

      return null;
   }

   function getTabContainer(i) {
      const tabContainer = document.createElement("div");
      tabContainer.classList.add("tab-container", `tab-container-${i}`);
      return tabContainer;
   }

   function applyTabs(tabContainer, group, i) {
      const tabButtons = document.createElement("div");
      tabButtons.classList.add("tab-buttons", `tab-buttons-${i}`);
      var buttonHtml = "";
      for (let y = 0; y < group.length; y++) {
         var headerElement = group[y].headertag;
         var isActive = y == 0 ? "active" : "";
         buttonHtml += `<button id="tab${i}-${y}-button" onclick="openTab('tab${i}-${y}', '.tab-container-${i}')" class="tab-button ${isActive}">${headerElement.innerText}</button>`;
      }
      tabButtons.innerHTML = buttonHtml;
      tabContainer.appendChild(tabButtons);
   }

   function applyTabContent(tabContainer, group, i) {
      for (let y = 0; y < group.length; y++) {
         var preElement = group[y].pretag;
         const tab = document.createElement("div");
         tab.id = `tab${i}-${y}`;
         tab.classList.add("tab", "tab-content");
         if (y == 0) {
            tab.classList.add("active");
         }
         tab.innerHTML = preElement.outerHTML;
         tabContainer.appendChild(tab);
      }
   }

   function replaceOldElements(tabContainer, group) {
      var parentElement = group[0].headertag.parentNode;
      parentElement.replaceChild(tabContainer, group[0].headertag);
      for (let y = 0; y < group.length; y++) {
         var preElement = group[y].pretag;
         var headerElement = group[y].headertag;
         preElement.remove();
         headerElement.remove();
      }
   }

   function replaceWithTabs() {
      const rootElement = document.querySelector(".gh-content");

      const groups = [];
      const result = extractSections(groups, rootElement);

      for (let i = 0; i < result.length; i++) {
         var group = result[i];

         const tabContainer = getTabContainer(i);
         applyTabs(tabContainer, group, i);
         applyTabContent(tabContainer, group, i);
         replaceOldElements(tabContainer, group);
      }
   }

   setTimeout(replaceWithTabs, 1000);
});
