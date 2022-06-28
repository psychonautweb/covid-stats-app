
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

//////// optimize this later > qselector
const selectedCountry1Element = document.getElementById('selected-country1');
const totalCasesCountry1Element = document.querySelector(
  '.country-1-total-cases .country-1-value'
);
const newCasesCountry1Element = document.querySelector(
  '.country-1-total-cases .country-1-new-value'
);
const deathCasesCountry1Element = document.querySelector(
  '.country-1-deaths .country-1-value'
);
const newDeathCasesCountry1Element = document.querySelector(
  '.country-1-deaths .country-1-new-value'
);

const selectedCountry2Element = document.getElementById('selected-country2');
const totalCasesCountry2Element = document.querySelector(
  '.country-2-total-cases .country-2-value'
);
const newCasesCountry2Element = document.querySelector(
  '.country-2-total-cases .country-2-new-value'
);
const deathCasesCountry2Element = document.querySelector(
  '.country-2-deaths .country-2-value'
);
const newDeathCasesCountry2Element = document.querySelector(
  '.country-2-deaths .country-2-new-value'
);

// Section Summary Lower Part TABLE

const table = document.getElementById('countries-stats');
const tbody = document.getElementById('tbody')

//select canvas for chartJS
const ctx = document.getElementById('axes_line_chart').getContext('2d');

//////////////////////////////////

// Global Variables /////////////

let casesList = [];
let globalTotalCases = [];
let globalTotalDeaths = []; // new

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

// Get users Latitude and Longitude and pass it to Geocoding Api, LocationIq // It happens after succesfull login

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
    
     if (!localStorage.getItem('key')) {
     addGeoToLocalStorage(userCountryAbb)
     }
    
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
    
    // getUsersLocation(); this is run if user is auth (firebase handled >> index.html)


const selectCountryForDataRetrieval = () => {
  //setuj lokaciju na Global kao default lokaciju
  userCountry = 'Global';
};

// try using this endpoint for spec countries >>> get last 2 days dynamically by using date method and -2 e.g.
//https://api.covid19api.com/total/country/US/status/confirmed?from=2022-06-15T00:00:00Z&to=2022-06-17T00:00:00Z
//get https://eu1.locationiq.com/v1/search.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&q=serbia&format=json
//https://eu1.locationiq.com/v1/nearby.php?key=pk.5dda2a04ec08d2da359b8da73fb99ed8&lat=44.7744753&lon=17.1815871

/*                API URL AND KEY                 */

const fetchDataOnLoad = (country) => {
  countryNameElement.innerHTML = 'Select Country...';
  userCountry = 'Global' //// this is just a temp workaround !!!
  resetList();

  const apiFetch = async () => {
    if (country === 'Global' || userCountry === 'Global') {
      await fetch(`https://api.covid19api.com/summary`, options)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          globalNewCasesConfirmed.push(data.Global.NewConfirmed);
          globalTotalCases.push(data.Global.TotalConfirmed);
          console.log(globalTotalCases + ' !!!!!!!!!')
          globalNewDeathsConfirmed.push(data.Global.NewDeaths);
          globalTotalDeaths.push(data.Global.TotalDeaths);
          dateOfData = data.Date;
        });
    }
    updateUi();
  };
  apiFetch();
};

fetchDataOnLoad();

