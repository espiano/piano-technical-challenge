# Piano Technical Assessment

##Configuration
Both implementations rely on `.env` (not included) for credentials. You can use `.env.example` to create that file.

## JS (Node)
This project makes use of the latest stable version of Node (v12.16.1). Run the demo with:
```
npm install
node demo.js
```
The result outputs to `sample-files/merged.csv`.

##PHP
This project makes use of PHP 7.3 features (flexible HEREDOC). Run the demo with:
```
composer install
php demo.php
```
The result outputs to `sample-files/mergedPhp.csv`.