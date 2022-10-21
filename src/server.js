const express= require("express")
const path= require("path")
const {Server: HttpServer} = require("http")
const {Server: IOServer} = require("socket.io")
var fs = require('fs');


const app= express()
const httpServer= new HttpServer(app)
const io= new IOServer(httpServer)
const PORT= 8080
app.use(express.static('public'));


const products=[]
app.use(express.urlencoded({extended:true}))
app.set("views", "./views/pages")

app.set("view engine", "ejs")

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "../public/index.html"))

  res.render("index", {products})
});


app.post("/products", (req, res) => {

let product=req.body;
product.id= products.length +1;
products.push(product)
fs.writeFile('./Productos.json', JSON.stringify(products), err => {
  if (err) {
    console.error(err)
    return
  }
console.log("write sussesful");})
console.log(products);

  res.redirect("/")
})


let messages=[]


const connectedServer= httpServer.listen(PORT, () =>{
  console.log(`Servidor escuchando en ${connectedServer.address().port}`);
})

io.on('connection', socket => {
  console.log(`a user connected on port ${PORT}`);
console.log("hola");



  socket.emit("messages", messages)

  socket.on("new-message", function(data) {
    messages.push( data)
    io.sockets.emit("messages", messages)
    require('fs').writeFile('./chatLog.json', JSON.stringify(messages ), function (err) {

      if (err) {

          console.error('Crap happens');
      }
  }
);
    })



});

app.get("/agregarArticulo", (req, res) =>{
  let articulo= req.query.articulo;
  io.sockets.emit("nuevoArticulo", articulo)

  res.send("Ruta")
  
 })


