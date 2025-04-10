//Initialise functions
{
  /**
   * calculatePotentialEconomicActivityGeomean() - Calculates intermediate model geomeans for HYDE-SEDAC. Not the processed SEDAC-adjusted model
   * @param {String} arg0_prefix - The prefix to use for saving base model output files.
   * 
   * @returns {Object}
  **/
  global.calculatePotentialEconomicActivityGeomean = function (arg0_prefix) {
    //Convert from parameters
    var prefix = (arg0_prefix) ? arg0_prefix : `base_model_`;

    //Declare local instance variables
    var all_coefficients = {};
    var base_model_folder_path = config.defines.common.output_file_paths.OLS_potential_economic_activity_folder;
    var raw_coefficients = {};

    //Read all JSON files in directory
    var all_input_files = FileManager.getAllFiles(base_model_folder_path);

    //Iterate over all_input_files
    for (var i = 0; i < all_input_files.length; i++)
      if (all_input_files[i].endsWith(".json")) {
        var local_split_path = all_input_files[i].split("\\");
        var local_file_name = local_split_path[local_split_path.length - 1];

        if (local_file_name.startsWith(prefix)) {
          var rawdata = JSON.parse(fs.readFileSync(all_input_files[i], "utf8"));

          //Extract coefficients
          var { coefficients } = rawdata;

          //Aggregate coefficients for geometric mean calculation
          for (var key in coefficients) {
            if (!all_coefficients[key])
              all_coefficients[key] = [];
            if (!raw_coefficients[key])
              raw_coefficients[key] = [];
            all_coefficients[key].push(coefficients[key]);
            raw_coefficients[key].push(coefficients[key]);
          }
        }
      }

    //Iterate over all coefficients; Compute geometric mean for each coefficient
    var hybrid_coefficients = {};
    
    for (var key in all_coefficients)
      hybrid_coefficients[key] = weightedGeometricMean(all_coefficients[key]);

    var output_data = { coefficients: hybrid_coefficients, raw_coefficients: raw_coefficients };
    var output_path = `${config.defines.common.output_file_paths.OLS_potential_economic_activity_folder}geomean_${prefix.split('_').join(" ").trim().split(" ").join("_")}.json`;

    fs.writeFileSync(output_path, JSON.stringify(output_data, null, 2));
    log.info(`HYDE-SEDAC weighted geometric mean calculated and saved at ${output_path}.`);

    //Return statement
    return output_data;
  };
  
  /**
   * getEoscalaPotentialEconomicActivityTotalGDP_PPP() - Gets the total GDP (PPP, Intl. 2000$) for a given year
   * @param {number} arg0_year - The year to get the potential economic activity for.
   * 
   * @returns {number}
  **/
  global.getEoscalaPotentialEconomicActivityTotalGDP_PPP = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Declare local instance variables
    var input_file_path = `${config.defines.common.output_file_paths.OLS_potential_economic_activity_prefix}${year}_number.png`;
    var total_gdp_ppp = 0;

    var gdp_image_data = loadNumberRasterImage(input_file_path);

    for (var i = 0; i < gdp_image_data.data.length; i++)
      total_gdp_ppp += gdp_image_data.data[i];

    //Return statement
    return total_gdp_ppp;
  };

  /**
    loadHYDESEDACYear() - Loads HYDE-SEDAC data from raster files in ./output/ and uses them for OLS training
    @param {number} arg0_year - The year to load HYDE-SEDAC data for.

    @returns {X: number, Y: number}
  **/
  global.loadHYDESEDACYear = async function (arg0_year) {
      //Convert from parameters
      var year = parseInt(arg0_year);

      //Declare local instance variables
      var hyde_data = [];
      var hyde_dictionary = config.velkscala.hyde.hyde_dictionary;
      var sedac_data = loadNumberRasterImage(`${config.defines.common.output_file_prefix}${year}_number.png`).data;

      //Iterate over all hyde stocks; load each HYDE variable as a predictor
      var all_hyde_keys = Object.keys(hyde_dictionary);

      for (var key of all_hyde_keys) {
        var local_file_path = `${config.defines.common.output_file_paths.hyde_folder}${key}${getHYDEYearName(year)}_number.png`;
        var local_rawdata = loadNumberRasterImage(local_file_path).data;

        hyde_data.push(local_rawdata);
      }

      //Tranpose HYDE data to match format [samples, features];
      var X = hyde_data[0].map((_, i) => hyde_data.map((row) => row[i]));
      var Y = sedac_data.map((y) => [y]);

      //Return statement
      return { X, Y };
  };

  /**
    trainPotentialEconomicActivityModel() - Trains adjusted, stabler HYDE-SEDAC OLS model with full dynamic lambda Ridge Regression.
    @param {number} arg0_year - The year to use for training the model.
    @param {Object} [arg1_options]
     @param {boolean} [arg1_options.remove_high_vif_features=false] - Whether to remove high VIF features.
     @param {boolean} [arg1_options.dynamic_lambda=false] - Whether to dynamically select lambda based on condition number for Ridge Regression purposes.
  **/
  global.trainPotentialEconomicActivityModel = async function (arg0_year, arg1_options) {
    //Convert from parameters
    var year = parseInt(arg0_year);
    var options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    var hyde_dictionary = config.velkscala.hyde.hyde_dictionary;
    var { X, Y } = await loadHYDESEDACYear(year);

    var all_hyde_keys = Object.keys(hyde_dictionary);

    log.info(`Performing OLS for ${year} ..`);

    //1. Remove multicolinear features using VIF selection if possible
    if (options.remove_high_vif_features) {
      X = removeHighVIFFeatures(X, 10);
      log.info(`- Removed High VIF Features.`);
    }

    //2. Apply Ridge Regression to stabilise coefficients
    var selected_lambda = 1e9; //The condition_number is always so large that it is always 1e9 anyway
    var X_matrix = mathjs.matrix(X);
    var Y_matrix = mathjs.matrix(Y);
    log.info(`- Computed preliminary matrices.`);

    if (options.dynamic_lambda) {
      var condition_number = conditionNumber(X_matrix);
      if (condition_number > 1e6) selected_lambda = 1e9;
        else if (condition_number > 1e4) selected_lambda = 1e7;
        else if (condition_number > 1e2) selected_lambda = 1e5;
        else selected_lambda = 1e3; //Minimum regularisation
    }

    log.info(`- Condition Number: ${condition_number}, using Lambda = ${selected_lambda}`);

    var beta = ridgeRegression(X_matrix, Y_matrix, selected_lambda); //Small lambda for stabilisation
    log.info(`- Applied Ridge Regression to stabilise coefficients.`);

    //3. Convert coefficients to JSON
    var coefficients = beta.toArray().flat();
    log.info(`- Computed coefficients.`);

    //Save model to JSON
    var model_data_obj = {
      year: year,
      coefficients: Object.fromEntries(all_hyde_keys.map((key, i) => [key, coefficients[i]]))
    };
    var output_file_path = `${config.defines.common.output_file_paths.OLS_potential_economic_activity_folder}base_adjusted_model_${year}.json`;

    fs.writeFileSync(output_file_path, JSON.stringify(model_data_obj, null, 2));
    log.info(`Adjusted model data for ${year} saved successfully in ${output_file_path}.`);
  };

  /**
    trainPotentialEconomicActivityProcessedModel() - Trains the adjusted processed model by iterating over all HYDE-SEDAC years and finding the weighted geomean global scalar for all coefficients
    @param {Object} [arg0_options]
     @param {boolean} [arg0_options.debug=false] - Whether to print debug information.
  **/
  global.trainPotentialEconomicActivityProcessedModel = async function (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Initialise objects
    if (!main.models.hyde_sedac) main.models.hyde_sedac = {};
      if (!main.models.hyde_sedac.processed_model) main.models.hyde_sedac.processed_model = {};
    try {
      calculatePotentialEconomicActivityGeomean(`base_adjusted_model_`)
    } catch (e) { console.error(e); }

    //Declare local instance variables
    var hyde_dictionary = config.velkscala.hyde.hyde_dictionary;
    var processed_model = FileManager.loadFileAsJSON(`${config.defines.common.output_file_paths.OLS_potential_economic_activity_folder}geomean_base_adjusted_model.json`);
    var sedac_years = main.sedac_domain[1] - main.sedac_domain[0];

    var all_hyde_keys = Object.keys(hyde_dictionary);

    //Ensure all coefficients are positive
    var all_coefficients = Object.keys(processed_model.coefficients);

    for (var i = 0; i < all_coefficients.length; i++)
      processed_model.coefficients[all_coefficients[i]] = Math.abs(processed_model.coefficients[all_coefficients[i]]);

    //Iterate over all SEDAC files
    for (var i = 0; i <= sedac_years; i++) try {
      var local_year = main.sedac_domain[0] + i;
      log.info(`Processing HYDE-SEDAC geomean base adjusted model for ${local_year} ..`);

      var local_file_path = `${config.defines.common.output_file_paths.sedac_prefix}${local_year}_number.png`;
      var local_hyde_images = {}; //Maps image data to hyde stocks
      var total_logs = {};
      var valid_hyde_keys = [];
      all_hyde_keys.forEach((key) => {
        log.info(`- Processing HYDE key: ${key} ..`);
        try {
          local_hyde_images[key] = loadNumberRasterImage(`${config.defines.common.output_file_paths.hyde_folder}${key}${getHYDEYearName(local_year)}_number.png`);;
          valid_hyde_keys.push(key);
        } catch (e) {
          console.warn(`- [WARN] Missing HYDE raster for ${key} in ${local_year}. Filtering out key.`);
        }
      });
      var local_sedac_image = loadNumberRasterImage(local_file_path);

      //Guard clause if no valid_hyde_keys present
      if (valid_hyde_keys.length == 0) {
        console.warn(`- [WARN] No HYDE keys for this year! Skipping year.`);
        continue;
      }

      //Iterate over all pixels
      log.info(`- Processing weights (bidirectional weighted average adjustment) ..`)
      for (var x = 0; x < local_sedac_image.width*local_sedac_image.height; x++) {
        //Compute predicted_value based on HYDE stocks
        var predicted_value = 0;
        var weights = {};
        var total_weight = 0;

        valid_hyde_keys.forEach((key) => {
          var hyde_value = returnSafeNumber(local_hyde_images[key].data[x]);

          var coefficient = returnSafeNumber(processed_model.coefficients[key], 1);
          var weighted_contribution = hyde_value*coefficient;

          predicted_value += weighted_contribution;
          weights[key] = hyde_value;
          total_weight += hyde_value;

          if (options.debug)
            if (hyde_value > 0 && returnSafeNumber(total_logs[key]) < 100)
              log.info(`- HYDE: Pixel ${x}: ${key}: Hyde value: ${hyde_value}, Coefficient: ${coefficient}, Weighted contribution: ${weighted_contribution}`);
        });

        var observed_value = returnSafeNumber(local_sedac_image.data[x], 0);
        var residual = observed_value - predicted_value;
        var correction_factor = residual/predicted_value;

        //Adjust coefficients proportionally based on each category's weight in that pixel
        if (total_weight > 0)
          valid_hyde_keys.forEach((key) => {
            var hyde_value = weights[key];
              if (hyde_value == 0) return; //Skip if hyde_value is 0
            var local_coefficient = processed_model.coefficients[key];
            var weight_fraction = hyde_value/total_weight;

            var update_amount = processed_model.coefficients[key]*correction_factor*weight_fraction;

            if (!(correction_factor < 0 && local_coefficient < 1)) {
              if (options.debug)
                if (returnSafeNumber(total_logs[key]) < 100) {
                  modifyValue(total_logs, key, 1);
                  log.info(`- SEDAC Adj: Pixel ${x}: ${key}, Update Amount: ${update_amount}, Weight Fraction: ${weight_fraction}, Residual: ${residual}, Correction Factor: ${correction_factor}`);
                }
              processed_model.coefficients[key] += returnSafeNumber(update_amount); //Apply the correction weighted by category presence
            }
          });
      }

      log.info(`- New coefficients:`, processed_model.coefficients);
    } catch (e) {
      log.error(`trainPotentialEconomicActivityProcessedModel(): Error when parsing ${main.sedac_domain[0] + i}:`);
      console.error(e);
    }

    //Save adjusted coefficients
    main.models.hyde_sedac.processed_model = processed_model;

    var output_file_path = `${config.defines.common.output_file_paths.OLS_potential_economic_activity_folder}processed_base_model.json`;
    fs.writeFileSync(output_file_path, JSON.stringify(processed_model, null, 2));
  };

  global.trainPotentialEconomicActivityModels = async function () {
    //Declare local instance variables
    var sedac_years = main.sedac_domain[1] - main.sedac_domain[0];

    //Iterate over all sedac_years; include end year
    for (var i = 0; i < sedac_years + 1; i++)
      await trainPotentialEconomicActivityModel(main.sedac_domain[0] + i);
  };
}
