---
title: 初识 Threejs(下) —— 实现一个太阳系模型
date: 2017-12-19 20:56:12
tags: WebGl
categories: threejs
---

<hr/>

![](/jo.github.io/2017/12/19/how-to-create-a-solar-system-using-by-threejs/unphoto.png)

在上一篇文章中，我整理了 Threejs 中的一些基本概念。现在这一篇，就使用上次所整理的内容加上一些不复杂的算法，来实现一个运转着的太阳系模型。这里的所有行星大小及公转时间，尽量贴合实际。

<!-- more -->

## 索引

- [实现思路](#实现思路)
- [场景初始化](#场景初始化)
- [创建行星](#创建行星)
- [创建轨道](#创建轨道)
- [创建文本](#创建文本)
- [行星添加公转效果](#行星添加公转效果)
- [行星添加光照效果](#行星添加光照效果)
- [ 鼠标交互事件](#场景添加鼠标事件)

### 实现思路

* 这篇文章于早前发出，收到了前辈的指教。反思后发现确实后面的内容比较流水账，欠缺一个思路的总结和梳理，而只是一味实现。这里我先将整体的实现方案梳理出来，接着我们再分解并一步步去实现它。

* 我将其主要分为两个部分，静态的实现，以及动态的鼠标交互。

#### 静态实现

* 太阳系模型的核心是八大行星围绕着太阳做**公转运动**。涉及到两点，一是运动，二是公转。运动使用动画即可完成。至于公转，实际上行星的运转是做椭圆周运动，我们在这里将其简化为圆周运动，那么核心就是计算圆周运动的坐标点。
* 那么实现这个静态的太阳系模型就有一定的思路了，首先我们用球体初始化行星，按照距离远近摆放在场景中。然后添加环状图形来当做轨道，辅助观察。接着文本采用外部引入的方式，加载后位置基本与行星相同，减去一定大小将其放在正上方。最后，将行星按照计算出的坐标信息，每一帧去设置位置。最终的效果就是动态的公转效果。
* 这里有几点值得注意：
  * 字体在 Threejs 中需要另外加载，格外引入。
  * 行星的初始化位置可以用随机的方式来分布，使其更真实。当然，有精力的话可以参考实际去计算坐标，摆放接近真实的位置。
  * 后来在行星中添加了月亮，涉及的计算就是把以太阳左标为原点改为了以地球坐标为原点，其他计算方式则相同。
  * 为行星添加光照效果，就是在太阳的位置上放一个点光源，然后在周围的地方摆放一个环境光光源优化视觉效果。
  * 采用图片纹理的方式优化行星的视觉效果。

#### 动态交互

* 场景基本完成后。我会添加一个鼠标交互，即鼠标移到行星位置上时，显示行星的名字。
* 这里主要的复杂点在于坐标系的转化。3d 的坐标系和浏览器平时的坐标系原点及坐标位置不一。这点在下文我详细说明。

### 场景初始化

* 首先，创建一个场景用来渲染这一切。

```javascript
  let scene = new THREE.Scene()
  let renderer = new THREE.WebGLRender()
  let camera = new THREE.Perpestive(40, this.el.clientHeight / this.el.clientWidth, 1, 500)
  renderer.setSize(this.el.clientHeight, this.el.clientWidth)
  this.el.appendChild(renderer.domElement)
  renderer.render(scene, camera)
```

### 创建行星

* 初始化各大星球，即创建球体。在参考了真实大小和距离后，我们尽量按接近真实的比例来创建。
* 首先我们创建一个对象数组来保存各星球的相关数据。包括名字，大小，位置，颜色等等属性。

```javascript
  const planets = [{
    name: 'Sun',
    size: [5, 16, 16],
    dis: 0,
    pos: [0, 10, 0],
    color: 0xFFFFFF,
  }, {
    name: 'Mercury',
    size: [0.4, 10, 10],
    dis: 4,
    pos: [0, 10, 9],
    color: 0xFFFFFF,
    rev: 0.3,
  }, {
    name: 'Venus',
    size: [0.85, 10, 10],
    dis: 7.5,
    pos: [0, 10, 12.75],
    color: 0xFFFFFF,
    rev: 0.6,
  }, {
    name: 'Earth',
    size: [1, 10, 10],
    dis: 10,
    pos: [0, 10, 15],
    color: 0xFFFFFF,
    rev: 1,
  }, {
    name: 'Moon',
    size: [0.4, 10, 10],
    dis: 1,
    pos: [0, 10, 17],
    color: 0xC0C0C0,
    rev: 0.2,
  }, {
    name: 'Mars',
    size: [0.6, 10, 10],
    dis: 15,
    pos: [0, 10, 20],
    color: 0xFFFFFF,
    rev: 1.8,
  }, {
    name: 'Jupiter',
    size: [4, 32, 32],
    dis:  20,
    pos: [0, 10, 25],
    color: 0xFFFFFF,
    rev: 5
  }, {
    name: 'Saturn',
    size: [3, 32, 32],
    dis:  25,
    pos: [0, 10, 30],
    color: 0xFFFFFF,
    rev: 10
  }, {
    name: 'Uranus',
    size: [2, 32, 32],
    dis:  30,
    pos: [0, 10, 36],
    color: 0xFFFFFF,
    rev: 15
  }, {
    name: 'Neptune',
    size: [1.8, 32, 32],
    dis:  35,
    pos: [0, 10, 45],
    color: 0xFFFFFF,
    rev: 0.5
  }]
```

* 根据这些属性，我们再用形状和材质来创建球体。

```javascript
  function initPlanet(size, color) {
    const sphereGeometry = new THREE.SphereGeometry(...size)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color })
    return new THREE.Mesh(sphereGeometry, sphereMaterial)
  }
```

* 这里我采用遍历数组的数据的方式来依次创建球体。并用一个 THREE.Group 对象来统一保存。
* 在初始化的数据里，我们可以拿到位置等信息，在这里给球体也加上相应的位置。

```javascript
  function initPlanets() {
    let planetsGroup = new THREE.Group()
    planets.map((planetObj) => {
      const planet = initPlanet(planetObj.size, planetObj.color)
      planet.name = planetObj.name
      planetsGroup.add(planet)
    })
    return planetsGroup
  }
  
  const planetsGroup = this.initPlanets()
  scene.add(planetsGroup)
  
```

* 场景中添加球体物体后，理论上应该能看到九个球体了。但是，这里只能见到一个球体。因为像机的默认视角是正对着球，而此时的球的位置正好连成一条线。我们来调整一下，让相机从高处俯视。

```javascript
  camera.position.set(0, 10, 20)
  camera.lookAt(scene.position)
```

### 创建轨道

* 为了更清晰得看清行星运转，我们添加一些轨道线来辅助。
* 所用的是 `RingGeometry` 几何形状。创建的方式类似行星。
* 但是需要注意的是，创建的环默认是垂直于水平面的，我们需要将它做一个旋转，转到水平面上来。

```javascript
  function initTrack(size, color) {
    const ringGeometry = new THREE.RingGeometry()
    const ringMaterial = new THREE.MeshBasicMaterial({ color })
    return new THREE.Mesh(ringGeometry, ringMaterial) // todo
  }
  
  // 统一创建 
  function initTracks(){
    let tracksGroup = new THREE.Group()
    planets.map((planet) => {
      const outer = planet.pos[2]
      const inner = outer - 0.05
      const size = [outer, inner, 100]
      const track = this.initTrack(size, 0xffffff)
      track.rotation.x = Math.PI * 0.5
      track.position.set(0, 10, 0)
      tracksGroup.add(track)
    })
    return tracksGroup
  }
  
  const tracksGroup = this.initTracks()
  scene.add(tracksGroup)
```

* 这样就可以在场景中看到行星在轨道上了。

### 创建文本

* 我们使用文本来标识行星的名字，位置在行星正上方。
* THREE 创建文本需要先加载字体。通常使用字体是先通过官方的方法加载 json 文件。

```javascript
  const textLoader = new THREE.FontLoader()
  textLoader.load('./assets/fonts/helvetiker_regular.typeface.json', (font) => {
    // do sth
  })
```

* 在自己的案例中，parcel 打包后似乎没有静态文件目录，于是这里了解了下 THREE.Font 部分代码后，发现只需要重新构造一个就可以。

```javascript
  import Font from './assets/fonts/helvetiker_regular.typeface.json'
  const font = new THREE.Font(Font)
  // 封装一下
  function loadFont() {
    return new THREE.Font(Font)
  }
  // 除去字体包以外，字体还有一些必要的样式
  function initFont() {
    return Object.assign({
      size: 0.5,
      height: 0,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 0.8
    }, { font: loadFont() })
  }
```

* 最终创建文本的方式和其他物体相似，也是形状和纹理。

```javascript
  function initText(content) {
    const textGeometry = new THREE.TextGeometry(content, initFont())
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    return new THREE.Mesh(textGeometry, textMaterial)
  }
```

* 最后，只要让文本使用对应行星的位置，再做一些小小的位移即可。

### 行星添加公转效果

* 在场景里添加以上图形后，我们能看到部分物体了，虽然可能位置有部分重叠。现在我们来给每个行星添加动态效果，让所有行星运转。
* 公转的本质是改变行星的坐标位置，每一帧进行一次重定位，那么球体看起来就是运动的。
* 这里的公转，就是围绕太阳做圆周运动，以太阳为中心，距离为半径，圆周上的点就是位置。所以每个行星的位置计算就是半径和弧度的计算。
* 例如距离为 5 的星球，圆周长则为 `2π * r`, 即 `Math.PI * 2 * 5`，计算每***帧***的弧度则为 `2π * r  / 60 / 60 / r` 即 `Math.PI * 2 * 5 / 60 / 60 / 5`.
* 所有行星在同一水平面，所以 y 的坐标固定，具体的位置就是 `Math.sin(Math.PI * 2 / 3600) * r, 5, Math.cos(Math.PI * 2 / 3600) * r`
* 因为每个行星的公转速度不一，所以我们再加一个变量来控制速度，整理后如下

```javascript
  function calcSpeed(rev) {
    return Math.PI * 2 / 3600 / rev
  }
  // 然后来调用动画的函数里执行
  planetsGroup.children.map((planet) => {
    planet.angle += calcSpeed(planet.rev)
    planet.angle = planet.angle > 2 * Math.PI ? planet.angle - 2 * Math.PI : planet.angle
    planet.position.set(Math.sin(planet.angle) * planet.distance, 5, Math.cos(planet.angle) * planet.distance)
  })
```

* 文字的移动效果同行星，只是位置要在行星的上方，并且水平方向上减去文本大小的一半。

```javascript
  const r = text && text.geometry && text.geometry.boundingSphere.radius || 0
  text.position.set(Math.sin(planet.angle) * planet.distance - r, 5 + 1, Math.cos(planet.angle) * planet.distance)
```

### 行星添加光照效果

* 为了使行星看起来更加真实，我们使用另一种材质来创建行星。并给太阳一个光照效果。

```javascript
  // 受光照影响的材质
  const planetMaterial = new THREE.MeshLambertMaterial({ color: 0x123321 })
  // 添加一个白色，光照强度为 1，光照距离为 100 的点光源，位置在太阳中心
  const pointLight = new THREE.PointLight(0xffffff, 1, 100)
  // 再添加一点环境光，使我们可以更清楚的观察所有行星
  const ambient = new THREE.AmbientLight(0xffffff, 0.7)
  pointLight.position.set(Sun.position)
  scene.add(pointLight)
  scene.add(ambientLight)
```

* 至此，一个有点像模像样的太阳系微缩模型完成了。
* 接下来我们为这个模型加点动态交互效果。

### 场景添加鼠标事件

* 我们在这里做一个较为简易的交互，即鼠标移到相应的行星上就显示该行星的名字。
* 3d 空间中，鼠标的交互事件的本质是获取鼠标点的坐标，然后转化为 3d  坐标系里的坐标，然后判断位置是否在物体内，然后做一些处理。
* 这部分的重点就在于将鼠标坐标转化为 3d 坐标系里的坐标。即**坐标换算**。
* 首先我们要创建一个鼠标对象，然后获取鼠标的坐标。

```javascript
  let mouse = new THREE.Vector2()
  function onDomMouseMove(event) {
    console.info(event.clientX, event.clientY)
  }
  this.el.addEventListener('mousemove', onDomMouseMove)
```

* 3d 坐标系的不同在于他是以场景中心作为原点的。而鼠标坐标是以左上角为原点的。转换后要将坐标赋值给鼠标对象。所以这里的坐标换算计算公式为：

```javascript
  function onDomMouseMove(event) {
    mouse.x = (this.el.clientX - (this.el.getBoundingClientRect().width / 2)) / (this.el.getBoundingClientRect().width / 2)
  }
  mouse.y = - (this.el.clientY - this.el.getBoundingClientRect().height / 2)) / (this.el.getBoundingClientRect().height / 2)
  
  // 优化后
  function onDomMouseMove(event) {
    const rect = this.el.getBoundingClientRect()
    const { width, height } = rect
    mouse.x = (2 * this.el.clientX - width) / width
    mouse.y = - (2 * this.el.clientY - height) / height
  }
```

* 获取场景中的鼠标位置后。接下去就是判断位置是否在物体上。这里的逻辑是，由相机发往一个射线到鼠标位置处，期间相交的第一个物体就是鼠标点中的物体。即 raycatser 对象中。

```javascript
  let raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  // 获取相交的所有物体
  const intersects = raycaster.instersectObjects(scene.children, true)
  if (intersects.length > 0 && intersects[0].object && intersects[0].object instanceof THREE.Mesh) {
    // do sth
  }
```

* 现在我们已经能获取到鼠标位置所在的物体了。剩下是完成这个交互，先将文字默认隐藏，然后在鼠标滑过的时候再显示出来。
* 首先将文本存在同一个组里，便于查找。然后在鼠标滑过行星时，使用行星名字来找出对应的文本，然后显示。

```javascript
  function initTexts() {
    let textGroup = new THREE.Group()
    planets.map((planet) => {
      let text = initText(planet.name)
      text.visible = false
      textGroup.add(text)
    })
    return textGroup
  }
  
  // 显示文本逻辑
  if (intersects.length > 0 && intersects[0].object && intersects[0].object instanceof THREE.Mesh && intersects[0].object.name) {
    const name = intersects[0].object.name
    scene.children.map((obj) => {
      if (obj.name !== 'texts') { return }
      obj.children.map((text) => {
        text.visible = text.name === name
      })
    })
  }
  
```

* 到这儿一个差不多的太阳系模型就完成啦。
* 后续还可以给各行星的初始位置添加随机位置，给行星添加纹理效果，给土星加上土星环，给地球加上月亮，再加上些星星背景，那就挺好看了。
* 具体的代码在这里**[threejs-learning](https://github.com/kyriejoshua/threejs-learning)**

### 最终效果

* gif 显示的较为简陋。当然，更清楚的效果还是直接跑项目吧~

{% asset_img solar-system.gif solar system %}

<hr>
{% asset_img reward.jpeg Thanks %}
