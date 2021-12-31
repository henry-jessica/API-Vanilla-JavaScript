const caro = document.getElementById("caroussel");

function ab() {
    document.getElementById("head").innerHTML = localStorage.getItem("name");

    let id = localStorage.getItem("id");

    fetch(`https://hotels-com-provider.p.rapidapi.com/v1/hotels/photos?hotel_id=${id}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "hotels-com-provider.p.rapidapi.com",
            "x-rapidapi-key": "dff496b32emsh804bcc469c8db50p11f794jsn6f2a52fc28e9"
        }
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            RenderData(data);

        })

        .catch(err => {
            console.error(err);
        });

}
function RenderData(data) {
    let img1 = document.getElementById('img1');
    img1.setAttribute('src', data[0].mainUrl)
    for (let i = 1; i < 10; i++) {
        const article = `
    <div class="carousel-item">
    <img id="img2" class="d-block w-20" src="${data[i].mainUrl}" alt="Third slide">
    </div>
  `
        $('#carol').append(article);
    }
}

window.onload = ab();

console.log(id);
