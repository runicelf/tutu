function httpGet(url) {
  return response = new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if(xhr.readyState != 4) {
        return;
      }
      if(xhr.status !== 200) {
        reject(xhr.status + ': ' + xhr.statusText);
      }else {
        resolve(xhr.responseText);
      }
      return;
    };
  });
}

const url = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
const table = document.getElementById('table-ins');
const searchButton = document.getElementById('search-button');
const additionalInfo = document.getElementById('additional-info');
const buttons = [
  {
    elem: document.getElementById('id'),
    onUp: false,
    name: 'id'
  },
  {
    elem: document.getElementById('first-name'),
    onUp: false,
    name: 'firstName'
  },
  {
    elem: document.getElementById('last-name'),
    onUp: false,
    name: 'lastName'
  },
  {
    elem: document.getElementById('email'),
    onUp: false,
    name: 'email'
  },
  {
    elem: document.getElementById('phone'),
    onUp: false,
    name: 'phone'
  }
];

httpGet(url).then((r) => {
  const data = JSON.parse(r);
  let modifiedData = data;
  function modify(obj) {
    modifiedData = sorter(obj.name, modifiedData, obj.onUp);
    table.innerHTML = arrToTable(modifiedData);
    obj.onUp = obj.onUp ? false : true;
  }
  table.innerHTML = arrToTable(data);
  buttons.forEach(obj => {
    obj.elem.addEventListener('click', () => {
      modify(obj);
    });
  });
  table.addEventListener('click', event => {
    let target = event.target;
    while(target != table) {
      if(target.className === 'row') {
        additionalInfo.innerHTML = getAdditionalInfo(target.children[0].innerText, modifiedData);
        return;
      }else {
        target = target.parentNode;
      }
    }
    return;
  });

  searchButton.addEventListener('click', () => {
    const searchValue = document.getElementById('search').value;
    table.innerHTML = arrToTable(search(searchValue));
  });
  function search(value) {
    if(!value) {
      return data;
    }
    modifiedData = data.filter((e) => {
      const arr = Object.keys(e).filter(k => {
        return k === 'adress' || k === 'description' ? false : true;
      }).filter(k => {
        if(String(e[k]).toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
      if(arr.length > 0) {
        return true;
      }
      return false;
    });
    return modifiedData;
  }
});

function getAdditionalInfo(id, data) {
  const ourElem = data.filter(e => String(e.id) === String(id))[0];
  if(ourElem) {
    return `Выбран пользователь <b>${`${ourElem.firstName} ${ourElem.lastName}`}</b>
            Описание:
            <textarea>${ourElem.description}</textarea>
            Адрес проживания: <b>${ourElem.adress.streetAddress}</b>
            Город: <b>${ourElem.adress.city}</b>
            Провинция/штат: <b>${ourElem.adress.state}</b>
            Индекс: <b>${ourElem.adress.zip}</b>`;
  }
  return new Error();
}

function sorter(name, arr, up) {
  return arr.sort((a, b) => {
    if (a[name] > b[name]) {
      return up ? -1 : 1;
    }
    if (a[name] < b[name]) {
      return up ? 1 : -1;
    }
    return 0;
  });
}
function arrToTable(jsn) {
  return jsn.reduce((acc, elem) => {
    return acc + htmlTable(elem);
  },'');
}

function htmlTable(data) {
  return `<div class="row">
  <div class="cell id">${data.id}</div>
  <div class="cell first-name">${data.firstName}</div>
  <div class="cell last-name">${data.lastName}</div>
  <div class="cell email">${data.email}</div>
  <div class="cell phone">${data.phone}</div>
  </div>`;
}
