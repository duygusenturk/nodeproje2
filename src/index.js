"use strict"
import "../src/style.css"
const inputs = document.querySelectorAll("input")
const newMember = document.querySelector("#newMemberButton")
const notification = document.querySelector(".message")
const dialog = document.querySelector("dialog")
const successMessage = document.querySelector(".success-text")
const modalCloseButton = document.querySelector("#modalCloseButton")
const submitButton = document.querySelector("#submitButton")
const clearNotifications = () =>
  setTimeout(() => {
    notification.innerHTML = ""
  }, 3000)

const deleteMember = async (id) => {
  const res = await fetch("/teams/" + id, {
    method: "delete",
  })
  const data = await res.json()
  notification.innerHTML = data
  clearNotifications()
  loadMembers()
}

modalCloseButton.onclick = () => {
  closeUpdate()
}

newMember.onclick = () => addMember()

const addMemberFetch = async () => {
  let data = {}
  inputs.forEach((input) => {
    if (input.name !== "id") {
      data = { ...data, [input.name]: input.value }
    }
  })
  const res = await fetch("/teams/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const member = await res.json()
  if (member) {
    successMessage.style.display = "block"
    loadMembers()
    setTimeout(() => {
      closeUpdate()
      successMessage.style.display = "none"
    }, 1000)
  }
}

const addMember = async () => {
  dialog.setAttribute("open", "true")
  submitButton.onclick = () => {
    addMemberFetch()
  }

  const form = document.querySelector(".form")
  form.children[0].innerHTML = "New Member Form"
  const idInput = inputs[0]
  idInput.parentElement.style.display = "none"
}

const getMember = async (id) => {
  dialog.setAttribute("open", "false")
  const res = await fetch("/teams/" + id)
  const data = await res.json()
  const { member } = data
  inputs.forEach((input) => {
    input.value = member[input.name] ?? input.value
  })
  submitButton.onclick = () => {
    updateMember()
  }
}

const updateMember = async () => {
  const id = inputs[0].value
  let data = {}
  inputs.forEach((input) => {
    if (input.name !== "id") {
      data = { ...data, [input.name]: input.value }
    }
  })

  const res = await fetch("/teams/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const updateRes = await res.json()
  const { member } = await updateRes
  if (member) {
    successMessage.style.display = "block"
    loadMembers()
    setTimeout(() => {
      closeUpdate()
      successMessage.style.display = "block"
    }, 1000)
  }
}

const searchInput = document.getElementById("searchBar")
searchInput.addEventListener("keyup", (e) => searchMember(e.target.value))

const searchMember = async (value) => {
  const res = await fetch("/teams?q=" + value)
  const data = await res.json()
  const table = document.querySelector("table")
  const tbody = document.querySelector("tbody")
  if (tbody) {
    table.removeChild(tbody)
  }
  const tableData = data
    .map(
      (member) =>
        `<tr><th>${member.name}</th><th>${member.surname}</th><th>${member.birthdate}</th><th>${member.title}</th><th><span class="action" onclick="deleteMember(${member.id})">Delete</span> - <span class="action" onclick="getMember(${member.id})">Update</span></th></tr>`
    )
    .join("")

  const htmlObject = document.createElement("tbody")
  htmlObject.innerHTML = tableData
  table.appendChild(htmlObject)
}

const closeUpdate = () => {
  dialog.removeAttribute("open")
  submitButton.removeAttribute("onclick")
  inputs.forEach((input) => {
    input.value = ""
  })
}

const loadMembers = async () => {
  const res = await fetch("/teams")
  const data = await res.json()
  const table = document.querySelector("table")
  const tbody = document.querySelector("tbody")
  if (tbody) {
    table.removeChild(tbody)
  }
  const tableData = data
    .map(
      (member) =>
        `<tr><th>${member.name}</th><th>${member.surname}</th><th>${member.birthdate}</th><th>${member.title}</th><th><span class="action" onclick="deleteMember(${member.id})">Delete</span> - <span class="action" onclick="getMember(${member.id})">Update</span></th></tr>`
    )
    .join("")

  const htmlObject = document.createElement("tbody")
  htmlObject.innerHTML = tableData
  table.appendChild(htmlObject)
}

loadMembers()

window.updateMember = updateMember
window.getMember = getMember
window.deleteMember = deleteMember
window.loadMembers = loadMembers
window.addMember = addMember
