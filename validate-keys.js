const en = require('./src/i18n/en.json');
const th = require('./src/i18n/th.json');

function getKeys(obj, prefix) {
  prefix = prefix || '';
  var keys = [];
  for (var key of Object.keys(obj)) {
    var fullKey = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

var enKeys = getKeys(en);
var thKeys = getKeys(th);

var missingInTh = enKeys.filter(function(k) { return thKeys.indexOf(k) === -1; });
var extraInTh = thKeys.filter(function(k) { return enKeys.indexOf(k) === -1; });

console.log('EN keys count:', enKeys.length);
console.log('TH keys count:', thKeys.length);

if (missingInTh.length > 0) {
  console.log('\nMissing in TH (present in EN):');
  missingInTh.forEach(function(k) { console.log('  -', k); });
}

if (extraInTh.length > 0) {
  console.log('\nExtra in TH (not in EN):');
  extraInTh.forEach(function(k) { console.log('  -', k); });
}

if (missingInTh.length === 0 && extraInTh.length === 0) {
  console.log('\nKeys match perfectly!');
}
