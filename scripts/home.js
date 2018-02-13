/* eslint-env browser*/
/*eslint "no-console": "off" */
/*eslint "no-undef": "off" */
$('#readMore').click(function(){
     console.log("working");
    $('#readMore').hide();
})

$('#readLess').click(function(){
    $('#readMore').show();
})