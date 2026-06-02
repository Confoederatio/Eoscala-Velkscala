@echo off
setlocal enabledelayedexpansion

for %%F in (nordhaus_adjusted_*_number.png) do (
    set "filename=%%~nF"
    rem Extract number between underscores
    for /f "tokens=3 delims=_" %%A in ("!filename!") do (
        ren "%%F" "gdp_ppp_%%A.png"
    )
)
