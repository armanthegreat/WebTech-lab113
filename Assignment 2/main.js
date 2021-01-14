// SORTING ALGORITHM
$('.t1_head').click(function () {
    console.log("button pressed")
    let table = $(this).parents('table').eq(0)
    console.log(table.length)
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