// Target DOM elements ////////////////

const latestReportHelper = document.querySelector('.latest-report'); //helper

const countryNameElement = document.querySelector('.country .name');
const totalCasesElement = latestReportHelper.querySelector(
  '.total-cases .value'
);
const newTotalCasesElement = latestReportHelper.querySelector(
  '.total-cases .new-value'
);
const dateOfDataRetrievalElement =
  latestReportHelper.querySelector('.global .value');

const deathsElement = latestReportHelper.querySelector('.deaths .value');
const newDeathsElement = latestReportHelper.querySelector('.deaths .new-value');

// Section Summary Lower Part TABLE

const table = document.getElementById('countries-stats');

//select canvas for chartJS
const ctx = document.getElementById('axes_line_chart').getContext('2d');

//////////////////////////////////

// Global Variables /////////////

let casesList = [];
let globalTotalCases = [];

let globalNewCasesConfirmed = [];
let globalNewDeathsConfirmed = [];

let deathsList = [];
let formatedDates = [];
let globalList = [];
let userCountryFull = '';
let userCountryAbb = '';
var dates = [];

let dateOfData = [];

let userCountry = 'Global'; // default loads info for global

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow',
};

// resets arrays of global Vars after you change country so it doesn't append again and again
function resetList() {
  casesList = [];
  globalList = [];
  deathsList = [];
  dates = [];
  formatedDates = [];
  globalTotalCases = [];
  globalTotalDeaths = [];

  globalNewDeathsConfirmed = [];
  globalNewCasesConfirmed = [];

  dateOfData = [];
}

function addGeoToLocalStorage(countryAbb) {
  localStorage.setItem('key', countryAbb);
}

// Get users Latitude and Longitude and pass it to Geocoding Api, LocationIq

// const showCountryCode = (position) => {
//   let latitude = position.coords.latitude;
//   let longitude = position.coords.longitude;

//   const apiUrl = `https://eu1.locationiq.com/v1/reverse.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=${latitude}&lon=${longitude}&format=json`;

//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       let countryCode = data.address.country_code.toUpperCase(); // extract country code

//       countryList.forEach((country) => {
//         if (country.code == countryCode) {
//           userCountryFull = country.name; // I used abb here instead of name!
//           userCountryAbb = countryCode;
//         }
//       });

//  if (!localStorage.getItem('key')) {
//  addGeoToLocalStorage(userCountryAbb)
//  }

//       fetchData(userCountryFull, userCountryAbb);
//       //////////
//     });
// };

// const getUsersLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showCountryCode);
//   } else {
//     alert('Geolocation is not supported by this browser.');
//   }
// };

// getUsersLocation();

const selectCountryForDataRetrieval = () => {
  //setuj lokaciju na Global kao default lokaciju
  userCountry = 'global';
};

//get https://eu1.locationiq.com/v1/search.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&q=serbia&format=json
//https://eu1.locationiq.com/v1/nearby.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=44.7744753&lon=17.1815871

/*                API URL AND KEY                 */

const fetchDataOnLoad = () => {
  countryNameElement.innerHTML = 'Select Country...';

  if (userCountry === 'Global') {
    resetList();

    const apiFetch = async () => {
      if (userCountry === 'Global') {
        await fetch(`https://api.covid19api.com/summary`, options)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            globalNewCasesConfirmed.push(data.Global.NewConfirmed);
            globalTotalCases.push(data.Global.TotalConfirmed);
            globalNewDeathsConfirmed.push(data.Global.NewDeaths);
            globalTotalDeaths.push(data.Global.TotalDeaths);
            dateOfData = data.Date;
          });
      }
      updateUi();
    };
    apiFetch();
  }
};

fetchDataOnLoad();

