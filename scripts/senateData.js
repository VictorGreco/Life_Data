/*eslint-env browser*/
/*eslint "no-console": "off" */
/*eslint "no-undef": "off" */
$(function () {
    $.ajax({
        beforeSend: function (xhr) {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType("application/json");
            }
        }
    });
    var url;
    var url_Senate_Data = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";
    var url_House_Data = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
    $('body').attr('data-source-type') === "senate" ? url = url_Senate_Data : url = url_House_Data;

    $.getJSON(url, function (data) {

        $('.spinwrap').hide();
        getTable(data);
        getDropdownOfStates(data);
        $('#republican, #democrat, #independent').click(updateUI);
        $('#filterByState').change(updateUI);
        $("a.iframe").colorbox({
            iframe: true,
            width: "80%",
            height: "80%",
        });
        $('.table').dataTable({
            "dom": '<"top"f>rt<"bottom"i><"clear">',
            "bPaginate": false,
            "sScrollY": 600,
            "bScrollCollapse": true,
            "search": {
                "smart": true,
            }
        });
    });
})
//----------------------------------------------MAIN FUNCTIONS------------------------------------------------------------------------
function getTable(data) {
    var tableTitles = ["SENATOR", "PARTY AFILIATON", "STATE", "YEARS IN OFFICE", "% VOTES w/ PARTY"];
    getHeaderRow(tableTitles);
    getTableContent(data);
}

function updateUI() {
    var activeFilters = getCheckedBoxes();
    $('.R, .D, .I').hide();
    activeFilters == "" ? $('.R, .D, .I').show() : $(activeFilters).show();
}

function getDropdownOfStates(data) {
    var complexOfLines = "";
    $(getStatesArray(data)).each(function () {
        complexOfLines += "<option value='" + this + "'>" + this + "</option>";
    });
    $('#filterByState').html(complexOfLines);
}
//-----------------------------------------TABLE GENERATION FUNCTIONS------------------------------------------------
function getHeaderRow(titleArray) {

    var headerRow = "";
    $(titleArray).each(function () {
        headerRow += "<th>" + this + "</th>";
    })
    $('#dataTableHeader').html("<tr>" + headerRow + "</tr>");
}

function getTableContent(data) {
    var template = $('#data-template').html();
    var tableRows = Mustache.render(template, data.results[0]);
    $('#dataTableBody').html(tableRows);
}
//----------------------------------------------------LIST GENERATION FUNCTION--------------------------------------------------------
function getStatesArray(data) {
    var listOfStates = [];
    $(data.results[0].members).each(function () {
        listOfStates.indexOf(this.state) === -1 ? listOfStates.push(this.state) : "";
    })
    listOfStates.sort().unshift("All");
    return listOfStates;
}
//----------------------------------------------------CHECKBOXES FUNCTION--------------------------------------------------------
function getCheckedBoxes() {
    var checkedParties = [];
    var stateFilter = "." + $('#filterByState').val();
    stateFilter === ".All" ? stateFilter = "" : "";
    $('#checkboxes input:checked').each(function () {
        checkedParties.push(" " + stateFilter + "." + $(this).val());
    })
    checkedParties.length === 0 ? checkedParties.push(stateFilter) : "";
    checkedParties += "";
    return checkedParties;
}
