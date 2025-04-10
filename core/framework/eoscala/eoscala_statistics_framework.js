//Initialise functions
{
  global.printAdjustedGDP_PPP = function () {
    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      var local_gdp_ppp_sum = getImageSum(`${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_prefix}${hyde_years[i]}${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_suffix}`);

      console.log(`${hyde_years[i]} Global GDP (PPP) in 2000$: ${parseNumber(local_gdp_ppp_sum*100)}`);
    } catch (e) {}
  };

  global.printAdjustedGDP_PPPByRegion = function () {
    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;
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
    var regional_subdivisions_file_path = config.defines.common.input_file_paths.regional_subdivisions;
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

      var local_gdp_ppp_file_path = `${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_prefix}${hyde_years[i]}${config.defines.common.output_file_paths.OLS_nordhaus_gdp_ppp_suffix}`;
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
      console.error(`checkAdjustedGDP_PPPByRegion(): Ran into an error with year ${hyde_years[i]}:`);
      console.error(e);
    }

    main.regions_gdp_ppp = regions_obj;

    //Return statement
    return regions_obj;
  };
}