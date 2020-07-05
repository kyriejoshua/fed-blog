---
title: 项目中 React hooks + context + ts 实战及体会
date: 2020-06-30 17:20:29
tags: React
categories: React
---
<hr/>

![](/2020/06/30/usecontext-with-typescript-in-reacthooks/unphoto.jpeg)
引言：随着小伙伴们使用 `hooks` 越来越多，项目的复杂度也随之变化。有必要考虑下实际业务中，当前的 `mobx` 是否还能坚挺的适配 `hooks` + ts 的组合。
推荐：★★★★

<!--more-->

## 索引

* [如何选择](#如何选择)
* [考量维度](#考量维度)
* [最佳实践](#最佳实践的选择)
* [业务实战](#业务实战)
* [小结](#小结)

### 如何选择

个人对于数据流方案的考虑，出于以下几点，不分先后顺序，只是作为考虑的维度，来探索有什么数据流方案，可能会比当前的更适合；或者其他的方案，虽然当下不适合，但却能够提供给我们更多的选择空间和思考。

* 引入包的成本。
* 学习成本。
* 和 `hooks` 的适配能力，以及是否兼容 `class` 写法。
* 与 ts 的支持能力。
* 可维护性。
* 当前以及未来可能的生态，扩展能力。

### 考量维度

#### 引入成本

* 这个其实比较好理解，这个包的大小，以及压缩后的大小是考量的维度，这里自然是越小越好的。尤其是，某些库需要考虑的不仅仅是它本身，还有它与 `React` 结合所需要引入的库。

#### 学习成本

* 就目前而言，学习成本最低的自然是项目中已经用到的 `mobx`。大家已经熟悉了它的运作方式和写法。与 `hooks` 的结合相对来说也是容易上手的。

#### 适配能力，兼容 `class`

* 在实际的生产环境项目里，`class` 和 `hooks` 还是混合使用的。已存在的项目大多数还是以 `class` 写法运行，因此这个数据流方案最好能够兼容 `class` 写法，以便我们还是可以方便的更新和维护它。

#### 支持 ts

* 现在我们组内的新项目必须是 ts 项目，所以这一点不可或缺。

#### 可维护性

* 我理解的这一点，是指异常捕获方面，可调试性。当我遇到非期望的错误时，我是否可以很快的调试，定位到问题。
* 还有一点即是说，这个库是否长期有效，这点很重要。因为一个项目，很重要的是稳定。大多数项目并非是朝生暮死的。长期运行的项目，使用了某个库，结果一年后这个库没有人维护了，那是万万不可的，后续迁移的成本，维护的成本都是成倍增长的。

#### 生态以及扩展能力

* 生态就是上手成本和解决问题的速度。
* 前者是说，有一个比较好的文档社区，例子浅显易懂好上手。
* 后者则是，踩坑，填坑的速度。具体比如说，当你遇到一个问题的时候，你在这个社区里搜索，你的坑有人踩过，并且有方案解决，或者即使没有现成的解决方案，你提出来，社区里的小伙伴们也能愉快地协助你来解决完成。这就是一个比较好的生态。
* 我所理解的生态还包括一点，就是它的扩展能力，时下 ts 是比较流行的 js 扩展方式，那么未来是否还有其他可能呢，就像当年的 `coffeescript` 而来的过渡。或者与其他组件库搭配，形成更强大的能力。

### 最佳实践的选择

* 有关方案的选择——最好是，根据不同的项目规模，业务复杂度，来结合使用不同的数据流方案，当然，一种方案能解决所有问题自然是最好的。

#### 目前的实际情况

`mobx` 的结论

* 目前看下来，`mobx` 结合 `hooks` 还是完全可以应付的了实际业务的。兼容 `hooks` 和 `class` 的写法，应该也支持 ts 写法（这个我自己还没实践，并不完全确认）
* 那么为什么还是要考虑其他方案呢，因为 `mobx` 还是有点大了。这个插件展示了具体大小，`mobx` 与 `mobx-react` 加起来有近 70k 的大小。

{% asset_img mobx-size.png 体积大小 %}

* 而且，个人觉得，`mobx` 对于数据变更的溯源并不是那么清楚，它是订阅式的。在使用 `hooks` 的情况下，推崇函数式编程，这不是与某个数据流理念很符合么，没错，就是 `redux`。

#### 新的选择

* 实际上，`hooks` 的能力使得原生的 `context` 可以发挥出近似 `redux` 的效果了。
* 相比 `redux`，它最大的好处是不用再引入 `redux` 相关的库，大大减少了包体积，以及不需要使用繁琐的 `connect`, `mapStateToProps` 等方法。因为是原生的，所以可以即插即用，兼容性良好，无缝衔接 ts。
* 学习成本较低，因为几乎和 `redux` 一致，使用过 `redux` 就一定会使用它。
* 当然，缺点也是有的，就是相比而言，它继承了 `redux` 样板代码多的特性。但同时却也保证了数据的流向是清楚的，可追溯的。
* 具体的优缺点，下面会引入一个具体的案例。各位可以自行判断。

#### 其他选择

* 其他方案当然也有，社区里 [`pullstate`](https://github.com/lostpebble/pullstate) 、[ `constate`](https://github.com/diegohaz/constate)、[`recoil`](https://github.com/facebookexperimental/Recoil) 等。但这些无一不是生态不够完善，就是不能完美兼容 `hooks` 现有的和旧有的 `class` 写法兼容，或者不能很好和 ts 适配，又或者方案本身还不够成熟，达不到能在生产环境里使用的程度。

### 业务实战

* 下面我们以一个实际案例，来看看两者有什么区别，以及如何使用它们。

#### 背景介绍

* 现在有一个列表页面，包含条件搜索，权限操作，弹窗处理等等。
  * [页面地址](http://20200602-toolbox-beiyan-hr.yangtuojia.com/front-static/teamBuilding) - 需内网访问
* 这里我们有一个很常见的场景，就是在一个列表页面内。搜索条件组件和表格展示组件是平级的两个页面子组件，它们会共享**搜索参数** `searchParams` 这个数据，且搜索参数需要传递给他们的子组件，在这里，就是对应到表格的子组件——弹窗。
* 搜索的逻辑很好理解了，特别说明一下弹窗这里就是需要将当前搜索条件中的一部分也带过来，用在默认的查询参数上。
* 现在我们结合原有的代码，对它进行一些改造。先来看一下原始代码。

#### 现有逻辑

* 这是页面中， 组合搜索和表格的入口页面。这里我们统统使用原生的 `hooks` 和 ts 实现。

```tsx
const TeamBuilding: React.FC<MyProps> = props => {
    const [searchParams, setSearchParams] = useState(null);

    /**
     * 请求团建费数据
     * @param values
     */
    const onSearch = (values) => {
        setSearchParams(values);
        // do sth...
    };

    return (
        <div className="remind-main">
            <Search onSearch={onSearch} handleSearchData={setSearchParams} />
            <AdminTable searchParams={searchParams} />
        </div>
    );
};

```

* 我们将 `searchParams` 这个搜索条件保存在最上层，也就是页面层级，供表格和搜索两个组件共用，其中搜索组件负责修改这个参数，而表格则仅仅是使用这个参数，当前这里是通过 `props` 的方式传递给表格。
*  `setSearchParams` 方法则是提供了修改它的能力。
* 表格的核心逻辑：

```tsx
const AdminTable: React.FC<TableProps> = ({ onSearch, tableData, searchParams = {} }) => {
    const { year, deptId } =  searchParams || {};

    /**
     * 团队核销
     */
    const handleUseWalfare = () => {
        const data = {
            type: WALFARE_TYPE,
            deptId,
            year,
        };
        handleUseWalfareApi(data)
            .then((res) => {
                res.code === 200 && message.success('核销成功');
                onSearch(searchParams);
            });
    };
  	// 注入该方法，供表格内部使用
    const columns = columnsFn(handleUseWalfare);

    return <>
        <div className="admin-table">
            <Table columns={columns} bordered pagination={false} rowKey="month" size="small"/>
        </div>
        <PersonalWelfareModal year={year} />
    </>;
};

```

* 可以看到，上述所说的搜索条件参数，是提供给一个实际操作交互里作为参数使用的，需要获取其中的某些字段当作参数，同时操作成功后又需要以同样参数进行刷新。
* 然后会将其中的属性 `year`, 继续传给弹窗组件使用。因为弹窗组件内的搜索也需要默认参数年份。
* 整体大概就是这么个样子

{% asset_img props.png 状态管理 %}

* 这里的繁琐就是在处理的时候，需要将状态抽离到最上层，然后层层传递 props。

#### 改造代码

* 下面我们使用原生 `context`，和 `hooks` 中的 ` useReducer` 的能力，来将这段逻辑改造成类 `redux` 的效果。
* 原始上下文需要初始值，这里因为用到了 ts. 所以我们用 ts 的方式定义初始值，并建立上下文。这部分是完全新增的一个文件。

```tsx
export interface IState {
    searchParams?: {
        year?: string,
        deptId?: number
    };
}
const initialState: IState = {
    searchParams: {}
};

interface IContextProps {
    state: IState,
    dispatch: Dispatch<TAction>;
}

export const TeamBuildingContext = createContext<IContextProps>({ state: initialState, dispatch: () => {} });

const TeamBuildingProvider: React.FC<MyProps> = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <TeamBuildingContext.Provider value={{state, dispatch}}>
            {props.children}
        </TeamBuildingContext.Provider>
    );
};

export default TeamBuildingProvider;

```

* 可以看到，这个文件的作用是建立上下文，以及给这个上下文传入一个初始状态和更新方法。
* 注意上下文 ` TeamBuildContext` 是需要导出的，然后需要维护的值以 `value` 的形式传入。
* 这里面只有 `reducer` 是外部导入的，我们一步步来看。
* 为了方便演示，而且这次只是以一个数据为例子，我就把 `action` 和 `type` 以及 `reducer` 的定义，通通放在一个文件里了。下面就是：

```typescript
import { Reducer } from "react";

export const UPDATE_PARAMS = 'UPDATE_PARAMS';
export type UPDATE_PARAMS = typeof UPDATE_PARAMS;

export interface IDispatch {
    type: UPDATE_PARAMS;
    payload: object;
  }

export const updateParams = (payload: object): IDispatch =>
    ({
        payload,
        type: UPDATE_PARAMS
    });

export type TAction = IDispatch;

export const reducer: Reducer<IState, TAction> = (prevState: IState, action: TAction): IState => {
    const { type, payload } = action;
    switch (type) {
        case UPDATE_PARAMS:
            return { ...prevState, loading: false, searchParams: payload };
        default:
            return prevState;
    }
};
```

* 可以看到，这是一个很经典的 `reducer` 写法。根据不同 `type`，匹配不同操作，并将操作后的新状态进行返回。
* 由于我们这里只对一个参数进行操作，所以相应的 `action` 和 `type` 也只写了一个。
* 然后接下来看看使用的地方，需要对原来的代码进行一些修改。为了方便，我重新定义了一个入口文件 `index.js`，把原先的入口组件改造成了 `TeamBuildContainer.js` 作为容器。这样就可以将提供上下文的能力与业务组件进行解耦。
* 这是入口文件 `index.js`

```tsx
import React from 'react';
import TeamBuildingProvider from "./TeamBuildContext";
import TeamBuildContainer from './TeamBuildContainer';

const TeamBuildingHooks: React.FC = props => {
    return (
        <TeamBuildingProvider>
            <TeamBuildContainer {...props} />
        </TeamBuildingProvider>
    );
};

export default TeamBuildingHooks;
```

* 很简单，只做了一件事，就是引入刚刚新增的上下文 `TeamBuildingProvider` 组件，进行包裹。
* 这样我们就可以在子组件内使用导入的 `TeamBuildingContext` 上下文，获取我们所需的  `dispatch` 方法和 `state` 值。
* 下面是改造后的 `TeamBuildContainer.js`

```tsx
import TeamBuildingProvider from "./TeamBuildContext";

const TeamBuildingContainer: React.FC<MyProps> = props => {
		const {dispatch} = useContext(TeamBuildingContext);
  	const dispatchCb = (payload = {}, type) => dispatch && dispatch({payload, type });

  	/**
     * 请求团建费数据
     * @param values
     */
    const onSearch = (values) => {
        dispatchCb(values, UPDATE_PARAMS);
      // do sth...
    };

    return (
        <div className="remind-main">
            <Search onSearch={onSearch} />
            <AdminTable onSearch={onSearch} />
        </div>
    );
};

export default Form.create()(TeamBuildingContainer);

```

* 在这个页面中，我们需要使用 `dispatch` 来更新数据，但不需要直接使用状态，所以只用取出  `dispatch` 。 **`useContext`**  方法为我们提供了这样的能力。
* 可以明显的看到，这里不需要使用 `props` 的方式传递数据了。
* 再看看 `adminTable` 中是怎么取用数据的吧。

```tsx
import { TeamBuildingContext } from "./../../TeamBuildContext";

const AdminTable: React.FC<TableProps> = ({ onSearch }) => {
    const { state } = useContext(TeamBuildingContext);
    // 这里要设置初始值，不然会报错，主要是因为自动生成的接口字段对应的 ts 接口没有设置可选项，具体见 useWelfare.ts
    const { year = '2020', deptId = 67 } = state.searchParams || {};

    /**
     * 团队核销
     */
    const handleUseWalfare = () => {
        const data = {
            type: WALFARE_TYPE,
            deptId,
            year,
        };
        handleUseWalfareApi(data)
            .then((res) => {
                res.code === 200 && message.success('核销成功');
                onSearch(state);
            });
    };

    const columns = columnsFn(handleUseWalfare);

    return <>
        <div className="admin-table">
            <Table columns={columns} bordered pagination={false} rowKey="month" size="small"/>
        </div>
        <PersonalWelfareModal/>
    </>;
};

```

* 表格中取用的逻辑是完全类似的，这次 `useContext` 中我们只需要 `state`。
* 以此类推，在表格内的弹窗 `PersonalWelfareModal` 组件中，我们可以以完全一样的方式来取用 `state` 中我们所需的字段，而无需 `props` 传递。
* 以上，就是我们对原始逻辑的一次完整改造了。
* 我们使用了先前就有的 `context`, 和这次 `hooks` 新提供的 `useContext`, `useReducer` 等 api，达到了类似 `redux` 处理的效果。
* 这里我列举的只是一个比较常见的例子，不一定是最恰当的。这次业务里只是涉及到两层 `props` 的传递，实际业务中肯定有更多层级的传递，或是跨层级的共享。但最终，我们使用它的方式和理念一致的。

#### 使用体验

* 相较于原生的组织方式，使用 `context` + ts 使得我们在创建时就约束好了数据格式 —— `initialState`。
* 然后在需要取用数据的地方，或者需要更新数据的地方，使用 `useContext` 取出，进行预期的操作。
* 至于具体的更新数据逻辑，则统一在 `reducer` 里定义。实现了展示层和逻辑层的解耦。当然，这里的例子十分小，具体业务里要实现这样的解耦，还需要做其他的统筹管理的努力。但从最终效果来说，理应是明显的。
* 这里我并没有很深入的去使用，但至少在目前的场景里，我理解使用 `context` 的状态管理是模块化的。只要创建 `context` 得当，那么每个模块都是独立分割的，很适合在一个模块里去统筹管理。它不像 `redux` 是在全局的顶层进行注入，需要使用的地方去  `connect`   连接；也不像 `mobx`，尽管也可以做到模块化，但通常会在顶层入口注入所有 `store`.

### 小结

* 事到如今，我们再来回顾一下，它在我自己总结的上述考量维度里，哪些是做的好的，哪些是做的不好的。以及怎么去权衡。
* 引入包的成本：
  * 这点上，它无疑是最好的，因为它是天生内置，自带可以使用的，没有任何冗余依赖。
* 学习成本：
  * 在仅仅使用过 `mobx` 数据管理方案的小伙伴身上，确实需要一点学习成本，不过它本身函数式的思想，和 `hooks` 的写法一脉相承，相信这点成本是相对容易克服的。
  * 至于已经写过  `redux` 的小伙伴，自然是可以无缝衔接了。
* 适配能力，兼容能力：
  * 这在上文已经体现很明显了，`hooks` 中是无须担心的。至于还在 `class` 的业务，可以使用 `context` ，但方式并不是类 `redux` 的方式了，这算是一个小缺憾把。不过，在使用 `class` 的项目中，基本上我们已经内置了 `mobx` 的方案了。
* 支持 ts 的能力：
  * 上述例子中我们也可以看到了，这显然是无须担心的。
* 可维护性：
  * 显而易见，只要 `hooks` 还在，这个方案就会一直随着它的更新而存在，不必担心有一天它突然不能使用了。
* 生态以及扩展能力：
  * 由于是官方的亲生儿子，所以相信这一块的社区必定不少，我也是从网上搜索到了类似的例子，才能在生产项目里快速写出以上的无缝衔接代码。而且因为是天生的，它的扩展能力，例如我们对它的定制也应当是容易的，方便的。
* 综上，个人推荐在新的 `hooks` + ts 项目里，完全可以使用这个方案来实践。前提当然是我们没有非常巨大的量的数据需要处理，控制。
* 至于现有的项目，可以仍然使用 `mobx`，并同时在写 `hooks` 的时候使用这套方案。
* 也可以按项目大小的类型来区分，如下：

{% asset_img states.png 状态管理 %}

### 参考

* [State Management with React Hooks in TypeScript](https://medium.com/@suraj.kc/state-management-with-react-hooks-in-typescript-84b70b6c3fb9)

<!--7h-->

<hr/>
{% asset_img reward.jpeg Thanks %}
