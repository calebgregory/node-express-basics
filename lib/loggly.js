var loggly = require('loggly');

// we can use loggly's api to send logs from multiple servers to loggly,
// which assembles these into a comprehensible whole
function logger(tag) {
  var client = loggly.createClient({
    token     : process.env.LOGGLY_TOKEN,
    subdomain : 'calebgregory',
    tags      : ['NodeJS', tag],
    json      : true
  });

  return client;
}

module.exports = logger;
