function openTab(tabName, tabContainerSelector) {
    const tabs = document.querySelectorAll(`${tabContainerSelector} > .tab`);
    tabs.forEach(tab => {
      tab.classList.remove('active');
    });
  
    const activeTab = document.getElementById(`${tabName}`);
    activeTab.classList.add('active');
  
    const buttons = document.querySelectorAll(`${tabContainerSelector} button`);
    buttons.forEach(button => {
      button.classList.remove('active');
    });
  
    const activeButton = document.getElementById(`${tabName}-button`);
    activeButton.classList.add('active');
  }
  
  document.addEventListener('DOMContentLoaded', function() {
      function isPreTagElementPresent(array, targetElement) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].pretag === targetElement) {
            return true;
            }
        }
        return false;
      }
  
      function extractSections(groups, element) {
          var sections = [];
        
          // Iterate through child nodes of the current element
          for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
                  
            // Check if the child is an <h> tag with an <a> child
            if (child.tagName.toLowerCase().startsWith('h') && child.querySelector('a')) {
              const headerTag = child;
              const preTag = getNextSibling(child, 'pre');  
  
              // Add section object to the sections array
              sections.push({
                headertag: headerTag,
                pretag: preTag,
              });
            }
            else if(child.tagName.toLowerCase() === 'pre' && isPreTagElementPresent(sections, child)) {
              
            }
            else {
              if(sections.length != 0){
                groups.push(sections)
                sections = []
              }
            }
        
          //   // Recursively call the function for nested sections
          //   if (child.children.length > 0) {
          //     const nestedSections = extractSections(child);
          //     if (nestedSections.length > 0) {
          //       sections.push({ sections: nestedSections });
          //     }
          //   }
          }
          if(sections.length != 0){
            groups.push(sections)
            sections = []
          }
        
          return groups;
        }
        
        function getNextSibling(element, startsWithMatch) {
          let nextSibling = element.nextElementSibling;
        
          // Find the next sibling that is a <pre> tag
          if (nextSibling && nextSibling.tagName.toLowerCase().startsWith(startsWithMatch)) {
            return nextSibling;
          }
        
          return null;
        }
  
        function doTabs(){
  
          // Get the root element to start the extraction (replace 'your-selector' with your actual selector)
          const rootElement = document.querySelector('.gh-content');
          
          const groups = [];
          // Call the function to extract sections recursively
          const result = extractSections(groups, rootElement);
          
          for (let i = 0; i < result.length; i++) {
            var group = result[i]
  
            const tabContainer = document.createElement('div')
            tabContainer.classList.add('tab-container', `tab-container-${i}`)
            
            const tabButtons = document.createElement('div');
            // div.id = `${tabId}Tab`;
            tabButtons.classList.add('tab-buttons', `tab-buttons-${i}`);
            var buttonHtml = ''
            for (let y = 0; y < group.length; y++) {
              var headerElement = group[y].headertag;
              var isActive = y == 0 ? 'active' : ''
              buttonHtml += `<button id="tab${i}-${y}-button" onclick="openTab('tab${i}-${y}', '.tab-container-${i}')" class="tab-button ${isActive}">${headerElement.innerText}</button>`
            }
            tabButtons.innerHTML = buttonHtml
            tabContainer.appendChild(tabButtons)
            for (let y = 0; y < group.length; y++) {    
              var preElement = group[y].pretag;  
              var isActive = y == 0 ? 'active' : ''    
              const tab = document.createElement('div');  
              tab.id = `tab${i}-${y}`              
              tab.classList.add('tab', 'tab-content');
              if(y == 0){
                tab.classList.add('active');
              }
  
              tab.innerHTML = preElement.outerHTML;
              tabContainer.appendChild(tab)
            }          
            
            var parentElement = group[0].headertag.parentNode;
            parentElement.replaceChild(tabContainer, group[0].headertag);
            for (let y = 0; y < group.length; y++) {    
              var preElement = group[y].pretag;   
              var headerElement = group[y].headertag;  
              preElement.remove();
              headerElement.remove();
            }
          }
        }     
  
        setTimeout(() => doTabs(), 1000)
  });