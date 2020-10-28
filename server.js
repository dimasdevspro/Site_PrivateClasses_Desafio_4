const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')

const server = express()


server.use(express.urlencoded({ extended: true}))
server.use(express.static('public'))
server.use(routes)

server.set("view engine", "njk")


nunjucks.configure("views", {
    express: server
})


server.use(function(req, res) {
    res.status(404).render("not-found")
});

server.listen(3332, function(){
    console.log("Server is running!")
})

