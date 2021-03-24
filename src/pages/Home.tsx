import { useState } from 'react';
import TodoListItem from "../components/TodoListItem";
import { TodoItem } from "../data/todo-item";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { Plugins } from "@capacitor/core";
import './Home.css';
import { checkmark } from 'ionicons/icons';

const { Storage } = Plugins;
const Home: React.FC = () => {

  // const [messages, setMessages] = useState<Message[]>([]);

  // useIonViewWillEnter(() => {
  //   const msgs = getMessages();
  //   setMessages(msgs);
  // });
  const [items, setItems] = useState<TodoItem[]>([]);
  const [text, setText] = useState<string>("");

  const rewriteList = () => {
    if(typeof TodoItem.ALL_ITEMS === "undefined"){
      return;
    }
    let itemsList = Array.from(TodoItem.ALL_ITEMS).sort((a,b) => b.getTimestamp()-a.getTimestamp());
    setItems(itemsList);
  }

  const handleAdd = async () => {
    if(text === ""){
      return;
    }
    let newItem:TodoItem = new TodoItem(text);
    await Storage.set({
      key: ""+newItem.getTimestamp(),
      value: JSON.stringify({
        text: newItem.getText(),
        isComplete: newItem.isComplete()
      })
    });
    setItems([newItem].concat(items));
    setText("");
  }

  const deleteItem = async (item: TodoItem) => {
    await Storage.remove({key: ""+item.getTimestamp()});
    TodoItem.ALL_ITEMS.delete(item);
    rewriteList();
  }

  const editItem = async (item: TodoItem, newText: string) => {
    await Storage.remove({key: ""+item.getTimestamp()})
    let editedItem = item.edit(newText);
    await Storage.set({
      key: ""+editedItem.getTimestamp(),
      value: JSON.stringify({
        text: newText,
        isComplete: false
      })
    })
    rewriteList();
  }

  useIonViewWillEnter(async () => {
    const { keys } = await Storage.keys();
    await keys.forEach(async (k: string) => {
      let strVal = await Storage.get({key: k});
      let val = JSON.parse(strVal.value || "{}");
      new TodoItem(val.text, Number(k), val.isComplete);
    });
    rewriteList();
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Todo List</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Todo List
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonInput style={{margin: "1em"}} value={text} placeholder="Enter item" onIonChange={e => setText(e.detail.value!)}></IonInput>
          <IonButton style={{margin: "1em"}} onClick={handleAdd}>
            <IonIcon slot="icon-only" icon={checkmark} />
          </IonButton>
        </IonItem>
        <IonList>
          {/* {messages.map(m => <MessageListItem key={m.id} message={m} />)} */}
          {items.map(m => <TodoListItem editMethod={editItem} deleteMethod={deleteItem} key={m.getTimestamp()} todoItem={m} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
