// importação de dados

const fs = require('fs')
const data = require('../data.json')
const { date, graduation, grade } = require('../utils')

// exportação de funções para routes.js

// exportar lista

exports.index = function (req, res) {

    return res.render('students/index', {students: data.students})
}

// exportar criar

exports.create = function (req, res){
    return res.render('students/create')
}

// exportar envia

exports.post = function (req, res){

    const keys = Object.keys(req.body)
    
        for(key of keys) {
           if (req.body[key] == "")
           return res.send('Please, fill all fields!')
        }

birth = Date.parse(req.body.birth)

let id = 1  
const lastStudent = data.students[data.students.length - 1 ]

if(!lastStudent) {
    id = lastStudent + 1
}

data.students.push({
    id,
    ...req.body,
    birth,
})

fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err){
    if(err) return res.send("write file error!")

    return res.redirect("/students")
})

    // return res.send(req.body)
}

// exportar mostrar

exports.show = function(req, res) {
    const { id } = req.params

    const foundStudents = data.students.find(function(students){
        return students.id == id
    })

    if(!foundStudents) return res.send("Student not found!")

    
const student = {
   ...foundStudents,
   birth: date(foundStudents.birth).birthDay,
   graduation: graduation(foundStudents.graduation),
}

    return res.render("students/show", {student})
}

// exportar editar

exports.edit = function (req, res) {
    const { id } = req.params

     const foundStudents = data.students.find(function(students){
         return students.id == id
     })

     if(!foundStudents) return res.send("Student not found!")

     const student = {
         ...foundStudents,
         birth: date(foundStudents.birth).iso,
         graduation: graduation(foundStudents.graduation)
     }


    return res.render('students/edit', {student})
}

// exportar atualizar

exports.put = function (req, res) {
    const { id } = req.body
    let index = 0
     const foundStudents = data.students.find(function(student, foundIndex){
         if (id == student.id) {
             index = foundIndex
             return true
         }
     })

     if(!foundStudents) return res.send("Student not found!")

        const student = {
            ...foundStudents,
            ...req.body,
            birth: Date.parse(req.body.birth),
            id: Number(req.body.id)
        }

        data.students[index] = student

        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
            if(err) return res.send("Write error!")

            return res.redirect(`/students/${id}`)
        })
}

// exportar delete

exports.delete = function (req, res) {
    const { id } = req.body

    const filteredStudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/students")
    })
}