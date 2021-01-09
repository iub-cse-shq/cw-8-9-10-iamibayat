var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = http.Server(app)
var Article = require('./article.model')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//DB connection

var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/cw10' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function (err) {
    console.log(err)
})


// your server routes go here
app.get('/', function (request, response) {
    // console.log(request)
    response.sendFile(__dirname + '/index.html')
});
app.get('/second', function (request, response) {
    // console.log(request)
    response.sendFile(__dirname + '/second.html')
});
app.get('/article/form', function (request, response) {
    // console.log(request)
    response.sendFile(__dirname + '/form.html')
});
// var articles = [{ title: 'test', content: 'test' },
// { title: 'test1', content: 'test1' },
// { title: 'test2', content: 'test2' }];
var articles = [];
app.post('/article/new', function (request, response) {
    //console.log('post request');
    var newArticle = new Article(request.body)
    newArticle.save(function (err, data) {
        if (err)
            return response.status(400).json({
                error: 'Title is missing'
            })
        return response.status(200).json({
            message: 'Article created successfully'
        })
    })


    // let newArticle = request.body;
    // if (newArticle.name) {
    //     articles.push(request.body);
    //     console.log(articles)
    //     response.json(articles);

    // }
    // else {
    //     response.status(400).json({
    //         msg: 'No name Added'
    //     });
    // }


})

app.get('/article/:id', function (request, response) {
    Article.findById(request.params.id, function (err, data) {
        response.render('article.ejs', {
            article: data
        })

    })

})

app.get('/articles/all', function (request, response) {
    Article.find({}, function (err, data) {
        response.render('secondArticle.ejs', {
            articles: data
        })
    })


    // response.render('secondArticle.ejs', {
    //     articles: articles
    // })
})

server.listen(process.env.PORT || 8000,
    process.env.IP || 'localhost', function () {
        console.log('Server running');
    })
module.exports = { app, server, mongoose }