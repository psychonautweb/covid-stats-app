// Target all elements

const latestReportHelper = document.querySelector('.latest-report'); //helper

const countryNameElement = document.querySelector('.country .name');
const totalCasesElement = latestReportHelper.querySelector(
  '.total-cases .value'
);
const newTotalCasesElement = latestReportHelper.querySelector(
  '.total-cases .new-value'
);
const globalCasesElement = latestReportHelper.querySelector('.global .value');
const globalDeathCasesElement = latestReportHelper.querySelector(
  '.global .deaths-val'
);
const deathsElement = latestReportHelper.querySelector('.deaths .value');
const newDeathsElement = latestReportHelper.querySelector('.deaths .new-value');

//select canvas for chartJS
const ctx = document.getElementById('axes_line_chart').getContext('2d');

//global variables

// let appData = [];
let casesList = [];
let globalListConfirmed = [];
let globalDeathsConfirmed = [];
let deathsList = [];
let formatedDates = [];
let globalList = [];
let userCountryFull = ''
let userCountryAbb = ''
var dates = []

let userCountry = '';


const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
};

function resetList() {
  casesList = [];
  globalList = [];
  deathsList = [];
  dates = [];
  formatedDates = [];
  globalListConfirmed = []
  globalDeathsConfirmed = []
}
// Get users Latitude and Longitude and pass it to Geocoding Api, LocationIq

const showCountryCode = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  const apiUrl = `https://eu1.locationiq.com/v1/reverse.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=${latitude}&lon=${longitude}&format=json`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      let countryCode = data.address.country_code.toUpperCase(); // extract country code

      countryList.forEach((country) => {
        if (country.code == countryCode) {
          userCountryFull = country.name; // I used abb here instead of name!
          userCountryAbb = countryCode;
        }
      });
      fetchData(userCountryFull, userCountryAbb);
      //////////
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
//https://eu1.locationiq.com/v1/nearby.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=44.7744753&lon=17.1815871

/*                API URL AND KEY                 */

const fetchData = (country, code) => {

  console.log(country + '' + code);
  userCountry = country; //
  countryNameElement.innerHTML = 'Loading...';

  resetList();

  const apiFetch = async (code) => {
    await fetch(
      `https://api.covid19api.com/total/country/${code}/status/confirmed`,
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          dates.push(entry.Date);
          casesList.push(entry.Cases);
        });
      });

    await fetch(
      `https://api.covid19api.com/total/country/${code}/status/deaths`,
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          deathsList.push(entry.Cases);
        });
      });

    await fetch(`https://api.covid19api.com/summary`, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        globalListConfirmed.push(data.Global.TotalConfirmed);
        globalDeathsConfirmed.push(data.Global.TotalDeaths);
      });

    updateUi();
  };

  apiFetch(code);

};



// Update Ui

const updateUi = () => {
  updateStats();
  axesLinearChart();
};

const updateStats = () => {
  console.log(casesList.length);

  const totalCasesCount = casesList[casesList.length - 1]; // ???
  const newConfirmedCasesCount = totalCasesCount - casesList[casesList.length - 2]; /// ???

  const totalDeathsCount = deathsList[deathsList.length - 1];
  const newDeathsCasesCount =
    totalDeathsCount - deathsList[deathsList.length - 2];

  const totalGlobalCasesCount = globalListConfirmed;
  const newGlobalDeathsCasesCount = globalDeathsConfirmed;

  //

  countryNameElement.innerHTML = userCountry;

  totalCasesElement.innerHTML = totalCasesCount;
  newTotalCasesElement.innerHTML = `+${newConfirmedCasesCount} today`;

  deathsElement.innerHTML = totalDeathsCount;
  newDeathsElement.innerHTML = `+${newDeathsCasesCount} today`;

  globalCasesElement.innerHTML = `${totalGlobalCasesCount} total cases`;
  globalDeathCasesElement.innerHTML = `${newGlobalDeathsCasesCount} total deaths`;
};



// UPDATE CHART
let my_chart;
function axesLinearChart() {

// format dates

dates.forEach((date) => {
  formatedDates.push(formatDate(date));
});

  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Cases',
          data: casesList,
          fill: false,
          borderColor: '#FFF',
          backgroundColor: '#FFF',
          borderWidth: 1,
        },
        // {
        //   label: "Global",
        //   data: globalListConfirmed,
        //   fill: false,
        //   borderColor: "#009688",
        //   backgroundColor: "#009688",
        //   borderWidth: 1,
        // },
        {
          label: 'Deaths',
          data: deathsList,
          fill: false,
          borderColor: '#f44336',
          backgroundColor: '#f44336',
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// FORMAT DATES
const monthsNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}
