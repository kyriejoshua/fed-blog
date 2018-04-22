// TODO 点击展示更多星星
var starwar = document.querySelector('#starwar')
var block = document.body.querySelector('#regular')
var $starwar = $(starwar)
var $block = $(block)
var scene = new THREE.Scene()
var earthRect = starwar.getBoundingClientRect()
var renderer = new THREE.WebGLRenderer()
var camera = new THREE.PerspectiveCamera(75, earthRect.width / earthRect.height, 1, 500)
renderer.setSize(earthRect.width, earthRect.height)

/**
 * [initEarth earth part]
 * @return {Object} [description]
 */
var initEarth = function() {
  // var earthPic = 'https://kyriejoshua.github.io/jo.github.io/about/satelite.jpg'
  var earthPic = './satelite.jpg'
  var textureEarth = new THREE.TextureLoader().load(earthPic || '')
  var sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
  var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xfafaf6, map: textureEarth })
  var earth = window.earth = new THREE.Mesh(sphereGeometry, sphereMaterial)
  earth.position.set(0, -1, -3.2)
  scene.add(earth)
  return window
}

/**
 * [initStars stars]
 * @return {Object} [description]
 */
var initStars = function() {
  var starPic = './star.png'
  var textureStar = new THREE.TextureLoader().load(starPic)
  var starsGeometry = new THREE.Geometry()
  for (var i = 0; i < 200; i++) {
    var star = new THREE.Vector3()
    star.x = THREE.Math.randFloatSpread(50)
    star.y = THREE.Math.randFloatSpread(50)
    star.z = THREE.Math.randFloatSpread(50)
    starsGeometry.vertices.push(star)
  }
  var starsMaterial = new THREE.PointsMaterial({
    color: 0xcfee90, map: textureStar, size: 1,
    transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthTest: false
  })
  var starField = new THREE.Points(starsGeometry, starsMaterial)
  scene.add(starField)
  return window
}

/**
 * [initLight light part]
 * @return {Object} [description]
 */
var initLight = function() {
  var light = new THREE.PointLight(0xfafaf6, 1.5, 100)
  light.position.set(-2, 3, 10)
  scene.add(light)
  return window
}

initEarth().initStars().initLight()

// text part
var textMaterial = new THREE.MeshLambertMaterial({ color: 0xffff9d })
var fontLoader = new THREE.FontLoader()
var textGroup = new THREE.Group()
var tipsGroup = new THREE.Group()
var texts = ['Mac deep user', 'ES6 && Typescript', 'React && Redux', 'Git', 'Nodejs', 'Webpack && Gulp', 'WebGL']
var tips = ['ok, fine!', 'show me more!']
texts = texts.reverse()
tips = tips.reverse()
var textsMesh = {}
var tipsMesh = {}
// 放在本地有毒，解析会出现问题
// fontLoader.load('./helvetiker_regular.typeface.json', function(font) {
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
  var textParams = {
    font: font,
    size: 1,
    height: 0.12,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 10,
    bevelSize: 8,
    bevelSegments: 5
  }
  texts.map(function(text, index) {
    var textGeometry = new THREE.TextGeometry(text, textParams)
    textsMesh[index] = new THREE.Mesh(textGeometry, textMaterial)
    textsMesh[index].name = text
    textsMesh[index].position.set(-5, -10.2 + index * (1 + 0.2), 3.2)
    textGroup.add(textsMesh[index])
  })
  var tipsParams = Object.assign({}, textParams, { size: 0.32, height: 0, bevelThickness: 1, bevelSize: 0.8 })
  var tipMaterial = new THREE.MeshBasicMaterial({ color: 0xffff9d })
  tips.map(function(tip, index) {
    var textGeometry = new THREE.TextGeometry(tip, tipsParams)
    tipsMesh[index] = new THREE.Mesh(textGeometry, tipMaterial)
    tipsMesh[index].name = tip
    tipsMesh[index].position.set(8.4, -7.2 + index * (0.12 + 0.32), 0)
    tipsGroup.add(tipsMesh[index])
  })
  tipsGroup.visible = false
  tipsGroup.name = 'tips'
})
textGroup.rotation.x -= Math.PI * 0.08
scene.add(textGroup)
scene.add(tipsGroup)

// TODO: 因为鼠标事件点击文字获取不到对象，暂时采用该方式来解决。
// var cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff9d })
// var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// cube.position.set(10, -7.2, -1)
// cube.name = 'tips'
// scene.add(cube)

starwar.appendChild(renderer.domElement)
camera.position.set(0, 0, 10)
camera.lookAt(scene.position)

// threejs events
var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()
var onMouseDown = function (event) {
  event.stopPropagation()
  event.preventDefault()

  mouse.x = (event.clientX - $starwar.offset().left - $starwar.width() / 2) / ($starwar.width() / 2)
  mouse.y = (event.clientY - $starwar.offset().top - $starwar.height() / 2) / ($starwar.height() / 2)
  raycaster.setFromCamera(mouse, camera)
  $block.slideDown()
  var intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects.length > 0) {
    if (intersects[0].object instanceof THREE.Mesh && intersects[0].object.name === 'tips') {
      // block.style.display = 'block'
      $block.slideDown()
    }
  }
}
starwar.addEventListener('mousedown', onMouseDown)
var threeAnimation = function() {
  window.requestAnimationFrame(threeAnimation)
  renderer.render(scene, camera)
  earth.rotation.y += 0.003
  earth.rotation.z += 0.0001
  var pos = textGroup.position
  if (pos.y > 0.56 && !tipsGroup.visible) {
    tipsGroup.visible = true
  }
  textGroup.position.set(pos.x, pos.y + 0.003, pos.z - 0.002)
}
threeAnimation()

// events
block.addEventListener('click', function() {
  starwar.style.display = 'block'
})
