module.exports = {
  getAllFiles: function (arg0_folder) {
    //Convert from parameters
    var folder = arg0_folder;

    //Declare local instance variables
    var file_array = [];

    try {
      var files = fs.readdirSync(folder);

      for (var i = 0; i < files.length; i++) {
        //Self-reference to fetch files in sub-directories
        local_dir_array = (fs.statSync(folder + "/" + files[i]).isDirectory()) ? module.exports.getAllFiles(folder + "/" + files[i]) : file_array.push(path.join(folder, "/", files[i]));

        //Add files from local_dir_array to file_array
        for (var x = 0; x < local_dir_array.length; x++) file_array.push(local_dir_array[x]);
      }
    } catch (e) {
      console.log(e);
    }

    //Return statement
    return file_array;
  },

  loadAllScripts: function () {
    //Declare local instance variables
    var loaded_files = [];

    //Load config backend files individually first
    var local_load_order = load_order.load_files;

    for (var i = 0; i < local_load_order.length; i++) {
      for (var x = 0; x < load_order.load_directories.length; x++) {
        var local_dir = load_order.load_directories[x];
        var all_directory_files = module.exports.getAllFiles(local_dir);

        for (var y = 0; y < all_directory_files.length; y++)
          if (all_directory_files[y].includes(local_load_order[i]))
            if (all_directory_files[y].endsWith(".js")) {
              module.exports.loadFile(all_directory_files[y]);
              loaded_files.push(local_load_order[i]);
              console.log(`Loaded imperative file ${all_directory_files[y]}.`);
            }
      }
    }

    //Load each load directory separately
    for (var i = 0; i < load_order.load_directories.length; i++) {
      var local_dir = load_order.load_directories[i];
      var all_directory_files = module.exports.getAllFiles(local_dir);

      for (var x = 0; x < all_directory_files.length; x++)
        if (!loaded_files.includes(all_directory_files[x]))
          if (all_directory_files[x].endsWith(".js")) {
            module.exports.loadFile(all_directory_files[x]);
            loaded_files.push(all_directory_files[x]);
          }
    }

    console.log(`Loaded ${loaded_files.length} files from ${load_order.load_directories.length} directories.`);
  },

  load: function (arg0_file_path) {
    //Convert from parameters
    var file_path = (arg0_file_path) ? arg0_file_path : "./database.json";

    //Declare main
    main = JSON.parse(fs.readFileSync(file_path, "utf8"));

    console.log(`Loaded main DB from ${file_path}`);
  },

  loadFile: function (arg0_file) {
    //Declare local instance variables
    var file_path = path.join(__dirname, "..", arg0_file);

    //Evaluate file contents
    try {
      var rawdata = fs.readFileSync(file_path);
      eval(rawdata.toString());
    } catch (e) {
      console.error(`Failed to load ${file_path}.`);
      console.error(e);
    }
  },

  loadFileAsJSON: function (arg0_file_path) {
    //Convert from parameters
    var file_path = arg0_file_path;

    //Return statement
    return JSON.parse(fs.readFileSync(file_path, "utf8"));
  },

  save: function (arg0_file_path) {
    //Convert from parameters
    var file_path = (arg0_file_path) ? arg0_file_path : "./database.json";

    fs.writeFileSync("./database.json", JSON.stringify(main, null, 2));
    console.log(`Saved main DB to ${file_path}`);
  }
};
