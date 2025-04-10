//Initialise functions
{
  global.getHYDEYearName = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Return statement
    return `${Math.abs(year)}${(year >= 0) ? "AD" : "BC"}`;
  };
}
