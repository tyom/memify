const validator = require('validator');

function isValidUrl(url) {
  return validator.isURL(url, {
    require_tld: true,
    require_protocol: true,
  });
}

module.exports = {
  isValidUrl
};
