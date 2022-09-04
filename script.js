"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

const data = {};

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
};

window.addEventListener("DOMContentLoaded", init);

async function init() {
  console.log("ready!");

  data.studentObjects = [];
  data.studentJSON = [];

  await loadJSON();
}

async function loadJSON() {
  const response = await fetch(url);
  data.studentJSON = await response.json();

  console.log(data.studentJSON);

  prepareObjects();
}

function prepareObjects() {
  data.studentJSON.forEach((jsonObject) => {
    const student = Object.create(Student);
    let name = jsonObject.fullname.trim().toLowerCase();
    let splitName = name.split(" ");

    //Firstname
    student.firstName =
      splitName[0].substring(0, 1).toUpperCase() + splitName[0].substring(1);

    //Middlename

    //Lastname
    // student.lastName = splitName.lastIndexOf[]

    // let firstLetter = name.substring(0, 1).toUpperCase();
    // let restOfName = name.substring(1).toLowerCase();
    // student.firstName = firstLetter + restOfName;

    console.log(student.firstName);
    data.studentObjects.push(student);

    if (name[0] == " ") {
      name.shift();
    }
  });

  displayList();
}

function displayList() {
  const studentList = document.querySelector("#list");

  // document.querySelector("#list tbody").innerHTML = "";

  data.studentObjects.forEach((student) => {
    const template = document.querySelector("#student");
    let klon = template.cloneNode(true).content;

    // let listElement = clone.querySelector("li");
    klon.querySelector(
      ".firstName"
    ).textContent = `FIRSTNAME: ${student.firstName}`;

    studentList.appendChild(klon);
  });
}
