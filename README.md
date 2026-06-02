# Eoscala/Velkscala

![](https://i.postimg.cc/P5ncBfd9/eoscala-gdp-ppp-1850-visualisation.png)

### <div align = "center">Global Economic and Population Data, 10000BC-2023AD.</div>
<div align = "center">Figure 1. GDP (PPP) in FY2000 International Dollars, 100s in AD1850.</div>

<div align = "center">-</div>
<br>
<img src = "https://i.postimg.cc/3ND2B1zL/crd-coat-of-arms-logo.png" height = "64">

[![Join our community!](https://img.shields.io/discord/548994743925997570?label=Discord&style=for-the-badge)](https://discord.gg/89kQY2KFQz) ![](https://img.shields.io/github/languages/code-size/Confoederatio/Eoscala-Velkscala?style=for-the-badge)

- E-mail: [vf@confoederatio.org](mailto:vf@confoederatio.org)

> [!NOTE]
> De-facto polity extents: [Atlas 0.5 (GeoJSON)](https://confoederatio.org/data/atlas_0.5b.json) | [Atlas 0.5 (Webview)](https://confoederatio.org/pages/dataview). De jure polity extents: [C-Shapes 2.0](https://icr.ethz.ch/data/cshapes/).<br>
> City extents, names, and populations are available at [Stadestér 1.0 (JSON/Raster)](https://doi.org/10.5281/zenodo.17180328).
>
> Map editing tools can be installed from [Naissance](https://github.com/ConfoederatioVF/Naissance).

## Abstract:

Eoscala/Velkscala are twin projects focusing on the global historical modelling of demographic and economic data overtime at a 5-arcminute resolution (4320x2160, WGS84 Equirectangular). These rasters are currently provided at 1000-year intervals from 10000BC to 1AD, at 100-year intervals from 1AD to 1700AD, at 10-year intervals from 1700AD to 1950AD, and at 1-year intervals from 1950AD to 2023AD. Eoscala's data is reliable to 2022AD, and Velkscala's data to 2023AD.

This database is subject to future routine updates to improve model and data accuracy, as well as to expand the scope of available gridded raster data. Make sure to read each release paper for the full methodology. Some input data has been omitted due to GitHub LFS limits; static development images are available upon request.

**Data & Papers.**

Eoscala 1.3/Velkscala 0.8.
- [📈 Eoscala 1.3 Rasters/Gini](https://github.com/ConfoederatioVF/EoscalaVelkscala/tree/main/eoscala) | [👥 Velkscala 0.8 Rasters](https://github.com/ConfoederatioVF/EoscalaVelkscala/tree/main/velkscala) | [📦 Release](https://github.com/Confoederatio/Eoscala-Velkscala/releases/tag/eoscala-1.3-velkscala-0.8)

Eoscala 1.2/Velkscala 0.7.
- [📈 Eoscala 1.2 Rasters](https://github.com/ConfoederatioVF/EoscalaVelkscala/tree/eoscala-1.2-velkscala-0.7/eoscala_1.2) | [👥 Velkscala 0.7 Rasters](https://github.com/ConfoederatioVF/EoscalaVelkscala/tree/eoscala-1.2-velkscala-0.7/velkscala_0.7) | [📦 Release](https://github.com/Confoederatio/Eoscala-Velkscala/releases/tag/eoscala-1.2-velkscala-0.7)

Eoscala 1.1/Velkscala 0.6.
- [📈 Eoscala 1.1 Rasters](https://github.com/Confoederatio/EoscalaVelkscala/tree/eoscala-1.1-velkscala-0.6/eoscala_1.0) | [👥 Velkscala 0.6 Rasters](https://github.com/Confoederatio/Eoscala-Velkscala/tree/eoscala-1.1-velkscala-0.6/velkscala_0.5) | [📦 Release](https://github.com/Confoederatio/Eoscala-Velkscala/releases/tag/eoscala-1.1-velkscala-0.6)

Eoscala 1.0/Velkscala 0.5.
- [📝 Paper](https://confoederatio.org/papers/Eoscala%201.0_Velkscala%200.5_%20A%20Gridded%20Reconstruction%20of%20Global%20GDP%20and%20Population%20from%2010000BC%20to%20the%20Present-4.pdf) | [📈 Eoscala 1.0 Rasters](https://github.com/Confoederatio/Eoscala-Velkscala/tree/eoscala-1.0-velkscala-0.5/eoscala) | [👥 Velkscala 0.5 Rasters](https://github.com/Confoederatio/Eoscala-Velkscala/tree/eoscala-1.0-velkscala-0.5/velkscala) | [📦 Release](https://github.com/Confoederatio/Eoscala-Velkscala/releases/tag/eoscala-1.0-velkscala-0.5)
 
**Decoding and Encoding.**

RGBA rasters can be decoded as follows for each pixel: `((r << 24) | (g << 16) | (b << 8) | a) >>> 0`, where the resultant integer contains the given cell value (i.e. population/GDP PPP, 100s). RGBA rasters may be encoded via an inverse function: `r = (number >> 24) & 0xFF, g = (number >> 16) & 0xFF, b = (number >> 8) & 0xFF, number & 0xFF`. Make sure to use these methods when interpreting pixel values.

## Eoscala:

Negative years represent BC, and postive years represent AD. 0 is used in place of 1AD.<br>
Eoscala's file directories are divided into the following folders:
- `./eoscala/economic_activity_rasters` - Organically modelled OLS-based proxies for potential economic activity at each time interval.
- `./eoscala/gini` - Wealth/income Gini coefficients from 21500BC-2018AD. Formatted as geolocated/coded `.csv`.
- `./eoscala/gdp_ppp_rasters` - Gridmaps reflecting actual GDP PPP per cell, in 100s of FY2000 International Dollars.

In general, Eoscala's economic activity were informed by an OLS model over HYDE-SEDAC (Kummu-extended) stocks from 1990-2015, which were then dasymetrically backcalculated over HYDE for LU and Velkscala for population. Potential economic activity prior to 1800AD were scaled to Maddison and Nordhaus to form GDP PPP, whilst data was scaled to Gapminder post-1800.

<ins>Eoscala (Gini).</ins>

<details open>
 <summary>Gini Headers:</summary>
 
Due to different file formats, Gini files have been split into premodern (`gini_-21500_1800.csv`) and modern files (`gini_1800_2018.csv`). Latlng coordinates from 21500BC-1800AD are rounded to two decimal places and should be viewed as approximate. 

- **gini_-21500_1800.csv**: Society, City/Site, Region, Polity, Year, Latitude, Longitude, Income Gini, Wealth Gini, Sources
- **gini_1800_2018.csv**: geo, name, time, Gini | Note: Name refers to country names, and time to year. Gini figures reflect income.
 
</details>
<details>
 <summary>Pre-industrial Gini (21500BC-1800AD):</summary>

1. Aboagye & Bolt (2018): [https://doi.org/10.1016/j.eeh.2021.101405](https://doi.org/10.1016/j.eeh.2021.101405)
2. Alfani (2021): [https://doi.org/10.1257/jel.20191449](https://doi.org/10.1257/jel.20191449)
3. Alfani et al. (2025): [https://doi.org/10.1038/s41467-025-58581-0](https://doi.org/10.1038/s41467-025-58581-0)
4. Alfania and Carballo (2023): [https://doi.org/10.1038/s41562-023-01636-3](https://doi.org/10.1038/s41562-023-01636-3)
5. Astorga-Junqueira (2017): [https://doi.org/10.1007/s11698-016-0150-9](https://doi.org/10.1007/s11698-016-0150-9)
6. Basri and Lawrence (2020): [https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/abs/wealth-inequality-in-the-ancient-near-east-a-preliminary-assessment-using-gini-coefficients-and-household-size/26E4D7CF79B5CEAEE7CDE5ED9C75E8ED](https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/abs/wealth-inequality-in-the-ancient-near-east-a-preliminary-assessment-using-gini-coefficients-and-household-size/26E4D7CF79B5CEAEE7CDE5ED9C75E8ED)
7. Battistoni and Martinez (2025): [https://doi.org/10.1111/roiw.70001](https://doi.org/10.1111/roiw.70001)
8. Beretola et al. (2010): [https://doi.org/10.1017/S021261091000011X](https://doi.org/10.1017/S021261091000011X)
9. Bigsten (1986, 2014): [https://doi.org/10.35188/UNU-WIDER/2014/847-6](https://doi.org/10.35188/UNU-WIDER/2014/847-6)
10. Bolt & Hillborn (2016): [https://doi.org/10.1111/ehr.12326](https://doi.org/10.1111/ehr.12326)
11. Canbakal (2014): [https://www.semanticscholar.org/paper/Wealth-and-inequality-in-Ottoman-lands-in-the-early-Canbakal-Filiztekin/66595b39c32cf9437cbc8fc990651b311c01c18b](https://www.semanticscholar.org/paper/Wealth-and-inequality-in-Ottoman-lands-in-the-early-Canbakal-Filiztekin/66595b39c32cf9437cbc8fc990651b311c01c18b)
12. Caruto et al. (2024): [https://doi.org/10.1017/S0956536123000111](https://doi.org/10.1017/S0956536123000111)
13. Castaneda-Garza & Bengtsson (2020): [doi:10.1017/S021261092400017X](https://doi.org/10.1017/S021261092400017X)
14. Castillos (1998) [https://www.egyptologyforum.org/bbs/uruguay/Castillos,_Inequality_in_Egyptian_predynastic_cemeteries,_1998.pdf](https://www.egyptologyforum.org/bbs/uruguay/Castillos,_Inequality_in_Egyptian_predynastic_cemeteries,_1998.pdf)
15. de Haas (2021): [https://academic.oup.com/ereh/article/26/2/255/6290253](https://academic.oup.com/ereh/article/26/2/255/6290253)
16. Duffy et al. (2024): [https://doi.org/10.21203/rs.3.rs-4844801/v1](https://doi.org/10.21203/rs.3.rs-4844801/v1)
17. Fitzgerald (2008): [https://doi.org/10.1002/jid.1511](https://doi.org/10.1002/jid.1511)
18. Fourie & von Fintel (2011): [https://eprints.lse.ac.uk/113838/1/Economic_inequality_in_Latin_America_and_Africa_1650_to_1950_Can_a_comparison_of_historical_trajectories_help_to_understand_underdevelopment.pdf](https://eprints.lse.ac.uk/113838/1/Economic_inequality_in_Latin_America_and_Africa_1650_to_1950_Can_a_comparison_of_historical_trajectories_help_to_understand_underdevelopment.pdf)
19. Fourie & von Fintel (2011): [https://www.tandfonline.com/doi/full/10.1080/20780389.2011.582990](https://www.tandfonline.com/doi/full/10.1080/20780389.2011.582990)
20. Furió et al (2020): [https://doi.org/10.36253/978-88-5518-053-5.14](https://doi.org/10.36253/978-88-5518-053-5.14)
21. GINI Project Database: [https://doi.org/10.15184/aqy.2023.188](https://doi.org/10.15184/aqy.2023.188), DB files accessed at: [https://core.tdar.org/collection/72000/gini-project-data-files](https://core.tdar.org/collection/72000/gini-project-data-files)
22. Kohler et al. (2017): [https://www.nature.com/articles/nature24646](https://www.nature.com/articles/nature24646)
23. Kumon (‘The Deep Roots of Inequality’, 2019): [https://ies.keio.ac.jp/upload/20190712appliedpaper.pdf](https://ies.keio.ac.jp/upload/20190712appliedpaper.pdf)
24. Meinzer (‘Regional living standards and inequality in Fifth – Eighth Century Alamannia’, 2020): [https://files.ehs.org.uk/wp-content/uploads/2020/11/29060833/2016-Conference-Booklet.pdf#page=20](https://files.ehs.org.uk/wp-content/uploads/2020/11/29060833/2016-Conference-Booklet.pdf#page=20)
25. Mulder et al. (2009): [https://doi.org/10.1126/science.1178336](https://doi.org/10.1126/science.1178336)
26. Rodriguez Weber (2015): [https://www.colibri.udelar.edu.uy/jspui/bitstream/20.500.12008/4681/1/DOL%20UM%2036.pdf](https://www.colibri.udelar.edu.uy/jspui/bitstream/20.500.12008/4681/1/DOL%20UM%2036.pdf) (ISSN: 1688-9037)
27. Rodriguez Weber (2017): [RePEc:col:000093:015838](https://ideas.repec.org/a/col/000093/015838.html)
28. Smith (2022): [https://www.heritageuniversityofkerala.com/JournalPDF/Volume10/1.pdf](https://www.heritageuniversityofkerala.com/JournalPDF/Volume10/1.pdf)
29. Stone (2018) in Ten Thousand Years of Inequality: [https://doi.org/10.2307/j.ctt20d8801](https://doi.org/10.2307/j.ctt20d8801)
30. Tadei and Alfani (2019): [https://dx.doi.org/10.2139/ssrn.3494245](https://dx.doi.org/10.2139/ssrn.3494245)
31. Thompson et al. (2021): [https://doi.org/10.1371/journal.pone.0248169](https://doi.org/10.1371/journal.pone.0248169)
32. Thompson et al. (2025): [https://doi.org/10.1073/pnas.2400699121](https://doi.org/10.1073/pnas.2400699121)
33. Williamson (2009): [https://cepr.org/voxeu/columns/latin-american-inequality-1491](https://cepr.org/voxeu/columns/latin-american-inequality-1491)
34. Williamson et al. (2008): [https://ideas.repec.org/p/afc/wpaper/08-06.html](https://ideas.repec.org/p/afc/wpaper/08-06.html)
35. Wronski (2022): [https://doi.org/10.1080/03585522.2022.2148736](https://doi.org/10.1080/03585522.2022.2148736)

</details>

Post-1800 Gini was sourced from [Gapminder Gini v3](https://www.gapminder.org/data/documentation/gini/) and relies on geocoded national extents.

## Velkscala:

Velkscala's file directories are contained within `./velkscala/`, and follow a HYDE naming scheme. Note that a `_number.png` prefix denotes a raw integer raster file, and `_percentage.png` denotes a relative percentage raster file, where the g channel contains percentile values in 0,5%-step resolution. 0AD is used in place of 1AD. Non-demographic land-use data is sourced from [HYDE3.3](https://geo.public.data.uu.nl/vault-hyde/HYDE%203.3[1710493486]/original/hyde33_c7_lower_mrt2023/zip/). Demographic data was based on city populations from Stadestér/Velkscala fallback modelling. For pre-Columbian population modelling in the Americas, see <ins>Project Centaur</ins>.

ALCC data was geometrically averaged over the domain of KK10/LUH2, and was used for demographic fallback modelling in HYDE outlier regions.

- `alcc`: Anthropogenic Land Cover (%/cell)
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

Regional subdivisions mentioned in papers may be found as follows as unique RGBA-coded ID rasters.
- [Eoscala Regions](https://github.com/Confoederatio/Eoscala-Velkscala/blob/main/subdivisions/regional_subdivisions.png)
- [McEvedy Subdivisions](https://github.com/Confoederatio/Eoscala-Velkscala/blob/main/subdivisions/mcevedy_subdivisions.png)
- [World Bank Subdivisions](https://github.com/Confoederatio/Eoscala-Velkscala/blob/main/subdivisions/world_bank_subdivisions.png)

Note that custom subdivisions are currently unavailable, though you can script your own analysis and statistical visualisation functions. R statistical tie-ins are available on the main production repository at [https://github.com/Confoederatio/Eoscala-Velkscala-Production](https://github.com/Confoederatio/Eoscala-Velkscala-Production).
