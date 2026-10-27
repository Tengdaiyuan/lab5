/**
 * Lab 5 - Exercise 2: HTML5 Geolocation
 * ------------------------------------
 * getGeolocation() checks for API support, then asks
 * navigator.geolocation.getCurrentPosition() for the device position and
 * hands the result to showGeolocation(). showError() covers the cases where
 * the user blocks the request or no fix can be obtained.
 */
var x = document.getElementById('geolocation');

function getGeolocation() {
  if (navigator.geolocation) {
    x.innerHTML = 'Locating&hellip;';
    navigator.geolocation.getCurrentPosition(showGeolocation, showError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.';
  }
}

function showGeolocation(position) {
  x.innerHTML = 'Latitude: ' + position.coords.latitude +
    '<br>Longitude: ' + position.coords.longitude;
}

function showError(error) {
  var messages = {
    1: 'Permission denied &mdash; allow location access and try again.',
    2: 'Position unavailable &mdash; the device could not determine a location.',
    3: 'Timed out while waiting for a position. Please try again.'
  };
  x.innerHTML = messages[error.code] || ('Unable to retrieve the position: ' + error.message);
}
