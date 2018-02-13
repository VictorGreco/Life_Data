/* eslint-env browser*/
/*eslint "no-console": "off" */

//document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2);



function getTable(){
    var table = "";
}

function getHeaderRow(){
    var headRow = ["SENATOR", "PARTY AFILIATON", "STATE", "YEARS IN OFFICE", "% VOTES w/ PARTY"];
    for(var index = 0; index < 5; index++){
        
    }
}

function getRows(){
    var rows = "";
    for( var index = 0; index < data.results[0].members.length; index++){
        var currentMember = data.results[0].members[index];
        var middleName = currentMember.middle_name === null ? "":" " + currentMember.middle_name;
        
        var fullName = "<td><a href='" + currentMember.url + "'>" + currentMember.first_name + middleName+" "+currentMember.last_name + "</a></td>";
        var party = "<td>" + currentMember.party + "</td>";
        var state = "<td>" + currentMember.state + "</td>";
        var year = "<td>" + currentMember.seniority + "</td>";
        var percent = "<td>" + currentMember.votes_with_party_pct + "%" + "</td>";
        var currentMemberDate = fullName + party + state + year + percent 
        rows +="<tr>"+  currentMemberDate+ "</tr>";
               
}
        document.getElementById("senate-data").innerHTML = rows; 
    }
getRows();