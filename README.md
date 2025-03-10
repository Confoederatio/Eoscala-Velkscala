# Eoscala/Velkscala

![](https://github.com/Australis-0/Eoscala-Velkscala/blob/main/eoscala/gdp_ppp_rasters/gdp_ppp_1850.png)

### <div align = "center">Global Economic and Population Data, 10000BC-2023AD.</div>
<div align = "center">Figure 1. GDP (PPP) in FY2000 International Dollars, 100s in AD1850.</div>

<div align = "center">-</div>
<br>
<img src = "https://i.postimg.cc/m2xCLYYh/crd-logo.png" height = "64">

[![Join our community!](https://img.shields.io/discord/548994743925997570?label=Discord&style=for-the-badge)](https://discord.gg/89kQY2KFQz) ![](https://img.shields.io/github/languages/code-size/Australis-0/Eoscala-Velkscala?style=for-the-badge) ![](https://img.shields.io/github/downloads/Australis-0/Eoscala-Velkscala/total?style=for-the-badge)

**Abstract.**

Eoscala 1.0/Velkscala 0.5 are twin projects focusing on the global historical modelling of demographic and economic data overtime at a 5-arcminute resolution (4320x2160, WGS84 Equirectangular). These rasters are currently provided at 1000-year intervals from 10000BC to 1AD, at 100-year intervals from 1AD to 1700AD, at 10-year intervals from 1700AD to 1950AD, and at 1-year intervals from 1950AD to 2023AD. Eoscala's data is reliable to 2022AD, and Velkscala's data to 2023AD.

This database is subject to future routine updates to improve model and data accuracy, as well as to expand the scope of available gridded raster data. Make sure to read each release paper for the full methodology.

**Data & Papers.**

Eoscala 1.0/Velkscala 0.5.
- [📝 Paper](https://github.com/Australis-0/Eoscala-Velkscala/blob/main/Eoscala%201.0-Velkscala%200.5%20-%20A%20Gridded%20Reconstruction%20of%20Global%20GDP%20and%20Population%20from%2010000BC%20to%20the%20Present.pdf) | [📈 Eoscala 1.0 Rasters](https://github.com/Australis-0/Eoscala-Velkscala/tree/main/eoscala) | [👥 Velkscala 0.5 Rasters](https://github.com/Australis-0/Eoscala-Velkscala/tree/main/velkscala)
  
  - Note: The current model includes the full source-code, but is not yet cross-compatible and fully operable on most devices. Use source code with caution. 2000BC data is not currently provided.
 
**Decoding and Encoding.**

RGBA rasters can be decoded as follows for each pixel: `((r << 24) | (g << 16) | (b << 8) | a) >>> 0`, where the resultant integer contains the given cell value (i.e. population/GDP PPP, 100s). RGBA rasters may be encoded via an inverse function: `r = (number >> 24) & 0xFF, g = (number >> 16) & 0xFF, b = (number >> 8) & 0xFF, number & 0xFF`. Make sure to use these methods when interpreting pixel values.

**File Formatting.**

__Eoscala.__
Negative years represent BC, and postive years represent AD. 0 is used in place of 1AD.<br>
Eoscala's file directories are divided into the following folders:
- `./eoscala/economic_activity_rasters` - Organically modelled OLS-based proxies for potential economic activity at each time interval.
- `./eoscala/gdp_ppp_rasters` - Gridmaps reflecting actual GDP PPP per cell, in 100s of FY2000 International Dollars.

__Velkscala.__
Velkscala's file directories are contained within `./velkscala/`, and follow a HYDE naming scheme. Note that a `_number.png` prefix denotes a raw integer raster file, and `_percentage.png` denotes a relative percentage raster file, where the g channel contains percentile values in 0,5%-step resolution. 0AD is used in place of 1AD. Non-demographic land-use data is sourced from [HYDE3.3](https://geo.public.data.uu.nl/vault-hyde/HYDE%203.3[1710493486]/original/hyde33_c7_lower_mrt2023/zip/).
- `conv_rangeland`: Converted Rangeland (km^2/cell)
- `cropland`: Cropland (km^2/cell)
- `grazing`: Grazing Land (km^2/cell)
- `ir_norice`: Irrigated Non-Rice Cropland (km^2/cell)
- `ir_rice`: Irrigated Rice Cropland (km^2/cell)
- `pasture`: Pasture Area (km^2/cell)
- `rangeland`: Rangeland Area (km^2/cell)
- `rf_norice`: Rainfed Non-Rice Cropland (km^2/cell)
- `rf_rice`: Rice Cropland (km^2/cell)
- `shifting`: Manual Weight Changes (HYDE3.3)
- `tot_irri`: Irrigated Area (km^2/cell)
- `tot_rainfed`: Rainfed Non-Rice Cropland (km^2/cell)
- `tot_rice`: Rice Cropland (km^2/cell)
<br><br>
- `popc_`: Total Population (pop/cell)
- `popd_`: Population Density (pop/km^2)
- `rurc_`: Rural Population (pop/cell)
- `uopp_`: Built-Up Area (km^2/cell)
- `urbc_`: Urban Population (pop/cell)

Relevant model weighting data for Eoscala ML models, including the base OLS HYDE-SEDAC model, may be found in the `./models/` folder.

Regional subdivisions mentioned in papers may be found as follows:
- [Eoscala Regions](https://github.com/Australis-0/Eoscala-Velkscala/blob/main/subdivisions/regional_subdivisions.png)
- [McEvedy Subdivisions](https://github.com/Australis-0/Eoscala-Velkscala/blob/main/subdivisions/mcevedy_subdivisions.png)
- [World Bank Subdivisions](https://github.com/Australis-0/Eoscala-Velkscala/blob/main/subdivisions/world_bank_subdivisions.png)

Their JSON values are currently hardcoded in source, with future plans for modularisation.
