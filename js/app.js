//model

var placeModel = [
	{
		name: 'Maya Residence Hall',
		city: 'San Diego',
		lat: 32.772278,
		lng: -117.068234,
		showME: true,
		infoWindowContent: 'Maya Residence Hall',
		image: 'http://www.freshmansupport.com/images/ca/san-diego/sdsu/properties/olmeca/main0.jpg'
	},
	{
		name: 'Sigma Chi',
		city: 'San Diego',
		lat: 32.769532,
		lng: -117.069571,
		showME: true,
		infoWindowContent: 'Sigma Chi',
		image: 'img/sigmaChi.jpg'
	},
	{
		name: 'Love Library',
		city: 'San Diego',
		lat: 32.775169,
		lng:  -117.071541,
		showME: true,
		infoWindowContent: 'The Lib',
		image: 'http://gra.sdsu.edu/grad/orientation/images/library.jpg'
	},
	{
		name: 'Viejas Arena',
		city: 'San Diego',
		lat: 32.773356,
		lng:  -117.074408,
		showME: true,
		infoWindowContent: 'Basketball House',
		image: 'http://universe.sdsu.edu/sdsuniverse/images/stories/res630xy-str-031709-viejas.jpg'
	},
	{
		name: 'Aztec Student Union',
		city: 'San Diego',
		lat: '32.773847',
		lng: '-117.069848',
		showME: true,
		infoWindowContent: 'Associated Students',
		image: 'https://as.sdsu.edu/slideshow/81.jpg'
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
        	zoom: 15
        };

        mapObjUnwrapped.googleMap = new google.maps.Map(element, mapOptions);

        //the following code adds the markers to the map for each 'place'
        var testVariable = ko.unwrap(mapObjUnwrapped.places);

        for(var i = 0; i < testVariable.length; i++) {
        	var LatLng = new google.maps.LatLng(ko.unwrap(testVariable[i].lat()), ko.unwrap(testVariable[i].lng()));
        	var marker = new google.maps.Marker({
        		position: LatLng,
        		map: mapObjUnwrapped.googleMap,
        		title: ko.unwrap(testVariable[i].name())
        	});
        	//what we need to do here is create the info window, and create an event to will open the marker
        	//I have access to the model view the 'testVariable', I can add the html to the model and the Place
        	//constructor function.
        	attachMessage(marker, i);
        }

        function attachMessage(marker, num) {
        	var message = ko.unwrap(testVariable[num].infoWindowContent());
        	var infoWindow = new google.maps.InfoWindow({
        		content: message
        	});
        	//add event listeners to open and close the info window
        	google.maps.event.addListener(marker, 'mouseover', function() {
        		infoWindow.open(marker.get('map'),marker);
        	});

        	google.maps.event.addListener(marker, 'mouseout', function() {
        		infoWindow.close();
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
		var textInputValue = ko.unwrap(allBindingsAccessor.get("textInput")).toLowerCase();

		for(var i = 0; i < placeListUnwrapped.length; i++) {
			var placeListNameLower = placeListUnwrapped[i].name().toLowerCase();
			if(placeListNameLower.includes(textInputValue)) {
				placeListUnwrapped[i].showME(true);
			}else {
				placeListUnwrapped[i].showME(false);
			}
		}
	}
};



//class of data that will take in an object from the model, and represent the "places" on the map and in the list

var Place = function(data) {
	//this is where I will add the observables for each "Place"
	this.name = ko.observable(data.name);
	this.city = ko.observable(data.city);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.showME = ko.observable(data.showME);
	this.infoWindowContent = ko.observable(data.infoWindowContent);
	this.image = ko.observable(data.image);
};

//MV

var ViewModel = function() {
	var self = this;

	self.placeList = ko.observableArray([]);

	placeModel.forEach(function(currentPlace){
		self.placeList.push(new Place(currentPlace));
	});

	self.myMap = ko.computed(function(){
		return {lat: ko.observable(32.774770), lng: ko.observable(-117.071665), places: self.placeList()};
    });

	self.filterString = ko.observable('');

	//I wasn't sure where I should place my AJAX requests to stay in alignment with the MVO paradigm.
	//If this needs to me elsewhere, please let me know.
	self.ajaxRequest = function(place) {

		//this is the ajax request to wikipedia
		var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + place.name() + "&format=json&callback=wikiCallback";
		var $wikiElem = $('#wikipedia-links');
		$wikiElem.text("");

		$.ajax({
        	url: wikiUrl,
        	dataType: "jsonp",
        	success: function ( response ) {
            	var articleList = response[1];
            	for(var i = 0; i < articleList.length; i++) {
                	var articleStr = articleList[i];
                	var url = "http://en.wikipedia.org/wiki/" + articleStr;
                	$wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            	}
        	}
    	}).error(function(e) {
    		$wikiElem.text('Wikipedia articles could not be found.');
    	});

    	var $extraInfo = $('#extraInfo');
    	$extraInfo.empty();
    	var image = "<img class='img-responsive' src='" + place.image() + "'>";
    	$extraInfo.append(image);
	};
};

ko.applyBindings(new ViewModel());


//This is for personal reference during the project:
//API key: AIzaSyA-w4P4Nz_UWWGlPpxjUCIIbtq3F-b8xs4

