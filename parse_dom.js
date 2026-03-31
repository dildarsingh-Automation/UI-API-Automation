const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('modal_dom.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Helper to find elements by label and look at their structure
function analyzeDropdown(labelText) {
  console.log(`\n--- Analyzing Dropdown: ${labelText} ---`);
  
  // Find the label
  const labels = Array.from(document.querySelectorAll('label, div'));
  const targetLabel = labels.find(el => el.textContent && el.textContent.trim() === labelText);
  
  if (!targetLabel) {
    console.log(`Could not find label containing '${labelText}'`);
    return;
  }
  
  console.log(`Found label element: <${targetLabel.tagName.toLowerCase()} class="${targetLabel.className}">`);
  
  // Look at next siblings or parents
  let parent = targetLabel.parentElement;
  console.log(`Parent: <${parent.tagName.toLowerCase()} class="${parent.className}">`);
  console.log(`Parent HTML: ${parent.outerHTML}`);
}

analyzeDropdown('Faculty *');
analyzeDropdown('Program *');
analyzeDropdown('Category *');
analyzeDropdown('Batch *');
