// JavaScript Document

//	A namespace object, as requested in the project.
var couponNameSpace = {};


/*
	A function which purpose is to calculate the the coupons locations.
	And show the location of the coupons.
*/
couponNameSpace.getLocation=function(){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(loc){
			couponNameSpace.la = loc.coords.latitude;
			couponNameSpace.lo = loc.coords.longitude;
		}, function() {
			alert("Error get location");
		});
	}else {
		x.innerHTML = "Geolocation is not supported by this browser.";
	}
};

/*
	A function which should take the data from the json file.
	Parse the data into javascript objects, and create a list view from it.
*/
couponNameSpace.listCall = function(filt){
	// Creating xhr object
	var xhr = new window.XMLHttpRequest();
	// Configuring the xhr object
	xhr.open("GET","jsondata.txt",false);
	// Sending the http request
	xhr.send();
	// Getting the content of jsondata.txt as a simple string
	var text = xhr.responseText;
	var ob = JSON.parse(text);
		
	// Find the location.
	couponNameSpace.getLocation();
	// Sorting the data from the json file
	for(var i = 0 ; i < ob.length ; i++){
		for(var j = i+1 ; j < ob.length ; j++){
			var jj = Math.sqrt( Math.pow((ob[j].longitude-couponNameSpace.la),2)+
					Math.pow((ob[j].latitude-couponNameSpace.lo),2));
			var ii = Math.sqrt( Math.pow((ob[i].longitude-couponNameSpace.la),2)+
					Math.pow((ob[i].latitude-couponNameSpace.lo),2));
			if( jj < ii){
				var t = ob[j];
				ob[j] = ob[i];
				ob[i] = t;
			}
		}
	} 
	// End of sortion.
	
	couponNameSpace.pizzaSet = ob;
	// Create the listview, if it's still not created
	$("#list").empty();
	for(var i = 0; i < ob.length ; i++){
		if(filt == ob[i].Kind){
			$("#list").append("<li id='l0'><a href=\"#popupPanel\" "+
			"data-rel=\"popup\" data-transition=\"slide\""+
			" data-position-to=\"window\" data-role=\"button\""+
			" onclick=\"getObjectIndex("+i+")\" >"+ob[i].Name+"</a></li>");	
		}
	}
	$("#list").listview("refresh");
};

/*
	This function is required for the get list function,
	because of the fact we send an index, and take the objects properties.
	@param1 - index of a current object in an array.
*/
function getObjectIndex(i){
	var obj = couponNameSpace.pizzaSet[i];
	var _la = Math.pow((obj.longitude-couponNameSpace.la),2);
	var _lo = Math.pow((obj.latitude-couponNameSpace.lo),2);
	$("#inner").empty();
	$("<h4>Name : " 	+ obj.Name 		+ "</h4>").appendTo("#inner");		
	$("<h4>Kind :"  + obj.Kind 	+ "</h4>").appendTo("#inner");	
	$("<h4>Price :" 		+ obj.Price 	+ "</h4>").appendTo("#inner");	
	$("<h4>Distance :"  + Math.sqrt(_la+_lo).toFixed(2) +
	"</h4>").appendTo("#inner");	
}
