const createAutoComplete=({root,renderOption,onOptionSelect,inputValue,fetchData})=>{
     root.innerHTML=`
    <label><b>Search </b></label>
    <input class="input" />
    <div class="dropdown">
    <div class="dropdown-menu">
    <div class="dropdown-content  results">
    </div>
    </div>
    </div>
    `;
    const input=root.querySelector('input');
    const dropdown=root.querySelector('.dropdown');
    const resultwrapper=root.querySelector('.results');
    
    
    const onInput= async events=>{
      const items= await fetchData(events.target.value);
    if(!items.length){
        dropdown.classList.remove('is-active');
        return; 
    }
    
    
    resultwrapper.innerHTML="";
    dropdown.classList.add('is-active');
    
    for(item of items){
        const option=document.createElement('a');
    
    
    
        option.classList.add('dropdown-item')
    option.innerHTML=renderOption(item) 
    option.addEventListener('click',()=>{
        dropdown.classList.remove('is-active');
        input.value=inputValue(item);
        onOptionSelect(item)
    })
    
    resultwrapper.appendChild(option);
    }
    }
    input.addEventListener('input',debounce(onInput,500));
    document.addEventListener('click',events =>{
        if(!root.contains(events.target)){
            dropdown.classList.remove('is-active');   
        }
    } )
    
    
}