//Initialise functions
{
  global.handleCommandLine = function (arg0_args) {
    //Convert from parameters
    var arg = arg0_args;

    //Parse arg
    if (equalsIgnoreCase(arg[0], "console")) {
      var full_code = [];
      for (var i = 1; i < arg.length; i++)
        full_code.push(arg[i]);

      try {
        console.log(eval(full_code.join(" ")));
      } catch (e) {
        console.error(e);
      }
    } else {
      
    }
  }
}