const fetchData = (country, code, compareList, countryOneOrTwo) => {
  console.log(country + ' ' + code + ' ' + compareList);
  userCountry = country;
  countryNameElement.innerHTML = 'Loading';

  resetList();

  // this condition updates the data for comparison table based on passed compareList argument
  // this updates data for  chart and main stats table on the top

    const apiFetch = async (code) => {
      if (userCountry !== 'Global') {
        if (userCountry === ('USA' || 'US') || userCountry === ('France' || 'FR')) {
          let todaysDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format ... todaysDate.slice(8) - 2 >>> this way I could get last 2 days
  
          await fetch(
            `https://api.covid19api.com/total/country/${code}/status/confirmed?from=2022-01-01T00:00:00Z&to=${todaysDate}`,
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
            `https://api.covid19api.com/total/country/${code}/status/deaths?from=2022-01-01T00:00:00Z&to=${todaysDate}`,
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
        } else {
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
      }
  


    // ako nije global run this // ovo cemo izvrsiti nakon getLocation
    // samo ako je loggedIn ili ako je manuelno selektovan

    updateUi(compareList, countryOneOrTwo);
  };

  apiFetch(code);
};

////////////////////  UPDATE USER INTERFACE ///////////////////////////////////

const updateUi = (compareList, countryOneOrTwo) => {
  updateStats(compareList, countryOneOrTwo);
  axesLinearChart();
};

const updateStats = (compareList, countryOneOrTwo) => {
  let totalCasesCount,
    newConfirmedCasesCount,
    totalDeathsCount,
    newDeathsCasesCount,
    dateFormat,
    globalPopulationCount;

    console.log(compareList)

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

  console.log(totalCasesCount + ' !!!! ')

  totalCasesElement.innerHTML = totalCasesCount.toLocaleString('sr-RS');
  newTotalCasesElement.innerHTML = `+${newConfirmedCasesCount.toLocaleString(
    'sr-RS'
  )}`;

  deathsElement.innerHTML = totalDeathsCount.toLocaleString('sr-RS');
  newDeathsElement.innerHTML = `+${newDeathsCasesCount.toLocaleString(
    'sr-RS'
  )}`;

  dateOfDataRetrievalElement.innerHTML = `Updated at:<br/> 
  ${globalPopulationCount}
  `;

  ///// Compare Section UI Update Logic ///
  if (compareList) {
    if (countryOneOrTwo === 'country1') {
      selectedCountry1Element.innerText = userCountry;
      totalCasesCountry1Element.innerText = totalCasesCount.toLocaleString('sr-RS');
      newCasesCountry1Element.innerText = `+${newConfirmedCasesCount.toLocaleString(
        'sr-RS'
      )}`;
      deathCasesCountry1Element.innerText =
        totalDeathsCount.toLocaleString('sr-RS');
      newDeathCasesCountry1Element.innerText = `+${newDeathsCasesCount.toLocaleString(
        'sr-RS'
      )}`;
    } else if (countryOneOrTwo === 'country2')  {
      selectedCountry2Element.innerText = userCountry;
      totalCasesCountry2Element.innerText = totalCasesCount.toLocaleString('sr-RS');
      newCasesCountry2Element.innerText = `+${newConfirmedCasesCount.toLocaleString(
        'sr-RS'
      )}`;
      deathCasesCountry2Element.innerText =
        totalDeathsCount.toLocaleString('sr-RS');
      newDeathCasesCountry2Element.innerText = `+${newDeathsCasesCount.toLocaleString(
        'sr-RS'
      )}`;
    }


  }

  // if user is auth //
  // geolocate user and store the value in local storage??
  // update UI with the users state
  // update chart with state info
  // update info cards with state info
  // list of countries (aside el) should not be available
  // leave comparison options available
};

// -------------------------------------------------------------- //

// --------------  UPDATE CHART CHART JS -------------------------------------------------------- //
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

// // Table Update --------------- //////////////////

//used DOM drilling as a practice here // otherwise queryselector
const showSummaryButton = document.body.children[3].children[1];

showSummaryButton.addEventListener('click', function () {
  table.classList.toggle('hide')
})


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
        let row = tbody.insertRow(i);
        let country_name = row.insertCell(0);
        let cases = row.insertCell(1);
        let deaths = row.insertCell(2);
        let population = row.insertCell(3);
        let updated = row.insertCell(4);
        country_name.innerHTML = countries_stat[i][0]; // name
        cases.innerHTML = countries_stat[i][1].All.confirmed;
        deaths.innerHTML = countries_stat[i][1].All.deaths;

        // check if target is available to avoid displaying undefined
        if (countries_stat[i][1].All.population) {
          population.innerHTML = countries_stat[i][1].All.population; 
        } else {
          population.innerHTML = '0'; // !
        }
        if (countries_stat[i][1].All.updated) {
          updated.innerHTML = countries_stat[i][1].All.updated;
        } else {
          updated.innerHTML = '0'
        }

      }
    })
    )
  .catch((err) => {
    console.log(err);
  });



//// Table sorting // tablesort.min.js
document.querySelector('#countries-stats').tsortable()
// https://github.com/oleksavyshnivsky/tablesort

// ----------------- BACK TO TOP BUTTON ------------ ////////////

const showOnPx = 100;
const backToTopButton = document.querySelector(".back-to-top");

const scrollContainer = () => {
  return document.documentElement || document.body;
};

const goToTop = () => {
  document.body.scrollIntoView({
    behavior: "smooth"
  });
};

document.addEventListener("scroll", () => {
  // console.log("Scroll Height: ", scrollContainer().scrollHeight);
  // console.log("Client Height: ", scrollContainer().clientHeight);

  if (scrollContainer().scrollTop > showOnPx) {
    backToTopButton.classList.remove("hidden");
  } else {
    backToTopButton.classList.add("hidden");
  }
});

backToTopButton.addEventListener("click", goToTop);


