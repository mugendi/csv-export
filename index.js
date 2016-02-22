var converter = require('json-2-csv');
var Ziptree = require('ziptree');
var path =require('path');
var async = require('async');
var _ = require('lodash');


var csv_export={
	csvObject:{},
	json2csv: function(object,callback){
		//
    	converter.json2csv(object,function(err,csv){
    		if (err) {return callback(err,null);}

    	    callback(null,csv);

    	},{CHECK_SCHEMA_DIFFERENCES:false});

	},
	export: function(jsonObj,callback){

		//always use as array
		if(_.isArray(jsonObj)){
			jsonObj={'all':jsonObj};
		}

		async.forEachOf(jsonObj,function(obj,key,next){

			csv_export.json2csv(obj,function(err, csv){
				if (err) throw err;

				csv_export.csvObject[key+'.csv']=csv;

				//next index
				next();

			});

		},function(){
			// console.log(JSON.stringify(csv_export.csvObject,0,4))
			//now export
			zipFile(function(data){
				callback(data);
			});
			//
		});
	}

};



function zipFile(callback){
	//makefile
	var file = new Ziptree (csv_export.csvObject);
	var data = file.toBuffer();

	callback(data);
}



module.exports = csv_export;
