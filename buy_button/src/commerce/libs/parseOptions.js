export default (options) => {
  return options.split(';').reduce(function (options, option) {
    var ref = option.split(/:(.+)/);
    var key = ref[0];
    var value = ref[1];
    if (key && value) {
        options[key.trim()] = value.trim();
    }
    return options;
  }, {})
}
