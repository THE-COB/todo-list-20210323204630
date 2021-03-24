import { runInThisContext } from "node:vm";

export class TodoItem {
    private text: string;
    private complete: boolean;
    private timestamp: number;

    static ALL_ITEMS: Set<TodoItem>;

    constructor(todoText: string, time: number = Date.now(), complete: boolean = false){
        this.text = todoText;
        this.timestamp = time;
        this.complete = complete;
        if(typeof TodoItem.ALL_ITEMS === "undefined"){
            TodoItem.ALL_ITEMS = new Set<TodoItem>();
        }
        TodoItem.ALL_ITEMS.add(this);
    }

    getText(): string {
        return this.text;
    }
    isComplete(): boolean {
        return this.complete;
    }
    getTimestamp(): number {
        return this.timestamp;
    }
    //From stack overflow
    getFormattedTimestamp(): string {
        var a = new Date(this.timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    edit(newText: string): TodoItem {
        TodoItem.ALL_ITEMS.delete(this);
        this.text = newText;
        this.complete = false;
        this.timestamp = Date.now();
        TodoItem.ALL_ITEMS.add(this);
        return this;
    }

    changeCompletion(): void {
        this.complete = !this.complete;
    }
}