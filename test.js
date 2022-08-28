let today = new Date()
// // today = today.split("T")[0];
// console.log(today.getDate());
// console.log(today.getMonth());

// console.log(typeof today);

function dateConverter(dateObject) {
    let date = dateObject.getDate();
    let month = dateObject.getMonth()+1;
    let year = dateObject.getFullYear();
    return `${year}-${month}-${date}`;
}
console.log(dateConverter(today));