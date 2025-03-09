@echo off
:loop
cls
echo Eoscala v0.1a. Historical Economic Statistics.
node --max-old-space-size=128000 --expose-gc --trace-uncaught "main.js"
pause
goto loop
