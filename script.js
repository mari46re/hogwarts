"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

const studentList = {};

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
  blood: "",
  prefect: false,
  expelled: false,
};

let allStudents = [];

let filter;
let filteredStudents = [];
let filterButtons;

let sortThis;

window.addEventListener("DOMContentLoaded", init);

async function init() {
  console.log("ready!");

  filterButtons = document.querySelectorAll(`[data-action="filter"]`);
  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", filterButtonClicked);
  });

  //Onchange registrerer en forandring, der aktiverer en funktion. I dette tilfælde sortering
  document.querySelector("#sortingList").onchange = function () {
    selectedSorting(this.value);
  };

  await loadJSON();
}

function filterButtonClicked(filterButton) {
  console.log("filter-button clicked");

  filter = filterButton.target.dataset.filter;

  const filteredStudents = filterStudents();

  displayList(filteredStudents);
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  }
  return false;
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  }
  return false;
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  }
  return false;
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  }
  return false;
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
  console.log("Filtering students from this house:", filter);

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
  // console.log(`Use this ${sortThis}`);
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

//FirstName from a-z
function sortThisFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return -1;
  } else {
    return 1;
  }
}

//FirstName from z-a
function sortThisFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return 1;
  } else {
    return -1;
  }
}

//LastName from a-z
function sortThisLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return -1;
  } else {
    return 1;
  }
}

//Lastname from z-a
function sortThisLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return 1;
  } else {
    return -1;
  }
}

//House from a-z
function sortThisHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}

//House sorted from z-a
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

  prepareObjects(studentJSON);
}

function prepareObjects(studentJSON) {
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
    student.lastName = name.substring(lastSpace).trim();
    // student.lastName =
    //   lastName.substring(0, 1).toUpperCase() + lastName.substring(1);

    // Removes to avoid Leanne two times
    if (lastSpace == -1) {
      student.lastName = "";
    }

    //Registering hyphen
    let hyphen = student.lastName.indexOf("-");

    if (hyphen == -1) {
      student.lastName =
        student.lastName.substring(0, 1).toUpperCase() +
        student.lastName.substring(1).toLowerCase();
    } else {
      student.lastName =
        //First part of lastname being cleansed
        student.lastName.substring(0, 1).toUpperCase() +
        student.lastName.substring(1, hyphen).toLowerCase() +
        //Last part of lastname being cleansed
        student.lastName.substring(hyphen, hyphen + 2).toUpperCase() +
        student.lastName.substring(hyphen + 2).toLowerCase();
    }

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

    //Image
    student.image =
      student.lastName.toLowerCase() +
      "_" +
      splitName[0].substring(0, 1).toLowerCase();

    if (student.lastName == "Patil") {
      student.image =
        student.lastName.toLowerCase() + "_" + splitName[0].toLowerCase();
    } else if (hyphen) {
      student.image =
        student.lastName.substring(hyphen + 1).toLowerCase() +
        `_${student.firstName.substring(0, 1).toLowerCase()}`;
    }

    loadBloodJSON();

    async function loadBloodJSON() {
      const response = await fetch(bloodUrl);
      const studentBloodJSON = await response.json();
      student.bloodStatus = checkBloodStatus(studentBloodJSON);

      checkBloodStatus(studentBloodJSON);
    }

    function checkBloodStatus(studentBloodJSON) {
      if (studentBloodJSON.pure.includes(student.lastName) == true) {
        return "Pureblood";
      } else if (studentBloodJSON.half.includes(student.lastName) == true) {
        return "Halfblood";
      } else {
        return "Muggle-born";
      }
    }

    allStudents.push(student);
    // console.log(allStudents);
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

    if (student.house == "Slytherin") {
      klon.querySelector("li").style.border = "3px solid #1a472a";
    }

    if (student.house == "Gryffindor") {
      klon.querySelector("li").style.border = "3px solid #740001";
    }

    if (student.house == "Ravenclaw") {
      klon.querySelector("li").style.border = "3px solid #0e1a40";
    }

    if (student.house == "Hufflepuff") {
      klon.querySelector("li").style.border = "3px solid #ecb939";
    }

    klon.querySelector(
      ".firstName"
    ).textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
    // klon.querySelector(
    //   ".firstName"
    // ).textContent = `FIRSTNAME: ${student.firstName}`;

    // klon.querySelector(
    //   ".middleName"
    // ).textContent = `MIDDLENAME: ${student.middleName}`;

    // klon.querySelector(
    //   ".lastName"
    // ).textContent = `LASTNAME: ${student.lastName}`;

    // klon.querySelector(
    //   ".nickName"
    // ).textContent = `NICKNAME: ${student.nickName}`;

    // klon.querySelector(".gender").textContent = `GENDER: ${student.gender}`;

    klon.querySelector(".house").textContent = student.house;
    // console.log(student.house);

    klon.querySelector(".image").src = `/images/${student.image}.png`;

    klon
      .querySelector("li")
      .addEventListener("click", () => showDetails(student));
    studentList.appendChild(klon);
  });

  function showDetails(student) {
    // let span = document.createElement("span");
    console.log("clicked", student);

    const popup = document.querySelector("#popup");
    popup.style.display = "block";

    popup.querySelector(
      ".fullName"
    ).textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;

    popup.querySelector(".firstName").textContent = student.firstName;

    popup.querySelector(".nickName").textContent = student.nickName;

    popup.querySelector(".middleName").textContent = student.middleName;

    popup.querySelector(".lastName").textContent = student.lastName;

    popup.querySelector(".gender").textContent = student.gender;

    popup.querySelector(".house").textContent = student.house;

    popup.querySelector(".image").src = `/images/${student.image}.png`;

    popup.querySelector(".blood").textContent = student.bloodStatus;

    document
      .querySelector("#luk")
      .addEventListener("click", () => (popup.style.display = "none"));
    popup.addEventListener("click", () => (popup.style.display = "none"));
  }
}
