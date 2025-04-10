//Initialise functions
{
  /**
   * getCountriesPopulations() - Gets the population for all countries at a specific year.
   * @param {number} [arg0_year] - The year to get the population for.
   * 
   * @returns {Object{"country_id": number}} - A dictionary of country IDs and their populations for the given year.
   */
  global.getCountriesPopulation = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Declare local instance variables
    var common_defines = config.defines.common;
    var hyde_population_file_path = `${common_defines.output_file_paths.hyde_folder}popc_${getHYDEYearName(year)}_number.png`;
    var world_bank_subdivisions_file_path = common_defines.input_file_paths.world_bank_subdivisions;
    var world_bank_subdivisions_image = loadWorldBankSubdivisions(world_bank_subdivisions_file_path);
    
    var return_obj = {};

    //Iterate over all pixels to sum up country populations based on HYDE statistics
    operateNumberRasterImage({
      file_path: hyde_population_file_path,
      function: function (arg0_index, arg1_number) {
        //Convert from parameters
        var local_index = arg0_index;
        var local_data = arg1_number;

        var local_country = getCountryObjectByRGB(getRGBAFromPixel(world_bank_subdivisions_image, local_index));

        if (local_country) {
          if (!local_country.population) local_country.population = {};
          modifyValue(local_country.population, year.toString(), local_data);
        }
      }
    });

    //Parse return_obj
    var all_countries_keys = Object.keys(main.countries);

    for (var i = 0; i < all_countries_keys.length; i++) {
      var local_country = main.countries[all_countries_keys[i]];

      try {
        return_obj[all_countries_keys[i]] = local_country.population[year.toString()];
      } catch (e) {}
    }
    
    //Return statement
    return return_obj;
  };

  /**
   * getCountryPopulations() - Gets the population for all countries at all years.
   * @param {Object} [arg0_options] 
   *  @param {boolean} [arg0_options.do_not_save=false] - Whether to not save the current DB to the default path.
   * 
   * @returns {Object}
   */
  global.getCountryPopulations = function (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      getCountriesPopulation(hyde_years[i]);
      log.info(`Fetching country populations for ${hyde_years[i]} ..`);
    } catch (e) {
      log.error(e);
    }

    //Write to DB if enabled
    if (!options.do_not_save) {
      FileManager.save();
      log.info(`getCountriesPopulations() - Saved current DB to default path.`);
    }

    //Return statement
    return main.countries;
  };
}
