import { Initializer, createModel } from "@bramblex/state-model"
import { useSyncModel } from "@bramblex/state-model-react"

interface ToDoModel {
    states: {
        todos: string[]
    },
    actions: {
        addTodos(todo: string): void
    }
}

const createTodoModel: Initializer<ToDoModel> = (set, get) => {
    return {
        states: {
            todos: ['第一件事情']
        },
        actions: {
            addTodos(payload) {
                set(draft => {
                    draft.states.todos.push(payload);
                    return draft
                });
            }
        }
    }
};

console.log('###createModel', createModel)

const todoModel = createModel(createTodoModel);
export const useStore:() => ToDoModel = () => {
    return useSyncModel({
        setState: todoModel.setState,
        getSnapshot: todoModel.getSnapshot,
        subscribe: todoModel.subscribe
    });
}
