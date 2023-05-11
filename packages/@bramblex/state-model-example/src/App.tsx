import React from 'react';
// import { useLocalModel, useModelProvider } from '@bramblex/state-model';
import { EditorModel } from './models/editor';
import { useStore } from './models/todo';
import { Initializer, createModel } from "@bramblex/state-model"
// import { useSyncModel } from "@bramblex/state-model-react"
import * as q from "@bramblex/state-model-react"

function App() {
  // const editor = useLocalModel(() => 
  //    new EditorModel()
  // );
  // const Provider = useModelProvider(EditorModel);
  const { actions, states } = useStore();
  const addSleep = () => {
    actions.addTodos('睡觉');
  }

  return (
    // <Provider value={editor}>
    <div>
      <button onClick={addSleep}>加一条睡觉</button>
      <div>
        {
          states.todos.map((t, i) => {
            return <li key={i}>{t}</li>
          })
        }
      </div>
    </div>
    // </Provider>
  );
}

export default App;
