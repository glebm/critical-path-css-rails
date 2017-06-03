const penthouse = require('penthouse');
const fs = require('fs');

const argOptions = JSON.parse(process.argv[2]);
const penthouseOptions = Object.assign({
  url: null, // required
  css: null, // required
  // OPTIONAL params
  width: 1300,                    // viewport width
  height: 900,                    // viewport height
  forceInclude: [                 // CSS selectors to always include, e.g.:
    //  '.keepMeEvenIfNotSeenInDom',
    //    /^\.regexWorksToo/
  ],
  timeout: 30000,                 // ms; abort critical CSS generation after this timeout
  strict: false,                  // set to true to throw on CSS errors (will run faster if no errors)
  maxEmbeddedBase64Length: 1000,  // characters; strip out inline base64 encoded resources larger than this
  userAgent: 'Penthouse Critical Path CSS Generator', // specify which user agent string when loading the page
  renderWaitTime: 100,            // ms; render wait timeout before CSS processing starts (default: 100)
  blockJSRequests: true,          // set to false to load (external) JS (default: true)
  phantomJsOptions: {             // see `phantomjs --help` for the list of all available options
    // 'proxy': 'http://proxy.company.com:8080',
    // 'ssl-protocol': 'SSLv3'
  },
  customPageHeaders: {
    'Accept-Encoding': 'identity' // add if getting compression errors like 'Data corrupted'
  }
}, argOptions);

const STDOUT_FD = 1;
const STDERR_FD = 2;

penthouse(penthouseOptions).then(function(criticalCss) {
  fs.writeSync(STDOUT_FD, criticalCss);
  fs.fsyncSync(STDOUT_FD);
}).catch(function(err) {
  fs.writeSync(STDERR_FD, err);
  fs.fsyncSync(STDERR_FD);
  process.exit(1);
});
