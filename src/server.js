const express= require("express")
const path= require("path")
const {Server: HttpServer} = require("http")
const {Server: IOServer} = require("socket.io")

const app= express()
const httpServer= new HttpServer(app)
const io= new IOServer(httpServer)
const PORT= 8080

const products=[]
app.use(express.urlencoded({extended:true}))
app.use(express.static("./public"))
app.set("views", "./views/pages")

app.set("view engine", "ejs")

app.get("/", (req, res) => {
res.sendFile("index.html", {root:__dirname})
  res.render("inicio", {products})
});


app.post("/products", (req, res) => {

let product=req.body;
product.id= products.length +1;
products.push(product)

console.log(products);
  res.redirect("/")
});


let mensajes=[]
let messages=[]
const connectedServer= httpServer.listen(PORT, () =>{
  console.log(`Servidor escuchando en ${connectedServer.address().port}`);
})

io.on('connection', socket => {
  console.log(`a user connected on port ${PORT}`);


  socket.emit("mensajes", mensajes)

  socket.emit("messages", messages)

  socket.on("new-message", function(data) {
    messages.push( data)
    io.sockets.emit("messages", messages)
    })

  socket.on("mensaje", data =>{
  mensajes.push({socketid: socket.id, mensaje: data})
  io.sockets.emit("mensajes", mensajes)
  })

});

app.get("/agregarArticulo", (req, res) =>{
  let articulo= req.query.articulo;
  io.sockets.emit("nuevoArticulo", articulo)
  res.send("Ruta")
 })
