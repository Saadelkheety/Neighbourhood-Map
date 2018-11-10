// this is the data to handle the project //////
let locations = [{
        title: 'Electra Center',
        location: {
            lat: 31.209072,
            lng: 29.924966
        }
    },
    {
        title: 'Sidi Gaber Station',
        location: {
            lat: 31.218918,
            lng: 29.942362
        }
    },
    {
        title: 'Alexandria Library',
        location: {
            lat: 31.208990,
            lng: 29.909199
        }
    },
    {
        title: 'Faculty of engineering Alexendria university',
        location: {
            lat: 31.20741,
            lng: 29.924116
        }
    },
    {
        title: 'M3ML cooworking space',
        location: {
            lat: 31.246797,
            lng: 29.972079
        }
    },
    {
        title: 'Knight Academy',
        location: {
            lat: 31.210663,
            lng: 29.921678
        }
    },
    {
        title: 'Desertwood Pavillion',
        location: {
            lat: 31.208900,
            lng: 29.921732
        }
},
    {
        title: 'Track Training center',
        location: {
            lat: 31.207171,
            lng:  29.926630
        }
    },
    {
        title: 'ROBOTA',
        location: {
            lat: 31.207779,
            lng: 29.927067
        }
    },
    {
        title: 'Emad Eldin Center',
        location: {
            lat: 31.208805,
            lng: 29.925987
        }
    },
    {
        title: 'Alexandria Training Center',
        location: {
            lat: 31.231012,
            lng:  29.961144
        }
    }
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
    // to maintain the bound of the map
    bounds = new google.maps.LatLngBounds();
    // to maintain the bound upon window resize
    window.onresize = function() {
        map.fitBounds(bounds);
    };
    // create info window
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
            show: ko.observable(true), // this is just for the list updating
            id: i
        });

        // the map bounding according to markers
        bounds.extend(marker.position);
        // wken click, bounce
        marker.addListener('click', toggleBounce);
        function toggleBounce() {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 500)
            }
        }

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        // Push the marker to our array of markers.
        markers.push(marker);
    }
    //when an item is selected from a list
    this.selecItem = function(marker) {
        populateInfoWindow(marker, largeInfowindow);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 500)
    };

    // query which is related to the search input
    this.query = ko.observable('');
    // the function to call foe search input
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

    // setup the infowindow
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            // set the max width
            infowindow.setOptions({
                maxWidth: 250
            });

            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
            // add foursquare api for nearby places.
            const request = new XMLHttpRequest();

            let apiUrl = ` https://api.foursquare.com/v2/venues/explore?client_id=URUBLCSWPB2WHXHOWJYZIZ3P0MKR3FUUYHX3V4PYPDZ2TSZH&client_secret=1JOHIYIIW1DYQSCIF35FTBOFVNTL1TO3AZZLBTOPZ1C5UBQY&v=20180323&limit=5&ll=${marker.position["lat"]()},${marker.position["lng"]()}&time=any&day=any&openNow=0&sortByDistance=1&radius=200`

            request.open('GET', apiUrl, true);

            request.addEventListener("error", transferFailed);

            request.send();

            // Callback function for when request has an error
            function transferFailed() {
                infowindow.setContent(`<h6> ${marker.title}</h6>
                    <div id="foursquare"> the foursqure api connections has a proplem, could you check your connection? </div>`);
            }

            // time out
            request.ontimeout = function(e) {
                console.error("Timeout!!")
            }

            // Callback function for when request completes
            request.onload = () => {
                // Extract JSON data from request
                const data = JSON.parse(request.response);
                if (data.meta.code == 200) {
                    let nearbyPlaces = data.response.groups[0].items;
                    let places = [];
                    for (let i = 0; i < nearbyPlaces.length; i++) {
                        let place = {
                            category: nearbyPlaces[i].venue.categories[0].name,
                            name: nearbyPlaces[i].venue.name,
                            distance: nearbyPlaces[i].venue.location.distance
                        };
                        places.push(place);
                    } // end for
                    let content = '';
                    for (let i = 0; i < places.length; i++) {
                        content += `
                            <h6>${places[i].name}</h6>
                            <ul>
                                <li>Category: ${places[i].category}</li>
                                <li>Distance: ${places[i].distance} Meters</li>
                            </ul>
                        `
                    } // end for
                    infowindow.setContent(
                        `<div id="infowindow">
                        <h5> ${marker.title}</h5>
                        <img src="https://maps.googleapis.com/maps/api/streetview?size=200x100&location=${marker.position["lat"]()},${marker.position["lng"]()}&fov=90&heading=235&pitch=10&key=AIzaSyC8oKS2QngD-5FlY_uc9gIz-Lb0wggu_6Y&radius=200" alt="">
                        <h6>nearby Places</h6>
                        <div id="foursquare" data-bind="foreach: places">
                        ${content}
                        <div class="infowindow-footer">
                        <sytong>this data was collected using foursquare API</strong>
                        </div>
                     </div>
                     </div>`);
                     bounds.extend(marker.position);
                } // end if
                else {
                    infowindow.setContent(`<h6> ${marker.title}</h6><div id="foursquare"> the foursqure api connections has a proplem </div>`);
                }
            }

            infowindow.open(map, marker);
        }
    }
}
function mapError() {
  alert("Oops! Something went wrong. Please try again after sometime, or contact us");
}
