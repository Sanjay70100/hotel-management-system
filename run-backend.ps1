$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
$env:MAVEN_HOME = "C:\Program Files\apache-maven-3.9.16"
$env:Path = "$env:JAVA_HOME\bin;$env:MAVEN_HOME\bin;" + $env:Path

Write-Host "==============================================================" -ForegroundColor Yellow
Write-Host " GrandStay Royale Suites - Hotel Management System" -ForegroundColor Yellow
Write-Host " Backend:  http://localhost:8080/api/" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:8080/" -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Yellow

& "$env:MAVEN_HOME\bin\mvn.cmd" spring-boot:run
