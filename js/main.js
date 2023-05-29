window.addEventListener('load',init);

//Global vars
let apiUrl = "webservice";
let artData = {};
let gallery;
let detailModal;
let detailModalContent;
let detailModalCloseButton;
let favoriteItems = [];
//functions on start of site

function init() {
    gallery = document.getElementById('gallery');
    gallery.addEventListener('click',cardClickHandlerDetail);
    gallery.addEventListener('click',cardClickHandlerFav);

    detailModal = document.getElementById('art-detail');
    detailModalContent = detailModal.querySelector('.modal-content');
    detailModalCloseButton = detailModal.querySelector('.modal-close');
    detailModalCloseButton.addEventListener('click', detailModalCloseClickHandler);


    //loads local storage into favorites array and changes class
    let favoritesString = localStorage.getItem('favorites');
    if (favoritesString !== null) {
        favoriteItems = JSON.parse(favoritesString)
        for(let favorite of favoriteItems){
            setTimeout(setClassFavorite, 500, favorite);
        }
    }

    ajaxRequest(apiUrl,createCard);

}

/**
 * AJAX gets from webservice
 *
 * @param url
 * @param successHandler
 */
function ajaxRequest(url, successHandler){
   fetch(url)
       .then((response) => {if(!response.ok){
           throw new Error(response.statusText);
       }
       return response.json();
       })
       .then(successHandler)
       .catch(ajaxErrorHandler);
}
/**
 *
 * @param data
 */
function createCard(data){
    //Loop through the list of art
    for (let art of data) {
        //Wrapper element for every card. We need the wrapper now, because adding it later
        //will result in art being ordered based on the load times of the API instead of chronically
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = art.name;
        card.dataset.cardId = art.id;
        //Append card to the actual HTML
        gallery.appendChild(card);

        //Element for art
        let image = document.createElement('img');
        image.src = art.link;
        card.appendChild(image);


        //Element for the name of the art piece
        let title = document.createElement('h2');
        title.innerHTML = `${art.name}`;
        card.appendChild(title);


        //Elements for the buttons for the details and to favorite
        let button1 = document.createElement('button');
        button1.innerHTML = 'Favorite';
        button1.dataset.favId = art.id;
        button1.classList.add("buttonFav")
        card.appendChild(button1);

        let button2 = document.createElement('button');
        button2.innerHTML = 'Details';
        button2.dataset.detailId = art.id;
        button2.classList.add("buttonDetail")
        card.appendChild(button2);

        //Store art data globally for later use in other functions
        artData[art.id] = art;


    }
}


/**
 *
 * @param data
 */
//Displays error when called
function ajaxErrorHandler(data)
{
    let error = document.createElement('div');
    error.classList.add('error');
    error.innerHTML = 'Er is helaas iets fout gegaan met de API, probeer het later opnieuw';
    gallery.before(error);
}


function cardClickHandlerFav(e) {
    let clickedItem = e.target;


    //Check if the user clicked on a button
    if (clickedItem.nodeName !== 'BUTTON') {
        return;
    }
    //Check if the correct class button is clicked
    if(!clickedItem.classList.contains('buttonFav')){
        return;
    }
    //Check what id the card has
    let favorite = clickedItem.dataset.favId;

    if(favoriteItems.includes(favorite)){
        removeItem(favorite)
    }else {
        addFavoriteItem(favorite);

    }
}

function cardClickHandlerDetail(e) {
    let clickedItem = e.target;

    //Check if the user clicked on a button
    if (clickedItem.nodeName !== 'BUTTON') {
        return;
    }
    //Check if the correct class button is clicked
     if(!clickedItem.classList.contains('buttonDetail')){
         return;
    }
    //Get the information from the global stored data
    let art = artData[clickedItem.dataset.detailId];

    //Reset the content
    detailModalContent.innerHTML = '';

    //Show the name of the art piece
    let title = document.createElement('h1');
    title.innerHTML = `${art.name}`;
    detailModalContent.appendChild(title);

    //Create img
    let img = document.createElement('img');
    img.src = art.link;
    detailModalContent.appendChild(img);

    //Create description using the left over data in JSON file
     let description = document.createElement(`h2`);
     description.innerHTML= `This piece is made using ${art.sort} in ${art.date}`;
    detailModalContent.appendChild(description);


    //Open the modal
    detailModal.classList.add('open');
}

/**
 * Close the modal
 *
 * @param e
 */
function detailModalCloseClickHandler(e)
{
    detailModal.classList.remove('open');
}

/**
 *
 * @param favorite
 */
//Adds clicked card to favorites in local storage and to the array
function addFavoriteItem(favorite) {
    favoriteItems.push(favorite);
    localStorage.setItem(`favorites`, JSON.stringify(favoriteItems));
    setClassFavorite(favorite)


}
/**
 *
 * @param favorite
 */
//Changes class, changes button text and removes clicked card from array and local storage
function removeItem(favorite){
    let favoriteCard = document.querySelector(`[data-card-id='${favorite}']`)
    favoriteCard.classList.replace('favorite', 'card')
    let favoriteCardButton = document.querySelector(`[data-fav-id='${favorite}']`)
    favoriteCardButton.innerHTML="Favorite"
    let favoritePosition = favoriteItems.indexOf(favorite);
    favoriteItems.splice(favoritePosition, 1);
    localStorage.setItem('favorites', JSON.stringify(favoriteItems));

}


//Changes class to favorite and changes button text
function setClassFavorite(favorite){
let favoriteCard = document.querySelector(`[data-card-id='${favorite}']`)
    let favoriteCardButton = document.querySelector(`[data-fav-id='${favorite}']`)
    favoriteCard.classList.replace('card', 'favorite');
    favoriteCardButton.innerHTML='Un-Favorite';
}

