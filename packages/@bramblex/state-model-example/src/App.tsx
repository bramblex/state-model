import React from 'react';
import './App.css';
import { useLocalModel, useModelProvider } from '@bramblex/state-model';
import { EditorModel } from './models/editor';


function App() {
  const editor = useLocalModel(() => 
     new EditorModel()
  );
  const Provider = useModelProvider(EditorModel);

  return (
    <Provider value={editor}>
      <div>
        <div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