const fetchData = (country, code) => {
  console.log(country + '' + code);
  userCountry = country;
  countryNameElement.innerHTML = 'Loading';

  resetList();

  const apiFetch = async (code) => {
    if (userCountry !== 'Global') {
      await fetch(
        `https://api.covid19api.com/total/dayone/country/${code}/status/confirmed`,
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
          dateOfData = data[data.length - 1].Date;
        });

      await fetch(
        `https://api.covid19api.com/total/dayone/country/${code}/status/deaths`,
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
    }

    // ako nije global run this // ovo cemo izvrsiti nakon getLocation
    // samo ako je loggedIn ili ako je manuelno selektovan

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
  let totalCasesCount,
    newConfirmedCasesCount,
    totalDeathsCount,
    newDeathsCasesCount,
    dateFormat,
    globalPopulationCount;

  if (userCountry !== 'Global') {
    totalCasesCount = casesList[casesList.length - 1];
    newConfirmedCasesCount = totalCasesCount - casesList[casesList.length - 2];
    totalDeathsCount = deathsList[deathsList.length - 1];
    newDeathsCasesCount = totalDeathsCount - deathsList[deathsList.length - 2];

    dateFormat = new Date(dateOfData);
    globalPopulationCount = dateFormat.toLocaleString();
  } else {
    totalCasesCount = globalTotalCases;
    newConfirmedCasesCount = globalNewCasesConfirmed;
    totalDeathsCount = globalTotalDeaths;
    newDeathsCasesCount = globalNewDeathsConfirmed;

    dateFormat = new Date(dateOfData);
    globalPopulationCount = dateFormat.toLocaleString();
  }

  //

  countryNameElement.innerHTML = userCountry;

  totalCasesElement.innerHTML = totalCasesCount.toLocaleString('sr-RS');
  newTotalCasesElement.innerHTML = `+${newConfirmedCasesCount.toLocaleString('sr-RS')}`;

  deathsElement.innerHTML = totalDeathsCount.toLocaleString('sr-RS');
  newDeathsElement.innerHTML = `+${newDeathsCasesCount.toLocaleString('sr-RS')}`;

  dateOfDataRetrievalElement.innerHTML = `Updated at:<br/> 
  ${globalPopulationCount}
  `;

  // if user is auth //
  // geolocate user and store the value in local storage
  // update UI with the users state
  // update chart with state info
  // update info cards with state info
  // list of countries (aside el) should not be available
  // leave comparison options available
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

  if (userCountry === 'Global') {
    my_chart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Cases',
            data: globalTotalCases,
            fill: false,
            borderColor: 'black',
            backgroundColor: '#e9e28e',
            borderWidth: 1,
          },
          {
            label: 'Deaths',
            data: globalTotalDeaths,
            fill: false,
            borderColor: 'black',
            backgroundColor: '#f44336',
            borderWidth: 1,
          },
        ],
        labels: ['Global Stats'],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  } else {
    my_chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Cases',
            data: casesList,
            fill: false,
            borderColor: '#9b59b6',
            backgroundColor: '#9b59b6',
            borderWidth: 1,
          },
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

//Sort Table A - Z

function sortTable(n) {
  let tableCountries,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  tableCountries = document.getElementById('countries-stats');
  switching = true;
  // Set the sorting direction to ascending:
  dir = 'asc';
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = tableCountries.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName('TD')[n];
      y = rows[i + 1].getElementsByTagName('TD')[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == 'asc') {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == 'desc') {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == 'asc') {
        dir = 'desc';
        switching = true;
      }
    }
  }
}

//Sort Table Numeric

// Update comparison

// Table Update

fetch('https://covid-api.mmediagroup.fr/v1/cases', options)
  .then((response) =>
    response.json().then((data) => {
      console.log(data);
      let countries_stat = Object.entries(data);
      console.log(countries_stat);
      //Getting all the country statistic using a loop

      // data.COUNTRYi.All.something how to access target??

      console.log(countries_stat[0][1].All);

      for (let i = 0; i < countries_stat.length; i++) {
        //we will start by inserting the new rows inside our table
        let row = table.insertRow(i + 1);
        let country_name = row.insertCell(0);
        let cases = row.insertCell(1);
        let deaths = row.insertCell(2);
        let serious_critical = row.insertCell(3);
        let recovered_per_country = row.insertCell(4);
        country_name.innerHTML = countries_stat[i][0]; // name
        cases.innerHTML = countries_stat[i][1].All.confirmed;
        deaths.innerHTML = countries_stat[i][1].All.deaths;
        serious_critical.innerHTML = countries_stat[i][1].All.population; // !
        recovered_per_country.innerHTML = countries_stat[i][1].All.updated;
      }
    })
  )
  .catch((err) => {
    console.log(err);
  });
