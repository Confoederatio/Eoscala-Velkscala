//Initialise functions
{
  global.checkGlobalPopulation = function () {
    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      var local_population_sum = getImageSum(`${config.defines.common.output_file_paths.hyde_folder}popc_${getHYDEYearName(hyde_years[i])}_number.png`);

      console.log(`${hyde_years[i]} Global Population: ${parseNumber(local_population_sum)}`);
    } catch (e) {}
  };
}