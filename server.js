const express = require("express")
const webpack = require("webpack")
const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-hot-middleware")
const config = require("./webpack.dev.js")
const compiler = webpack(config)

var port = process.env.port || 3000
const teamdata = require("./src/team")

const app = express()
app.use(express.static("dist"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

if (process.env.NODE_ENV !== "production") {
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      writeToDisk: true,
    })
  )
  app.use(webpackHotMiddleware(compiler))
}

//Data-All
app.get("/teams", function (req, res) {
  const query = req.query.q || ""
  const filteredValues = teamdata.filter(
    (member) =>
      member.name
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")) ||
      member.surname
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR")) ||
      member.title
        .toLocaleLowerCase("tr-TR")
        .includes(query.toLocaleLowerCase("tr-TR"))
  )
  res.status(200).json(query ? filteredValues : teamdata)
})

//Data-Find
app.get("/teams/:id", function (req, res) {
  const id = req.params.id
  const colleague = teamdata.find((colleague) => colleague.id == id)
  return colleague != undefined
    ? res.status(200).send(colleague)
    : res.status(404).json({
        message: "Seems like you lost your way (:",
        status: 200,
      })
})

//Data-Create
app.post("/teams", function (req, res) {
  const colleagueIds = teamdata.map((colleague) => colleague.id)
  const newId =
    colleagueIds.length > 0 ? Math.max.apply(Math, colleagueIds) + 1 : 1

  let newColleague = {
    id: newId,
    name: req.body.name,
    surname: req.body.surname,
    birthdate: req.body.birthdate,
    title: req.body.title,
  }
  if (req.body.name || req.body.surname === "") {
    res.redirect(301, "/")
  } else {
    teamdata.push(newColleague)
  }
})

//Data-Update
app.put("/teams/:id", function (req, res) {
  const id = req.params.id
  const index = teamdata.findIndex((member) => member.id == id)
  if (index === -1) {
    return res.status(404).send("ID not found.")
  }

  const updatedMember = { ...teamdata[index], ...req.body }

  teamdata[index] = updatedMember
  res.status(200).json(teamdata[index])
})

//Data-Delete
app.delete("/teams/:id", function (req, res) {
  const id = req.params.id
  const index = teamdata.findIndex((member) => member.id == id)

  if (index === -1) {
    return res.status(404).send("ID not found.")
  }
  teamdata.splice(index, 1)
  res.status(200).json("Member removed")
})

//Emptyroot
app.get("*", (req, res) => {
  res.status(404).json({
    message: "Seems like you lost your way (:",
    status: 404,
  })
})

app.listen(port, () => {
  console.log(`Localhost ${port}`)
})
console.log(process.env.NODE_ENV)
