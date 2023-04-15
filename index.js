let express = require('express');
let path = require("path");
let bodyParser = require('body-parser');
let routes = require("./routes");

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);

let http = require('http');

let calcType = 0;
let savedNotes = "";

let server = http.createServer(app);
let io = require('socket.io').listen(server);

io.on('connection', function(socket) {
	console.log("server io.on function called");
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('update', function (data) {
        io.emit('update', data);
    });

});

app.get("/",function(req,res) {
    res.sendFile(path.resolve(__dirname,"public/views/index.html"));
});
app.get("/type",function(req,res) {
    res.sendFile(path.resolve(__dirname,"public/views/type.html"));
});

app.get("/saveNotes", function(req, res){
    // console.log(req.query.notes);
    savedNotes = req.query.notes;
   res.json({});
});
app.get("/retNotes", function(req, res){
   res.json({notes:savedNotes});
});


let port = process.env.PORT || 3000;

server.listen(port);