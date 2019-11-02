import { Injectable } from '@angular/core';


export class ChatMessage 
{
  userName : string;
  chatText : string;

  constructor (userName: string, chatText: string)
  {
     this.userName = userName;
     this.chatText = chatText;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatData
{
  chatList : Array<ChatMessage> = [];

  addChat(c : ChatMessage)
  {
    this.chatList.push(c);
  }

  getChats()
  {
    return this.chatList;
  } 

  setChats(cm : ChatMessage[])
  {
    this.chatList = cm;
  }

}
