const notification = document.querySelector(".message")
const dialog = document.querySelector("dialog")
const successMessage = document.querySelector(".success-text")
const clearNotifications = () =>
  setTimeout(() => {
    notification.innerHTML = ""
  }, 3000)

const deleteMember = async (id) => {
  const res = await fetch("/teams/" + id, { method: "delete" })
  const data = await res.json()
  notification.innerHTML = data
  clearNotifications()
  loadMembers()
}
deleteMember()

const getMember = async (id) => {
  dialog.setAttribute("open", "false")
  const res = await fetch("/teams/" + id)
  const data = await res.json()
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.value = data[input.name] ?? input.value
  })
}
getMember()

const updateMember = async () => {
  const inputs = document.querySelectorAll("input")
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
  const member = await res.json()
  if (member) {
    successMessage.style.display = "block"
    loadMembers()
    setTimeout(() => {
      closeUpdate()
      successMessage.style.display = "block"
    }, 1000)
  }
}

updateMember()

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
