//Initialise functions
{
  global.checkAdjustedGDPPPP = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      var local_gdp_ppp_sum = getImageSum(`./output/OLS_base_model_png/second_step_adjusted/OLS_nordhaus_adjusted_${hyde_years[i]}_number.png`);

      console.log(`${hyde_years[i]} Global GDP (PPP) in 2000$: ${parseNumber(local_gdp_ppp_sum*100)}`);
    } catch (e) {}
  };

  global.checkAdjustedGDPPPPByRegion = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();
    var regions_obj = {
      northern_america: {
        colour: [87, 122, 175]
      },
      latin_america: {
        colour: [71, 165, 101]
      },
      europe: {
        colour: [47, 97, 170]
      },
      eastern_europe_and_russia: {
        colour: [20, 114, 30]
      },
      central_asia: {
        colour: [41, 193, 175]
      },
      middle_east: {
        colour: [198, 130, 129]
      },
      maghreb_egypt: {
        colour: [239, 188, 112]
      },
      sub_saharan_africa: {
        colour: [155, 101, 77]
      },
      oceania: {
        colour: [0, 205, 143]
      },
      indian_subcontinent: {
        colour: [214, 144, 83]
      },
      southeast_asia: {
        colour: [97, 144, 163]
      },
      eastasia: {
        colour: [173, 62, 62]
      }
    };
    var regional_subdivisions_file_path = `./geographic_datasets/subdivisions/regional_subdivisions.png`;
    var regional_subdivisions_image = pngjs.PNG.sync.read(fs.readFileSync(regional_subdivisions_file_path));

    var all_regions_keys = Object.keys(regions_obj);

    //Pre-process all_regions_keys; iterate over all_regions_keys
    for (var i = 0; i < all_regions_keys.length; i++) {
      var local_region = regions_obj[all_regions_keys[i]];

      local_region.id = all_regions_keys[i];
      local_region.gdp_ppp = {};
      regions_obj[local_region.colour.join(",")] = local_region;
    }

    //Iterate over all HYDE years
    for (var i = 0; i < hyde_years.length; i++) try {
      console.log(`Processing Regional GDP PPP for ${hyde_years[i]} ..`);

      var local_gdp_ppp_file_path = `./output/OLS_base_model_png/second_step_adjusted/OLS_nordhaus_adjusted_${hyde_years[i]}_number.png`;
      var local_gdp_ppp_image = loadNumberRasterImage(local_gdp_ppp_file_path);

      //Iterate over all pixels to fetch all region GDP PPPs
      for (var x = 0; x < local_gdp_ppp_image.width*local_gdp_ppp_image.height; x++) {
        var local_index = x*4; //RGBA index
        var local_x = x % local_gdp_ppp_image.width;
        var local_y = Math.floor(x/local_gdp_ppp_image.width);

        var local_data = local_gdp_ppp_image.data[x];
        var local_key = [
          regional_subdivisions_image.data[local_index],
          regional_subdivisions_image.data[local_index + 1],
          regional_subdivisions_image.data[local_index + 2]
        ].join(",");
        var local_region = regions_obj[local_key];

        if (local_region)
          modifyValue(local_region.gdp_ppp, hyde_years[i], local_data*100);
      }

      var total_gdp_ppp = 0;

      for (var x = 0; x < all_regions_keys.length; x++)
        total_gdp_ppp += regions_obj[all_regions_keys[x]].gdp_ppp[hyde_years[i]];
      for (var x = 0; x < all_regions_keys.length; x++) {
        var local_region = regions_obj[all_regions_keys[x]];

        local_region.gdp_ppp[`${hyde_years[i]}_percentage`] = local_region.gdp_ppp[hyde_years[i]]/total_gdp_ppp;
      }

      console.log(`- Regions Object:`, regions_obj);
    } catch (e) {
      console.error(`checkAdjustedGDPPPPByRegion(): Ran into an error with year ${hyde_years[i]}:`);
      console.error(e);
    }

    main.regions_gdp_ppp = regions_obj;

    //Return statement
    return regions_obj;
  };

  global.checkGlobalPopulation = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      var local_population_sum = getImageSum(`./output/HYDE_png/popc_${Math.abs(hyde_years[i])}${(hyde_years[i] < 0) ? "BC" : "AD"}_number.png`);

      console.log(`${hyde_years[i]} Global Population: ${parseNumber(local_population_sum)}`);
    } catch (e) {}
  };

  global.getNordhausGlobalGDPPPP = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();
    var nordhaus_obj = { //In Billions of 1990$
      "-10000": 1.38,
      "-8000": 1.61,
      "-5000": 1.91,
      "-4000": 2.84,
      "-3000": 5.89,
      "-2000": 11.20,
      "-1600": 16.16,
      "-1000": 23.55,
      "-800": 36.05,
      "-500": 50.90,
      "-400": 59.44,
      "-200": 63.05,
      "0": 68.65,
      "14": 64.91,
      "200": 68.80,
      "350": 66.53,
      "400": 68.40,
      "500": 73.90,
      "600": 77.39,
      "700": 86.97,
      "800": 94.70,
      "900": 117.52,
      "1000": 131,
      "1100": 146.91,
      "1200": 138.90,
      "1250": 132.01,
      "1300": 119.06,
      "1340": 150.27,
      "1400": 166.64,
      "1500": 217.64,
      "1600": 285.70,
      "1650": 303.24,
      "1700": 370.26,
      "1750": 476.75,
      "1800": 650.11,
      "1850": 945.60,
      "1875": 1256.10,
      "1900": 2052.38,
      "1920": 2810.15,
      "1925": 3293.03,
      "1930": 3409.69,
      "1940": 4237.90,
      "1950": 5379.21,
      "1960": 8431.84,
      "1965": 10845.34,
      "1970": 13934.06,
      "1975": 16801.40,
      "1980": 20162.78,
      "1985": 23270.78,
      "1990": 27539.57,
    };
    var world_bank_obj = {
      //2021$, convert down to 2000$ (World Bank)
      "1991": 59.68,
      "1992": 60.18,
      "1993": 61.86,
      "1994": 63.50,
      "1995": 65.46,
      "1996": 67.87,
      "1997": 70.54,
      "1998": 72.30,
      "1999": 74.91,
      "2000": 78.50,
      "2001": 80.39,
      "2002": 82.59,
      "2003": 85.61,
      "2004": 90.01,
      "2005": 94.11,
      "2006": 99,
      "2007": 104.14,
      "2008": 107.03,
      "2009": 106.27,
      "2010": 111.67,
      "2011": 116.06,
      "2012": 119.65,
      "2013": 123.52,
      "2014": 127.74,
      "2015": 131.97,
      "2016": 136.25,
      "2017": 141.44,
      "2018": 146.59,
      "2019": 150.88,
      "2020": 146.61,
      "2021": 156.07,
      "2022": 161.38,
      "2023": 166.65
    };

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
    var values = Object.values(nordhaus_obj).map((value) => value);
    var years = Object.keys(nordhaus_obj).map((year) => parseInt(year));

    //Ensure values; years are sorted properly
    var sorted_indices = years.map((_, i) => i).sort((a, b) => years[a] - years[b]);
      values = sorted_indices.map(i => values[i]);
      years = sorted_indices.map(i => years[i]);

    var local_splines = new cubic_spline(years, values);

    //Iterate over all hyde_years in domain
    for (var i = 0; i < hyde_years.length; i++)
      if (hyde_years[i] <= returnSafeNumber(years[years.length - 1])) {
        let current_year = hyde_years[i];

        if (current_year <= returnSafeNumber(years[years.length - 1])) {
          var local_value = cubicSplineInterpolation(years, values, current_year);

          // If local_value is flat, use linear interpolation fallback
          let last_year = null, last_year_value = null;
          let next_year = null, next_year_value = null;

          // Find the closest previous (last) year in nordhaus_obj
          for (let x = 0; x < years.length; x++) {
            if (years[x] < current_year) {
              last_year = years[x];
              last_year_value = values[x];
            } else {
              break; // Stop once we pass current_year
            }
          }

          // Find the closest next year in nordhaus_obj
          for (let x = 0; x < years.length; x++) {
            if (years[x] > current_year) {
              next_year = years[x];
              next_year_value = values[x];
              break; // Stop at the first valid next year
            }
          }

          // Perform linear interpolation only if both last_year and next_year are found
          if (last_year !== null && next_year !== null && last_year_value !== null && next_year_value !== null) {
            local_value = last_year_value + ((current_year - last_year) / (next_year - last_year)) * (next_year_value - last_year_value);
          }

          nordhaus_obj[current_year] = local_value;
        }
      }

    //Return statement
    return nordhaus_obj;
  };

  global.getGDPPPP = function (arg0_country_obj) {
    //Convert from parameters
    var country_obj = arg0_country_obj;

    //Declare local instance variables
    var local_values = {};
    var maddison_name = country_obj.maddison_name;

    main.maddison_estimates = FileManager.loadFileAsJSON(`./economic_datasets/maddison/maddison_gdp_ppp_2011$.json`);

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
        var local_splines = new cubic_spline(years, values);

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

  global.scaleRasterToMaddison = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Declare local instance variables
    var gdp_ppp_file_path = `./output/OLS_base_model_png/second_step_adjusted/OLS_nordhaus_adjusted_${year}_number.png`;
    var world_bank_subdivisions_image = loadWorldBankSubdivisions(`./geographic_datasets/world_bank_subdivisions_for_ppp_calculations/world_bank_subdivisions.png`);

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
    for (var i = 0; i < gdp_ppp_image.width*gdp_ppp_image.height; i++) {
      var local_index = i*4; //RGBA index
      var local_x = i % gdp_ppp_image.width;
      var local_y = Math.floor(i/gdp_ppp_image.width);

      var local_data = gdp_ppp_image.data[i];
      var local_key = [
        world_bank_subdivisions_image.data[local_index],
        world_bank_subdivisions_image.data[local_index + 1],
        world_bank_subdivisions_image.data[local_index + 2]
      ].join(",");

      var local_country = main.countries[local_key];

      if (local_country)
        local_country.sum_gdp_ppp += local_data;
    }

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

    var png = new pngjs.PNG({
      height: gdp_ppp_image.height,
      width: gdp_ppp_image.width,
      filterType: -1
    });

    //Iterate over all pixels to adjust economic data
    for (var i = 0; i < gdp_ppp_image.data.length; i++) {
      var local_index = i*4; //RGBA value

      var local_country = main.countries[[
        world_bank_subdivisions_image.data[local_index],
        world_bank_subdivisions_image.data[local_index + 1],
        world_bank_subdivisions_image.data[local_index + 2]
      ].join(",")];
      var local_value = gdp_ppp_image.data[i];

      //Encode new GDP PPP
      var rgba = encodeNumberAsRGBA(local_value);

      //Adjust to Maddison if possible
      if (local_country)
        if (local_country.maddison_scalar != undefined)
          local_value = ((local_value*100)*local_country.maddison_scalar)/100; //Convert to and from $100s
      rgba = encodeNumberAsRGBA(local_value);

      //Set new pixels regardless
      png.data[local_index] = rgba[0];
      png.data[local_index + 1] = rgba[1];
      png.data[local_index + 2] = rgba[2];
      png.data[local_index + 3] = rgba[3];
    }

    //Write file
    console.log(`Standardising to Maddison for ${year}:`);
    console.log(`- ${gdp_ppp_file_path} ..`);
    fs.writeFileSync(gdp_ppp_file_path, pngjs.PNG.sync.write(png));
  };

  global.scaleRastersToMaddison = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();

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

  global.scaleRasterToNordhaus = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Declare local instance variables
    var gdp_ppp_file_path = `./output/OLS_base_model_png/second_step_adjusted/OLS_nordhaus_adjusted_${year}_number.png`;
    var nordhaus_gdp_obj = getNordhausGlobalGDPPPP();
    var world_bank_subdivisions_image = loadWorldBankSubdivisions(`./geographic_datasets/world_bank_subdivisions_for_ppp_calculations/world_bank_subdivisions.png`);

    var gdp_ppp_image = loadNumberRasterImage(gdp_ppp_file_path);
    console.log(`Scaling ${year} to Nordhaus GDP PPP (2000$)..`);
    console.log(`- Loaded ${gdp_ppp_file_path}`);

    var actual_gdp = nordhaus_gdp_obj[year]/100; //Make sure this in $100s to prevent overflow
    if (isNaN(actual_gdp) || returnSafeNumber(actual_gdp) == 0) return; //Guard clause if GDP (PPP) doesn't exist

    var png = new pngjs.PNG({
      height: gdp_ppp_image.height,
      width: gdp_ppp_image.width,
      filterType: -1
    });
    var sum_gdp = 0;

    //Iterate over all pixels to fetch sum_gdp
    for (var i = 0; i < gdp_ppp_image.data.length; i++)
      sum_gdp += returnSafeNumber(gdp_ppp_image.data[i]);
    console.log(`- (OLS Step 2, ${year}) - Sum GDP ($100s):`, sum_gdp, `Actual GDP ($100s):`, actual_gdp);

    var global_scalar = actual_gdp/sum_gdp;

    //Iterate over all pixels
    for (var i = 0; i < gdp_ppp_image.data.length; i++) {
      var local_index = i*4; //RGBA index
      var local_value = gdp_ppp_image.data[i];

      var local_country = getCountryObjectByRGB([
        world_bank_subdivisions_image.data[local_index],
        world_bank_subdivisions_image.data[local_index + 1],
        world_bank_subdivisions_image.data[local_index + 2]
      ]);

      if (local_value != undefined && local_value != -9999)
        local_value *= global_scalar;

      //Set pixel values
      var rgba = encodeNumberAsRGBA(local_value);

      png.data[local_index] = rgba[0];
      png.data[local_index + 1] = rgba[1];
      png.data[local_index + 2] = rgba[2];
      png.data[local_index + 3] = rgba[3];
    }

    //Write PNG file
    var output_file_path = `./output/OLS_base_model_png/second_step_adjusted/OLS_nordhaus_adjusted_${year}_number.png`;
    fs.writeFileSync(output_file_path, pngjs.PNG.sync.write(png));
    console.log(`.PNG output file written to ${output_file_path}`);
  };

  global.scaleRastersToNordhaus = function () {
    //Declare local instance variables
    var hyde_years = getHYDEYears();

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      scaleRasterToNordhaus(hyde_years[i]);
    } catch (e) {
      console.error(`scaleRastersToNordhaus(): Error for Year ${hyde_years[i]}`);
      console.error(e);
    }
  };
}
