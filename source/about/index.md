##	About Me

<blockquote>
	**平淡无奇的前端攻城狮。**
	偏爱美好的设计，注重用户体验。
	遵循简洁的代码规范，拥有良好的代码习惯。

	#Mac 重度用户
	#ES6 #typescript #coffeescript
	#React
	#Redux
	#Git
	#Nodejs 入坑中
	#Webpack #Gulp #Parcel
	#Scss #Less
	#Jade
	#WebGL 会一点点点
	[更多的在这里](https://github.com/kyriejoshua/my-frontend-stack)

	**0. 对一切事物充满好奇心。**
	**1. 凡事怎么能不折腾。 **
	**2. Geeeeek 一点，再 Geeeeek 一点。**
	**3. 能用键盘搞定的事，绝不动鼠标。**

	欢迎交流 -- kj2046@outlook.com
	github: https://github.com/kyriejoshua

</blockquote>

<div id="myEarth" style="width: 100%;height: 250px" title="我也不知道为什么要放个地球🌎在这里" alt="This is for a lovely girl"></div>
<script src="https://cdn.bootcss.com/three.js/87/three.min.js"></script>
<script>
	var scene = new THREE.Scene()
	var earthDom = document.querySelector('#myEarth')
	var earthRect = earthDom.getBoundingClientRect()
	var renderer = new THREE.WebGLRenderer()
	var camera = new THREE.PerspectiveCamera(75, earthRect.width / earthRect.height, 1, 500)
	renderer.setSize(earthRect.width, earthRect.height)
	var earthPic = 'https://github.com/kyriejoshua/jo.github.io/about/satelite.jpg'
	var texture = new THREE.TextureLoader().load(earthPic || '')
	var sphereGeometry = new THREE.SphereGeometry(4, 32, 32)
	var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00d1ff, map: texture })
	var earth = new THREE.Mesh(sphereGeometry, sphereMaterial)
	scene.add(earth)
	earthDom.appendChild(renderer.domElement)
	camera.position.set(0, 0, 10)
	camera.lookAt(scene.position)
	var threeAnimation = function() {
		window.requestAnimationFrame(threeAnimation)
		renderer.render(scene, camera)
		earth.rotation.x += 0.01
	}
	threeAnimation()
</script>
