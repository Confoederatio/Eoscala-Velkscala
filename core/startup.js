//Initialise functions
{
  global.startup = function () {
    //Declare local instance variables
    var input_file_paths = config.defines.common.input_file_paths;
    var output_file_paths = config.defines.common.output_file_paths;
    var hyde_years = config.velkscala.hyde.hyde_years;
    var hyde_years_length = hyde_years.length;
    var hyde_years_index = 0;

    //Eoscala
    //Initialise main object
    main = {};
    main.eoscala = {
      //GDP (PPP) - World
      nordhaus_gdp_obj: loadGlobalNordhausGDP_PPP()
    };
    main.hyde_years = hyde_years;
    main.hyde_years_length = hyde_years_length;
    main.hyde_years_index = hyde_years_index;

    //Load all files
    main.countries = getWorldBankSubdivisions();
    main.maddison_estimates = FileManager.loadFileAsJSON(input_file_paths.maddison_estimates);

    //Velkscala
    main.population = {};
      loadMcEvedy(); //Loads into the namespace main.population.mcevedy

    //Return statement
    return main;
  };
} 