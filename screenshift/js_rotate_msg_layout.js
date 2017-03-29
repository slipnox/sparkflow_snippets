var $document = $(document), //catch document
    rotationTimeOut;

// AdChoices Icon
$.ajax({
    url: "/sparkflow/formats/latest/adchoices.min.js",
    dataType: "script",
    cache: true,
    success: function () {
        AdChoices.init({
            corner: "br",
            //icon: true,
            url: "http://www.undertone.com/opt-out-tool?utm_source=AdChoiceIcon&utm_medium=IAAdChoicesIcon&utm_campaign=Privacy"
        });
    }
});

//preload scripts
$(function () {
    if (isIEorEdge()) {
        ad.preload([
            '//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/device.js/0.2.7/device.min.js'
        ]);
    } else {
        $.getScript('//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js');
        $.getScript('//cdnjs.cloudflare.com/ajax/libs/device.js/0.2.7/device.min.js')
    }
});

function addRotateMsg() {
    var widthFixer        = $('#widthFixer'),
        rotateContainer   = $('<div></div>', { id:    'msg_landscape' }),
        closeRotateMsg    = $('<div></div>', { class: 'rotate_close_btn' }),
        messageContainer  = $('<div></div>', { class: 'msg_container' }),
        spiningDevice     = $('<div></div>', { class: 'spinner'}),
        box               = $('<div></div>', { class: 'box'}).appendTo(spiningDevice),
        dot               = $('<div></div>', { class: 'dot'}).appendTo(spiningDevice),
        rMessageTxt       = $('<p>', { id:            'rotate_txt', text: 'Please rotate your device.' }), // change text if is needed
        campaignOwnerLogo = $('<img />', { id: 'rotate_logo', src: 'rotate_logo.png' }); // change src if is needed

    //add interaction listener to the close btn
    closeRotateMsg.on('click', function (e) {
        mraid.close();
    });

    //append message content
    messageContainer.append([campaignOwnerLogo, rMessageTxt, spiningDevice]);
    rotateContainer.append([messageContainer, closeRotateMsg]).appendTo(widthFixer);
}

function setRotateMsg(e) {
    var isPortrait = device.mobile() && $(window).width() < 480,
        isResizedVisible = $('.banner.smartphone').is(':hidden') && $('.resized.smartphone').is(':visible'),
        rotateMsg = $('#msg_landscape');

    !isPortrait && isResizedVisible ? rotateMsg.addClass('active') : adResizeAction();

    function adResizeAction() {
        // wait to hide the rotate cover on user close action or hide inmediately on device rotation interacion
        if (mraid.getState() === 'default') {
            rotationTimeOut = setTimeout(function () {
                rotateMsg.removeClass('active');
            }, 50);
        } else if (isPortrait) {
            rotateMsg.removeClass('active');
        }
    }
}

function ssInit() {
    //ss animation here
}

$document
    .on('adInteraction', function () { // If an interaction is detected clear the auto close
        mraid.cancelAutoClose();
    }).on('adReady adClick', function () { // Wait for the adReady or adClick event to initialize
        mraid.setAutoClose(15 * 1000);
    }).on('adReady', function () {
        addRotateMsg(); //insert rotate message
        $.getScript('//cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js', ssInit);
    }).on('adResize', function (e) {
        clearTimeout(rotationTimeOut);
        setRotateMsg(); //set rotate message on resizing
    });