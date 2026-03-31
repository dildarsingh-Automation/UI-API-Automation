const fs = require('fs');
const state = JSON.parse(fs.readFileSync('storageState.json', 'utf8'));
const ls = state.origins.find(o => o.origin.includes('copilot-student.wowlabz.com')).localStorage;
const token = ls.find(i => i.name === 'access_token').value.replace(/^"|"$/g, '');

fetch('https://copilot-user-api.wowlabz.com/api/v1/student/get/mobile?mobile=9876543210', {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(console.error);
