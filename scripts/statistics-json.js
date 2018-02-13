/* eslint-env browser*/
/*eslint "no-console": "off" */
/*eslint "no-undef": "off" */
var statistics = {
    "Table_1": [
        {
            "party": "Republicans",
            "number_of_reps": "0",
            "p_Voted_w_Party": "0",
        },
        {
            "party": "Democrats",
            "number_of_reps": "0",
            "p_Voted_w_Party": "0",
        },
        {
            "party": "Independents",
            "number_of_reps": "0",
            "p_Voted_w_Party": "0",
        },
        {
            "party": "Total",
            "number_of_reps": "0",
            "p_Voted_w_Party": "0",
        }
    ],

    "Table_2": {
        "moreToLess": "0",
        "lessToMore": "0",
    },
    "Table_3": {
        "moreToLess": "0",
        "lessToMore": "0",
    },
};


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
    if ($('body').attr('data-source-type') === "senate") {
        url = url_Senate_Data;
    } else {
        url = url_House_Data;
    }

    $.getJSON(url, function (data) {
        //ACTUAL CALLING FUNCTIONS-----------------------------------------------------------------------------------
        $('.spinwrap').hide();
        getTopTableUpdates(data, statistics.Table_1);
        getTopTable(statistics);
        if ($('#attendenceLeftTable').length === 1) {
            fillAndPrintAttendenceTables(statistics.Table_2);
        } else if ($('#loyaltyLeftTable').length === 1) {
            fillAndPrintLoyaltyTables(statistics.Table_3);
        }

        $("a.iframe").colorbox({
            iframe: true,
            width: "80%",
            height: "80%"
        });

        $('#ascendence').dataTable({
            "bPaginate": false,
            "sScrollY": 600,
            "bScrollCollapse": true,
            "order": [[2, "asc"]],
            "dom": '<t>i',
        });

        $('#descendence').dataTable({
            "bPaginate": false,
            "sScrollY": 600,
            "bScrollCollapse": true,
            "order": [[2, "desc"]],
            "dom": '<t>i',
        });
        //PRINTING TABLES---------------------------------------------------------------------------------------------
        function getTopTable(statistics) {
            var template = $('#topTableContent').html();
            var tablePrintMustache = Mustache.render(template, statistics);
            $('#topTableBody').html(tablePrintMustache);
        }
        //CALL ALL THE UPDATE FUNCTION TO UPDATE MY STATISTICS DATABASE--------------------------------------------------
        function getTopTableUpdates(data, stat_T1) {
            var update;

            var listR = data.results[0].members.filter(function (item) {
                return item.party == "R";
            });
            var listD = data.results[0].members.filter(function (item) {
                return item.party == "D";
            });
            var listI = data.results[0].members.filter(function (item) {
                return item.party == "I";
            });

            update += updateNumberOfPartyMembers(stat_T1, listR, listD, listI, total_Reps);
            update += updatePercentVotedWithParty(stat_T1, listR, listD, listI, total_votes);

            var total_Reps = 0;
            $(stat_T1).each(function () {
                total_Reps += +this.number_of_reps;
            })

            var total_votes = 0;
            $(stat_T1).each(function () {
                total_votes += Math.round(this.p_Voted_w_Party / 3);
            })

            stat_T1[3].number_of_reps = total_Reps;
            stat_T1[3].p_Voted_w_Party = total_votes;

            return update;
        }
        //UPDATES THE VALUES OF MY JASON FIELDS: "number_of_reps"--------------------------------------------------------
        function updateNumberOfPartyMembers(stat, listR1, listD1, listI1) {
            var allLists = [listR1, listD1, listI1];
            $(allLists).each(function () {
                if (this[0].party === "R") {
                    stat[0].number_of_reps = this.length;
                } else {
                    if (this[0].party === "D") {
                        stat[1].number_of_reps = this.length;
                    } else {
                        stat[2].number_of_reps = this.length;
                    }
                }
            })
        }
        //UPDATES THE VALUES OF MY JASON FIELDS: "%_Voted_w/_Party"------------------------------------------------------
        function updatePercentVotedWithParty(stat, listR1, listD1, listI1) {
            var percentRep = 0;
            var percentDem = 0;
            var percentInde = 0;
            $(listR1).each(function () {
                percentRep += +this.votes_with_party_pct;
            })
            $(listD1).each(function () {
                percentDem += +this.votes_with_party_pct;
            })
            $(listI1).each(function () {
                percentInde += +this.votes_with_party_pct;
            })

            stat[0].p_Voted_w_Party = Math.round(percentRep / listR1.length);

            stat[1].p_Voted_w_Party = Math.round(percentDem / listD1.length);

            stat[2].p_Voted_w_Party = Math.round(percentInde / listI1.length);
        }
        //musache printer function
        function mustachePrinter(tbodyId, scriptId, stat) {
            template = $(scriptId).html();
            tablePrintMustache = Mustache.render(template, stat);
            $(tbodyId).html(tablePrintMustache);
        }
        //PRINT TABLE BODYES FOR EACH TABLE AT ATTENDENCE----------------------------------------------------------------
        function fillAndPrintAttendenceTables(stat_T2) {
            var moreToLess10pct = tableContentAttendenceLoyalty(sortMoreToLess, "missed_votes_pct", lessToMore_Pct);
            var lessToMore10pct = tableContentAttendenceLoyalty(sortLessToMore, "missed_votes_pct", lessToMore_Pct);

            stat_T2.moreToLess = moreToLess10pct;
            mustachePrinter('#attendenceRightTable', '#attendenceRightContent', stat_T2)

            stat_T2.lessToMore = lessToMore10pct;
            mustachePrinter('#attendenceLeftTable', '#attendenceLeftContent', stat_T2);
        }

        //PRINT TABLE BODYES FOR EACH TABLE AT LOYALTY-------------------------------------------------------------------
        function fillAndPrintLoyaltyTables(stat_T3) {
            var moreToLess10pct = tableContentAttendenceLoyalty(sortMoreToLess, "votes_with_party_pct", lessToMore_Loyalty);
            var lessToMore10pct = tableContentAttendenceLoyalty(sortLessToMore, "votes_with_party_pct", lessToMore_Loyalty);

            stat_T3.moreToLess = lessToMore10pct;
            $(stat_T3.moreToLess).each(function () {
                this.total_votes = Math.round(this.total_votes * this.votes_with_party_pct / 100);
            })
            mustachePrinter('#loyaltyRightTable', '#loyaltyRightContent', stat_T3);

            stat_T3.lessToMore = moreToLess10pct;
            $(stat_T3.lessToMore).each(function () {
                this.total_votes = Math.round(this.total_votes * this.votes_with_party_pct / 100);
            })
            mustachePrinter('#loyaltyLeftTable', '#loyaltyLeftContent', stat_T3);
        }
        //ATTENDENCE/LOYALTY TABLE CONTENT-----------------------------FACTORIZADO-------------------------------------------
        function tableContentAttendenceLoyalty(func, prop, func_2) {
            var moreToLess = func(func_2);
            var wanted10pct = Math.round(moreToLess.length * 10 / 100);
            var moreToLess10pct = [];
            $(moreToLess).each(function () {
                var currentMemberProp = this[prop];
                var successiveMemberProp = moreToLess[wanted10pct - 1][prop];
                moreToLess10pct.length < wanted10pct || currentMemberProp === successiveMemberProp ? moreToLess10pct.push(this) : "";
            })
            return moreToLess10pct;
        }
        //SORT MEMBERS FROM LESS TO MORE MISSED VOTES PTC-----------------------FACTORIZADO-----------------------
        function sortLessToMore(func) {
            var memberList = data.results[0].members;
            return memberList.sort(func);
        }
        //SORT MEMBERS FROM MORE TO LESS---------------------------------------FACTORIZADO-------------------------
        function sortMoreToLess(func) {
            return sortLessToMore(func).reverse();
        }
        // WHEN THE SORT RUNS IT COMPARES AND SORT BY "missed_votes_pct"-------------------------------------------------
        function lessToMore_Pct(first, second) {
            var missedVotesPctA = first.missed_votes_pct;
            var missedVotesPctB = second.missed_votes_pct;
            var comparison = 0;
            if (missedVotesPctA > missedVotesPctB) {
                comparison = 1;
            } else if (missedVotesPctA < missedVotesPctB) {
                comparison = -1;
            }
            return comparison;
        }
        // WHEN THE SORT RUNS IT COMPARES AND SORT BY "votes_with_party_pct"---------------------------------------------
        function lessToMore_Loyalty(first, second) {
            var missedVotesPctA = first.votes_with_party_pct;
            var missedVotesPctB = second.votes_with_party_pct;
            var comparison = 0;
            if (missedVotesPctA > missedVotesPctB) {
                comparison = 1;
            } else if (missedVotesPctA < missedVotesPctB) {
                comparison = -1;
            }
            return comparison;
        }
    });
});
