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


//I need to make a component that renders my map
ko.components.register('some-component-name', {
    viewModel: function(params) {
    	this.test = params.initialName;
    },
    template: "<h2 data-bind='text: test'></h2>"
});

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

	self.testing = ko.observable("Bill");
}

ko.applyBindings(new ViewModel());


//API key: AIzaSyA-w4P4Nz_UWWGlPpxjUCIIbtq3F-b8xs4
