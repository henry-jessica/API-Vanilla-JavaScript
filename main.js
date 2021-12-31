const area = document.getElementById("location");
const checkIn = document.getElementById("check-in");
const checkOut = document.getElementById('check-out');
const maxPrice = document.getElementById('max-price');
const minPrice = document.getElementById('min-price');
const guasts = document.getElementById('guasts');
const covidDetails = document.getElementById("covidDetails");
const covidInfoBox = document.getElementById('info-covid-box');
const search = document.getElementById('search');
const hotelListElement = document.getElementById('hotel-list');
const loadMore = document.getElementById('load-more');

var covidInfo = [];

const parametersObjects = {
    // REQUIRED PARAMETERS 
    checkin_date: '2022-03-26',
    checkout_date: '2022-03-27',
    sort_order: 'STAR_RATING_HIGHEST_FIRST',
    adults_number: 1,
    destination_id: '697795',
    locale: 'en_IE',
    currency: 'EUR',
};

let hotelList = [];

let searchPlace = 'Sligo';
let startNum = 0, endNum = 5;

// API_KEY '37aa3d20ecmsh14c3a3d70759fe3p1a2135jsn5cb128cc5a0e'
// API_KEY '08301aa950msh5d7db6116501b4dp1766f5jsn61a07487769d'
// const API_KEY = '3a41ba70-56dd-11ec-ad6b-695001827bb9';
// const API_KEY = '6860aec399mshae8bea32ae112e9p109292jsnb82b44cd653b';
// const API_KEY = '6db1e5b532msh22c091f888769c3p1a770fjsn227e72dfcab3';
const API_KEY = 'dff496b32emsh804bcc469c8db50p11f794jsn6f2a52fc28e9';

// RapidAPI host
const rapidApiHost = "covid-19-data.p.rapidapi.com";

//get event 
area.addEventListener("change", e => {
    searchPlace = e.target.value;
});

checkIn.value = new Date(new Date().setHours(0, 0, 0, 0)).toLocaleDateString('fr-CA');
checkOut.value = new Date(+new Date().setHours(0, 0, 0, 0) + 86400000).toLocaleDateString('fr-CA');


//getting events click search and values 
checkIn.addEventListener('change', e => {
    parametersObjects.checkin_date = e.target.value;

});

checkOut.addEventListener('change', e => {
    parametersObjects.checkout_date = e.target.value;
});

maxPrice.addEventListener('change', e => {
    parametersObjects.price_max = e.target.value;
});

minPrice.addEventListener('change', e => {
    parametersObjects.price_min = e.target.value;
});


//sincronising click 
search.addEventListener('click', async e => {


    e.preventDefault();
    const destination = await rapidAPIFetchLocation(searchPlace);
    if (destination === null) {
        console.log("Location not found - ");
    } else {
        console.log("Destination - ", destination);
        parametersObjects.destination_id = destination.destinationId;
        rapidAPIFetchHotel();
        loadMore.style.display = "block";
    }
    sessionStorage.removeItem("detail")
});

//showing just 5 hotels per page 
loadMore.addEventListener('click', (e) => {
    e.preventDefault();
    const increasedBy = 5;
    if (endNum < hotelList.length) {
        endNum += increasedBy;
        const sliceList = hotelList.slice(startNum, endNum);
        showAllItems(sliceList, hotelListElement, stringToDOM);
    }
});
//search by parameters
const rapidAPIFetchHotel = async () => {
    const params = new URLSearchParams(parametersObjects);
    console.log("Hit");
    try {
        const options = {
            method: "GET",
            headers: {
                "x-rapidapi-host": 'hotels-com-provider.p.rapidapi.com',
                "x-rapidapi-key": API_KEY


            }
        };
        const requestURL = `https://hotels-com-provider.p.rapidapi.com/v1/hotels/search?` + params;
        const response = await fetch(requestURL, options);

        const text = await response.text();
        const jsonRes = JSON.parse(text);
        console.log("JSON response - ", jsonRes);

        displayTravelalert(jsonRes.searchResults.results[0].address.countryName);
        hotelList = jsonRes.searchResults.results;
        console.log(jsonRes.searchResults.results[0]);

        // FILTER FIVE ITEM FROM HERE
        const sliceList = hotelList.slice(startNum, endNum);
        showAllItems(sliceList, hotelListElement, stringToDOM);
    } catch (error) {
        console.log(error);
    }
}

