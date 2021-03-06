//global variables
var $ssDocument = $(document),
    isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent), //check for internet explorer or edge
    resizeTimeOut;

//preload assets
$(function() {
    var preloadAssets = [ //add any assets to be preloaded to this array
        '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/device.js/0.2.7/device.min.js',
        "/sparkflow/formats/latest/adchoices.min.js",
        "/sparkflow/formats/latest/utmark.min.js",
        "rotate_logo.png",
        "closeBtn.png",
    ];

    if (!isIE) { //for some reason external js assets must be loaded with jQuery if is not IE in order to works
        $.getScript('//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js');
        $.getScript('//cdnjs.cloudflare.com/ajax/libs/device.js/0.2.7/device.min.js');
    }

    ad.preload(preloadAssets);
});

function insertAdBranding() {
    AdChoices.init({ //AdChoices
        corner: "br", // corner property which where the icon will be anchored: tr, tl, br or bl
        url: "http://www.undertone.com/opt-out-tool?utm_source=AdChoiceIcon&utm_medium=IAAdChoicesIcon&utm_campaign=Privacy"
    });

    UndertoneMark.init({ //Undertone
        corner: "bl", // corner property which where the icon will be anchored: tr, tl, br or bl
        color: 'black',
        opacity: 0.5,
    });
}

function insertRotateMsg() {
    var rotateContainer = $('<div></div>', { class: 'msg_landscape' }),
        closeRotateMsg = $('<div></div>', { class: 'rotate_close_btn' }),
        messageContainer = $('<div></div>', { class: 'msg_container' }),
        spiningDevice = $('<div></div>', { class: 'spinner' }),
        box = $('<div></div>', { class: 'box' }).appendTo(spiningDevice),
        dot = $('<div></div>', { class: 'dot' }).appendTo(spiningDevice),
        rMessageTxt = $('<p>', { class: 'rotate_txt', text: 'Please rotate your device.' }), // change text if is needed
        campaignOwnerLogo = $('<img />', { class: 'rotate_logo', src: 'rotate_logo.png' }); // change src if is needed

    //append message content
    messageContainer.append(campaignOwnerLogo, rMessageTxt, spiningDevice);
    rotateContainer.append(messageContainer, closeRotateMsg).appendTo($ssDocument.find('body'));

    //add interaction listener to the close btn
    closeRotateMsg.on('click', function(e) {
        mraid.close();
    });
}

function setRotateMsg(e, onExpandCb, onCloseCb) {
    var resized = $ssDocument.find('.resized'),
        banner = $ssDocument.find('.banner'),
        rotateMsg = $ssDocument.find('.msg_landscape'),
        isExpanded = resized.is(':visible') && banner.is(':hidden'),
        isMobilePortrait = device.mobile() && $(window).width() < 480,
        isMobileResized = $ssDocument.find('.resized.smartphone').is(':visible');

    !isMobilePortrait && isMobileResized ? rotateMsg.addClass('active') : adResizeAction();

    // wait to hide the rotate cover on user close action or hide inmediately on device rotation interacion
    function adResizeAction() {
        if (isMobilePortrait) {
            rotateMsg.removeClass('active');
        } else {
            resizeTimeOut = setTimeout(function() {
                rotateMsg.removeClass('active');
            }, 40);
        }
    }

    clearTimeout($.data(this, 'resizeTimer'));
    $.data(this, 'resizeTimer', setTimeout(function() {
        onExpandCb || onCloseCb ? isExpanded ? onExpandCb() : onCloseCb() : false;
    }, 200));
}

function ssInit() {
    //ss animation here
}

$ssDocument
    .on('adInteraction', function() { // If an interaction is detected clear the auto close
        mraid.cancelAutoClose();
    }).on('adReady adClick', function() { // Wait for the adReady or adClick event to initialize
        mraid.setAutoClose(15 * 1000);
    }).on('adReady', function() {
        insertAdBranding();
        insertRotateMsg();
        ssInit(); //start screenshit
    }).on('adResize', function(e) {
        clearTimeout(resizeTimeOut); //
        setRotateMsg(e, function() { //set rotate message on resizing
            // console.log('expanded');
        }, function() {
            // console.log('closed');
        });
    });