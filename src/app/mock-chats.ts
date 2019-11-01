import { ChatMessage } from './chat-data';

export const CHATS: ChatMessage[] = [
  { user: '#system#', message: '<luser> has entered' },
  { user: 'luser', message: 'Hey all!' },
  { user: '#system#', message: '<bozo> has entered' },
  { user: 'luser', message: 'Hey, bozo' },
  { user: 'bozo', message: 'Hey, l. Want a game?' },
  { user: '#system#', message: '<spongey> has entered' },
  { user: '#system#', message: '<spongey> has left' },
  { user: '#system#', message: '<bozo> has invited you to a game' }
];
