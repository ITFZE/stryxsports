var baseURL = "/b1s/v1";
var libPath = "/ITSFZE/Development/stryxsports/services/";
var mCalSchLib = $.import(libPath + "SS_MCalScheduleLib.xsjslib");

var obj = {
    teamCalName: "Team Calendar Testing",
    teamID: "28",
    cardCode: "CH005073"
};

mCalSchLib.createMCalSchedule(JSON.stringify(obj));