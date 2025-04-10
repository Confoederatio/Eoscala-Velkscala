//Initialise functions
{
  /**
   * getCountryObjectByRGB() - Fetches the base main.countries object for a given RGBA value.
   * @param {Array<number, number, number, number>} arg0_rgb - The RGBA parameter to fetch the country object for.
   *  
   * @returns {Object}
   */
  global.getCountryObjectByRGB = function (arg0_rgb) {
    //Convert from parameters
    var rgb = getList(arg0_rgb);

    //Initialise main.countries if not already defined
    if (!main.countries)
      main.countries = getWorldBankSubdivisions();

    //Return statement if found
    if (main.countries[rgb.join(",")])
      return main.countries[rgb.join(",")];
    if (rgb.length > 3)
      rgb = rgb.slice(0, 3); //Slice off alpha channel
      if (main.countries[rgb.join(",")])
        return main.countries[rgb.join(",")];

    //Return statement; NODATA_value
    return main.countries.NODATA_value;
  };

  /**
   * getWorldBankSubdivisions() - Returns the initial World Bank state for main.countries.
   * 
   * @returns {Object}
   */
  global.getWorldBankSubdivisions = function () {
    //Declare local instance variables
    var countries_obj = config.eoscala.history.countries;
    var maddison_obj = config.eoscala.maddison.countries;
    var ppp_scalar_obj = config.eoscala.statistics.ppp_scalars;

    //Iterate over all_countries_keys and input ppp_relative_scalar and ppp_absolute_scalar for each country
    var all_countries_keys = Object.keys(countries_obj);
    var all_maddison_keys = Object.keys(maddison_obj);

    for (var i = 0; i < all_countries_keys.length; i++) {
      var local_value = countries_obj[all_countries_keys[i]];

      //Maddison data
      for (var x = 0; x < all_maddison_keys.length; x++) {
        var local_maddison_obj = maddison_obj[all_maddison_keys[x]];

        if (local_maddison_obj.id == all_countries_keys[i])
          local_value.maddison_name = local_maddison_obj.name;
      }
      if (!local_value.maddison_name)
        console.warn(`getWorldBankSubdivisions(): ${all_countries_keys[i]} (${local_value.name}) does not have a valid Maddison name.`);

      //World Bank data
      if (local_value.name) {
        var local_ppp_scalar_obj = ppp_scalar_obj[local_value.name];

        if (local_ppp_scalar_obj) {
          local_value.ppp_absolute_scalar = returnSafeNumber(local_ppp_scalar_obj.ppp_absolute_scalar);
          local_value.ppp_relative_scalar = returnSafeNumber(local_ppp_scalar_obj.ppp_relative_scalar);
        } else {
          var default_scalar_obj = ppp_scalar_obj.NODATA_value;
          local_value.ppp_absolute_scalar = default_scalar_obj.ppp_absolute_scalar;
          local_value.ppp_relative_scalar = default_scalar_obj.ppp_relative_scalar;

          console.warn(`getWorldBankSubdivisions(): ${all_countries_keys[i]} (${local_value.name}) does not have a valid equivalent in config.eoscala.statistics.ppp_scalars.`);
        }
      } else {
        console.error(`getWorldBankSubdivisions(): ${all_countries_keys[i]} has no name!`);
      }

      //Populate Maddison GDP (PPP) estimates, 2000$
      local_value.gdp_ppp = getCountryGDP_PPP(local_value);
    }

    //Iterate over all_countries_keys to add colour aliases
    for (var i = 0; i < all_countries_keys.length; i++) {
      var local_value = countries_obj[all_countries_keys[i]];

      if (local_value.colour)
        countries_obj[local_value.colour.join(",")] = countries_obj[all_countries_keys[i]];
    }

    //Return statement
    return countries_obj;
  };

  /**
   * loadWorldBankSubdivisions() - Loads the World Bank subdivisions image and returns it as a .png object.
   * @param {String} arg0_image_path - The file path for World Bank subdivisions.
   * 
   * @returns {Object}
   */
  global.loadWorldBankSubdivisions = function (arg0_image_path) {
    //Convert from parameters
    var image_path = arg0_image_path;

    //Set main.countries_obj
    if (!main.countries)
      main.countries = getWorldBankSubdivisions();

    //Return statement
    return loadImage(image_path);
  }
}
