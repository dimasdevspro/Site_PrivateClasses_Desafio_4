const fs = require('fs')
const data = require('./data.json')
const { age } = require('./utils')
// exportar mostrar

exports.show = function(req, res) {
     const { id } = req.params

     const foundTeachers = data.teachers.find(function(teachers){
         return teachers.id == id
     })

     if(!foundTeachers) return res.send("Teacher not found!")

     
const teacher = {
    ...foundTeachers,
    age: age(foundTeachers.birth),
    subjects: foundTeachers.subjects.split(","),
    created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeachers.created_at),
}

     return res.render("teachers/show", {teacher})
}

// exportar post

exports.post = function (req, res){

    const keys = Object.keys(req.body)
    
        for(key of keys) {
           if (req.body[key] == "")
           return res.send('Please, fill all fields!')
        }

let {avatar_url, name, birth, degreesOfEducation, classes, subjects} = req.body

birth = Date.parse(req.body.birth)
const created_at = Date.now()
const id = Number(data.teachers.length +1)



data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    degreesOfEducation,
    classes,
    subjects,
    created_at   
})

fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err){
    if(err) return res.send("write file error!")

    return res.redirect("/teachers")
})

    // return res.send(req.body)
}