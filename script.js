"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const studentList = {};

// const data = {};

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
};

let allStudents = [];
let filter;
let filteredStudents = [];

let filterButtons;

let sortThis = "sorting";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  console.log("ready!");

  filterButtons = document.querySelectorAll(`[data-action="filter"]`);
  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", filterButtonClicked);
  });

  document.querySelector("#sortingList").onchange = function () {
    selectedSorting(this.value);
  };

  await loadJSON();
}

function filterButtonClicked(filterButton) {
  console.log("filterClicked right here ");

  filter = filterButton.target.dataset.filter;

  const filteredStudents = filterStudents();

  displayList(filteredStudents);
}

function isSlytherin(student) {
  console.log("ifStudentSlytherin");
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  console.log("ifStudentHufflepuff");
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isGryffindor(student) {
  console.log("ifStudentGryffindor");
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isRavenclaw(student) {
  console.log("ifStudentRavenclaw");
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function ifStudentAll(student) {
  console.log("ifStudentAll");
  if (student) {
    return true;
  } else {
    return false;
  }
}

function filterStudents() {
  console.log("Filtering My Students by: ", filter);

  filteredStudents = [];

  if (filter === "slytherin") {
    filteredStudents = allStudents.filter(isSlytherin);
  } else if (filter === "ravenclaw") {
    filteredStudents = allStudents.filter(isRavenclaw);
  } else if (filter === "hufflepuff") {
    filteredStudents = allStudents.filter(isHufflepuff);
  } else if (filter === "gryffindor") {
    filteredStudents = allStudents.filter(isGryffindor);
  } else {
    filteredStudents = allStudents.filter(ifStudentAll);
  }

  return filteredStudents;
}

function selectedSorting(event) {
  sortThis = event;
  console.log(`Use this ${sortThis}`);
  buildList();
}

function sortList(sortedList) {
  //Calls a matching function

  if (sortThis === "firstnamea-z") {
    sortedList = sortedList.sort(sortThisFirstnameAZ);
  } else if (sortThis === "firstnamez-a") {
    sortedList = sortedList.sort(sortThisFirstnameZA);
  } else if (sortThis === "lastnamea-z") {
    sortedList = sortedList.sort(sortThisLastnameAZ);
  } else if (sortThis === "lastnamez-a") {
    sortedList = sortedList.sort(sortThisLastnameZA);
  } else if (sortThis === "housea-z") {
    sortedList = sortedList.sort(sortThisHouseAZ);
  } else if (sortThis === "housez-a") {
    sortedList = sortedList.sort(sortThisHouseZA);
  }

  return sortedList;
}

//sorts by firstName a-z
function sortThisFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by firstName z-a
function sortThisFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by lastName a-z
function sortThisLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by lastName z-a
function sortThisLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by house a-z
function sortThisHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by house z-a
function sortThisHouseZA(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return 1;
  } else {
    return -1;
  }
}

function buildList() {
  let currentList = filterStudents(allStudents);
  currentList = sortList(currentList);

  displayList(currentList);
}

async function loadJSON() {
  const response = await fetch(url);
  const studentJSON = await response.json();

  // console.log(studentJSON);

  prepareObjects(studentJSON);
}

function prepareObjects(studentJSON) {
  // console.log(studentObjects);
  // console.log(studentJSON);

  studentJSON.forEach((jsonObject) => {
    const student = Object.create(Student);
    let name = jsonObject.fullname.trim().toLowerCase();
    let splitName = name.split(" ");

    //Firstname
    student.firstName =
      splitName[0].substring(0, 1).toUpperCase() + splitName[0].substring(1);

    // console.log(student.firstName);

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

    //Lastname
    const lastSpace = jsonObject.fullname.lastIndexOf(" ");
    let lastName = name.substring(lastSpace).trim();
    student.lastName =
      lastName.substring(0, 1).toUpperCase() + lastName.substring(1);

    //Nickname
    if (name.includes(`"`)) {
      let nickName = name
        .substring(name.indexOf(`"`) + 1, name.lastIndexOf(`"`))
        .toUpperCase();

      student.nickName = nickName[0] + nickName.substring(1).toLowerCase();

      student.middleName = "";
    }

    // console.log(student.nickName);

    //Gender
    let gender = jsonObject.gender.trim().toLowerCase();
    student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1);

    //House
    let house = jsonObject.house.trim().toLowerCase();
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);
    // console.log(student.house);

    // studentObjects.push(student);

    //Image
    student.image =
      student.lastName.toLowerCase() +
      "_" +
      splitName[0].substring(0, 1).toLowerCase();

    if (student.lastName == "Patil") {
      student.image =
        student.lastName.toLowerCase() + "_" + splitName[0].toLowerCase();
    }

    // console.log(student.image);
    allStudents.push(student);
  });

  displayList(allStudents);
}

function displayList(studentObjects) {
  // clear the list
  document.querySelector("#list").innerHTML = "";

  const studentList = document.querySelector("#list");

  studentObjects.forEach((student) => {
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
    // console.log(student.house);

    klon.querySelector(".image").src = `/images/${student.image}.png`;

    if (student.house == "Griffyndor") {
      template.style.backgroundColor = "red";
    }

    studentList.appendChild(klon);
  });
}
