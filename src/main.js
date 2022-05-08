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
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        //Añado la clase
        movieImg.classList.add('movie-img');
        //El objeto movie tiene entre sus propiedades el titulo de la pelicula que será mi alt
        movieImg.setAttribute('alt', movie.title);
        //posther path tiene el enlace de la imagen que quiero mostrar.
        movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        
        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}
async function getCategoriesPreview() {
    //La información sale ya parseada gracias a AXIOS.
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    categories.forEach(category => {

        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id','id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        previewCategoriesContainer.appendChild(categoryContainer);
    });
}
getTrendingMoviesPreview();
getCategoriesPreview();