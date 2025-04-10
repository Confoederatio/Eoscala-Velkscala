//Initialise functions
//Global GDP PPP functions (Nordhaus), 2000$
{
  //Raster functions
  {
    /**
     * scaleRasterToNordhaus() - Scales a raster image of GDP (PPP) to Nordhaus Global GDP (PPP) 2000$. Returns the total global GDP for that year.
     * @param {number} arg0_year - The year to scale the raster image to.
     * 
     * @returns {number}
     */
    global.scaleRasterToNordhaus = function (arg0_year) {
      //Convert from parameters
      var year = parseInt(arg0_year);
  
      //Declare local instance variables
      var gdp_ppp_file_path = `${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_prefix}${year}${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_suffix}`;
      var nordhaus_gdp_obj = getGlobalNordhausGDP_PPP();

      var actual_gdp = nordhaus_gdp_obj[year]/100; //Make sure this in $100s to prevent overflow
      var gdp_ppp_image = loadNumberRasterImage(gdp_ppp_file_path);
      console.log(`Scaling ${year} to Nordhaus GDP PPP (2000$)..`);
      console.log(`- Loaded ${gdp_ppp_file_path}`);
      var output_file_path = `${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_prefix}${year}${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_suffix}`;
      var sum_gdp = 0;
  
      //Guard clause if GDP (PPP) doesn't exist
      if (isNaN(actual_gdp) || returnSafeNumber(actual_gdp) == 0) return;

      //Save raster image
      saveNumberRasterImage({
        file_path: output_file_path,
        height: gdp_ppp_image.height,
        width: gdp_ppp_image.width,
        function: function (arg0_index) {
          //Convert from parameters
          var local_index = arg0_index;

          //Declare local instance variables
          var local_value = gdp_ppp_image.data[local_index];

          if (local_value != undefined && local_value != -9999)
            local_value *= global_scalar;
          sum_gdp += local_value;
          
          //Return statement
          return local_value;
        }
      });

      console.log(`.PNG output file written to ${output_file_path}`);

      //Return statement
      return sum_gdp*100;
    };
    
    /**
     * scaleRastersToNordhaus() - Scales all raste images of GDP (PPP) to Nordhaus. Returns an object dictionary of years to total global GDP (PPP) in 2000$.
     * 
     * @returns {Object<number, number>}
     */
    global.scaleRastersToNordhaus = function () {
      //Declare local instance variables
      var hyde_years = config.velkscala.hyde.hyde_years;
      var return_obj = {};
  
      //Iterate over all hyde_years
      for (var i = 0; i < hyde_years.length; i++) try {
        modifyObject(return_obj, hyde_years[i], scaleRasterToNordhaus(hyde_years[i]));
      } catch (e) {
        console.error(`scaleRastersToNordhaus(): Error for Year ${hyde_years[i]}`);
        console.error(e);
      }

      //Return statement
      return return_obj;
    };
  }

  //Statistical functions
  {
    /**
     * getGlobalNordhausGDP_PPP() - Returns an object dictionary of total global GDP (PPP) in 2000$ for all HYDE years.
     * 
     * @returns {Object<number, number>}
     */
    global.getGlobalNordhausGDP_PPP = function () {
      //Declare local instance variables
      var hyde_years = config.velkscala.hyde.hyde_years;
      var nordhaus_obj = config.eoscala.statistics["gdp_ppp_global_nordhaus_-10000-1990_1990$"]; //Billions of 1990$
      var world_bank_obj = config.eoscala.statistics["gdp_ppp_global_world_bank_1990-2023_2021$"]; //Trillions of 2021$
  
      //Iterate over all_nordhaus_keys and multiply by SDR deflator to convert 1990$ to 2000$. Apply the same for world_bank_obj
      var all_nordhaus_keys = Object.keys(nordhaus_obj);
      var all_world_bank_keys = Object.keys(world_bank_obj);
      var nordhaus_conversion = 1.2171767028627838*1000000000;
      var worldbank_conversion = 0.7011657662780779*1000000000*1000;
  
      for (var i = 0; i < all_nordhaus_keys.length; i++)
        nordhaus_obj[all_nordhaus_keys[i]] *= nordhaus_conversion;
      for (var i = 0; i < all_world_bank_keys.length; i++)
        world_bank_obj[all_world_bank_keys[i]] *= worldbank_conversion;
      nordhaus_obj = mergeObjects(nordhaus_obj, world_bank_obj, { overwrite: true });
  
      //Interpolate nordhaus_obj over all HYDE_years
      nordhaus_obj = cubicSplineInterpolationObject(nordhaus_obj, { 
        years: hyde_years 
      });
  
      //Return statement
      return nordhaus_obj;
    };
  }
}

