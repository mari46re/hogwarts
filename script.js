"use strict";

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodUrl = "https://petlatkea.dk/2021/hogwarts/families.json";

const studentList = {};

const Student = {
  fullName: "",
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
  blood: "",
  schoolstatus: true,
  prefect: false,
  // expelled: false,
};

let allStudents = [];
let expelledStudents = [];

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

document.querySelector(".search").addEventListener("keyup", (e) => {
  console.log("search");
  let searchString = e.target.value;
  searchString = searchString.toLowerCase();
  const filterStudents = allStudents.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(searchString) ||
      student.lastName.toLowerCase().includes(searchString) ||
      student.house.toLowerCase().includes(searchString)
    );
  });
  document.querySelector(".number-of-students").textContent =
    filterStudents.length;
  displayList(filterStudents);
});

function filterButtonClicked(filterButton) {
  console.log("filter-button clicked");

  filter = filterButton.target.dataset.filter;

  const filteredStudents = filterStudents();

  displayList(filteredStudents);
}

//Hvis students house er SLYTHERIN
function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  }
  return false;
}

//Hvis students house er HUFFLEPUFF
function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  }
  return false;
}

//Hvis students house er GRYFFINDOR
function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  }
  return false;
}

//Hvis students house er RAVENCLAW
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  }
  return false;
}

//Hvis ALLE students er valgt
function ifStudentAll(student) {
  console.log("ifStudentAll");
  if (student) {
    return true;
  } else {
    return false;
  }
}

function filterStudents() {
  console.log("Filtering students from this:", filter);

  filteredStudents = [];

  if (filter === "slytherin") {
    filteredStudents = allStudents.filter(isSlytherin);
  } else if (filter === "ravenclaw") {
    filteredStudents = allStudents.filter(isRavenclaw);
  } else if (filter === "hufflepuff") {
    filteredStudents = allStudents.filter(isHufflepuff);
  } else if (filter === "gryffindor") {
    filteredStudents = allStudents.filter(isGryffindor);
  } else if (filter === "expell") {
    filteredStudents = expelledStudents;
  } else {
    filteredStudents = allStudents.filter(ifStudentAll);
  }

  document.querySelector(".number-of-students").textContent =
    filteredStudents.length;

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

    //Fullname = Navn sammensat

    student.fullName = `
    ${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
    // console.log(student.fullName);
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

    student.prefect = false;

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

    klon.querySelector(".firstName").textContent = student.fullName;
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

    klon.querySelector(".prefect").addEventListener("click", clickPrefect);
    klon.querySelector(".expell").addEventListener("click", clickExpell);

    function clickExpell() {
      if (student.schoolstatus === false) {
        student.schoolstatus = true;
        document.querySelector(".school-status").textContent = "Attending";
      } else {
        expellStudent(student);
      }

      buildList();
    }

    function clickPrefect() {
      if (student.prefect === true) {
        student.prefect = false;
        document.querySelector("#popup .prefect").textContent =
          "Is not a prefect";
      } else {
        tryToMakeAPrefect(student);
      }
      buildList();
    }

    klon
      .querySelector("li")
      .addEventListener("click", () => showDetails(student));
    studentList.appendChild(klon);
  });
}

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

  // popup.querySelector(".school-status").textContent = student.schoolstatus;

  popup.querySelector(".blood").textContent = student.bloodStatus;

  document
    .querySelector("#luk")
    .addEventListener("click", () => (popup.style.display = "none"));
  popup.addEventListener("click", () => (popup.style.display = "none"));
}

function expellStudent(selectedStudent) {
  if (selectedStudent.schoolstatus === true) {
    console.log(selectedStudent);
    allStudents.splice(allStudents.indexOf(selectedStudent), 1);
    selectedStudent.schoolstatus = false;
    selectedStudent.prefect = false;
    document.querySelector(".school-status").textContent = "EXPELLED!";
    expelledStudents.push(selectedStudent);
  }
  buildList();
}

function tryToMakeAPrefect(selectedstudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  const numberOfPrefects = prefects.length;
  const other = prefects
    .filter((student) => student.prefect === selectedstudent.prefect)
    .shift();

  document.querySelector("#popup .prefect").textContent = "Is a prefect";

  if (other !== undefined) {
    console.log("There can only be 1 prefect from each house");
    removeOther(other);
  } else if (numberOfPrefects >= 2) {
    console.log("There can only be 2 prefects!");
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedstudent);
  }

  makePrefect(selectedstudent);

  function removeOther(other) {
    //Ask user to ignore or remove other
    document.querySelector("#remove_other").classList.remove("hide");
    document
      .querySelector("#remove_other .close")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove_other #remove_other_btn")
      .addEventListener("click", clickRemoveOther);

    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");

      document
        .querySelector("#remove_other .close")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_other #remove_other_btn")
        .removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }
    //if ignore, do something..
  }

  function removeAorB(prefectA, prefectB) {
    document.querySelector("#remove_aorb").classList.remove("hide");
    document
      .querySelector("#remove_aorb .close")
      .addEventListener("click", closeDialog);
    document
      .querySelector("#remove_aorb #removea")
      .addEventListener("click", clickRemoveA);
    document
      .querySelector("#remove_aorb #removeb")
      .addEventListener("click", clickRemoveB);

    //Show names on buttons
    document.querySelector("#remove_aorb [data-field=prefectA]").textContent =
      prefectA.fullName;
    document.querySelector("#remove_aorb [data-field=prefectB]").textContent =
      prefectB.fullName;

    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document
        .querySelector("#remove_aorb .close")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#remove_aorb #removea")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb #removeb")
        .removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if removeA:
      removePrefect(prefectA);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      //else - if removeB
      removePrefect(prefectB);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }
    //Ask user to ignorre orr removie a orr b
    //if ignoree - do nothing
  }

  function removePrefect(prefectStudent) {
    document.querySelector("#popup .prefect").textContent = "Is a not prefect";

    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}
