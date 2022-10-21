
var socket = io.connect();
const Fecha= new Date().toLocaleString();

socket.on("messages", function (data) {render(data);})

function render(data){
    let html= data.map(function(elem, index){
        return(`<div>
        <strong>${elem.author}</strong>:
        <em>${elem.text}</em> <em><small>${Fecha}</small></em> </div>`)

    }).join(" ")
    document.getElementById("messages").innerHTML= html
}
function addMessage(){
    const mensaje={
        author: document.getElementById("username").value,
        text: document.getElementById("texto").value
    }
    socket.emit("new-message", mensaje)
    document.getElementById("texto").value=""
    document.getElementById("texto").focus()
    return false
}
