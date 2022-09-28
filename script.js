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
  inq: false,
};

let allStudents = [];
let expelledStudents = [];
let filter;
let filteredStudents = [];
let filterButtons;
let sortThis;
let isHacked = false;

window.addEventListener("DOMContentLoaded", init);

async function init() {
  console.log("ready!");

  filterButtons = document.querySelectorAll(`[data-action="filter"]`);
  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", filterButtonClicked);
  });

  document.querySelector("#hack").addEventListener("click", hackTheSystem);

  //Onchange registrerer en forandring, hvilket aktiverer en funktion. I dette tilfælde sortering
  document.querySelector("#sortingList").onchange = function () {
    selectedSorting(this.value);
  };

  await loadJSON();
}
/*-------------------SØGEFUNKTITON------------------------*/
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
/*-------------------FILTRERING------------------------*/
function filterButtonClicked(filterButton) {
  console.log("filter-button clicked");

  filter = filterButton.target.dataset.filter;

  const filteredStudents = filterStudents();

  displayList(filteredStudents);
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
  } else if (filter === "prefect") {
    filteredStudents = allStudents.filter(isPrefect);
  } else if (filter === "inq") {
    filteredStudents = allStudents.filter(isInq);
  } else if (filter === "expell") {
    filteredStudents = expelledStudents;

    // document.querySelector("#student .expell-btn").classList.add("hide");
  } else {
    filteredStudents = allStudents.filter(ifStudentAll);
  }

  document.querySelector(".number-of-students").textContent =
    filteredStudents.length;

  return filteredStudents;
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

function isPrefect(student) {
  if (student.prefect === true) {
    return true;
  }
  return false;
}

function isInq(student) {
  if (student.inq === true) {
    return true;
  }
  return false;
}

/*-------------------SORTERING------------------------*/
function selectedSorting(event) {
  sortThis = event;
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

/*-------------------HACKING------------------------*/
function hackTheSystem(student) {
  alert("YOU'RE BEING HACKED NOW, YEEEEEHAAWWW");

  document.querySelector("#hack").removeEventListener("click", hackTheSystem);

  student.inq = false;

  addMe();
  isHacked = true;
  if (isHacked === true) {
    document.querySelector("body").style.backgroundColor = "rgb(0, 255, 85)";
  }
  hackBlood();
}

function hackBlood() {
  allStudents.forEach(changeBlood);
  buildList();
}

function changeBlood(student) {
  const number = Math.floor(Math.random() * 3) + 1;

  if (
    student.bloodStatus === "Muggle-born" ||
    student.bloodStatus === "Halfblood"
  ) {
    student.bloodStatus = "Pureblood";
  } else if (number === 1) {
    student.bloodStatus = "Muggle-born";
  } else if (number === 2) {
    student.bloodStatus = "Halfblood";
  } else {
    student.bloodStatus = "Pureblood";
  }
}

function addMe() {
  const me = createMe();
  allStudents.push(me);
}

function createMe() {
  const me = Object.create(Student);
  me.fullName = "Marikka Katrina Højen";
  me.firstName = "Marikka";
  me.middleName = "Katrina";
  me.lastName = "Højen";
  me.nickName = "LeviosaaAAAaH";
  me.house = "Gryffindor";
  me.gender = "Ginger-gal";
  me.image = "højen_m";
  me.bloodStatus = "Pure";
  me.isMe = true;

  return me;
}

/*-------------------FETCH STUDENT JSON------------------------*/
async function loadJSON() {
  const response = await fetch(url);
  const studentJSON = await response.json();

  prepareObjects(studentJSON);
}

/*-------------------KLARGØR DATA------------------------*/
function prepareObjects(studentJSON) {
  studentJSON.forEach((jsonObject) => {
    const student = Object.create(Student);
    let name = jsonObject.fullname.trim().toLowerCase();
    let splitName = name.split(" ");

    //Firstname
    student.firstName =
      splitName[0].substring(0, 1).toUpperCase() + splitName[0].substring(1);

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

    if (student.firstName === "Seamus") {
      student.lastName = "Finnigan";
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

    //Gender
    let gender = jsonObject.gender.trim().toLowerCase();
    student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1);

    //House
    let house = jsonObject.house.trim().toLowerCase();
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

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

    if (student.firstName == "Leanne") {
      student.image = "missing_student";
    }
    /*-------------------FETCH BLOOD-DATA------------------------*/

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

    student.schoolstatus = true;
    student.prefect = false;
    student.inq = false;

    allStudents.push(student);
    // console.log(allStudents);
  });

  displayList(allStudents);
}

/*-------------------VIEW: VIS STUDENTS------------------------*/
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
    klon.querySelector(".house").textContent = student.house;
    klon.querySelector(".image").src = `images/${student.image}.png`;

    /*-------------------EXPELL 1------------------------*/
    klon.querySelector(".expell-btn").addEventListener("click", clickExpell);
    function clickExpell() {
      document
        .querySelector(".expell-btn")
        .removeEventListener("click", clickExpell);

      if (isHacked === true && student.firstName === "Marikka") {
        alert("EXPELLING ME??? Are you NUTS! THAT AIN'T NEVA GON' HAPPN'!!!!");
      } else {
        if (student.schoolstatus === false) {
          //Toggle
          student.schoolstatus = true;
          document.querySelector(".school-status").textContent = "Attending";
        } else {
          expellStudent(student);
        }
      }

      buildList();
    }

    /*-------------------PREFECT 1------------------------*/
    klon.querySelector(".prefect-btn").addEventListener("click", clickPrefect);
    function clickPrefect() {
      document
        .querySelector(".prefect-btn")
        .removeEventListener("click", clickPrefect);
      //Dette kan kun lade sig gøre, hvis den studerende IKKE er expelled
      if (student.schoolstatus === true) {
        if (student.prefect === true) {
          student.prefect = false;
        } else {
          tryToMakeAPrefect(student);
        }
      } else {
        alert("This student is expelled and cannot become a prefect!");
      }
      buildList();
    }

    //Hvis student er EXPELLED, grayscales billede samt hide fjernes fra DOM-element
    if (student.schoolstatus === false) {
      klon.querySelector(".image").style.filter = "grayscale()";
      klon.querySelector(".expelled").style.paddingTop = "0.5em";
      klon.querySelector(".expelled").classList.remove("hide");
      klon.querySelector(".expell-btn").remove();
      klon.querySelector(".prefect-btn").remove();

      student.inq = false;
      student.prefect = false;
    }

    //Når der klikkes på Li-element, åbnes et popup
    klon
      .querySelector("li")
      .addEventListener("click", () => showDetails(student));

    //Studentlisten skal appende alt klon-data
    studentList.appendChild(klon);
  });
}

