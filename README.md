# StateModel

## 简介
StateModel 是一个用于前端轻量级状态管理的库，它提供了一种由模型驱动 UI 的方式来管理前端应用程序的状态。通过构建业务模型或者数据模型，可以将应用程序的状态和行为封装在一个模型中，并且 StateModel 为模型提供了可响应式的 API 用于将模型的状态绑定在 UI 上，以方便 UI 和业务逻辑的同步更新。

## 安装
```bash
npm install @bramblex/state-model
```

## API

### StateModel 类
``` TypeScript
export type Id = number | string | symbol | bigint;

export type BaseState = Record<string, unknown>;

export class StateModel<State extends BaseState = BaseState> {
	/* 只读属性，用于唯一标识一个实例 */
	public readonly id: Id;
	/* 只读属性，用于存储当前的状态 */
	public readonly state: State;

	/* 
	* 构造函数
	* @param initialState 初始状态
	* @param id 实例的唯一标识，默认为 Symbol(), 如果传入 ID 同一个类型的实例，ID 相同则会复用同一个实例
	*/
	public constructor(initialState: State, id?: Id);

	/*
	* 用于更新状态的方法
	* @param state 要更新的状态
	*/
	public update(state: Partial<State>): void;

	/*
	* 用于订阅状态更新的方法
	* @param callback 状态更新时的回调函数
	* @returns 取消订阅的 off 函数
	*/
	public onUpdate(callback: (state: Partial<State>) => unknown): () => void;


	/* 
	* 用于销毁实例的方法， 因为传入 ID 会被记录在全局，所以需要手动销毁实例
	*/
	public destroy(): void;
}
```

###  React Hooks
``` TypeScript
/*
* 用于将 StateModel 实例绑定到 React 组件上的方法
* @param model StateModel 实例
*/
function useModel<Model extends StateModel<BaseState>>(model: Model): void;

/*
* 用于创建一个本地的 StateModel 实例的方法
* @param creator 用于创建 StateModel 实例的函数
*/
function useLocalModel<Model extends StateModel<BaseState>>(creator: () => Model): void;
```

### Vue Hooks

``` TypeScript
/*
* 用于将 StateModel 实例绑定到 Vue 实例上的方法
* @param model StateModel 实例
* @returns 绑定后的 Vue 可以使用 refs 对象
*/
function useModel<Model extends StateModel<State>, State extends BaseState>(): 
	{ [key in keyof State]: Ref<State[key]> };
```

## 使用示例

### 基本使用
一个 counter 示例

``` TypeScript
import { StateModel } from '@bramblex/state-model';

// 创建一个 Counter 类
class Counter extends StateModel<{ count: number }> {
  constructor() {
    super({ count: 0 });
  }
  increment() {
    this.update(state => ({ count: state.count + 1 }));
  }
}

const counter = new Counter();
```

在 React 组件中使用
```tsx
import { useModel } from '@bramblex/state-model/react';

function CounterComponent() {
	useModel(counter);
	// 如果只在组件中使用，也可以使用 useLocalModel
	const counter = useLocalModel(() => new Counter());

	return (
		<div>
			<p>Count: {counter.state.count}</p>
			<button onClick={() => counter.increment()}>Increment</button>
		</div>
	)
}
```

在 Vue 组件中使用
```vue
<script setup>
import { useModel } from '@bramblex/state-model/vue';
const { count } = useModel(counter); // 此处的 counter 是一个 vue ref 对象
</script>

<template>
	<div>
		<p>Count: {{ count }}</p>
		<button @click="counter.increment()">Increment</button>
	</div>
</template>
```


## 协议
MIT