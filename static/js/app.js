let markers = [];
let locations = [
  {title: 'Electra Center',visible: ko.observable(true), location: {lat: 31.209072, lng:  29.924966}},
  {title: 'Sidi Gaber Station',visible: ko.observable(true), location: {lat: 31.218918, lng: 29.942362}},
  {title: 'Alexandria Library',visible: ko.observable(true), location: {lat: 31.208990,lng: 29.909199}},
  {title: 'Faculty of engineering Alexendria university',visible: ko.observable(true), location: {lat: 31.20741, lng: 29.924116}},
  {title: 'M3ML cooworking space',visible: ko.observable(true), location: {lat: 31.246797,lng: 29.972079}},
];
function initMap(){
  // Constructor creates a new map - only center and zoom are required.
  let map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 31.20741, lng: 29.924116},
    zoom: 13
  });
for(let i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    let position = locations[i].location;
    let title = locations[i].title;
    // Create a marker per location, and put into markers array.
    let marker = new google.maps.Marker({
      position: position,
      title: title,
      opacity: 0.8,
      show: ko.observable(true),
      animation: google.maps.Animation.DROP,
      map: map,
      id: i
  });
    // Push the marker to our array of markers.
    markers.push(marker);
}
}

function AppViewModel() {
    //this.markers = ko.observableArray(markers);
    this.query = ko.observable('');
    this.filter = function() {
        let search = this.query();
        if (search.length === 0) {
            for (let i = 0; i < locations.length; i++) {
                locations[i].visible(true);
                markers[i].setVisible(true);
            }
        } else {
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].title.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    locations[i].visible(true);
                    markers[i].setVisible(true);
                } else {
                    locations[i].visible(false);
                    markers[i].setVisible(false);
                }
            }
        }
    };
}
// Activates knockout.js
ko.applyBindings(new AppViewModel());
