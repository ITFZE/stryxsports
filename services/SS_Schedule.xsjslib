var libPath = "/ITSFZE/Development/stryxsports/services/";
var m = $.import(libPath + "Moment.xsjslib");
var l = $.import(libPath + "Later.xsjslib");

function getMomentDateTime() {
	var dateTime = new Date("2015-06-17 14:24:36");
	dateTime = m.moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
	$.response.contentType = "application/json";

	$.response.setBody(JSON.stringify({
		"body": dateTime
	}));
}

function getLaterDateTime() {
    var mSSched = [], mESched = [];
	var sDate = new Date('2018-01-01');
	var eDate = new Date('2019-01-01');
	var aTime = [{
			Name: "Monday",
			STime: "11:00",
			ETime: "12:00"
            },
		{
			Name: "Thursday",
			STime: "16:00",
			ETime: "17:00"
            },
		{
			Name: "Sunday",
			STime: "21:00",
			ETime: "22:00"
            }
        ];

	var days = {
		Sunday: 1,
		Monday: 2,
		Tuesday: 3,
		Wednesday: 4,
		Thursday: 5,
		Friday: 6,
		Saturday: 7
	};
	l.later.date.localTime();
	var sSch = l.later.parse.recur();
	var eSch = l.later.parse.recur();
	aTime.forEach(function(element, index) {
		if (index === 0) {
			sSch = sSch.on(element.STime).time().on(days[element.Name]).dayOfWeek();
			eSch = eSch.on(element.ETime).time().on(days[element.Name]).dayOfWeek();
		} else {
			sSch = sSch.and().on(element.STime).time().on(days[element.Name]).dayOfWeek();
			eSch = eSch.and().on(element.ETime).time().on(days[element.Name]).dayOfWeek();
		}
	});

	var sSched = l.later.schedule(sSch).next(-1, sDate, eDate);
	var eSched = l.later.schedule(eSch).next(-1, sDate, eDate);

    sSched.forEach(function(ele){
        mSSched.push(m.moment(ele).format("YYYY-MM-DD HH:mm:ss"));
    });
    eSched.forEach(function(ele){
        mESched.push(m.moment(ele).format("YYYY-MM-DD HH:mm:ss"));
    });
    var arrayCombined = mSSched.reduce(function (arr, v, i) {
        return arr.concat(v, mESched[i]);
    }, []);
	$.response.contentType = "application/json";

	$.response.setBody(JSON.stringify({
    	"body": arrayCombined
	}));
}