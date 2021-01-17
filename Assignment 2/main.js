const topSellingItemTable = $("#top_selling_items table");
const topSellingItemForm = $("#add_top_selling_item");
const sortableColumns = $("sortable_column");

// 1. SORTING ALGORITHM

// $("th").click(function () {
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
// NEW SORTING ALGORITHM GOES HERE ↓↓↓↓↓↓↓↓

// user sortableColumns variable instead of th tag


// Second sorthing(but takes 2 headers)--------------------------
// It is all in vanila js no jq is used.

// const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

// const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
//     v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
//     )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// document.querySelectorAll('.sortable_column').forEach(th => th.addEventListener('click', (() => {
//     const table = th.closest('table');
//     Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
//         .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
//         .forEach(tr => table.appendChild(tr) );
// })));


// STATIC TABLE SORT
$('.sortable_column_header').click(function () {
    // loadDataToTable(); -- TRY USING FOR DYNAMIC TABLE SORTING
    let table = $(this).parents('table').eq(0)
    let rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc) {
        rows = rows.reverse()
    }

    for (var i = 0; i < rows.length; i++) {
        if (!$(rows[i]).hasClass("sortable_column")) {
            table.find("tr").eq(0).after(rows[i])
        }
    }
});

// Helper function 
function comparer(index) {
    return function (a, b) {
        let valA = getCellValue(a, index);
        let valB = getCellValue(b, index);

        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}

//Helper function
function getCellValue(row, index) {
    return $(row).children('td').eq(index).text()
}


// 2.RESET BUTTON
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


// 3.DYNAMIC TABLE CONTENT
function loadDataToTable() {
    $.ajax({
        type: "get",
        url: "https://wt.ops.labs.vu.nl/api21/e532098f",
        data: "data",
        dataType: "JSON",
        success: function (response) {
            for (let item in response) {
                topSellingItemTable.find("tbody").prepend(`<tr><td><img src="${response[item].image}" height="150"></td><td> ${response[item].product} </td><td> ${response[item].origin} </td><td> ${response[item].best_before_date} </td><td> ${response[item].amount} </td></tr>`)
            }
        }
    });
}


// 4.SINGLE PAGE FORM SUBMIT
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
                }
            });
        }
    });
});


// EXECUTION
$(document).ready(function () {
    loadDataToTable()
});