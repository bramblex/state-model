import { StateModel } from "@bramblex/state-model";
import { PageModel } from "./page";

interface EditorState {
    pages: PageModel[]
}

export class EditorModel extends StateModel<EditorState> {
    constructor() {
        super({
            pages: [],
        });
    }

    openPage(id?: string) {
        const { pages } = this.state;
        this.setState({
            pages: [...pages, new PageModel(this, id)],
        });
    }

    closePage(id: string) {
        const { pages } = this.state;
        this.setState({
            pages: pages.filter(page => page.id !== id),
        });
    }

    movePage(id: string, targetIndex: number) {
        const { pages } = this.state;
        const originIndex = pages.findIndex(page => page.id === id);

        if (originIndex < 0) {
            return;
        }

        this.setState({
            pages: [
                ...pages.slice(0, targetIndex),
                pages[originIndex],
                ...pages.slice(targetIndex + 1)
            ]
        });
    }
}
