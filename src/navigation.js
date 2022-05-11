//Cuando se cargue mi contenido 
window.addEventListener('DOMContentLoaded', navigator, false);
//haschange se activa cuando cambia el hash
window.addEventListener('haschange', navigator, false);


function navigator(){

    console.log({location});

    if (location.hash.startsWith('#trends')){
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
        searchPage();
    } else if (location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }  
    else if (location.hash.startsWith('#category=')){
        categoriesPage();
    } else {
        homePage();
    }
}

function homePage() {
    console.log('Home');
    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function categoriesPage() {
    console.log('Category');
}

function movieDetailsPage() {
    console.log('Movie');
}

function searchPage() {
    console.log('search!!');
}
function trendsPage() {
    console.log('TRENDS');
}