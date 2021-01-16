const topSellingItemTable = $("#top_selling_items table");
const topSellingItemForm = $('#add_top_selling_item');

// SORTING ALGORITHM
// $(".sortable_column").click(function () {
//     let table = $(this).parents("table").eq(0);
//     let tableLength = table.find("tbody").length
//     let rows = table.find("tr").slice(1, tableLength).toArray().sort(comparer($(this).index()));
//     let rowsForSort;
//     this.asc = !this.asc;

//     if (!this.asc) {
//         rows = rows.reverse();
//     }

//     for (let i = 0; i < rows.length; i++) {
//         table.append(rows[i]);
//     }
// })

// function comparer(index) {
//     return function (a, b) {
//         let valA = getCellValue(a, index);
//         let valB = getCellValue(b, index);

//         return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
//     }
// }

// function getCellValue(row, index) {
//     return $(row).children('td').eq(index).text()
// }


// LOADING DATA FROM DB
function loadDataToTable() {
    $.ajax({
        type: "get",
        url: "https://wt.ops.labs.vu.nl/api21/e532098f",
        data: "data",
        dataType: "JSON",
        success: function (response) {
            for(let i = 0; i < response.length; i++) {
                topSellingItemTable.find("tbody").prepend(`<tr><td><img src="${response[i].image}" height="150"></td><td> ${response[i].product} </td><td> ${response[i].origin} </td><td> ${response[i].best_before_date} </td><td> ${response[i].amount} </td></tr>`)
            }
        }
    });
}


// SUBMITTING NEW ITEM, EVENT LISTENER
topSellingItemForm.submit(function (e) {
    e.preventDefault();

    $.ajax({
        type: "post",
        url: "https://wt.ops.labs.vu.nl/api21/e532098f",
        data: topSellingItemForm.serialize(),
        success: function (data) {
            // ADDING ITEM TO TABLE FROM RESPONSE 
            $.ajax({
                type: "get",
                url: data.URI,
                data: "data",
                dataType: "JSON",
                success: function (response) {
                    topSellingItemTable.find("tbody").prepend(`<tr><td><img src="${response.image}" height="150"></td><td> ${response.product} </td><td> ${response.origin} </td><td> ${response.best_before_date} </td><td> ${response.amount} </td></tr>`)
                    console.log(topSellingItemTable.find("tbody tr").length);
                }

            });
        }
    });
});


// RESETING DATABASE, EVENT LISTENER
$(".reset_database").click(function () {
    $.ajax({
        type: "get",
        url: "https://wt.ops.labs.vu.nl/api21/e532098f/reset",
        dataType: "json",
        success: function (response) {
            // DELETE EVERYTHING FROM TABLE
            topSellingItemTable.find("tbody tr:not(:last-child)").slice(0).remove();
            // ADD ITEMS FROM DB AFTER RESET
            loadDataToTable();
        }
    });
});


// EXECUTION:
$(document).ready(function () {
    loadDataToTable()
});


