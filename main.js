//Error handling
process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', function (reason, p) {
    console.error('Unhandled Rejection:', reason);
});

//File directories to load into Eoscala
global.load_order = {
  load_directories: [
    "common",
    "core",
    "UF"
  ],
  load_files: []
};

//Import Core Framework
global.FileManager = require("./core/file_manager");

//Node.js imports
//Non-CommonJS imports
async function loadH5Wasm() {
    var h5wasm = await import('h5wasm');
    global.h5wasm = h5wasm.default; //Assign import to the global namespace
}
loadH5Wasm();

//CommonJS imports
global.child_process = require("child_process");
global.cubic_spline = require("cubic-spline");
global.fs = require("fs");
global.mathjs = require("mathjs");
global.ml_matrix = require("ml-matrix");
global.netcdfjs = require("netcdfjs");
global.readline = require("readline");
global.path = require("path");
global.pngjs = require("pngjs");
global.tensorflow = require("@tensorflow/tfjs");
global.v8 = require("v8");

//Add main variable for proxy models to be built off of
global.main = {
  models: {},
  sedac_domain: [1990, 2015]
};

//Load all scripts
FileManager.loadAllScripts();
global.log.prefix = "[Eoscala]";

//Global CLI handling
{
  function clearRequireCache () {
      log.info("Reloading project files...");
      Object.keys(require.cache).forEach((key) => {
          delete require.cache[key];
      });
  }

  function splitCommandLine (arg0_input) {
    //Convert from parameters
    var input = arg0_input;

    //Declare local instance variables
    var args = [];
    var current_arg = "";
    var in_quotes = false;

    //Iterate over input tokens
    for (var i = 0; i < input.length; i++) {
      if (input[i] == '"') {
        in_quotes = (!in_quotes);
      } else if (input[i] == " " && !in_quotes) {
        if (current_arg.length > 0) {
          args.push(current_arg);
          current_arg = "";
        }
      } else {
        current_arg += input[i];
      }
    }

    //Push to args if possible
    if (current_arg.length > 0)
      args.push(current_arg);

    //Return statement
    return args;
  }

  function reloadDependencies () {
    //Call FileManager to re-evaluate all scripts. This should force function-based redefinitions.
    FileManager.loadAllScripts();
  }
}

//CLI handling
{
  //Set up global.cli. This must be defined outside a function.
  global.cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });
  //Log init settings
  log.info(`[Eoscala] Initialised with:`);
  log.info(`[Eoscala] - RAM allocation: ${v8.getHeapStatistics().heap_size_limit/1024/1024} MB`);

  function handleCLI () {
    //Run Eoscala frame
    cli.question("[Eoscala] > ", (input_string) => {
        if (input_string.toLowerCase() === "exit") {
          log.info("Exiting Eoscala.");

          //Break CLI
          cli.close();
        } else if (input_string.toLowerCase() === "reload") {
          reloadDependencies();
          handleCLI();
        } else {
          var args = splitCommandLine(input_string);

          if (args.length > 0) {
            //Handle command line
            handleCommandLine(args);
          }

          //KEEP AT BOTTOM!
          handleCLI(); //Refresh CLI loop
        }
    });
  }
}

//Start CLI; startup process
handleCLI();
log.info(`Calling startup process.`);
startup();
log.info(`Startup process complete.`);