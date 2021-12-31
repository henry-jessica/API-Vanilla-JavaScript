
// Below is the API which returns data of the current covid -19 incidents of the country
function ab() {
  const country = localStorage.getItem("country");
  console.log(country);
  const API_KEY = 'dff496b32emsh804bcc469c8db50p11f794jsn6f2a52fc28e9';

  // RapidAPI host
  const rapidApiHost = "covid-19-data.p.rapidapi.com";
  covidcases(country);
  fetchTravelStatus(country);
  fetchData(country);
  function covidcases(Country) {
    fetch(`https://covid-19-data.p.rapidapi.com/country?name=${Country}`, {
      headers: {
        "x-rapidapi-host": rapidApiHost,
        "x-rapidapi-key": API_KEY
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        renderCovidHistory(data[0])
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}
window.onload = ab();

function fetchTravelStatus(country_name) {
  fetch(`https://eu-covid-19-travel.p.rapidapi.com/travel/${country_name}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "eu-covid-19-travel.p.rapidapi.com",
      "x-rapidapi-key": "8c3dc06293msh94e84c30ec66810p1d8bb8jsn7852d910f2a0",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data[0])
      renderTravelStatus(data[0]);
    })
    .catch((err) => {
      console.error(err);
    });
}
function renderTravelStatus(data) {
  console.log('travel status', data);
  if (typeof data == "undefined") {
    html = `<h3 style='text-align: center'>Search EU-country for travel status</h3>`;
    $(html).hide().appendTo(".situation").fadeIn(3000);
    $(".situation").addClass("black-borders");
  } else {
    html = `
      <h3 style='text-align: center;'>Travel Status&emsp;<span class='dot' style='background-color: ${data.colour
      };'></span></h3><br>
      <h5 style='font-weight: bold;'>Status: ${data.travel_status}</h5><br>
      <h5 style='font-weight: bold;'>Posivity rate (out of all tested): ${data.national_positivity_rate.toFixed(
        2
      )}%</h5><br><br>
  <div id="status">
   <h1>${data.colour}</h1>
   <p>${data.travel_status}</p>
   </div>
   `;
    $(html).hide().appendTo(".situation").fadeIn(3000);
    $(".situation").addClass("black-borders");
    let div = document.getElementById('status');
    div.style.padding = '2rem';
    div.style.color = "white";

    //checing status color 

    if (data.colour == "Green") {
      div.style.backgroundColor = "green";
    }
    else if (data.colour == "Orange") {
      div.style.backgroundColor = "Orange";
    }
    else {
      div.style.backgroundColor = "red";
    }

  }
}

function renderCovidHistory(data) {
  html = `
      <h3 style='text-align: center;'>Covid-19 Stats</h3><br>
      <h5 style='font-weight: bold;'>Registered confirmed cases: ${data.confirmed > 1000000
      ? (data.confirmed / 1000000).toFixed(2) + " million"
      : (data.confirmed / 100000).toFixed(1) + " hundred thousand"
    }</h5><br>
      <h5 style='font-weight: bold;'>Registered recovery cases: ${data.recovered > 1000000
      ? (data.recovered / 1000000).toFixed(2) + " million"
      : (data.recovered / 100000).toFixed(1) + " hundred thousand"
    }</h5><br>
      <h5 style='font-weight: bold;'>Death cases: ${data.deaths}</h5><br><br>`;
  $(html).hide().appendTo(".ratios").fadeIn(3000);
  $(".ratios").addClass("black-borders");
}
//Clear previously shown data
function clearPage() {
  if ($(".country__img") !== undefined) {
    $(".nation-flag").empty();
    $(".ratios").removeClass("black-borders").empty();
    $(".situation").removeClass("black-borders").empty();
  }
}

function fetchData(country) {
  fetch(
    `https://restcountries.com/v3.1/name/${country}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `The country you searched "${$(
            ".search-input"
          ).val()}" doesn't exist ☹ , please try again`
        );
      }
      data = res.json();
      return data;
    })
    .then((data) => {
      if ($(".main-content").css("display") == "none") {
        $(".main-content").css("display", "block").hide().fadeIn();
      }
      renderNationFlag(data[0]);
      const correctInput =
        $(".search-input").val().charAt(0).toUpperCase() +
        $(".search-input").val().substring(1);
      fetchCovidHistory($(".search-input").val());
      fetchTravelStatus(correctInput);
    })
}

// Adding country flag
function renderNationFlag(data) {
  console.log(data);
  html = `<img class="country__img" src="${data.flags.png}" /><br><br><h2 style='font-weight: bold;'>${data.name.common}</h2>`;
  $(html).hide().appendTo(".nation-flag").fadeIn(2000);
}