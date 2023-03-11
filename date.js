exports.getDate=
function (){
   var today=new Date()
var options={weekday:"long",
               day:"numeric",
             month:"long"};
var day=today.toLocaleDateString("en-US",options);
return day;
}
exports.getDay=
function (){
   var today=new Date()
var options={
               day:"numeric",
             }
var day=today.toLocaleDateString("en-US",options);
return day;
}
