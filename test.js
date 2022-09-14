"use strict";

document
  .querySelector(".gryffindor-filter")
  .addEventListener("click", filterList);

document
  .querySelector(".ravenclaw-filter")
  .addEventListener("click", filterList);

document
  .querySelector(".hufflepuf-filter")
  .addEventListener("click", filterList);

document
  .querySelector(".slytherin-filter")
  .addEventListener("click", filterList);

function filterList(house) {
  const list = allStudents.filter(isHouse);

  function isHouse(student) {
    if (student.house === house) {
      return true;
    } else {
      return false;
    }
  }

  displayList(list);
}
