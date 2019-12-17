const ul = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");


fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(books => {
        books.forEach(turnObjToHtml);
    });

fetch("http://localhost:3000/books/1")
    .then(res => res.json())
    .then(book => showBookInfo(book));

function turnObjToHtml(book) {
    let li = document.createElement('li');
    li.innerText = book.title;
    li.style.cursor = "pointer";
    ul.append(li)

    li.addEventListener('click', () => {
       showBookInfo(book) 
    });
}

function showBookInfo(book) {
    showPanel.innerHTML = `
        <h4>${book.title}</h4>
        <p>${book.description}</p>
        <h5>User Likes</h5>
        <ul id="user-lists"></ul>
        <button id="like-btn">Like</button>
    `;

    let usersUl = document.querySelector("#user-lists");
    book.users.forEach((user) => {
        let userLi = document.createElement('li');
        userLi.innerText = user.username;
        usersUl.append(userLi);
    });

    toggleLike(book);
}

function handleUpdate(book) {
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            'content-type': "application/json"
        },
        body: JSON.stringify({users: book.users})
    })
    .then(res => res.json())
    .then(book => {
        showBookInfo(book);
    });
}

function toggleLike(book) {
    let likeBtn = showPanel.querySelector("#like-btn");

    let includePouros = book.users.find((ele, i, a) => {
        return ele.username === 'pouros';
    });

    likeBtn.innerText = includePouros ? "Unlike" : "Like";
    
    likeBtn.addEventListener('click', (e) => {

        if(!includePouros) {
            book.users.push({"id":1, "username":"pouros"});
            handleUpdate(book);
        } else {
            book.users.pop();
            handleUpdate(book);
        }
    });
}




