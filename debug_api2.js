const fs = require('fs');
const state = JSON.parse(fs.readFileSync('storageState.json', 'utf8'));
const ls = state.origins.find(o => o.origin.includes('copilot-student.wowlabz.com')).localStorage;
const token = ls.find(i => i.name === 'access_token').value.replace(/^"|"$/g, '');

const run = async () => {
  const invalid = await fetch('https://copilot-user-api.wowlabz.com/api/v1/student/get/mobile?mobile=0000000000', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json());
  console.log("INVALID:", invalid);
  
  const empty = await fetch('https://copilot-user-api.wowlabz.com/api/v1/student/get/mobile', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json());
  console.log("EMPTY:", empty);
}
run().catch(console.error);
