import { v4 as uuid } from 'uuid';
import { StateModel } from "@bramblex/state-model";
import { EditorModel } from './editor';
import { BlockModel } from './block';

interface PageState {
    pending: boolean;
    dirty: boolean;
    name: string;
    content: BlockModel;
    error: boolean;
    errorMessage: string;
}

export class PageModel extends StateModel<PageState> {

    public readonly id: string;

    public readonly editor: EditorModel;

    constructor(editor: EditorModel, id?: string ) {
        super({
            pending: false,
            dirty: false,
            name: '',
            content: {} as BlockModel,
            error: false,
            errorMessage: '',
        });
        this.editor = editor;

        if (id) {
            this.id = id;
            this.load();
        } else {
            this.id = uuid();
            this.setState({
                ...this.state,
                content: new BlockModel(this, null, { id: '', type: 'root', title: '根节点', options: {} }),
            });
        }
    }

    load() {
        try {
            const {name, content} = JSON.parse(localStorage.getItem(`content/${this.id}`) as string);
            this.setState({
                ...this.state,
                pending: false,

                name,
                content: new BlockModel(this, null, content),
            });
        } catch (err) {
            this.setState({
                ...this.state,
                pending: false,
                // @ts-ignore
                error: err,
                errorMessage: '页面加载错误',
            });
        }
    }

    save() {
        localStorage.setItem(`content/${this.id}`, JSON.stringify({
            name: this.state.name,
            content: this.state.content.serialize(),
        }))
    }

    close(force = false) {
        if (force || (this.state.dirty && window.confirm(`页面 “${this.state.name}” 未保存，是否关闭？`))) {
            this.editor.closePage(this.id);
        }
    }
}
