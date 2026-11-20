@echo off
echo =================================================================
echo   HEALTH ^& CARE — SPRING BOOT BACKEND SERVER (PORT 8080)
echo =================================================================
cd /d "%~dp0backend"
call "C:\Users\User\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run
pause
