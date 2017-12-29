const url = 'api/poems';
const foundpoem = document.getElementById("foundpoem");
const poemlist = document.getElementById("displaypoem");

const addPoem = async () => {
    const poem = document.getElementById("poem");
    const author = document.getElementById("author");
    const data = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: poem.value,
            author: author.value,
            time: new Date()
        })
    };

    const response = await fetch(url, data);
    if (response) { fetchPoem(); }

}

const fetchPoem = async () => {
    const request = await fetch(url);
    const data = await request.json();

    let poems = '';
    data.forEach((poem, index) => {
        poems += `<li >
                <span id="poem-${index}">${poem.text}</span>
                <span>${poem.author}</span>
                <span >${poem.time}</span>`;
    });
    poemlist.innerHTML = poems;
}

const findPoem = async () => {
    const title = document.getElementById("onegs").value;
    const request = await fetch(url + '/' + title);
    const data = await request.json();
    foundpoem.innerHTML = data;
}

fetchPoem();



