// this is the data to handle the project //////
let locations = [{
        title: 'Electra Center',
        visible: ko.observable(true),
        location: {
            lat: 31.209072,
            lng: 29.924966
        }
    },
    {
        title: 'Sidi Gaber Station',
        visible: ko.observable(true),
        location: {
            lat: 31.218918,
            lng: 29.942362
        }
    },
    {
        title: 'Alexandria Library',
        visible: ko.observable(true),
        location: {
            lat: 31.208990,
            lng: 29.909199
        }
    },
    {
        title: 'Faculty of engineering Alexendria university',
        visible: ko.observable(true),
        location: {
            lat: 31.20741,
            lng: 29.924116
        }
    },
    {
        title: 'M3ML cooworking space',
        visible: ko.observable(true),
        location: {
            lat: 31.246797,
            lng: 29.972079
        }
    },
];
// to store the markers of the map
let markers = [];
// the function google maps api call when success
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    let map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 31.20741,
            lng: 29.924116
        },
        zoom: 13
    });
    // Activates knockout.js
    ko.applyBindings(new AppViewModel(map));
}




function AppViewModel(map) {
    // Close infowindow when clicked elsewhere on the map
    map.addListener("click", function() {
      largeInfowindow.close();
      largeInfowindow.setContent('');
      largeInfowindow.marker = null;
    });
    let largeInfowindow = new google.maps.InfoWindow();
    // create our dear markers on our beutiful map
    for (let i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      let position = locations[i].location;
      let title = locations[i].title;
      // Create a marker per location, and put into markers array.
      let marker = new google.maps.Marker({
          position: position,
          title: title,
          label: title[0],
          opacity: 0.8,
          fillcolor: '#fff',
          animation: google.maps.Animation.DROP,
          map: map,
          show: ko.observable(true),
          id: i
      });


      marker.addListener('mouseout', function() {
          this.setAnimation(google.maps.Animation.Null);
      });
      marker.addListener('click', toggleBounce);
      function toggleBounce() {
            if (marker.getAnimation() !== null) {
              marker.setAnimation(null);
            } else {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
    // Push the marker to our array of markers.
      markers.push(marker);

  }
    //the marker which is selected open its pop up window
    this.selecItem = function(marker) {
     populateInfoWindow(marker, largeInfowindow);
      };

    //this.markers = ko.observableArray(markers);
    this.query = ko.observable('');
    this.filter = function() {
        let search = this.query();
        if (search.length === 0) {
            for (let i = 0; i < markers.length; i++) {
                markers[i].show(true);
                markers[i].setVisible(true);
            }
        } else {
            for (let i = 0; i < markers.length; i++) {
                if (markers[i].title.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    markers[i].show(true);
                    markers[i].setVisible(true);
                } else {
                    markers[i].show(false);
                    markers[i].setVisible(false);
                }
            }
        }
    };
    function populateInfoWindow(marker, infowindow) {
          // Check to make sure the infowindow is not already opened on this marker.
          if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
            });
            infowindow.setContent('<div>' + marker.title + '</div><div id="foursquare"></div>');
            infowindow.open(map, marker);
          }
        }
}
