var myjob = new $.jobs.Job({
		uri: "send_Job.xsjob"
	});
var d = new Date();
var day = ["sun","mon","tue","wed","thu","fri","sat"];
var a = d.getUTCFullYear() + " " + (d.getUTCMonth() + 1) + " " + d.getUTCDate() + " " + day[d.getUTCDay()] + " " + d.getUTCHours() + " " + (d.getUTCMinutes() + 1) + " " + d.getUTCSeconds();
var id = myjob.schedules.add({
		description: "Query another stock new",
		xscron: a,
		parameter: {}
	});
	//myjob.schedules.delete( {id:  id } );