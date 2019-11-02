import { ChatMessage } from './chat-data';

export const CHATS: ChatMessage[] = [
  { userName: '#system#', chatText: '<luser> has entered' },
  { userName: 'luser', chatText: 'Hey all!' },
  { userName: '#system#', chatText: '<bozo> has entered' },
  { userName: 'luser', chatText: 'Hey, bozo' },
  { userName: 'bozo', chatText: 'Hey, l. Want a game?' },
  { userName: '#system#', chatText: '<spongey> has entered' },
  { userName: '#system#', chatText: '<spongey> has left' },
  { userName: '#system#', chatText: '<bozo> has invited you to a game' }
];