const rapidAPIFetchLocation = async (place) => {
    try {
        // query=new%20york&locale=en_US&currency=USD"
        const queryLocation = new URLSearchParams({
            query: place.toLowerCase(),
            currency: "EUR",
            locale: "en_IE"

        });
        const options = {
            method: "GET",
            headers: {
                "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
                "x-rapidapi-key": API_KEY
            }
        };

        const requestURL = "https://hotels-com-provider.p.rapidapi.com/v1/destinations/search?" + queryLocation;
        const response = await fetch(requestURL, options);
        const text = await response.text();
        const jsonRes = JSON.parse(text);
        console.log("get destination JSON Response - ", jsonRes);
        for (let i = 0; i < jsonRes.suggestions.length; i++) {
            if (jsonRes.suggestions[i].group === "CITY_GROUP") {
                for (let j = 0; j < jsonRes.suggestions[i].entities.length; j++) {
                    if (jsonRes.suggestions[i].entities[j].name === place) {
                        return jsonRes.suggestions[i].entities[j];
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.log(error);
    }
}

//passing the hotelDetail a parameter which includes the details of the hotel like countryName etc.

function hotelDetail(Country) {
    fetch(`https://covid-19-data.p.rapidapi.com/country?name=${Country}`, {
        headers: {
            "x-rapidapi-host": rapidApiHost,
            "x-rapidapi-key": API_KEY
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayCases(data[0]);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

function displayCases(infected) {

    Swal.fire({
        title: 'Covid Status in ' + infected.country,
        html: "  Confirmed Cases: " + infected.confirmed +
            "    Recoverd Cases: " + infected.recovered +
            "    Critical: " + infected.critical +
            "    Deaths: " + infected.deaths,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Check more details'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                newFunction(infected.country)
            )
        }
    })
    const covdidRender = `
                <li class="character"> <h1> Covid Details</h1></li>
                <li class="character">
                    <h5> Country:${infected.country}</h5>   
                </li> 
                <li class="character">  <h5> Confirmed Cases: ${infected.confirmed}</h5>  </li>
                <li class="character">  <h5> Recoverd Cases:${infected.recovered}</h5> </li>
                <li class="character">  <h5>Critical:${infected.critical}</h5>  </li> 
                <li class="character">  <h5>Deaths: ${infected.deaths}</h5>  </li> 
`
}

function newFunction(country) {
    localStorage.setItem("country", country);
    window.location.href = "covid-status.html";
}

function displayTravelalert(country) {
    const article = `
       <article class=" row covid-message">
               <h3>Travel alert</h3>
               <div>
               <span>Check</span>
                 <a class="check-covid" onclick="hotelDetail('${country}')">COVID-19 status in ${country}</a>
               </div>
        </article>
`
    covidInfoBox.innerHTML = " ";
    covidInfoBox.appendChild(stringToDOM(article));
}

// HELPERS FUNCTIONS 
const stringToDOM = (stringElement) => {
    const composer = new DOMParser();
    const dragged = composer.parseFromString(stringElement, "text/html");
    const rootNode = dragged.getRootNode();
    const domElement = rootNode.body;
    return domElement;
}

// DISPLAY ELEMENT 
const showAllItems = (hItems, hlElement) => {

    const date1 = new Date(checkIn.value);
    const date2 = new Date(checkOut.value);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");

    if (hlElement.hasChildNodes()) {
        let last;

        while (last = hlElement.lastChild) hlElement.removeChild(last);
    }
    hItems.forEach((hotel, hI) => {
        //calculate review 
        const ratingCalc = hotel.guestReviews.rating / hotel.guestReviews.scale * 10;

        //calcule days 
        const totalDays = diffDays * hotel.ratePlan.price.current;

        //check special offer 
        if (typeof hotel.ratePlan.price.old === 'undefined') {
            hotel.ratePlan.price.old = ' ';
        }

        const hotelstr = `
        <div class="col">
              <div class="row">
                       </div>
                          <div class="row">
                        <div class="card mt-4">
                                <!-- No #${hI + 1} -->
                                 ${hotel.starRating} Star

                                    <div class="row">
                                    <div class="col-4">
                                    <img src="${hotel.optimizedThumbUrls.srpDesktop}" class="card-img-top p-4" alt="...">
                                     </div>
                                     <div class="col-6">
                                     <div class="card-body pt-4">
                                        <h5 class="card-title">${hotel.name}</h5><span></span>
                                        <h6 class="card-subtitle mb-2 text-muted">${hotel.address.streetAddress}, ${hotel.address.locality}, ${hotel.address.countryName}</h6>
                                        <p>${hotel.neighbourhood}</p>
                                         <ul>
                                            <li>${hotel.landmarks[0].distance} to ${hotel.landmarks[0].label}</li>
                                            <li>${hotel.landmarks[1].distance} to ${hotel.landmarks[1].label}</li>
                                        </ul>
                                        <span class="card-text">${ratingCalc.toFixed(1)}</span>
                                        <span>${hotel.guestReviews.badgeText}</span>
                                         <p>${hotel.guestReviews.total}  - Hotel.com guest reviews</p>
                                        <button class="btn-primary more-info" key={${hI}} id="btn" onclick="ab('${hotel.optimizedThumbUrls.srpDesktop}','${hotel.name}','${hotel.id}')" >More Info</button>
                                    </div>
                                 
                                  </div>
                                        <div class="col-2 text-right">
                                        <span class="old-price">${hotel?.ratePlan?.price?.old}</span>
                                        <p class="new-price">${hotel.ratePlan.price.current}</p>
                                        <p >${hotel.ratePlan.price.info}</p>
                                        <p>${hotel.ratePlan.price.summary}</p>
                                     
                                    </div>
                                 
                              </div>
                          </div>
                     </div>
                    </div>
                `
            ;
        //insert element to body 
        hlElement.appendChild(stringToDOM(hotelstr));
    });
}

//creating a new page to display hotels details 
function ab(img, name, id) {


    localStorage.setItem("img", img);
    localStorage.setItem("name", name);
    localStorage.setItem("id", id);
    window.location.href = "hotel-page.html";
}




////Passing the variable to display characters so in order to display the hotels in the list
// const displayCharacters = (characters) => {
//     const htmlString = characters
//         .map((character) => {
//             return `
//             <li class="character">
//                 <h2>${character.name}</h2> 
//                 <button onclick="hotelDetail('${character.address.countryName}')" class="button-55" >Details</button>
//             </li>
//         `;
//         })
//         .join("");
//     charactersList.innerHTML = htmlString;
// };
// //onClick this function will be called and the country's data will be dislayed
// const displayCases = (infected) => {
//     const htmlString = infected
//         .map((infected) => {
//             return `
//             <li class="character"> <h1> Covid Details</h1></li>
//             <li class="character">
//                 <h5> Country:${infected.country}</h5>   
//             </li> 
//             <li class="character">  <h5> Confirmed Cases: ${infected.confirmed}</h5>  </li>
//             <li class="character">  <h5> Recoverd Cases:${infected.recovered}</h5> </li>
//             <li class="character">     <h5>Critical:${infected.critical}</h5>  </li> 
//             <li class="character"> <h5>Deaths: ${infected.deaths}</h5>  </li> 
//         `;
//         })
//         .join("");
//     covidDetails.innerHTML = htmlString;
// };

//this one is working on console but the pane number is not dinamic
// function hotelDetail(countryName) {
//     const url = `https://covid-19-data.p.rapidapi.com/report/country/name?name=${countryName}&date=2020-04-01`;
//     fetch(url, {
//         headers: {
//             "x-rapidapi-host": rapidApiHost,
//             "x-rapidapi-key": API_KEY,
//         },
//     })
//         .then((response) => {
//             return response.json();
//         })
//         .then((data) => {
//             console.log(data);
//             for (let i = 0; i < 20; i++) {
//                 console.log(data._embedded.events[i]);
//             }
//             console.log(data);

//             // displayCovidData(data[0])

//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }
