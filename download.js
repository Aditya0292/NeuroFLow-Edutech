const fs = require('fs');
const https = require('https');

const urls = [
  { name: 'screen1_landing.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzlmNGEzMGQ4ODllNjQyYjQ4OGZlZTQ4ZGFlODBkNzU5EgsSBxCF3MOgphAYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzU0Nzg5ODE5MTQyMTQ5MjM1&filename=&opi=89354086' },
  { name: 'screen2_game.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzEzMWJkYzQ4Njg3NzRiYzNhNGI5NWViNTAxMjVlNWI0EgsSBxCF3MOgphAYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzU0Nzg5ODE5MTQyMTQ5MjM1&filename=&opi=89354086' },
  { name: 'screen3_learning.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzcxMjMyZjNhYzI0NDQ2YjNiZjlhMzYxYzgwNzJlODFlEgsSBxCF3MOgphAYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzU0Nzg5ODE5MTQyMTQ5MjM1&filename=&opi=89354086' },
  { name: 'screen4_dashboard.html', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JkMzg3MjIxZTU1NzQzZmQ4NzM3M2M1NzdkY2IxNDE0EgsSBxCF3MOgphAYAZIBIwoKcHJvamVjdF9pZBIVQhM3NzU0Nzg5ODE5MTQyMTQ5MjM1&filename=&opi=89354086' }
];

urls.forEach(item => {
  https.get(item.url, (response) => {
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      fs.writeFileSync(item.name, data);
      console.log('Saved', item.name);
    });
  }).on('error', (err) => {
    console.error('Error fetching', item.name, err);
  });
});
