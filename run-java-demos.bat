@echo off
echo =================================================================
echo   HEALTH ^& CARE — JAVA DESKTOP DEMONSTRATION LAUNCHER
echo =================================================================
cd /d "%~dp0java-demonstrations"
call "C:\Users\User\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd" exec:java
pause
