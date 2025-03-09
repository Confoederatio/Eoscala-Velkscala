//Initialise functions
{
  global.getImageSum = function (arg0_file_path) {
    //Convert from parameters
    var file_path = arg0_file_path;

    //Declare local instance variables
    var image = loadNumberRasterImage(file_path);
    var total_sum = 0;

    //Iterate over image
    for (var i = 0; i < image.data.length; i++)
      total_sum += image.data[i];

    //Return statement
    return total_sum;
  };

  global.loadNumberRasterImage = function (arg0_file_path) {
    //Convert from parameters
    var file_path = arg0_file_path;

    //Declare local instance variables
    var rawdata = fs.readFileSync(file_path);
    var pixel_values = [];
    var png = pngjs.PNG.sync.read(rawdata);

    //Iterate over all pixels
    for (var i = 0; i < png.width*png.height; i++) {
      var colour_index = i*4;
      var colour_value = decodeRGBAAsNumber([
        png.data[colour_index],
        png.data[colour_index + 1],
        png.data[colour_index + 2],
        png.data[colour_index + 3]
      ]);

      pixel_values.push(colour_value);
    }

    //Return statement
    return { width: png.width, height: png.height, data: pixel_values };
  };
}
