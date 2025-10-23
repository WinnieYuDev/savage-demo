var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log("Thumbs Up", data)
          window.location.reload(true)
        })
      });
});

//thumbs down solution
Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText //name
        const msg = this.parentNode.parentNode.childNodes[3].innerText //msg
        const counter = parseFloat(this.parentNode.parentNode.childNodes[5].innerText) //counter
        fetch('messages/down', { // give information from click to server.js app.put('/messages/down')
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ //sending to app.put('/messages/down') in key:value pairs
            'A': name, //Winnie
            'B': msg, //Hello
            'C': counter //18
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log("Thumbs Down", data)
          window.location.reload(true)
        })
      });
});

//delete from listening to click on trash can icon
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        //parent node li, parent node span, child node %
        const name = this.parentNode.parentNode.childNodes[1].innerText
        //skips from 1 to 3 because of carriage return of text node
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
