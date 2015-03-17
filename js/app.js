//model

var placeModel = [
	{
		name: 'Dorms',
		city: 'San Diego',
		lat: 32.772278,
		lng: -117.068234
	},
	{
		name: 'Sigma Chi',
		city: 'San Diego',
		lat: 32.769532,
		lng: -117.069571
	},
	{
		name: 'Love Library',
		city: 'San Diego',
		lat: 32.775169,
		lng:  -117.071541
	},
	{
		name: 'Viejas Arena',
		city: 'San Diego',
		lat: 32.773356,
		lng:  -117.074408
	}
];

//I'm going to make a custom binding that will display my map.

ko.bindingHandlers.map = {

    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
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

ko.bindingHandlers.test = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var filterVar = ko.unwrap(allBindingsAccessor.get('textInput'));
		console.log(filterVar);
	}
}

//class of data that will take in an object from the model, and represent the "places" on the map and in the list

var Place = function(data) {
	//this is where I will add the observables for each "Place"
	this.name = ko.observable(data.name);
	this.city = ko.observable(data.city);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
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

	self.filter = ko.observable("");


}

ko.applyBindings(new ViewModel());


//API key: AIzaSyA-w4P4Nz_UWWGlPpxjUCIIbtq3F-b8xs4