/*-------------------POPUP------------------------*/
function showDetails(student) {
  document.querySelector("li").removeEventListener("click", showDetails);

  console.log("clicked", student);

  const popup = document.querySelector("#popup");

  if (student.inq) {
    popup.querySelector(".fullName").textContent = student.fullName + "🎖";
    popup.querySelector(".inq").textContent = "Is a member";
    popup.querySelector(".inq-btn").textContent =
      "Remove from Inquisitorial Squad";
  } else if (!student.inq) {
    popup.querySelector(".fullName").textContent = student.fullName;
    popup.querySelector(".inq").textContent = "Is not a member";
    popup.querySelector(".inq-btn").textContent = "Add to inquisitorial squad";
  }

  popup.style.display = "block";

  /*-------------------POPUP I HUSENES FARVER------------------------*/
  if (student.house == "Slytherin") {
    popup.querySelector(".img-container").style.backgroundColor = "#1a472a";
    popup.querySelector(".crest").src = "images/slytherin.png";
  }

  if (student.house == "Gryffindor") {
    popup.querySelector(".img-container").style.backgroundColor = "#740001";
    popup.querySelector(".crest").src = "images/gryffindor.png";
  }

  if (student.house == "Ravenclaw") {
    popup.querySelector(".img-container").style.backgroundColor = "#0e1a40";
    popup.querySelector(".crest").src = "images/ravenclaw.png";
  }

  if (student.house == "Hufflepuff") {
    popup.querySelector(".img-container").style.backgroundColor = "#ecb939";
    popup.querySelector(".crest").src = "images/hufflepuff.png";
  }

  popup.querySelector(
    ".fullName"
  ).textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
  popup.querySelector(".firstName").textContent = student.firstName;
  popup.querySelector(".nickName").textContent = student.nickName;
  popup.querySelector(".middleName").textContent = student.middleName;
  popup.querySelector(".lastName").textContent = student.lastName;
  popup.querySelector(".gender").textContent = student.gender;
  popup.querySelector(".house").textContent = student.house;
  popup.querySelector(".image").src = `images/${student.image}.png`;
  popup.querySelector(".blood").textContent = student.bloodStatus;
  popup.querySelector(".inq-btn").addEventListener("click", clickInq);

  /*-------------------INQUISITORIAL SQUAD------------------------*/
  //Når der klikkes på "Add to inq..."
  function clickInq() {
    //Dette kan kun lade sig gøre, hvis student går på skolen og er PUREBLOOD eller SLYTHERIN
    console.log("CLICK INQ", student);
    if (student.house === "Slytherin" || student.bloodStatus === "Pureblood") {
      if (isHacked === true) {
        student.inq = true;
        setTimeout(removeInq, 1000);
        popup.querySelector(".fullName").textContent = student.fullName + "🎖";
        popup.querySelector(".inq").textContent = "Is a member";
        popup.querySelector(".inq-btn").textContent =
          "Remove from Inquisitorial Squad";

        function removeInq() {
          student.inq = false;
          alert("WOOPPSSSII, u got removed buddy!!!");
          popup.querySelector(".fullName").textContent = student.fullName;
          // popup.querySelector(".inq").textContent = "Is not a member";
          popup.querySelector(".inq-btn").textContent =
            "Add to inquisitorial squad";
          popup.querySelector(".inq").textContent = "Is not a member";
        }
      } else if (student.inq === true) {
        //TOGGLE -- Hvis man toggler, væksler man mlm. at være medlem el. ej
        student.inq = false;
      } else {
        makeInq(student);
      }
    } else {
      document.querySelector(".inq").textContent = "Is not a member";
      popup.querySelector(".fullName").textContent = student.fullName;
      //Lever man ikke op til kriterierne om Inq, vil en ALERT poppe op!
      student.inq = false;
      alert("This student isn't suited to join the inquisitorial squad!");
    }
  }

  /*-------------------LUK POPUP------------------------*/
  //Uanset om man trykker på kryds el. andet sted på popup'en, lukker det ned
  document.querySelector("#luk").addEventListener("click", () => {
    popup.style.display = "none";
    document.querySelector(".inq-btn").removeEventListener("click", clickInq);
  });

  //TEKSTINDHOLD i POPUP ændrer is ift. om man er medlem af PREFECT eller ej
  if (student.prefect === true) {
    popup.querySelector(".prefect").textContent = "Is a prefect";
    //Stjerne tilføjes fullname, ligesom på Li-element
    popup.querySelector(".fullName").textContent = student.fullName + " 🌟";
  } else {
    popup.querySelector(".prefect").textContent = "Is a not prefect";
  }

  //TEKSTINDHOLD i POPUP ændrer is ift. om man er medlem af EXPELLED eller ej
  if (student.schoolstatus === false) {
    popup.querySelector(".inq-btn").classList.add("hide");
    popup.querySelector(".school-status").textContent =
      "THIS STUDENT IS EXPELLED";
    popup.querySelector(".school-status").style.color = "red";
    student.inq = false;
    student.prefect = false;
  } else {
    popup.querySelector(".school-status").style.color = "#372e29";
    popup.querySelector(".school-status").textContent = "Attending at Hogwarts";
    popup.querySelector(".inq-btn").classList.remove("hide");
  }
  function makeInq(chosenStudent) {
    console.log("MAKE INQ", chosenStudent);
    chosenStudent.inq = true;
    document.querySelector(".fullName").textContent =
      chosenStudent.fullName + "🎖";
    document.querySelector(".inq").textContent = "Is a member";
    document.querySelector(".inq-btn").textContent =
      "Remove from Inquisitorial Squad";
  }
}