//Country GDP PPP functions (Maddison), 2000$
{
  //Raster functions
  {
    /**
     * scaleRasterToMaddison() - Scales a raster image of GDP (PPP) to Maddison by country level. Returns the total global GDP for that year.
     * @param {number} arg0_year - The year to scale the raster image to.
     */
    global.scaleRasterToMaddison = function (arg0_year) {
      //Convert from parameters
      var year = parseInt(arg0_year);
  
      //Declare local instance variables
      var gdp_ppp_file_path = `${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_prefix}${year}${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_suffix}`;
      var world_bank_subdivisions_image = loadWorldBankSubdivisions(config.defines.common.input_file_paths.world_bank_subdivisions);
  
      //NOTE: main.countries.<country_key>.gdp_ppp contains country GDP PPPs
      var all_countries_keys = Object.keys(main.countries);
      var gdp_ppp_image = loadNumberRasterImage(gdp_ppp_file_path);
      console.log(`Scaling ${year} to Maddison (2000$)..`);
      console.log(`- Loaded ${gdp_ppp_file_path}`);
  
      //Iterate over all countries to set things up
      for (var i = 0; i < all_countries_keys.length; i++) {
        var local_country = main.countries[all_countries_keys[i]];
  
        //Set to local_country.sum_gdp_ppp to 0 before counting
        local_country.sum_gdp_ppp = 0;
      }
  
      //Iterate over all pixels to fetch all country GDPs
      operateNumberRasterImage({
        file_path: gdp_ppp_file_path,
        function: function (arg0_index, arg1_number) {
          //Convert from parameters
          var index = arg0_index;
          var number = arg1_number;

          //Declare local instance variables
          var local_country = main.countries[
            world_bank_subdivisions_image.data[index],
            world_bank_subdivisions_image.data[index + 1],
            world_bank_subdivisions_image.data[index + 2]
          ].join(",");

          if (local_country)
            local_country.sum_gdp_ppp += number;
        }
      });
  
      //Compute Maddison scalars for each country
      for (var i = 0; i < all_countries_keys.length; i++) {
        var local_country = main.countries[all_countries_keys[i]];
  
        if (local_country) {
          //Make sure cached .maddison_scalar is always removed
          delete local_country.maddison_scalar;
  
          if (local_country.gdp_ppp)
            if (local_country.gdp_ppp[year.toString()])
              try {
                var actual_gdp_ppp = local_country.gdp_ppp[year.toString()];
                var sum_gdp_ppp = local_country.sum_gdp_ppp;
  
                if (actual_gdp_ppp != undefined && sum_gdp_ppp != undefined) {
                  local_country.maddison_scalar = actual_gdp_ppp/(sum_gdp_ppp*100); //Convert from $100s
                  console.log(`Set Maddison Scalar for ${all_countries_keys[i]} to:`, local_country.maddison_scalar);
                }
              } catch (e) {
                console.error(`Error dealing with country: `, all_countries_keys[i], local_country);
                console.error(e);
              }
        }
      }

      //Adjust raster image to Maddison
      saveNumberRasterImage({
        file_path: gdp_ppp_file_path,
        height: gdp_ppp_image.height,
        width: gdp_ppp_image.width,
        function: function (arg0_index) {
          //Convert from parameters
          var index = arg0_index;

          //Declare local instance variables
          var local_value = gdp_ppp_image.data[index];

          //Adjust to Maddison if possible
          if (local_country)
            if (local_country.maddison_scalar != undefined)
              local_value = ((local_value*100)*local_country.maddison_scalar)/100; //Convert to and from $100s

          //Return statement
          return local_value;
        }
      });
  
      //Write file
      console.log(`Standardising to Maddison for ${year}:`);
      console.log(`- ${gdp_ppp_file_path} ..`);
      fs.writeFileSync(gdp_ppp_file_path, pngjs.PNG.sync.write(png));
    };
    
    /**
     * scaleRastersToMaddison() - Scales all rasters of GDP (PPP) to Maddison by country level.
     */
    global.scaleRastersToMaddison = function () {
      //Declare local instance variables
      var hyde_years = config.velkscala.hyde.hyde_years;
  
      //Initialise main.countries
      main.countries = getWorldBankSubdivisions();
  
      //Iterate over all hyde_years
      for (var i = 0; i < hyde_years.length; i++) try {
        scaleRasterToMaddison(hyde_years[i]);
      } catch (e) {
        console.error(`scaleRastersToMaddison(): Error for Year ${hyde_years[i]}`);
        console.error(e);
      }
    };
  }

  //Statistical functions
  {
    /**
     * getCountryGDP_PPP() - Returns an object dictionary of GDP (PPP) in 2000$ for a given country.
     * @param {Object} arg0_country_obj - The country object to get the GDP (PPP) for.
     * 
     * @returns {Object<number, number>}
     */
    global.getCountryGDP_PPP = function (arg0_country_obj) {
      //Convert from parameters
      var country_obj = arg0_country_obj;
  
      //Declare local instance variables
      var local_values = {};
      var maddison_name = country_obj.maddison_name;
  
      main.maddison_estimates = FileManager.loadFileAsJSON(config.defines.common.input_file_paths.maddison_estimates);
  
      if (maddison_name) {
        var inside_domain = false;
  
        //Iterate over all maddison estimates and log in populated values before interpolation
        for (var i = 0; i < main.maddison_estimates.length; i++) {
          var local_value = main.maddison_estimates[i][maddison_name];
  
          if (local_value) {
            if (typeof local_value == "number" && returnSafeNumber(local_value) > 0)
              inside_domain = true;
            if (inside_domain) {
              var local_year = main.maddison_estimates[i]["GDP pc 2011 prices"];
  
              if (local_value != 0)
                local_values[local_year] = local_value*returnSafeNumber(local_value.ppp_absolute_scalar, 1);
            }
          }
        }
  
        //Interpolate any missing values
        var values = Object.values(local_values).map((value) => value);
        var years = Object.keys(local_values).map((year) => parseInt(year));
  
        //Ensure values; years are sorted properly
        var sorted_indices = years.map((_, i) => i).sort((a, b) => years[a] - years[b]);
          values = sorted_indices.map(i => values[i]);
          years = sorted_indices.map(i => years[i]);
  
        var end_year = getMaximumInArray(years);
        var starting_year = getMinimumInArray(years);
  
        //Iterate over all hyde_years and perform interpolation if within the given domain
        try {
          for (var i = starting_year; i <= end_year; i++)
            local_values[i] = cubicSplineInterpolation(years, values, i);
        } catch (e) {
          console.log(country_obj.maddison_name);
          console.log(e);
        }
      }
  
      //Return statement
      return local_values;
    };
  }
}