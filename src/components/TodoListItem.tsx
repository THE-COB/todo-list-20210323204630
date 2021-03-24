import React, {useState} from "react";
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote
  } from '@ionic/react';
import { TodoItem } from "../data/todo-item";
import "./MessageListItem.css";
import { pencil, trash } from "ionicons/icons";
import Home from "../pages/Home";

interface TodoListItemProps {
  todoItem: TodoItem;
  deleteMethod: (item: TodoItem) => void;
  editMethod: (item: TodoItem, newText: string) => void;
}

const handleDelete = (item: TodoItem) => {
  TodoItem.ALL_ITEMS.delete(item);
}
const TodoListItem: React.FC<TodoListItemProps> = ({todoItem, deleteMethod, editMethod}) => {

  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState<string>("");

  return (
    <IonItem>
      <IonModal isOpen={showModal}>
        <IonInput style={{ margin: "1em" }} value={text} placeholder="Enter new text" onIonChange={e => setText(e.detail.value!)}></IonInput>
        <IonButton onClick={() => editMethod(todoItem, text)}>Update</IonButton>
        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
      </IonModal>
      <IonCheckbox style={{margin: "1em"}} checked={todoItem.isComplete()} onIonChange={e => todoItem.changeCompletion()} />
      <IonLabel style={{margin: "1em"}}>
      <h2 style={{marginTop: "2em"}}>
        {todoItem.getText()}
        <span className="date">
          <IonNote>{todoItem.getFormattedTimestamp()}</IonNote>
        </span>
        <span>
          <IonButton className="date" onClick={() => setShowModal(true)}>
            <IonIcon slot="icon-only" icon={pencil}/>
          </IonButton>
        </span>
        <span>
          <IonButton className="date" onClick={() => deleteMethod(todoItem)}>
            <IonIcon slot="icon-only" icon={trash} />
          </IonButton>
        </span>
      </h2>
      </IonLabel>
    </IonItem>
  );
};

export default TodoListItem;