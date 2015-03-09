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

//class of data that will take in an object from the model, and represent the "places" on the map and in the list

//I need to make a component that renders my map

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
}

ko.applyBindings(new ViewModel());

