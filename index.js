const searchInput = document.querySelector('.input-container__input');
const autocomplete = document.querySelector('.autocomplete-list');
const reposList = document.querySelector('.repos-list');

const setActive = (selector ,active = true) => {

    if(active) {
        selector.classList.remove('active');
    }
    if(!active) {
       selector.classList.add('active');
    }
}

const debounce = (fn, debounceTime) => {
    let debounce;

    return function() {
        clearTimeout(debounce);

        debounce = setTimeout(() => fn.apply(this, arguments), debounceTime)
    }
}

function getSearch() {
    let liTag;
    let divTag;

    let buttonClose;

    searchInput.addEventListener('input', debounce(async function(e) {
        e.stopPropagation();

        let currentValue = e.target.value;
        if(!currentValue) return setActive(autocomplete,true)

        let usersPromise = await fetch('https://api.github.com/repositories');
        let usersData = await usersPromise.json();
        let currentData = usersData.filter((el) => el.name.startsWith(currentValue))

       autocomplete.innerHTML = ''; //отчищаем строку при каждом изменении
       let listItems = []; //массив с элементами списка поиска

       for(let i = 0; i < currentData.length; i++) {

          if(i < 5) {
              liTag = document.createElement('li');
              liTag.textContent = currentData[i].name;
              liTag.classList.add('autocomplete-list__item');
              autocomplete.appendChild(liTag)
              listItems.push(liTag);
          }
          if(listItems.length > 0) {
            setActive(autocomplete,false);
          }
          else {
            setActive(autocomplete,true);
          }

       listItems[i].addEventListener('click', function (e) {
           e.stopPropagation();
           searchInput.value = '';
           setActive(autocomplete,true);
               divTag = document.createElement('div');
               divTag.classList.add('repos-list__item');
               reposList.appendChild(divTag);

               buttonClose = document.createElement('button');
               buttonClose.classList.add('repos-list__button');

               divTag.appendChild(buttonClose);


               divTag.onclick = function(event) {
                   if (event.target.className !== 'repos-list__button') return;

                   let button = event.target.closest('.repos-list__item');
                   button.remove();
               };

               let slash = currentData[i]['full_name'].indexOf('/');

               for (let g = 0; g < 3; g++) {

                   let textTag = document.createElement('div');
                   textTag.classList.add('repos-list__text');
                   divTag.appendChild(textTag);


                   if (g === 0) {
                       textTag.textContent = `name: ${currentData[i].name}`;
                   }
                   if (g === 1) {
                       textTag.textContent = `owner: ${currentData[i]['full_name'].substr(0, slash)}`;
                   }
                   if (g === 2) {
                       textTag.textContent = `id: ${currentData[i].id}`;
                   }
               }

       })

       }
    }, 500))

}

getSearch();
