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

//global variables

let appData = [];
let casesList = [];
let recoveredList = [];
let deathsList = [];
let datesList = [];
let formatedDates = [];

let userCountry = '';

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};


function resetList () {
  casesList = []
  recoveredList = []
  deathsList = []
  datesList = []
  formatedDates = []
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
          userCountryAbb = countryCode
        }
      });

      fetchData(userCountryFull, userCountryAbb);
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

// https://covid-api.mmediagroup.fr/v1/history?ab=DE&status=deaths
// https://covid-api.mmediagroup.fr/v1/cases?ab=${country}
/*                API URL AND KEY                 */

const fetchData = (country, code) => {
  console.log(country + '' + code)
  userCountry = country; //
  countryNameElement.innerHTML = 'Loading...';

  resetList();

  const apiFetch = async (code) => {

    await fetch(
      `https://covid-api.mmediagroup.fr/v1/history?ab=${code}&status=confirmed`,
      options
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        valueOfDate = Object.values(data.All.dates)
        dates = Object.keys(data.All.dates)

        dates.forEach((entry) => {
          datesList.push(entry);

        });

        valueOfDate.forEach((entry) => {
          casesList.push(entry)
        });

        console.log(datesList)
        console.log(casesList)

      });

      console.log('here1')

      await fetch(
        `https://covid-api.mmediagroup.fr/v1/history?ab=${code}&status=deaths`,
        options
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          valueOfDate = Object.values(data.All.dates)
          valueOfDate.forEach((entry) => {
            deathsList.push(entry)
          });
          
        });
        
        updateUi();

      }

  apiFetch(code)
};

// Update Ui

console.log('here1')

const updateUi = async () => {
   updateStats()
   axesLinearChart()
}

const updateStats = () => {

  console.log(casesList.length)
  const totalCasesCount = casesList[0] // ???
  const newConfirmedCasesCount = totalCasesCount - casesList[1] /// ???

  const totalDeathsCount = deathsList[deathsList.length - 1]
  const newDeathsCasesCount = totalDeathsCount - deathsList[deathsList - 2]

  countryNameElement.innerHTML = userCountry;
  totalCasesElement.innerHTML = totalCasesCount
  newTotalCasesElement.innerHTML = `+${newConfirmedCasesCount} new cases today`
  deathsElement.innerHTML = totalDeathsCount;
  newDeathsElement.innerHTML = `+${newDeathsCasesCount}`
}



// format date

  // format dates
  datesList.forEach((date) => {
    formatedDates.push(formatDate(date));
  });


// UPDATE CHART
let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  console.log(casesList)

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: casesList,
          fill: false,
          borderColor: "#FFF",
          backgroundColor: "#FFF",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deathsList,
          fill: false,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
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
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}





