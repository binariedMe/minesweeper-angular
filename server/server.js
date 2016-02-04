/**
 * Created by rohitk on 03-Feb-16.
 */


var express = require('express'),
    bodyP = require('body-parser'),
    app = express();



app.use(express.static('../'));

app.use(bodyP.json());
app.use(bodyP.urlencoded({
    extended: true
}));



app.get('/', function(req, res){
    res.sendFile("index.html", {root : "../"});
});

app.listen(4000, function(){
    console.log("Your server is up and listening at 4000");
});