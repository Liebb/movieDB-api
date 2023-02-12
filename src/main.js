//Creando la instancia de AXIOS.
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/', 
    headers: {
        'Content-Type' : 'application/json;charset=utf-8',
    },
    //Nuestros query parameters, que siempre se enviarán a cada petición
    params: {
        'api_key' : API_KEY,
    },
});



//Utils-Helpers

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url);
        }
    });
});

function createMovies (movies, container, {lazyLoad = false, clean = true} = {}) {

    if (clean) {
        
        //Para limpiar datos repetidos
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        })

        const movieImg = document.createElement('img');
        //Añado la clase
        movieImg.classList.add('movie-img');
        //El objeto movie tiene entre sus propiedades el titulo de la pelicula que será mi alt
        movieImg.setAttribute('alt', movie.title);

        
        //posther path tiene el enlace de la imagen que quiero mostrar.
        movieImg.setAttribute(
            lazyLoad ? 'data-img': 'src', 
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        );

        
        movieImg.addEventListener('error', ()=>{
            movieImg.setAttribute('src', 'https://static.platzi.com/images/error/img404.png');
        })

            
        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
} 

function createCategories(categories, container) {
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id','id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

//Llamadas a la API
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day');
    console.log(data);
    const movies = data.results; 
    console.log('busca movie => ',data);
    createMovies(movies, trendingMoviesPreviewList, true);
}
async function getCategoriesPreview() {
    //La información sale ya parseada gracias a AXIOS.
    const {data} = await api('genre/movie/list');
    const categories = data.genres;
    //Limpiamos los cargos duplicados
    // categoriesPreviewList.innerHTML = "";

    createCategories(categories, categoriesPreviewList);
}
async function getMoviesByCategory(id) {
    const {data} = await api('discover/movie',{
        params: {
            //Este parametro hace referencia al id de los generos de las películoas que se pasa en navigation
            with_genres: id,
        }
    });
    const movies = data.results;
   createMovies(movies, genericSection, true);
}
async function getMoviesBySearch(query) {
    const {data} = await api('search/movie',{
        params: {
            //Este parametro hace referencia al query que enviamos a la api que es el resultado de busqueda del usuario
            query,
        }
    });
    const movies = data.results;
   createMovies(movies, genericSection);
}
async function getTrendingMovies() {

    const {data} = await api('trending/movie/day');
    const movies = data.results; 
    maxPage = data.total_pages;
    
    createMovies(movies, genericSection, {lazyLoad:true, clean:true});

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'cargar más';
    // btnLoadMore.addEventListener('click',getPaginatedTrendingMovies )
    // genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendingMovies(){

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++;

        const {data} = await api('trending/movie/day',{
            params:{
                page,
            }
        });
        const movies = data.results; 
        createMovies(movies, genericSection, {lazyLoad:true, clean:false});        
    }

}

async function getMovieById(id) {
    //AXIOS recibe un data, y yo le cambio el nombre a movie
    const {data: movie} = await api(`movie/${id}`);

   const movieImgUrl =  `https://image.tmdb.org/t/p/w500${movie.poster_path}`
   //Además de el link de la imagen de un gradiente para mi flecha, esto porque mi diseño lo amerita.
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),     
    url(${movieImgUrl})`;
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesById(id);
}

async function getRelatedMoviesById(id) {
    const {data} = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies,relatedMoviesContainer);
}