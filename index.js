const autoCompleteConfig={
    renderOption(movie){
        const imgSrc=movie.Poster==='N/A'?'': movie.Poster;
        return  `
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        
        
        `;
    },
   
    inputValue(movie){
     return   movie.Title;
    },
    async fetchData (searchTerm){
        const response= await axios.get('https://www.omdbapi.com/',
        {
        params:{
            apikey:'6157382b',
            s:searchTerm
        
        }
        });
        if(response.data.Error){
            return[];
        }
        return response.data.Search;
        }
        
    
}
createAutoComplete({
    ...autoCompleteConfig,
root:document.querySelector('#left-autocomplete'),
onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie,document.querySelector('#left-summary'),'left')
},
});
createAutoComplete({
    ...autoCompleteConfig,
root:document.querySelector('#right-autocomplete'),
onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie,document.querySelector('#right-summary'),'right')
},
});
let leftmovie;
let rightmovie;
const onMovieSelect= async( movie,summaryTarget,side)=>{
    const response= await axios.get('http://www.omdbapi.com/',
{
params:{
    apikey:'6157382b',
    i:movie.imdbID

}

});

summaryTarget.innerHTML=movieTemplate(response.data)  
if(side=='left'){
    leftmovie=response.data;
}
else{
    rightmovie=response.data;
}
if(leftmovie && rightmovie){
    runComparison();
}
};
const runComparison=()=>{
    leftSideStat=document.querySelectorAll('#left-summary .notification');
    rightSideStat=document.querySelectorAll('#right-summary .notification');
    leftSideStat.forEach((leftStat,index) => {
 rightStat=rightSideStat[index]
 const leftSideValue=leftStat.dataset.value;
 const rightSideValue=rightStat.dataset.value  ;  
 if(rightSideValue>leftSideValue){
     leftStat.classList.remove("is-primary")
     leftStat.classList.add("is-warning")
 }  
 else{
    rightStat.classList.remove("is-primary")
    rightStat.classList.add("is-warning")
  
 }
    });

}


const movieTemplate=(movieDetail)=>{

    const imdbrating=parseFloat(movieDetail.imdbRating);
    const metascore=parseInt(movieDetail.Metascore)
const imdbVotes=parseInt(movieDetail.imdbVotes.replace(/,/g,""));

const awards=movieDetail.Awards.split(' ').reduce((prev,word) => {
    const value=parseInt(word);
    if(isNaN(value)){
        return prev;
    }
    else{
        return prev+value;  
      }
    
},0);
console.log(awards)

    return`
    <article class="media">
    <figure class="media-left">
    <p class="image">
    <img src="${movieDetail.Poster}"/>
    </p>
    </figure>
    <div class="media-content">
    <div class="content">
    <h1>${movieDetail.Title}</h1>
    <h4>${movieDetail.Genre}</h4>
    <p>${movieDetail.Plot}</p>
    </div>
    </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    
    </article>
    <article class="notification is-primary">
    <p class="title">${movieDetail.Actors}</p>
    <p class="subtitle">Actors</p>
    
    </article>
    <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    
    </article>
    <article data-value=${imdbrating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle"IMDB Rating</p>
    
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
    
    </article>
    
    
    
    `
}