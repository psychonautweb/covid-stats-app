// Target all elements

const latestReportHelper = document.querySelector('.latest-report'); //helper

const countryNameElement = document.querySelector('.country .name');
const totalCasesElement = latestReportHelper.querySelector(
  '.total-cases .value'
);
const newTotalCasesElement = latestReportHelper.querySelector(
  '.total-cases .new-value'
);
const recoveredElement = latestReportHelper.querySelector('.recovered .value');
const newRecoveredElement = latestReportHelper.querySelector(
  '.recovered .new-value'
);
const deathsElement = latestReportHelper.querySelector('.deaths .value');
const newDeathsElement = latestReportHelper.querySelector('.deaths .new-value');

//select canvas for chartJS
const ctx = document.getElementById('axes_line_chart').getContext('2d');

//app variables

let appData = [];
let casesList = [];
let recoveredList = [];
let deathsList = [];
let datesList = [];

// Get users country code using geolocation API

const API_KEY = 'pk.5dda2a04ec08d2da359b8da73fb99ed8'
//get https://eu1.locationiq.com/v1/search.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&q=serbia&format=json
// https://eu1.locationiq.com/v1/search.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&q=de&format=json
// this would return json with info about germany ???

let countryCode = '//I need to extract country code here using api 1:15:30';
let userCountry;

countryList.forEach((country) => {
    if (country.code == countryCode) // if our country list code is same as the one we get from API than that's user country code/name
})


/* ---------------------------------------------- */
/*                API URL AND KEY                 */
/* ---------------------------------------------- */
/*
fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=country`, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
			"x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
		}
	})
*/
