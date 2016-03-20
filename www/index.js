document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady () {
  var button = document.querySelector('#take-video-button')
  var canvas = document.querySelector('#canvas')
  var video = document.querySelector('#video')

  button.addEventListener('click', function () {
    navigator.device.capture.captureVideo(function (mediaFiles) {
      playVideo(video, canvas, mediaFiles[0].fullPath)
    }, function (e) {
      console.error(e)
    })
  }, false)
}

function playVideo (video, canvas, videoSrc) {
  var maxWidth = 200
  var pixelRatio = window.devicePixelRatio || 2
  console.log('devicePixelRatio = ' + window.devicePixelRatio)

  video.src = videoSrc
  video.width = maxWidth

  video.addEventListener('playing', function () {
    var vw = video.videoWidth
    var vh = video.videoHeight
    var aspectRatio = vw / vh
    var cw = maxWidth * pixelRatio
    var ch = Math.ceil(cw / aspectRatio)
    canvas.width = cw
    canvas.height = ch
    canvas.style.width = maxWidth + 'px'
    canvas.style.height = Math.ceil(maxWidth / aspectRatio) + 'px'
    var ctx = canvas.getContext('2d')

    function drawFrame () {
      ctx.save()
      // translate to the center of the rectangle
      ctx.translate(cw * 0.5, ch * 0.5)
      // rotate 90 degree to the right
      ctx.rotate(Math.PI * 0.5)
      // translate back
      ctx.translate(-ch * 0.5, -cw * 0.5)
      // draw frame with rotated dimension
      ctx.drawImage(video, 0, 0, ch, Math.ceil(ch / aspectRatio))
      ctx.restore()
      setTimeout(drawFrame)
    }

    drawFrame()
  }, false)

  video.play()
}