/*-------------------EXPELL 2------------------------*/
function expellStudent(selectedStudent) {
  if (selectedStudent.schoolstatus === true) {
    console.log(selectedStudent);
    allStudents.splice(allStudents.indexOf(selectedStudent), 1);
    selectedStudent.schoolstatus = false;
    selectedStudent.prefect = false;
    selectedStudent.inq = false;
    expelledStudents.push(selectedStudent);
  }

  buildList();
}

/*-------------------PREFECT 2------------------------*/
function tryToMakeAPrefect(selectedstudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  const prefect = prefects.filter(
    (student) => student.house === selectedstudent.house
  );

  if (prefect.length >= 2) {
    removeAorB(prefect[0], prefect[1]);
  } else {
    makePrefect(selectedstudent);
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
    }

    function clickRemoveA() {
      //if removeA:
      document
        .querySelector("#remove_aorb #removea")
        .removeEventListener("click", clickRemoveA);
      removePrefect(prefectA);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      //else - if removeB
      document
        .querySelector("#remove_aorb #removeb")
        .removeEventListener("click", clickRemoveB);
      removePrefect(prefectB);
      makePrefect(selectedstudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makePrefect(selectedstudent) {
    selectedstudent.prefect = true;
    document.querySelector(".prefect").textContent = "Is a prefect";
    //Stjerne tilføjes fullname, ligesom på Li-element
    document.querySelector(".fullName").textContent =
      selectedstudent.fullName + " 🌟";
  }
}
