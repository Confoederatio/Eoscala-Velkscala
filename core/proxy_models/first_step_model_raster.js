//Initialise functions
{
  global.generateFirstStepModelRaster = function (arg0_year, arg1_output_file_path) {
    //Convert from parameters
    var year = parseInt(arg0_year);
    var output_file_path = (arg1_output_file_path) ? arg1_output_file_path : `./output/OLS_base_model_png/OLS_base_model_${year}_number.png`;

    //Declare local instance variables
    var hyde_dictionary = getHYDEDictionary();
    var processed_model = FileManager.loadFileAsJSON(`./output/OLS_base_model_data/processed_base_model.json`);

    var all_hyde_keys = Object.keys(hyde_dictionary);
    var coefficients = processed_model.coefficients;
    var hyde_images = {};
    var valid_hyde_keys = [];

    console.log(`Generating projected GDP (PPP, Intl. 2000$) raster based on HYDE-SEDAC Processed Model for ${year} ..`);
    for (var i = 0; i < all_hyde_keys.length; i++) try {
      hyde_images[all_hyde_keys[i]] = loadNumberRasterImage(`./output/HYDE_png/${all_hyde_keys[i]}${Math.abs(year)}${(year >= 0) ? "AD" : "BC"}_number.png`);
      valid_hyde_keys.push(all_hyde_keys[i]);
      console.log(`- Loaded ${all_hyde_keys[i]} into memory.`);
    } catch (e) {
      console.warn()
    }

    //Initialise an empty array for storing predictions
    var height = hyde_images[valid_hyde_keys[0]].height;
    var width = hyde_images[valid_hyde_keys[0]].width;
    var predicted_data = new Array(width*height).fill(0);

    console.log(`- Processing predicted GDP (PPP, Intl. 2000$) for ${year} ..`);
    var png = new pngjs.PNG({ width: width, height: height, filterType: -1 });

    //Iterate over all pixels
    for (var i = 0; i < height; i++)
      for (var x = 0; x < width; x++) {
        var local_index = (i*width + x)*4;
        var predicted_value = 0;

        //Compute predicted_value based on HYDE stocks and coefficients
        valid_hyde_keys.forEach((key) => {
          var coefficient = returnSafeNumber(coefficients[key], 1);
          var hyde_value = returnSafeNumber(hyde_images[key].data[i*width + x]);
          var weighted_contribution = hyde_value*coefficient;

          predicted_value += weighted_contribution;
        });

        //Encode as RGBA and store in PNG buffer
        var rgba = encodeNumberAsRGBA(predicted_value);
        png.data[local_index] = rgba[0];
        png.data[local_index + 1] = rgba[1];
        png.data[local_index + 2] = rgba[2];
        png.data[local_index + 3] = rgba[3];
      }

    //Write file
    console.log(`- Writing output file to ${output_file_path} ..`);
    fs.writeFileSync(output_file_path, pngjs.PNG.sync.write(png));
    console.log(`- File written to ${output_file_path}.`);
  }

  global.generateFirstStepModelRasters = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      console.log(`Generating HYDE-SEDAC Processed Model Rasters (${i}/${hyde_years.length}) ..`);
      generateFirstStepModelRaster(hyde_years[i]);
    } catch (e) {
      console.log(e);
    }
  };

  global.getTotalGDPPPP = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Declare local instance variables
    var input_file_path = `./output/OLS_base_model_png/OLS_base_model_${year}_number.png`;
    var total_gdp_ppp = 0;

    var gdp_image_data = loadNumberRasterImage(input_file_path);

    for (var i = 0; i < gdp_image_data.data.length; i++)
      total_gdp_ppp += gdp_image_data.data[i];

    //Return statement
    return total_gdp_ppp;
  };
}
