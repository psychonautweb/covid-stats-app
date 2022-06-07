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

// Get users Latitude and Longitude and pass it to Geocoding Api, LocationIq

const showCountryCode = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  const apiUrl = `https://eu1.locationiq.com/v1/nearby.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=${latitude}&lon=${longitude}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      let countryCode = data[0].address.country_code; // extract country code
      let userCountry;
      countryList.forEach((country) => {
        if (country.code == countryCode) {
          userCountry = country.code; // I used abb here instead of name!
        }
      });
      fetchData(userCountry);
    });
};

const getUsersLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showCountryCode);
  } else {
    alert('Geolocation is not supported by this browser.');
  }
};

getUsersLocation();

//get https://eu1.locationiq.com/v1/search.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&q=serbia&format=json
// https://covid-api.mmediagroup.fr/v1/history?ab=DE&status=deaths
//https://eu1.locationiq.com/v1/nearby.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=44.7744753&lon=17.1815871

/*                API URL AND KEY                 */

const fetchData = (userCountry) => {
	appData = [];
	casesList = [];
	recoveredList = [];
	deathsList = [];
	datesList = [];

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const api_fetch = (country) => {
     fetch(
      "https://covid-api.mmediagroup.fr/v1/history?ab=${userCountry}&status=confirmed",
      options
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
			console.log(entry)
        //   dates.push(entry.Date);
        //   casesList.push(entry.Cases);
        });
      });

     fetch(
      "https://covid-api.mmediagroup.fr/v1/history?ab=DE&status=deaths",
      options
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
			console.log(entry)
        //   deathsList.push(Object.values(entry.All.dates));
        });
      });

    updateUI();
  };

  api_fetch();
}

  fetch(`https://covid-api.mmediagroup.fr/v1/cases?ab=${userCountry}`, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      covidData = data;
      console.log(covidData);


    });


/* ---------------------------------------------- */
/*                     FETCH API                  */
/* ---------------------------------------------- */
