# StateModel

## 介绍
为 React 设计的简易模型，帮助 React 用户进行模型驱动设计。

## 安装

使用 npm 安装

```Bash
npm install --save @bramblex/state-model
```

使用 yarn 安装

```
yarn add @bramblex/state-model
```

## 用法

### 声明一个模型

```TS
import { 
    StateModel, 
    useModel, 
    useLocalModel, 
    useModelProvider, 
    useModelContext 
} from '@brambles/state-model'

class Counter extends StateModel<{ count: number }> {
    constructor() {
        super({ count: 0 })
    }

    increase() {
        this.setState({ count: this.state.count + 1 });
    }


    decrease() {
        this.setState({ count: this.state.count - 1 });
    }
}
```

### 全局使用
```TSX
const counter = new Counter();

function App() {
    useModel(counter);

    return (
        <div>
            <div>{model.state.count}</div>
            <div>
                <button onClick={() => counter.increase()}>+</button>
                <button onClick={() => counter.decrease()}>-</button>
            </div>
        </div>
    );
}
```

### 局部使用
```TSX
function App() {
    const counter = useLocalModel(() => new Counter(), []);

    return (
        <div>
            <div>{model.state.count}</div>
            <div>
                <button onClick={() => counter.increase()}>+</button>
                <button onClick={() => counter.decrease()}>-</button>
            </div>
        </div>
    );
}
```


### 局部使用 & Context
```TSX
function Increase() {
    const counter = useModelContext(Counter);
    return <button onClick={() => counter.increase()}>+</button>
}

function Decrease() {
    const counter = useModelContext(Counter);
    return <button onClick={() => counter.decrease()}>-</button>
}

function Count() {
    const counter = useModelContext(Counter);
    useModel(counter);
    return <div>{model.state.count}</div>
}

function App() {
    const counter = useLocalModel(() => new Counter(), []);
    // 等效于 
    // const counter = useModel(useMemo(() => new Counter(), []));
    const Provider = useModelProvider(Counter);

    return (
        <Provider value={counter}>
            <div>
                <Count />
                <div>
                    <Increase />
                    <Decrease />
                </div>
            </div>
        </Provider>
    );
}
```