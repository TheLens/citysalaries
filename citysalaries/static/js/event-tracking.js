/* global ga */
var payPlanLink = document.getElementById('pay-plan');
var learnMoreLink = document.getElementById('learn-more');
var bannerTwitterIcon = document.getElementById('banner-social-twitter');
var bannerFacebookIcon = document.getElementById('banner-social-facebook');
var bannerSupport = document.getElementById('banner-support');

// Pay plan
addListener(payPlanLink, 'click', function () {
  ga('send', 'event', 'link', 'click', 'Pay plan');
});
addListener(payPlanLink, 'mouseover', function () {
  ga('send', 'event', 'link', 'hover', 'Pay plan');
});

// Learn more
addListener(learnMoreLink, 'click', function () {
  ga('send', 'event', 'link', 'click', 'Learn more');
});


// Twitter icon
addListener(bannerTwitterIcon, 'click', function () {
  ga('send', 'event', 'link', 'click', 'Twitter icon');
});

// Facebook icon
addListener(bannerFacebookIcon, 'click', function () {
  ga('send', 'event', 'link', 'click', 'Facebook icon');
});

// Support The Lens
addListener(bannerSupport, 'click', function () {
  ga('send', 'event', 'link', 'click', 'Support The Lens');
});

/**
 * Utility to wrap the different behaviors between W3C-compliant browsers
 * and IE when adding event handlers.
 *
 * @param {Object} element Object on which to attach the event listener.
 * @param {string} type A string representing the event type to listen for
 *     (e.g. load, click, etc.).
 * @param {function()} callback The function that receives the notification.
 */
function addListener(element, type, callback) {
  if (element.addEventListener) {
    element.addEventListener(type, callback);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, callback);
  }
}
