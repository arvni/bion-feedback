<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta charset="UTF-8">
    <title>We are listening</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">
    <link rel="stylesheet" type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/solid.min.css">
</head>
<body id="body">
<img src="/images/logo.png" id="header-logo" alt="">
<div class="inputs">
    <div>
        <label for="name"> <span>Full Name</span>(optional)</label>
        <input id="name" type="text"/>
    </div>
    <div>
        <label for="phoneNumber"><span>Phone No.</span>(optional)</label>
        <input id="phoneNumber" type="text"/>
    </div>
</div>
<div id="timer">
    <span id="minute">00</span>:<span id="second">00</span>
</div>
<p id="text">Record Your message and sent to us with just press the button</p>
<div id="record"></div>
<div id="controls">
    <button id="recordButton">
        <i class="fa-sharp fa-solid fa-microphone"></i>
    </button>
    <button id="stopButton" disabled style="display: none">
        <i class="fa-sharp fa-solid fa-stop"></i>
    </button>
    <div id="container"></div>
</div>
<div style="display: flex">
    <button style="display: none;border-radius:50%; " disabled id="reRecordButton">
        <i class="fa-sharp fa-solid fa-rotate-right"></i>
    </button>
    <button id="submit" style="display: none; ">Send</button>
</div>
<!-- inserting these scripts at the end to be able to use all the elements in the DOM -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="/js/recorder.js"></script>
<script src="/js/app.js"></script>
<script src="/js/progressbar.min.js"></script>
<script>
    var container = document.getElementById("container");
    container.style.display = "none";
    var bar = new ProgressBar.Circle(container, {
        color: '#aaa',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 10,
        trailWidth: 1,
        easing: 'linear',
        duration: 62000,
        text: {
            autoStyleContainer: false
        },
        from: {color: '#0667ae', width: 5},
        to: {color: '#0667ae', width: 5},
        // Set default step function for all animate calls
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 60);

        }
    });
</script>
<script src="/js/defer.js" defer></script>
</body>
</html>
