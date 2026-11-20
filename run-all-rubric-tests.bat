@echo off
echo =================================================================
echo   HEALTH ^& CARE — COMPULSORY ACADEMIC RUBRIC VERIFICATION
echo =================================================================
cd /d "%~dp0java-demonstrations"
echo Running automated verification of AWT, Swing, JavaFX, SQLite and MySQL...
call "C:\Users\User\.m2\wrapper\dists\apache-maven-3.9.9-bin\33b4b2b4\apache-maven-3.9.9\bin\mvn.cmd" exec:java "-Dexec.args=all-tests"
pause
