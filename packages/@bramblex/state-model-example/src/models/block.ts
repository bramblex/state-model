import { v4 as uuid } from 'uuid';
import { StateModel } from "@bramblex/state-model";
import { PageModel } from "./page";

interface BlockOptions { [key: string]: any };

interface BlockStateBase {
    type: string;
    title: string;
    options: BlockOptions;
}

interface BlockState extends BlockStateBase {
    children?: BlockModel[]
}

interface BlockData extends BlockStateBase {
    id: string;
    children?: BlockData[];
}

export class BlockModel extends StateModel<BlockState> {
    public readonly id: string;

    public readonly page: PageModel;

    public parent: BlockModel | null;

    constructor(page: PageModel, parent: null | BlockModel, initialData: BlockData) {
        super({
            type: '',
            title: '',
            options: {},
        });

        this.id = initialData.id || uuid();

        this.setState({
            ...this.state,
            children: initialData.children?.map(data => new BlockModel(page, this, data)),
        });

        this.page = page;
        this.parent = parent;
    }


    serialize(): BlockData {
        return {
            id: this.id,
            ...this.state,
            children: this.state.children?.map(block => block.serialize()),
        }
    }

    modify(newOptions: Partial<BlockOptions>) {
        this.setState({
            ...this.state,
            options: {...this.state.options, ...newOptions},
        });
    }

    remove() {
        if (this.parent) {
            this.parent.setState({
                ...this.parent.state,
                children: this.parent.state.children?.filter(child => child.id !== this.id),
            });
            this.parent = null;
        }
    }

    insert(child: BlockModel, index: number = 0) {
        const children = this.state.children;
        if (!children) {
            throw new Error('Insert error');
        }

        const newChildren = [
            ...children.slice(0, index).filter(c => c.id !== child.id),
            child,
            ...children.slice(index + 1).filter(c => c.id !== child.id),
        ];

        child.remove();

        child.parent = this;
        this.setState({
            ...this.state,
            children: newChildren,
        });
    }
}
