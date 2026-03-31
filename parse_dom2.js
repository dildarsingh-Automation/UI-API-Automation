const fs = require('fs');

const html = fs.readFileSync('modal_dom.html', 'utf-8');

function extractDropdownContext(labelName) {
  console.log(`\n\n=== Context for ${labelName} ===`);
  const regex = new RegExp(`(<[^>]+>[\\s\\n]*${labelName.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&')}[\\s\\n]*<\\/[^>]+>)`, 'i');
  
  const match = html.match(regex);
  if (match) {
    const index = match.index;
    const preContext = html.substring(Math.max(0, index - 500), index);
    const postContext = html.substring(index, Math.min(html.length, index + 1500));
    console.log(preContext + postContext);
  } else {
    console.log('Not found via regex.');
  }
}

['Faculty *', 'Program *', 'Category *', 'Batch *', 'Description *', 'Create Generic Discussion'].forEach(extractDropdownContext);
