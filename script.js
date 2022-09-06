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

    console.log(student.firstName);

    //Middlename
    student.middleName =
      name
        .substring(name.indexOf(" "), name.lastIndexOf(" "))
        .trim()
        .substring(0, 1)
        .toUpperCase() +
      name
        .substring(name.indexOf(" "), name.lastIndexOf(" "))
        .trim()
        .substring(1);

    console.log(student.middleName);

    //Lastname
    const lastSpace = jsonObject.fullname.lastIndexOf(" ");
    let lastName = name.substring(lastSpace).trim();
    student.lastName =
      lastName.substring(0, 1).toUpperCase() + lastName.substring(1);

    // if (name.includes == "-") {
    //   student.lastName = name.lastIndexOf("-" + 1).toUpperCase();
    // }

    //Nickname

    if (name.includes(`"`)) {
      let nickName = name
        .substring(name.indexOf(`"`) + 1, name.lastIndexOf(`"`))
        .toUpperCase();

      student.nickName = nickName[0] + nickName.substring(1).toLowerCase();

      student.middleName = "";
    }

    console.log(student.nickName);

    //Gender
    let gender = jsonObject.gender.trim().toLowerCase();
    student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1);

    //House
    let house = jsonObject.house.trim().toLowerCase();
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);
    console.log(student.house);

    data.studentObjects.push(student);

    //Image
    student.image =
      student.lastName.toLowerCase() +
      "_" +
      splitName[0].substring(0, 1).toLowerCase();

    if (student.lastName == "Patil") {
      student.image =
        student.lastName.toLowerCase() + "_" + splitName[0].toLowerCase();
    }

    console.log(student.image);
  });

  displayList();
}

function displayList() {
  const studentList = document.querySelector("#list");

  data.studentObjects.forEach((student) => {
    const template = document.querySelector("#student");
    let klon = template.cloneNode(true).content;

    klon.querySelector(
      ".firstName"
    ).textContent = `FIRSTNAME: ${student.firstName}`;

    klon.querySelector(
      ".middleName"
    ).textContent = `MIDDLENAME: ${student.middleName}`;

    klon.querySelector(
      ".lastName"
    ).textContent = `LASTNAME: ${student.lastName}`;

    klon.querySelector(
      ".nickName"
    ).textContent = `NICKNAME: ${student.nickName}`;

    klon.querySelector(".gender").textContent = `GENDER: ${student.gender}`;

    klon.querySelector(".house").textContent = `HOUSE: ${student.house}`;

    klon.querySelector(".image").src = `/images/${student.image}.png`;

    studentList.appendChild(klon);
  });
}
