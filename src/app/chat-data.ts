import { Injectable } from '@angular/core';


export class ChatMessage
{
  userName: string;
  chatText: string;
  msgID: number;

  constructor(userName: string, chatText: string)
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
  chatList: Array<ChatMessage> = [];
  chatMap: Array<ChatMessage> = [];

  addChat(c: ChatMessage)
  {
    if (c.msgID in this.chatMap)
    {
      // Don't Duplicate
      return;
    }
    this.chatList.push(c);
    this.chatMap[c.msgID] = c;
  }

  getChats()
  {
    return this.chatList;
  }

  clear()
  {
    this.chatList  = [];
    this.chatMap  = [];
  }

  addChats(chats: ChatMessage[])
  {
    const chatData = this;
    chats.forEach(c => {chatData.addChat(c); });
  }

  setChats(cm: ChatMessage[])
  {
    this.chatList = cm;
    const chatData = this;
    this.chatList.forEach(c => {chatData.chatMap[c.msgID] = c; });
  }

}
