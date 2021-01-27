$(document).ready(function () {


    const topSellingItemTable = $("#top_selling_items table");
    const topSellingItemForm = $("#add_top_selling_item");

    // 1. SORTING ALGORITHM

    // Sorting and reset button of dynamic table do not perform well, however sorting itself works fine. Also, input form of dynamic table gets included in sorting

    // STATIC TABLE SORT
    $('.sortable_column_header').click(function () {
        let table = $(this).parents('table').eq(0)
        let rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc) {
            rows = rows.reverse()
        }

        for (var i = 0; i < rows.length; i++) {
            if (!$(rows[i]).hasClass("sortable_column")) {
                table.find("tbody").eq(0).after(rows[i])
            }
        }
    });

    // Helper functions
    function comparer(index) {
        return function (a, b) {
            let valA = getCellValue(a, index);
            let valB = getCellValue(b, index);

            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
        }
    }

    function getCellValue(row, index) {
        return $(row).children('td').eq(index).text()
    }


    // Assignemnt 4
    // BONUS PART:
    // 1.LOADING DYNAMICLY TABLE CONTENT FROM LOCALHOST SERVER
    function loadDataToTable() {
        $.ajax({
            type: "get",
            url: "http://localhost:3000/api/items",
            data: "data",
            dataType: "JSON",
            success: function (response) {
                for (let item in response) {
                    topSellingItemTable.find("tbody").prepend(`<tr><td><img alt="${response[item].product} image" class="productImage" src="${response[item].image}"></td><td> ${response[item].product} </td><td> ${response[item].origin} </td><td> ${response[item].best_before_date} </td><td> ${response[item].amount} </td></tr>`)
                }
            }
        });
    }

    // 2.RESET BUTTON
    $(".reset_database").click(function () {
        $.ajax({
            type: "delete",
            url: "http://localhost:3000/api/items",
            dataType: "json",
            success: function (response) {
                // DELETE EVERYTHING FROM TABLE
                topSellingItemTable.find("tbody tr:not(:last-child)").slice(0).remove();
                // ADD ITEMS FROM DB AFTER RESET
                loadDataToTable();
            }
        });
    });

    // 3.SINGLE PAGE FORM SUBMIT
    topSellingItemForm.submit(function (e) {
        e.preventDefault();

        let formContent = topSellingItemForm.serializeArray();
        let newProduct = {}

        formContent.forEach(element => {
            newProduct[element.name] = element.value;
        });

        $.ajax({
            method: "POST",
            url: "http://localhost:3000/api/items",
            data: newProduct,
            dataType: "json",
            success: function (data) {
                // ADDING ITEM TO TABLE FROM RESPONSE 
                $.ajax({
                    type: "get",
                    url: data.URI,
                    data: "data",
                    dataType: "JSON",
                    success: function (response) {
                        topSellingItemTable.find("tbody").prepend(`<tr><td><img alt="${response[0].product} image" class="productImage" src="${response[0].image}"></td><td> ${response[0].product} </td><td> ${response[0].origin} </td><td> ${response[0].best_before_date} </td><td> ${response[0].amount} </td></tr>`)
                    }
                });
            }
        });
    });

    loadDataToTable();
});