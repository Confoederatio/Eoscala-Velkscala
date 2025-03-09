/*
//BACKUP trainHYDESEDAC() for base divergent models (SUPER UNSTABLE - BUT ESTABLISHES GEOMEAN BASELINE)
global.trainBaselineHYDESEDAC = async function (arg0_year) {
  //Convert from parameters
  var year = parseInt(arg0_year);

  //Declare local instance variables
  var hyde_dictionary = getHYDEDictionary();
  var { X, Y } = await loadHYDESEDACYear(year);

  var all_hyde_keys = Object.keys(hyde_dictionary);

  console.log(`Performing OLS for ${year} ..`);

  //1. Apply Ridge Regression to stabilise coefficients
  var X_matrix = mathjs.matrix(X);
  var Y_matrix = mathjs.matrix(Y);
  console.log(`- Computed preliminary matrices.`);

  var beta = ridgeRegression(X_matrix, Y_matrix, 1e-3); //Small lambda for stabilisation
  console.log(`- Applied Ridge Regression to stabilise coefficients.`);

  //2. Convert coefficients to JSON
  var coefficients = beta.toArray().flat();
  console.log(`- Computed coefficients.`);

  //Save model to JSON
  var model_data_obj = {
    year: year,
    coefficients: Object.fromEntries(all_hyde_keys.map((key, i) => [key, coefficients[i]]))
  };
  var output_file_path = `./output/OLS_base_model_data/base_model_${year}.json`;

  fs.writeFileSync(output_file_path, JSON.stringify(model_data_obj, null, 2));
  console.log(`Model data for ${year} saved successfully in ${output_file_path}.`);
};
*/
