// SORTING ALGORITHM
$('.t1_head').click(function () {
    let table = $(this).parents('table').eq(0)
    let rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc

    if (!this.asc) {
        rows = rows.reverse()
    }

    for (let i = 0; i < rows.length; i++) {
        table.append(rows[i])
    }
})

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

// EVENT LISTENER, RESETING DATABASE
$(".reset_database").click(function () { 
    $.ajax({
        type: "get",
        url: "https://wt.ops.labs.vu.nl/api21/246926a4/reset",
        dataType: "json",
        success: function () {
            console.log("Database reset")
        }
    });
});

// LOADING DATA FROM DB INTO TABLE




// SUBMITTING NEW ITEM; EVENT LISTENER
$('#add_top_selling_item').submit(function (e) { 
    e.preventDefault();
    
});


// EVENT LISTENER, SUBMITING NEW ITEM
$(".ajax_call").click(function () { 
    $.ajax({
        type: "get",
        url: "https://wt.ops.labs.vu.nl/api21/246926a4",
        dataType: "json",
        success: function (data) {
            $("table tbody").html("<tr><td>something</td></tr>");
            console.log(data[0].product)
        }
    });    
});