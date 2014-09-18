'use strict';

var landingPageURL, utmSource, utmCampaign, utmMedium;

var valid = false;
var errors = [];

$('.result').hide();
$('#result-placeholder').show();

function getValues () {
    landingPageURL = $('input[name=landingPageURL]').val();
    utmCampaign = $('input[name=utm_campaign]').val();
    utmMedium = $('input:radio[name=utm_medium]:checked').val();
    utmSource = $('input:radio[name=utm_source]:checked').val();
    if (utmSource === 'other') {
        utmSource = $('#sourceOther').val();
    }
}

function checkValues () {
    valid = true;
    errors = [];

    // Landing page
    if (!landingPageURL) {
        valid = false;
        errors.push('Landing page URL is required');
    }

    if ((landingPageURL.match(/\?/g)||[]).length > 1) {
        valid = false;
        errors.push('There is more than one ? in the Landing Page URL, which means something is wrong. After the first ? there should only be &s');
    }

    // Campaign
    if (!utmCampaign) {
        valid = false;
        errors.push('Referral ID / Campaign Name is required');
    }

    var pattern = /^[\w-]+$/g;
    if (!pattern.test(utmCampaign)) {
        valid = false;
        errors.push('Referral ID can only contain letters, numbers, hyphens and underscores');
    }

    // Source
    if (!utmSource) {
        valid = false;
        errors.push('Campaign Source is required (check Other)');
    }

    var pattern2 = /^[\w-\.]+$/g;
    if (!pattern2.test(utmSource)) {
        valid = false;
        errors.push('Source Other can only contain letters, numbers, hyphens, underscores and dots');
    }

}

function showPlaceholder() {
    $('.result').hide();
    $('#result-placeholder').show();
}

function outputTaggedURL () {
    var taggedURL = landingPageURL;
    // check if there are already parameters in the URL
    if (landingPageURL.indexOf('?') === -1) {
        // if not, initiate with a ?
        taggedURL += '?';
    } else {
        // if there are, append to the existing parameters
        taggedURL += '&';
    }

    taggedURL += 'ref=' + utmCampaign;
    taggedURL += '&utm_campaign=' + utmCampaign;
    taggedURL += '&utm_source=' + utmSource;
    taggedURL += '&utm_medium=' + utmMedium;

    $('.result').hide();
    $('#result-success').show();
    $('#result-url').text(taggedURL);
    $('#result-link').attr('href',taggedURL);
}

function outputFeedback () {
    var feedback = '<ul>';
    for (var i = 0; i < errors.length; i++) {
        feedback += '<li>' + errors[i] + '</li>';
    }
    feedback += '</ul>';

    $('.result').hide();
    $('#result-error').show();
    $('#result-error').html(feedback);
}

$('#getTaggedURL').click(function () {
    getValues();
    checkValues();
    if (valid) {
        outputTaggedURL();
    } else {
        outputFeedback();
    }
});

$('input').focus(function () {
    showPlaceholder();
});

$('#sourceOther').focus(function () {
    $('#sourceOtherRadio').prop('checked', true);
});


