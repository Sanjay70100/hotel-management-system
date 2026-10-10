@echo off
title GrandStay Royale - Hotel Management Backend
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
set "MAVEN_HOME=C:\Program Files\apache-maven-3.9.16"
set "PATH=%JAVA_HOME%\bin;%MAVEN_HOME%\bin;%PATH%"

echo ==============================================================
echo  GrandStay Royale Suites - Hotel Management System
echo  Backend: Spring Boot 3.5.6 (Port: 8080)
echo  Frontend: http://localhost:8080/
echo ==============================================================

"%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run
pause
