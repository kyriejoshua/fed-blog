---
title: 初识 Three.js(上) —— 基础概念一览
date: 2017-11-23 19:45:14
tags: WebGL
categories: JavaScript
---

<hr>

![](/jo.github.io/2017/11/23/the-usage-of-threejs/unphoto.jpg)

近期在项目中有规划 3D 组件的需求。在发现 echarts-gl 不能满足需求后，我在d3等一众第三方库中无所适从。最终我决定挑战一下 Three.js. 当然在一开始，我遇到了很多麻烦，所幸到了临近最后时，我解决了绝大多数的问题。我在未学习 webgl 的情况下直接使用 threejs, 其实并不是个较好的方案，却是能较快出结果的方案。这篇文章记录了我使用 Three.js 的痛苦和收获。

<!-- more -->

## 索引

- [简单介绍](#Three.js 是什么)
- [基础概念](#基础概念)
  - [Scene(场景)](#Scene)
  - [Camera(相机)](#Camera)
  - [Renderer(渲染器)](#Renderer)
  - [Geometry(几何模型)](#Geometry)
  - [Material(材料)](#Material)
  - [Light(光源)](#Light)
  - [Animation(动画)](#Animation)
- [Demo](#Demo)


### Three.js 是什么

* 我在初次见到 Three.js 的时候并不理解它是一种怎样的存在。只知道使用它可以做出各式各样炫酷，无所不能的 3D 效果。当时我的同事提醒了我，他说这是一个类似 jquery 的库，封装了 webgl 的各式各样的 api. 因此更加友好，也更加方便。它让你可以绕过 webgl 基础这部分，直接创建 3D 效果。但你仍然要知道，这是一个捷径，是临时的方式。如果要切实使用好 Three, 还是必须得学好 webgl. 即使里面所有的基础 api 可能不会在 Three 中体现出来，但 webgl 的实现思路，里面的知识点仍然是值得借鉴和学习的。
* [Three.js](https://threejs.org/docs/)

### 基础概念

* 一定有人迫不及待地跃跃欲试了。但是且慢，在我尝试写代码之前，Three 的中文文档的寻找就耗去我不少时间。就目前而言，似乎还未找到官方的中文文档，教程之类的地方。只有部分翻译的文档。我最终只好硬着头皮阅读英文文档。所以若是理解有出入，请大胆指出。

#### [Scene](https://threejs.org/docs/index.html#api/scenes/Scene)

* 就像 `canvas.getContext('2d')`获取上下文 一样，创建 3D 组件也需要一个上下文环境。
* 通常情况下，这个场景不需要做什么配置。
* `const scene = new THREE.scene()`
* [源码](https://github.com/mrdoob/three.js/blob/master/src/scenes/Scene.js)

#### [Camera](https://threejs.org/docs/index.html#api/cameras/Camera)

* Three 为我们提供了多个相机，包括正交相机，透视相机，还有立方体相机等等。
* **正交相机**，则是类似一个长方体，我们透过这个长方体去看事物。此时，看到的事物是平面的，也就是没有立体感。和我们看 2d 的 `canvas` 类似。
  * `const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000)`
* *每个参数分别代表相机视锥体左面，右面，上面，下面，前面，后面。*
* **透视相机**，遵循近大远小的原则。和人肉眼所见相似。我们用以下方法来创建一个视角为 75°，占满屏幕大小，并且从离相机 1 个单位处开始渲染，到 500 的地方停止。
  * `const camera = new THREE.PerpestiveCamera(75, window.innerHeight/window.innerWidth, 1, 500)`
* 四个参数的含义分别为*相机视锥体垂直视角*，*相机视锥体宽高比*，*相机视锥体近裁剪面*，*相机视锥体远裁剪面*。
* [源码](https://github.com/mrdoob/three.js/blob/master/src/cameras/Camera.js)

#### [Renderer](https://threejs.org/docs/index.html#api/constants/Renderer)

* `WebGLRenderer` 渲染器使用 WebGL 来绘制场景。这个渲染器比 `CanvasRenderer`有着更好的性能。
* `const renderer = new THREE.WebGLRenderer()` 使用 `webgl` 来渲染。
* [WebGLRenderer](https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js)

#### [Geometry](https://threejs.org/docs/index.html#api/core/Geometry)

* 形状是构成物体的基本元素。它决定物体的形式。每个几何模型都基于基础类[Geometry](https://github.com/mrdoob/three.js/blob/master/src/core/Geometry.js).
* 基于此，拓展出了球，立方体等几何模型。例如使用`const sphereGeometry = new THREE.SphereGeometry(6, 6, 1)` 来创建一个球体形状或使用`const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)`立方体形状。
* [Geometry](https://github.com/mrdoob/three.js/blob/master/src/geometries/Geometries.js)

#### [Material](https://threejs.org/docs/index.html#api/materials/Material)

* 材料用来描述物体的外观和构成部分。用于决定一个物体以何种形式来渲染。例如球体的颜色，表面光滑度。
* `Material`是材料的基础类。其他材料都基于此类。
* 使用`const sphereMaterial = new THREE.MeshBasicMaterial({color: '0x000000'})` 来渲染黑色的表面。
* 当两项都满足的时候，就可以来创建一个完整的物体。
* `const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)`
* [源码](https://github.com/mrdoob/three.js/blob/master/src/materials/Material.js)

#### [Light](https://threejs.org/docs/index.html#api/lights/Light)

* 光源通过光照的强度和范围去影响场景中的部分对象，主要是对不同材质的对象产生影响。
* `Light`是光源的基础类。其他光源都基于此类。
* 常见的光源有环境光源(`AmbientLight`)、平行光源(`DirectionLight`)、点光源(`PointLight`)等。
  * 环境光源对所有对象产生影响。
  * 平行光仅对`MeshLambertMaterial`和`MeshPhongMaterial`材质的对象产生影响。
  * 点光源同上，仅对`MeshLambertMaterial`和`MeshPhongMaterial`两种材质产生影响。
* 以点光源为例，我们创建一个简单的点光源。

```javascript
let light = new THREE.PointLight(0xffffff, 1, 100) // 光照颜色，光照强度，光照范围
light.position.set(50, 50, 50)
scene.add(light)
```

* [源码](https://github.com/mrdoob/three.js/blob/master/src/lights/Light.js)

#### Animation

* 最后，让这一切动起来，需要动画来运行。

```javascript
functoin animation() => {
  window.requestAnimationFrame(animation)
  renderer.render(scene, camera)
  // do something
}
```

### [Demo](https://codepen.io/kyriejoshua/pen/BJNoVK?editors=0110)

* 在了解所有基本的要素之后，让我们来实现一个简单的动画吧——一个旋转的立方体。

```javascript
import * as THREE from 'three.js'

const body = document.body
const scene = new THREE.Scene()

// 新建渲染器并设置大小
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
body.appendChild(renderer.domElement)

// 设置相机和位置，并将视线转向场景中央
const camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerWidth, 1, 1000)
camera.position.set(0, 0, 10)
camera.lookAt(scene.position)

// 新建一个立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x123abc })
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)

// 旋转立方体
function animation() {
  window.requestAnimationFrame(animation)

  renderer.render(scene, camera)
  cube.rotation.z += 0.01
  cube.rotation.y += 0.01
}

animation()

```


<br/>

{% blockquote %}
[中文文档](http://techbrood.com/threejs/docs/#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/%E5%85%A5%E9%97%A8%E4%BB%8B%E7%BB%8D/%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E5%9C%BA%E6%99%AF(Scene)
{% endblockquote %}
