//Initialise functions
{
  global.clampHYDEToMcEvedy = function (arg0_year, arg1_options) {
    //Convert from parameters
    var year = parseInt(arg0_year);
    var options = (arg1_options) ? arg1_options : {};

    //Declare local instance variables
    var hyde_population_file_path = `${config.defines.common.output_file_paths.hyde_folder}popc_${getHYDEYearName(year)}_number.png`;
    var hyde_population_percentage_file_path = `${config.defines.common.output_file_paths.hyde_folder}popc_${getHYDEYearName(year)}_percentage.png`;
    var hyde_urbc_file_path = `${config.defines.common.output_file_paths.hyde_folder}urbc_${getHYDEYearName(year)}_number.png`;
    var hyde_rurc_file_path = `${config.defines.common.output_file_paths.hyde_folder}rurc_${getHYDEYearName(year)}_number.png`;
    var mcevedy_obj = main.population.mcevedy;
    var mcevedy_subdivisions_file_path = config.defines.common.input_file_paths.mcevedy_subdivisions;

    var all_mcevedy_keys = Object.keys(mcevedy_obj);
    var population_image = loadNumberRasterImage(hyde_population_file_path);
    var population_percentage_image = pngjs.PNG.sync.read(fs.readFileSync(hyde_population_percentage_file_path));
    var mcevedy_subdivisions_image = pngjs.PNG.sync.read(fs.readFileSync(mcevedy_subdivisions_file_path));

    //Iterate over all pixels to fetch all region populations
    for (var i = 0; i < population_image.width*population_image.height; i++) {
      var local_index = i*4; //RGBA index

      var local_data = population_image.data[i];
      var local_key = [
        mcevedy_subdivisions_image.data[local_index],
        mcevedy_subdivisions_image.data[local_index + 1],
        mcevedy_subdivisions_image.data[local_index + 2]
      ].join(",");

      var local_country = mcevedy_obj[local_key];

      //Exclude from count if population_percentage < 0,5% of maximum
      var population_percentage = population_percentage_image.data[local_index + 1]/2;

      if (local_country) {
        if (!local_country.hyde_population) local_country.hyde_population = {};
        if (!(options.population_percentage && population_percentage < 1))
          modifyValue(local_country.hyde_population, year, local_data);
      }
    }

    //Compute McEvedy scalars for each country
    for (var i = 0; i < all_mcevedy_keys.length; i++) {
      var local_country = mcevedy_obj[all_mcevedy_keys[i]];
      
      if (local_country) {
        //Make sure cached .hyde_scalar is always removed before parsing
        delete local_country.hyde_scalar;

        if (local_country.population)
          if (local_country.population[year.toString()] != undefined && local_country.hyde_population != undefined) {
            try {
              var actual_population = local_country.population[year.toString()];
              var hyde_population = local_country.hyde_population[year.toString()];

              console.log(`${all_mcevedy_keys[i]}: Actual population: `, actual_population, `Hyde population: `, hyde_population);
              if (actual_population != undefined && hyde_population != undefined)
                local_country.hyde_scalar = actual_population/hyde_population;
            } catch (e) {
              console.error(`Error dealing with country: `, all_mcevedy_keys[i], local_country);
              console.error(e);
            }
          } else {
            //Check to see if population should be set to 0
            var all_population_keys = Object.keys(local_country.population)
              .sort((a, b) => parseInt(a) - parseInt(b));

            if (local_country.population[all_population_keys[0]] == 0 && parseInt(year) <= parseInt(all_population_keys[0]))
              local_country.hyde_scalar = 0;
          }
      }
    }

    //Iterate over all pixels to adjust region populations
    var rurc_image = loadNumberRasterImage(hyde_rurc_file_path);
    var urbc_image = loadNumberRasterImage(hyde_urbc_file_path);

    var new_popc_image = new pngjs.PNG({
      height: population_image.height,
      width: population_image.width,
      filterType: -1
    });
    var new_urbc_image = new pngjs.PNG({
      height: population_image.height,
      width: population_image.width,
      filterType: -1
    });
    var new_rurc_image = new pngjs.PNG({
      height: population_image.height,
      width: population_image.width,
      filterType: -1
    });

    //Iterate over population_image.data and multiply by local_country.hyde_scalar before saving back to the same file
    for (var i = 0; i < population_image.data.length; i++) {
      var local_index = i*4;

      var local_country = mcevedy_obj[[
        mcevedy_subdivisions_image.data[local_index],
        mcevedy_subdivisions_image.data[local_index + 1],
        mcevedy_subdivisions_image.data[local_index + 2]
      ].join(",")];
      var local_rural_value = rurc_image.data[i];
      var local_urban_value = urbc_image.data[i];
      var local_value = population_image.data[i];

      //For options.percentage_weighting
      var population_percentage = population_percentage_image.data[local_index + 1]/2;

      var popc_rgba = encodeNumberAsRGBA(local_value);
      var rurc_rgba = encodeNumberAsRGBA(local_rural_value);
      var urbc_rgba = encodeNumberAsRGBA(local_urban_value);

      //Adjust to McEvedy if possible
      if (local_country)
        if (local_country.hyde_scalar != undefined) {
            local_value = local_value*local_country.hyde_scalar;
            local_rural_value = local_rural_value*local_country.hyde_scalar;
            local_urban_value = local_urban_value*local_country.hyde_scalar;

            if (options.percentage_weighting) {
              if (population_percentage < 0.5)
                population_percentage = 0.5; //Minimum percentage

              local_value = local_value*population_percentage;
              local_rural_value = local_rural_value*population_percentage;
              local_urban_value = local_urban_value*population_percentage;
            }
          }

      popc_rgba = encodeNumberAsRGBA(local_value);
      rurc_rgba = encodeNumberAsRGBA(local_rural_value);
      urbc_rgba = encodeNumberAsRGBA(local_urban_value);

      //Set new pixels regardless
      new_popc_image.data[local_index] = popc_rgba[0];
      new_popc_image.data[local_index + 1] = popc_rgba[1];
      new_popc_image.data[local_index + 2] = popc_rgba[2];
      new_popc_image.data[local_index + 3] = popc_rgba[3];
      new_rurc_image.data[local_index] = rurc_rgba[0];
      new_rurc_image.data[local_index + 1] = rurc_rgba[1];
      new_rurc_image.data[local_index + 2] = rurc_rgba[2];
      new_rurc_image.data[local_index + 3] = rurc_rgba[3];
      new_urbc_image.data[local_index] = urbc_rgba[0];
      new_urbc_image.data[local_index + 1] = urbc_rgba[1];
      new_urbc_image.data[local_index + 2] = urbc_rgba[2];
      new_urbc_image.data[local_index + 3] = urbc_rgba[3];
    }

    //Write file
    console.log(`Standardising HYDE-McEvedy for ${year}:`);
    console.log(`- ${hyde_population_file_path} ..`);
    fs.writeFileSync(hyde_population_file_path, pngjs.PNG.sync.write(new_popc_image));
    console.log(`- ${hyde_rurc_file_path} ..`);
    fs.writeFileSync(hyde_rurc_file_path, pngjs.PNG.sync.write(new_rurc_image));
    console.log(`- ${hyde_urbc_file_path} ..`);
    fs.writeFileSync(hyde_urbc_file_path, pngjs.PNG.sync.write(new_urbc_image));
  };

  global.clampHYDERastersToMcEvedy = function (arg0_do_not_percentage_weight) {
    //Convert from parameters
    var do_not_percentage_weight = arg0_do_not_percentage_weight;

    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++)
      if (hyde_years[i] <= 1500) try {
        if (!do_not_percentage_weight)
          clampHYDEToMcEvedy(hyde_years[i], { percentage_weighting: true });
        clampHYDEToMcEvedy(hyde_years[i]);
      } catch (e) {
        console.log(e);
      }
  };

  global.fixHYDEUrbanAreas = function (arg0_geomean_underweight) {
    //Convert from parameters
    var geomean_underweight = (arg0_geomean_underweight) ?
      arg0_geomean_underweight : 166.5698064; //Approximate Geomean underweight for HYDE urbc_ from -4000BC-1500AD

    //Declare local instance variables
    var hyde_path = config.defines.common.output_file_paths.hyde_folder;
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Iterate over all HYDE raster files
    var all_input_files = FileManager.getAllFiles(hyde_path);

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++)
      if (hyde_years[i] >= -4000 && hyde_years[i] <= 1500) {
        var local_popc_file_path = `${hyde_path}popc_${getHYDEYearName(hyde_years[i])}_number.png`;
        var local_urbc_file_path = `${hyde_path}urbc_${getHYDEYearName(hyde_years[i])}_number.png`;

        //Load raster images for urban population and total population
        var popc_image = loadNumberRasterImage(local_popc_file_path);
        var urbc_image = loadNumberRasterImage(local_urbc_file_path);

        var new_popc_image = new pngjs.PNG({
          height: popc_image.height,
          width: popc_image.width,
          filterType: -1
        });
        var new_urbc_image = new pngjs.PNG({
          height: urbc_image.height,
          width: urbc_image.width,
          filterType: -1
        });

        console.log(`Processing HYDE Urban Areas Correction for ${hyde_years[i]} ..`);

        //Iterate over urbc_image.data and multiply by geomean_underweight before saving back to the same file
        for (var x = 0; x < urbc_image.data.length; x++) {
          var local_index = x*4;
          var local_value = urbc_image.data[x];
            local_value = local_value*geomean_underweight;

          //Write corrected value to both popc_image and urbc_image
          var rgba = encodeNumberAsRGBA(local_value);
          new_popc_image.data[local_index] = rgba[0];
          new_popc_image.data[local_index + 1] = rgba[1];
          new_popc_image.data[local_index + 2] = rgba[2];
          new_popc_image.data[local_index + 3] = rgba[3];
          new_urbc_image.data[local_index] = rgba[0];
          new_urbc_image.data[local_index + 1] = rgba[1];
          new_urbc_image.data[local_index + 2] = rgba[2];
          new_urbc_image.data[local_index + 3] = rgba[3];
        }

        //Write file
        console.log(`Rewriting output files for ${hyde_years[i]}:`);
        console.log(`- ${local_popc_file_path} ..`);
        fs.writeFileSync(local_popc_file_path, pngjs.PNG.sync.write(new_popc_image));
        console.log(`- ${local_urbc_file_path} ..`);
        fs.writeFileSync(local_urbc_file_path, pngjs.PNG.sync.write(new_urbc_image));
      }
  }

  global.getPopulationOfCellOverTime = function (arg0_x, arg1_y, arg2_years) {
    //Convert from parameters
    var x = parseInt(arg0_x);
    var y = parseInt(arg1_y);
    var years = (arg2_years) ? getList(arg2_years) : undefined;

    //Declare local instance variables
    var cell_index = y*4320 + x;
    var hyde_path = config.defines.common.output_file_paths.hyde_folder;
    var hyde_years = (!years) ? config.velkscala.hyde.hyde_years : years;
    var population_obj = {};

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      console.log(`Gathering data for ${x}, ${y} - (${i}/${hyde_years.length}) ..`);

      var local_popc_file_path = `${hyde_path}popc_${getHYDEYearName(hyde_years[i])}_number.png`;
      var popc_image = loadNumberRasterImage(local_popc_file_path);

      population_obj[hyde_years[i]] = popc_image.data[cell_index];
    } catch {}

    //Return statement
    return population_obj;
  };

  global.loadMcEvedy = function () {
    //Load McEvedy into main
    if (!main.population) main.population = {};
      main.population.mcevedy = FileManager.loadFileAsJSON(config.defines.common.input_file_paths.mcevedy_data);

    //Declare local instance variables
    var hyde_years = config.velkscala.hyde.hyde_years;

    //Perform polynomial interpolation on McEvedy data
    var all_mcevedy_keys = Object.keys(main.population.mcevedy);

    //Iterate over all_mcevedy_keys
    for (var i = 0; i < all_mcevedy_keys.length; i++) {
      var local_country = main.population.mcevedy[all_mcevedy_keys[i]];

      if (local_country.population) {
        //Iterate over local_country.population
        if (local_country.population) {
          var all_population_keys = Object.keys(local_country.population);

          for (var x = 0; x < all_population_keys.length; x++)
            local_country.population[all_population_keys[x]] = local_country.population[all_population_keys[x]]*1000000;
        }

        var values = Object.values(local_country.population).map((value) => value);
        var years = Object.keys(local_country.population).map((year) => parseInt(year));

        //Ensure values; years are sorted properly
        var sorted_indices = years.map((_, i) => i).sort((a, b) => years[a] - years[b]);
            years = sorted_indices.map(i => years[i]);
            values = sorted_indices.map(i => values[i]);

        //Iterate over all hyde_years and perform interpolation if within the given domain
        if (values.length > 0 && years.length > 0)
          for (var x = 0; x < hyde_years.length; x++)
            if (hyde_years[x] >= years[0] && hyde_years[x] <= years[years.length - 1])
              local_country.population[hyde_years[x]] = cubicSplineInterpolation(years, values, hyde_years[x]);

        //Iterate over all hyde_years and set to 0 if first local_country.population year is < 0.0001
        var first_population_value = local_country.population[years[0]];

        if (first_population_value < 0.0001)
          for (var x = 0; x < hyde_years.length; x++)
            if (hyde_years[x] <= years[0])
             local_country.population[hyde_years[x]] = 0;
      }
    }

    //Set RGB aliases
    for (var i = 0; i < all_mcevedy_keys.length; i++) {
      var local_country = main.population.mcevedy[all_mcevedy_keys[i]];

      if (local_country.colour) {
        main.population.mcevedy[local_country.colour.join(",")] = main.population.mcevedy[all_mcevedy_keys[i]];
      } else {
        console.warn(`${all_mcevedy_keys[i]} has no colour!`);
      }
    }
  };
}
