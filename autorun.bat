@echo off
:loop
cls
echo Eoscala 1.1/Velkscala 0.6. Historical Economic Statistics.
node --max-old-space-size=128000 --expose-gc --trace-uncaught "main.js"
pause
goto loop
