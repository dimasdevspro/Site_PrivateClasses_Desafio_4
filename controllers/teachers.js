// exportação de funções para routes.js

const fs = require('fs')
const data = require('../data.json')
const { age, date, graduation } = require('../utils')

// exportar lista

exports.index = function (req, res) {
    return res.render('teachers/index', {teachers: data.teachers})
}

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
    graduation: graduation(foundTeachers.graduation),
}

     return res.render("teachers/show", {teacher})
}

// exportar criar

exports.post = function (req, res){

    const keys = Object.keys(req.body)
    
        for(key of keys) {
           if (req.body[key] == "")
           return res.send('Please, fill all fields!')
        }

let {avatar_url, name, birth, graduation, classes, subjects} = req.body

birth = Date.parse(req.body.birth)
const created_at = Date.now()

let id=1
const lastTeacher = data.teachers[data.teachers.length - 1 ]

if(!lastTeacher) {
    id = lastTeacher.id + 1
}

data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    graduation,
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


// exportar editar

exports.edit = function (req, res) {
    const { id } = req.params

     const foundTeachers = data.teachers.find(function(teachers){
         return teachers.id == id
     })

     if(!foundTeachers) return res.send("Teacher not found!")

     const teacher = {
         ...foundTeachers,
         birth: date(foundTeachers.birth).iso,
         graduation: graduation(foundTeachers.graduation)
     }


    return res.render('teachers/edit', {teacher})
}

// exportar criar

exports.create =  function (req, res){
    return res.render('teachers/create')
}

// exportar atualizar

exports.put = function (req, res) {
    const { id } = req.body
    let index = 0
     const foundTeachers = data.teachers.find(function(teacher, foundIndex){
         if (id == teacher.id) {
             index = foundIndex
             return true
         }
     })

     if(!foundTeachers) return res.send("Teacher not found!")

        const teacher = {
            ...foundTeachers,
            ...req.body,
            birth: Date.parse(req.body.birth),
            id: Number(req.body.id)
        }

        data.teachers[index] = teacher

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write error!")

            return res.redirect(`/teachers/${id}`)
        })
}

// exportar delete

exports.delete = function (req, res) {
    const { id } = req.body

    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/teachers")
    })
}