export class ChatMessage 
{
  user : string;
  message : string;
}

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

}
