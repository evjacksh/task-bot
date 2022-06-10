module.exports = {
  apps : [{
    name: 'task-bot',
    script: 'index.mjs',
    watch: '.',
    node_args: ['--inspect=false']
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'multibran2',
      host : '77.222.61.35',
      ref  : 'origin/master',
      repo : 'https://github.com/evjacksh/task-bot.git',
      path : '.home/t_multibrand_msk_ru/public_html/task-bot',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
