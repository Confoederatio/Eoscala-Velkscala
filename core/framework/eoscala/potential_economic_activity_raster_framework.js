//Initialise functions
{
  global.eoscalaGeneratePotentialEconomicActivityRaster = function (arg0_year, arg1_output_file_path) {
    //Convert from parameters
    var year = parseInt(arg0_year);
    var output_file_path = (arg1_output_file_path) ? arg1_output_file_path : `${config.defines.common.output_file_paths.OLS_potential_economic_activity_prefix}${year}${config.defines.common.output_file_paths.OLS_potential_economic_activity_suffix}`;

    //Declare local instance variables
    var hyde_dictionary = config.velkscala.hyde.hyde_dictionary;
    var processed_model = FileManager.loadFileAsJSON(config.defines.common.output_file_paths.OLS_potential_economic_activity_weights);

    var all_hyde_keys = Object.keys(hyde_dictionary);
    var coefficients = processed_model.coefficients;
    var hyde_images = {};
    var valid_hyde_keys = [];

    //Iterate over all_hyde_keys
    log.info(`Generating projected GDP (PPP, Intl. 2000$) raster based on HYDE-SEDAC Processed Model for ${getHYDEYearName(year)} ..`);
    for (var i = 0; i < all_hyde_keys.length; i++) try {
      hyde_images[all_hyde_keys[i]] = loadNumberRasterImage(`${config.defines.common.output_file_paths.hyde_folder}${all_hyde_keys[i]}${getHYDEYearName(year)}_number.png`);
      valid_hyde_keys.push(all_hyde_keys[i]);
      log.info(`- Loaded ${all_hyde_keys[i]} into memory.`);
    } catch (e) {
      log.warn(`- Failed to load ${all_hyde_keys[i]} into memory.`);
    }

    log.info(`- Processing predicted GDP (PPP, Intl. 2000$) for ${year} ..`);
    saveNumberRasterImage({
      file_path: output_file_path,
      height: hyde_images[valid_hyde_keys[0]].height,
      width: hyde_images[valid_hyde_keys[0]].width,
      function: function (arg0_index) {
        //Convert from parameters
        var index = arg0_index;
        var predicted_value = 0;

        //Compute predicted value based on HYDE stocks and coefficients
        for (var i = 0; i < valid_hyde_keys.length; i++) {
          var key = valid_hyde_keys[i];
          
          var coefficient = returnSafeNumber(coefficients[key], 1);
          var hyde_value = returnSafeNumber(hyde_images[key].data[index]);
          var weighted_contribution = hyde_value*coefficient;
          
          //Predicted value should be 0 if popc_ is 0, since uninhabited areas have no economic activity
          if (key == "popc_")
            if (hyde_value == 0) {
              predicted_value = undefined;
              break;
            }

          predicted_value += weighted_contribution;
        }

        //Return statement
        if (predicted_value)
          return predicted_value;
      }
    });

    log.info(`- File written to ${output_file_path}.`);
  }

  global.eoscalaGeneratePotentialEconomicActivityRasters = function () {
    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      log.info(`Generating HYDE-SEDAC Processed Model Rasters (${i}/${hyde_years.length}) ..`);
      eoscalaGeneratePotentialEconomicActivityRaster(hyde_years[i]);
    } catch (e) {
      log.info(e);
    }
  };
}
