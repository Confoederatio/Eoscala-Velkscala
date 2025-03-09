//Initialise functions
{
  global.getMaddisonPopulation = function (arg0_year) {
    //Convert from parameters
    var year = parseInt(arg0_year);

    //Declare local instance variables
    var hyde_population_file_path = `./output/HYDE_png/popc_${Math.abs(year)}${(year >= 0) ? "AD" : "BC"}_number.png`;
    var world_bank_subdivisions_file_path = `./geographic_datasets/world_bank_subdivisions_for_ppp_calculations/world_bank_subdivisions.png`;

    var population_image = loadNumberRasterImage(hyde_population_file_path);
    var world_bank_subdivisions_image = loadWorldBankSubdivisions(world_bank_subdivisions_file_path).data;

    //Iterate over all pixels
    for (var i = 0; i < population_image.width*population_image.height; i++) {
      var local_index = i*4; //RGBA index
      var local_x = i % population_image.width;
      var local_y = Math.floor(i/population_image.width);

      var local_data = population_image.data[i];
      var local_country = getCountryObjectByRGB([
        world_bank_subdivisions_image[local_index],
        world_bank_subdivisions_image[local_index + 1],
        world_bank_subdivisions_image[local_index + 2]
      ]);

      if (local_country)
        if (!local_country.population) local_country.population = {};
        modifyValue(local_country.population, year.toString(), local_data);
    }
  };

  global.getMaddisonPopulations = function (arg0_options) {
    //Convert from parameters
    var options = (arg0_options) ? arg0_options : {};

    //Declare local instance variables
    var hyde_years = getHYDEYears();

    //Iterate over all hyde_years
    for (var i = 0; i < hyde_years.length; i++) try {
      getMaddisonPopulation(hyde_years[i]);
      console.log(`Fetching Maddison population for ${hyde_years[i]} ..`);
    } catch (e) {
      console.error(e);
    }

    //Write to DB if enabled
    if (!options.do_not_save) {
      FileManager.save();
      console.log(`getMaddisonPopulation() - Saved current DB to default path.`);
    }
  };

  global.getMaddisonSubdivisions = function () {
    //Declare local instance variables
    var countries_obj = {
      afghanistan: {
        name: "Afghanistan",
        id: "afghanistan"
      },
      albania: {
        name: "Albania",
        id: "albania"
      },
      angola: {
        name: "Angola",
        id: "angola"
      },
      united_arab_emirates: {
        name: "United Arab Emirates",
        id: "united_arab_emirates"
      },
      argentina: {
        name: "Argentina",
        id: "argentina"
      },
      armenia: {
        name: "Armenia",
        id: "armenia"
      },
      australia: {
        name: "Australia",
        id: "australia"
      },
      austria: {
        name: "Austria",
        id: "austria"
      },
      azerbaijan: {
        name: "Azerbaijan",
        id: "azerbaijan"
      },
      burundi: {
        name: "Burundi",
        id: "burundi"
      },
      belgium: {
        name: "Belgium",
        id: "belgium"
      },
      benin: {
        name: "Benin",
        id: "benin"
      },
      burkina_faso: {
        name: "Burkina Faso",
        id: "burkina_faso"
      },
      bangladesh: {
        name: "Bangladesh",
        id: "bangladesh"
      },
      bulgaria: {
        name: "Bulgaria",
        id: "bulgaria"
      },
      bahrain: {
        name: "Bahrain",
        id: "bahrain"
      },
      bosnia_and_herzegovina: {
        name: "Bosnia and Herzegovina",
        id: "bosnia_and_herzegovina"
      },
      belarus: {
        name: "Belarus",
        id: "belarus"
      },
      bolivia: {
        name: "Bolivia (Plurinational State of)",
        id: "bolivia"
      },
      brazil: {
        name: "Brazil",
        id: "brazil"
      },
      barbados: {
        name: "Barbados",
        id: "barbados"
      },
      botswana: {
        name: "Botswana",
        id: "botswana"
      },
      central_african_republic: {
        name: "Central African Republic",
        id: "central_african_republic"
      },
      canada: {
        name: "Canada",
        id: "canada"
      },
      switzerland: {
        name: "Switzerland",
        id: "switzerland"
      },
      chile: {
        name: "Chile",
        id: "chile"
      },
      china: {
        name: "China",
        id: "china"
      },
      cote_d_ivoire: {
        name: "Côte d'Ivoire",
        id: "ivory_coast"
      },
      cameroon: {
        name: "Cameroon",
        id: "cameroon"
      },
      dr_congo: {
        name: "D.R. of the Congo",
        id: "dr_congo"
      },
      congo: {
        name: "Congo",
        id: "congo"
      },
      colombia: {
        name: "Colombia",
        id: "colombia"
      },
      comoros: {
        name: "Comoros",
        id: "comoros"
      },
      cabo_verde: {
        name: "Cabo Verde",
        id: "cabo_verde"
      },
      costa_rica: {
        name: "Costa Rica",
        id: "costa_rica"
      },
      czechoslovakia: {
        name: "Czechoslovakia"
      },
      cuba: {
        name: "Cuba",
        id: "cuba"
      },
      cyprus: {
        name: "Cyprus",
        id: "cyprus"
      },
      czech_republic: {
        name: "Czech Republic",
        id: "czech_republic"
      },
      germany: {
        name: "Germany",
        id: "germany"
      },
      djibouti: {
        name: "Djibouti",
        id: "djibouti"
      },
      dominica: {
        name: "Dominica",
        id: "dominica"
      },
      denmark: {
        name: "Denmark",
        id: "denmark"
      },
      dominican_republic: {
        name: "Dominican Republic",
        id: "dominican_republic"
      },
      algeria: {
        name: "Algeria",
        id: "algeria"
      },
      ecuador: {
        name: "Ecuador",
        id: "ecuador"
      },
      egypt: {
        name: "Egypt",
        id: "egypt"
      },
      spain: {
        name: "Spain",
        id: "spain"
      },
      estonia: {
        name: "Estonia",
        id: "estonia"
      },
      ethiopia: {
        name: "Ethiopia",
        id: "ethiopia"
      },
      finland: {
        name: "Finland",
        id: "finland"
      },
      france: {
        name: "France",
        id: "france"
      },
      gabon: {
        name: "Gabon",
        id: "gabon"
      },
      united_kingdom: {
        name: "United Kingdom",
        id: "united_kingdom"
      },
      georgia: {
        name: "Georgia",
        id: "georgia"
      },
      ghana: {
        name: "Ghana",
        id: "ghana"
      },
      guinea: {
        name: "Guinea",
        id: "guinea"
      },
      gambia: {
        name: "Gambia",
        id: "the_gambia"
      },
      guinea_bissau: {
        name: "Guinea Bissau",
        id: "guinea_bissau"
      },
      equatorial_guinea: {
        name: "Equatorial Guinea",
        id: "equatorial_guinea"
      },
      greece: {
        name: "Greece",
        id: "greece"
      },
      guatemala: {
        name: "Guatemala",
        id: "guatemala"
      },
      china_hong_kong: {
        name: "China, Hong Kong SAR"
      },
      honduras: {
        name: "Honduras",
        id: "honduras"
      },
      croatia: {
        name: "Croatia",
        id: "croatia"
      },
      haiti: {
        name: "Haiti",
        id: "haiti"
      },
      hungary: {
        name: "Hungary",
        id: "hungary"
      },
      indonesia: {
        name: "Indonesia",
        id: "indonesia"
      },
      india: {
        name: "India",
        id: "india"
      },
      ireland: {
        name: "Ireland",
        id: "ireland"
      },
      iran: {
        name: "Iran (Islamic Republic of)",
        id: "iran"
      },
      iraq: {
        name: "Iraq",
        id: "iraq"
      },
      iceland: {
        name: "Iceland",
        id: "iceland"
      },
      israel: {
        name: "Israel",
        id: "israel"
      },
      italy: {
        name: "Italy",
        id: "italy"
      },
      jamaica: {
        name: "Jamaica",
        id: "jamaica"
      },
      jordan: {
        name: "Jordan",
        id: "jordan"
      },
      japan: {
        name: "Japan",
        id: "japan"
      },
      kazakhstan: {
        name: "Kazakhstan",
        id: "kazakhstan"
      },
      kenya: {
        name: "Kenya",
        id: "kenya"
      },
      kyrgyzstan: {
        name: "Kyrgyzstan",
        id: "kyrgyzstan"
      },
      cambodia: {
        name: "Cambodia",
        id: "cambodia"
      },
      republic_of_korea: {
        name: "Republic of Korea",
        id: "south_korea"
      },
      kuwait: {
        name: "Kuwait",
        id: "kuwait"
      },
      lao_peoples_dr: {
        name: "Lao People's DR",
        id: "laos"
      },
      lebanon: {
        name: "Lebanon",
        id: "lebanon"
      },
      liberia: {
        name: "Liberia",
        id: "liberia"
      },
      libya: {
        name: "Libya",
        id: "libya"
      },
      saint_lucia: {
        name: "Saint Lucia",
        id: "saint_lucia"
      },
      sri_lanka: {
        name: "Sri Lanka",
        id: "sri_lanka"
      },
      lesotho: {
        name: "Lesotho",
        id: "lesotho"
      },
      lithuania: {
        name: "Lithuania",
        id: "lithuania"
      },
      luxembourg: {
        name: "Luxembourg",
        id: "luxembourg"
      },
      latvia: {
        name: "Latvia",
        id: "latvia"
      },
      morocco: {
        name: "Morocco",
        id: "morocco"
      },
      republic_of_moldova: {
        name: "Republic of Moldova",
        id: "republic_of_moldova"
      },
      madagascar: {
        name: "Madagascar",
        id: "madagascar"
      },
      mexico: {
        name: "Mexico",
        id: "mexico"
      },
      tfyr_of_macedonia: {
        name: "TFYR of Macedonia",
        id: "macedonia"
      },
      mali: {
        name: "Mali",
        id: "mali"
      },
      malta: {
        name: "Malta",
        id: "malta"
      },
      myanmar: {
        name: "Myanmar",
        id: "burma"
      },
      montenegro: {
        name: "Montenegro",
        id: "montenegro"
      },
      mongolia: {
        name: "Mongolia",
        id: "mongolia"
      },
      mozambique: {
        name: "Mozambique",
        id: "mozambique"
      },
      mauritania: {
        name: "Mauritania",
        id: "mauritania"
      },
      mauritius: {
        name: "Mauritius",
        id: "mauritius"
      },
      malawi: {
        name: "Malawi",
        id: "malawi"
      },
      malaysia: {
        name: "Malaysia",
        id: "malaysia"
      },
      namibia: {
        name: "Namibia",
        id: "namibia"
      },
      niger: {
        name: "Niger",
        id: "niger"
      },
      nigeria: {
        name: "Nigeria",
        id: "nigeria"
      },
      nicaragua: {
        name: "Nicaragua",
        id: "nicaragua"
      },
      netherlands: {
        name: "Netherlands",
        id: "netherlands"
      },
      norway: {
        name: "Norway",
        id: "norway"
      },
      nepal: {
        name: "Nepal",
        id: "nepal"
      },
      new_zealand: {
        name: "New Zealand",
        id: "new_zealand"
      },
      oman: {
        name: "Oman",
        id: "oman"
      },
      pakistan: {
        name: "Pakistan",
        id: "pakistan"
      },
      panama: {
        name: "Panama",
        id: "panama"
      },
      peru: {
        name: "Peru",
        id: "peru"
      },
      philippines: {
        name: "Philippines",
        id: "philippines"
      },
      poland: {
        name: "Poland",
        id: "poland"
      },
      puerto_rico: {
        name: "Puerto Rico",
        id: "puerto_rico"
      },
      dpr_of_korea: {
        name: "D.P.R. of Korea",
        id: "north_korea"
      },
      portugal: {
        name: "Portugal",
        id: "portugal"
      },
      paraguay: {
        name: "Paraguay",
        id: "paraguay"
      },
      state_of_palestine: {
        name: "State of Palestine",
        id: "palestine"
      },
      qatar: {
        name: "Qatar",
        id: "qatar"
      },
      romania: {
        name: "Romania",
        id: "romania"
      },
      russian_federation: {
        name: "Russian Federation",
        id: "russia"
      },
      rwanda: {
        name: "Rwanda",
        id: "rwanda"
      },
      saudi_arabia: {
        name: "Saudi Arabia",
        id: "saudi_arabia"
      },
      sudan_former: {
        name: "Sudan (Former)",
        id: "sudan"
      },
      senegal: {
        name: "Senegal",
        id:  "senegal"
      },
      singapore: {
        name: "Singapore",
        id: "singapore"
      },
      sierra_leone: {
        name: "Sierra Leone",
        id: "sierra_leone"
      },
      el_salvador: {
        name: "El Salvador",
        id: "el_salvador"
      },
      serbia: {
        name: "Serbia",
        id: "serbia"
      },
      sao_tome_and_principe: {
        name: "Sao Tome and Principe",
        id: "sao_tome_and_principe"
      },
      former_ussr: {
        name: "Former USSR"
      },
      slovakia: {
        name: "Slovakia",
        id: "slovakia"
      },
      slovenia: {
        name: "Slovenia",
        id: "slovenia"
      },
      sweden: {
        name: "Sweden",
        id: "sweden"
      },
      swaziland: {
        name: "Swaziland",
        id: "swaziland"
      },
      seychelles: {
        name: "Seychelles",
        id: "seychelles"
      },
      syrian_arab_republic: {
        name: "Syrian Arab Republic",
        id: "syria"
      },
      chad: {
        name: "Chad",
        id: "chad"
      },
      togo: {
        name: "Togo",
        id: "togo"
      },
      thailand: {
        name: "Thailand",
        id: "thailand"
      },
      tajikistan: {
        name: "Tajikistan",
        id: "tajikistan"
      },
      turkmenistan: {
        name: "Turkmenistan",
        id: "turkmenistan"
      },
      trinidad_and_tobago: {
        name: "Trinidad and Tobago",
        id: "trinidad_and_tobago"
      },
      tunisia: {
        name: "Tunisia",
        id: "tunisia"
      },
      turkey: {
        name: "Turkey",
        id: "turkey"
      },
      taiwan_province_of_china: {
        name: "Taiwan, Province of China",
        id: "taiwan"
      },
      ur_of_tanzania: {
        name: "U.R. of Tanzania: Mainland",
        id: "tanzania"
      },
      uganda: {
        name: "Uganda",
        id: "uganda"
      },
      ukraine: {
        name: "Ukraine",
        id: "ukraine"
      },
      uruguay: {
        name: "Uruguay",
        id: "uruguay"
      },
      united_states: {
        name: "United States",
        id: "united_states"
      },
      uzbekistan: {
        name: "Uzbekistan",
        id: "uzbekistan"
      },
      venezuela: {
        name: "Venezuela (Bolivarian Republic of)",
        id: "venezuela"
      },
      viet_nam: {
        name: "Viet Nam",
        id: "vietnam"
      },
      yemen: {
        name: "Yemen",
        id: "yemen"
      },
      former_yugoslavia: {
        name: "Former Yugoslavia"
      },
      south_africa: {
        name: "South Africa",
        id: "south_africa"
      },
      zambia: {
        name: "Zambia",
        id: "zambia"
      },
      zimbabwe: {
        name: "Zimbabwe",
        id: "zimbabwe"
      }
    };

    //Return statement
    return countries_obj;
  };
}
