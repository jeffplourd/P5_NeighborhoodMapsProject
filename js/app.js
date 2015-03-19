//model

var placeModel = [
	{
		name: 'Dorms',
		city: 'San Diego',
		lat: 32.772278,
		lng: -117.068234,
		showME: true
	},
	{
		name: 'Sigma Chi',
		city: 'San Diego',
		lat: 32.769532,
		lng: -117.069571,
		showME: true
	},
	{
		name: 'Love Library',
		city: 'San Diego',
		lat: 32.775169,
		lng:  -117.071541,
		showME: true
	},
	{
		name: 'Viejas Arena',
		city: 'San Diego',
		lat: 32.773356,
		lng:  -117.074408,
		showME: true
	},
	{
		name: 'Aztec Student Union',
		city: 'San Diego',
		lat: '32.773847',
		lng: '-117.069848',
		showME: true
	}
];

//I made a custom binding that displays my map and markers.

ko.bindingHandlers.map = {

    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
    	//the following code adds the map to the page
    	var mapObj = valueAccessor();
        mapObjUnwrapped = ko.unwrap(mapObj);

	    var latLng = new google.maps.LatLng(
            ko.unwrap(mapObjUnwrapped.lat),
            ko.unwrap(mapObjUnwrapped.lng));

        var mapOptions = {
        	center: latLng,
        	zoom: 15,
        };

        mapObjUnwrapped.googleMap = new google.maps.Map(element, mapOptions);

        //the following code adds the markers to the map for each 'place'
        var testVariable = ko.unwrap(mapObjUnwrapped.places);
        console.log(testVariable.length);

        for(var i = 0; i < testVariable.length; i++) {
        	var LatLng = new google.maps.LatLng(ko.unwrap(testVariable[i].lat()), ko.unwrap(testVariable[i].lng()));
        	var marker = new google.maps.Marker({
        		position: LatLng,
        		map: mapObjUnwrapped.googleMap,
        		title: ko.unwrap(testVariable[i].name())
        	});
        }
    }
};

//I made a custom binding to filter the places on my map with the input from the input box
ko.bindingHandlers.filter = {

	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var placeList = valueAccessor();
		placeListUnwrapped = ko.unwrap(placeList);

		//I need to grab the value from the 'textInput' binding
		var textInputValue = ko.unwrap(allBindingsAccessor.get("textInput"));

		for(var i = 0; i < placeListUnwrapped.length; i++) {
			var placeListNameLower = placeListUnwrapped[i].name().toLowerCase();
			if(placeListNameLower.includes(textInputValue)) {
				placeListUnwrapped[i].showME(true);
			}else {
				placeListUnwrapped[i].showME(false);
			}
		}

		//In this custom binding, I have access to the 'placeList' array and the 'filter' observable
		//I need to figure out at way to filter the observable array against the 'filter' value
		//Now that I have access to the array, I want to gain access to each element of the array's
		//name property.

		//if i could use the information from the input to determine if the input has the same letters as
		//the name in each 'place', then I could change the 'visiblilty' of each object.
		//take the value from 'input', then compare it to the name in each placeList element.
		//if value matches, then keep visible, else make visiblity 'false'
	}
}



//class of data that will take in an object from the model, and represent the "places" on the map and in the list

var Place = function(data) {
	//this is where I will add the observables for each "Place"
	this.name = ko.observable(data.name);
	this.city = ko.observable(data.city);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.showME = ko.observable(data.showME);
	this.street = ko.observable(data.street);
}

//MV

var ViewModel = function() {
	var self = this;

	self.placeList = ko.observableArray([]);

	placeModel.forEach(function(currentPlace){
		self.placeList.push(new Place(currentPlace));
	});

	self.myMap = ko.computed(function(){
		return {lat: ko.observable(32.774770), lng: ko.observable(-117.071665), places: self.placeList()}
    });

	self.filterString = ko.observable('');

	self.ajaxRequest = function(place) {


		var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + place.name() + "&format=json&callback=wikiCallback";
		var $wikiElem = $('#wikipedia-links');
		$wikiElem.text("");
		//this is the ajax request to wikipedia
		$.ajax({
        	url: wikiUrl,
        	dataType: "jsonp",
        	success: function ( response ) {
            	console.log(response);
            	var articleList = response[1];
            	for(var i = 0; i < articleList.length; i++) {
                	var articleStr = articleList[i];
                	var url = "http://en.wikipedia.org/wiki/" + articleStr;
                	$wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            	};
        	}
    	});

    	//this is how to make background according to exact address
    	var $extraInfo = $('#extraInfo');
    	$extraInfo.text("");
    	var fullLocation = place.lat() + ',' + place.lng();
    	var bgImageTemp = '<iframe width="400" height="275" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/streetview?location='
    	+ fullLocation + '&key=AIzaSyA-w4P4Nz_UWWGlPpxjUCIIbtq3F-b8xs4"></iframe>';
    	var bgImage = bgImageTemp.replace("%data%", fullLocation);
    	$extraInfo.append(bgImage);
	}
}

ko.applyBindings(new ViewModel());


//API key: AIzaSyA-w4P4Nz_UWWGlPpxjUCIIbtq3F-b8xs4

