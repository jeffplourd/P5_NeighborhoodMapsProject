//model

var placeModel = [
	{
		name: 'Starbucks',
		city: 'Seattle'
	},
	{
		name: 'Microsoft',
		city: 'Seattle'
	},
	{
		name: 'google',
		city: 'Mountain View'
	}
];

/*
//I need to make a component that renders my map
ko.components.register('some-component-name', {
    viewModel: function(params) {
    	this.test = params.initialName;
    },
    template: "<h2 data-bind='text: test'></h2>"
});
*/

//I'm going to make a custom binding that will display my map.

ko.bindingHandlers.map = {

     init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = valueAccessor();
        var mapObjUnwrapped = ko.unwrap(mapObj);

        var latLng = new google.maps.LatLng(
            ko.unwrap(mapObjUnwrapped.lat),
            ko.unwrap(mapObjUnwrapped.lng));

        var mapOptions = {
        	center: latLng,
        	zoom: 5,
        };

        mapObjUnwrapped.googleMap = new google.maps.Map(element, mapOptions);
    }
};

//class of data that will take in an object from the model, and represent the "places" on the map and in the list

var Place = function(data) {
	//this is where I will add the observables for each "Place"
	this.name = ko.observable(data.name);
	this.city = ko.observable(data.city);
}

//MV

var ViewModel = function() {
	var self = this;

	self.placeList = ko.observableArray([]);

	placeModel.forEach(function(currentPlace){
		self.placeList.push(new Place(currentPlace));
	});

	self.myMap = ko.observable({
        lat: ko.observable(55),
        lng: ko.observable(11)
    });
}

ko.applyBindings(new ViewModel());


//API key: AIzaSyA-w4P4Nz_UWWGlPpxjUCIIbtq3F-b8xs4
