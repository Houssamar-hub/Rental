import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Circle,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const conversations = [
  { id: 1, name: 'George Clark',    lastMsg: 'Sure, give me a moment.',                          time: '10:30 AM', unread: 2, online: true,  isToday: true  },
  { id: 2, name: 'Helen Martinez',  lastMsg: 'Hello George, thank you for informing us...',       time: '10:05 AM', unread: 0, online: false, isToday: true  },
  { id: 3, name: 'Alice Johnson',   lastMsg: 'Hi! I noticed a small scratch on the Audi Q7...',  time: '9:00 AM',  unread: 1, online: true,  isToday: true  },
  { id: 4, name: 'Bob Smith',       lastMsg: "I'm available for the next rental",                 time: '8:30 AM',  unread: 0, online: true,  isToday: true  },
  { id: 5, name: 'Charlie Davis',   lastMsg: 'The engine light is on...',                         time: 'Yesterday',unread: 3, online: false, isToday: false },
  { id: 6, name: 'Fiona Brown',     lastMsg: 'Here is the picture.',                              time: 'Yesterday',unread: 0, online: false, isToday: false },
  { id: 7, name: 'Diana White',     lastMsg: "I'll note it down and document it.",                time: 'Yesterday',unread: 0, online: true,  isToday: false },
  { id: 8, name: 'Edward Green',    lastMsg: 'Thanks for all the help!',                          time: 'Yesterday',unread: 0, online: false, isToday: false },
];

const initialMessages = [
  { id: 1, from: 'George Clark', text: "Hi! I noticed a small scratch on the Audi Q7. Can you note it down?",                                                   time: '10:20 AM', isMe: false },
  { id: 2, from: 'Me',           text: 'Hello George, thank you for informing us. Can you please send a picture of the scratch?',                                time: '10:22 AM', isMe: true  },
  { id: 3, from: 'George Clark', text: 'Sure, give me a moment.',                                                                                                time: '10:25 AM', isMe: false },
  { id: 4, from: 'George Clark', text: 'Here is the picture.',                                                                                                   time: '10:28 AM', isMe: false, hasImage: true },
  { id: 5, from: 'Me',           text: "Got it. We'll note it down and make sure it's documented. Is there anything else you need assistance with?",             time: '10:30 AM', isMe: true  },
  { id: 6, from: 'George Clark', text: "No, that's all for now. Thanks for the quick response! I really appreciate it.",                                         time: '10:32 AM', isMe: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500',   'bg-cyan-500', 'bg-fuchsia-500', 'bg-orange-500',
];
function avatarColor(id) { return avatarColors[(id - 1) % avatarColors.length]; }

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, id, size = 'md', online = false }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizes[size]} ${avatarColor(id)} rounded-full flex items-center justify-center text-white font-bold`}>
        {initials(name)}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
      )}
    </div>
  );
}

// ─── Conversation Item ────────────────────────────────────────────────────────
function ConversationItem({ conv, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
        selected ? 'bg-red-50 border border-red-100' : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      <Avatar name={conv.name} id={conv.id} online={conv.online} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="font-semibold text-slate-800 text-sm truncate">{conv.name}</p>
          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{conv.time}</span>
        </div>
        <p className="text-xs text-slate-400 truncate">{conv.lastMsg}</p>
      </div>

      {conv.unread > 0 && (
        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold flex-shrink-0">
          {conv.unread}
        </span>
      )}
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, contact }) {
  return (
    <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {!msg.isMe && (
        <Avatar name={contact.name} id={contact.id} size="sm" />
      )}

      <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {msg.hasImage ? (
          <div
            className={`rounded-2xl overflow-hidden ${msg.isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
            style={{ width: 200 }}
          >
            {/* Image placeholder */}
            <div
              className="bg-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400"
              style={{ width: 200, height: 120 }}
            >
              <ImageIcon size={28} />
              <span className="text-xs">Image attachment</span>
            </div>
          </div>
        ) : (
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.isMe
                ? 'bg-red-500 text-white rounded-br-sm'
                : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm'
            }`}
          >
            {msg.text}
          </div>
        )}
        <span className="text-xs text-slate-400 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Messages() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(conversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // TODO: Connect WebSocket STOMP here for real-time messaging
  useEffect(() => {
    // Example STOMP connection setup (requires @stomp/stompjs):
    //
    // import { Client } from '@stomp/stompjs';
    //
    // const stompClient = new Client({
    //   brokerURL: 'ws://localhost:8080/ws',
    //   onConnect: () => {
    //     stompClient.subscribe(`/topic/messages/${selected.id}`, (frame) => {
    //       const incomingMsg = JSON.parse(frame.body);
    //       setMessages((prev) => [...prev, incomingMsg]);
    //     });
    //   },
    // });
    // stompClient.activate();
    //
    // return () => stompClient.deactivate();
  }, [selected]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: 'Me', text, time: timeStr, isMe: true },
    ]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const todayConvs = conversations.filter(
    (c) =>
      c.isToday &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMsg.toLowerCase().includes(search.toLowerCase())),
  );
  const yesterdayConvs = conversations.filter(
    (c) =>
      !c.isToday &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.lastMsg.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="flex h-[calc(100vh-72px)] gap-0 p-4 bg-slate-100 overflow-hidden">
      {/* ── Column 1: Conversations ─────────────────────────────────────── */}
      <div className="w-72 flex-shrink-0 bg-white rounded-l-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 text-base">Messages</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {conversations.reduce((a, c) => a + c.unread, 0)} new
            </span>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {todayConvs.length > 0 && (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-2">Today</p>
              {todayConvs.map((conv) => (
                <ConversationItem key={conv.id} conv={conv} selected={selected?.id === conv.id} onClick={() => setSelected(conv)} />
              ))}
            </>
          )}
          {yesterdayConvs.length > 0 && (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3 py-2 mt-2">Yesterday</p>
              {yesterdayConvs.map((conv) => (
                <ConversationItem key={conv.id} conv={conv} selected={selected?.id === conv.id} onClick={() => setSelected(conv)} />
              ))}
            </>
          )}
          {todayConvs.length === 0 && yesterdayConvs.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-8">No conversations found.</p>
          )}
        </div>
      </div>

      {/* ── Column 2: Chat Window ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 bg-slate-50 rounded-r-2xl border border-l-0 border-slate-100 shadow-sm flex flex-col overflow-hidden">
        {selected ? (
          <>
            {/* Chat Topbar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} id={selected.id} online={selected.online} />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{selected.name}</p>
                  <p className={`text-xs flex items-center gap-1 ${selected.online ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <Circle size={6} fill="currentColor" />
                    {selected.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                  <Phone size={16} />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                  <Video size={16} />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} contact={selected} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-2 flex-shrink-0">
              <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors flex-shrink-0">
                <Paperclip size={17} />
              </button>
              <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors flex-shrink-0">
                <Smile size={17} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selected.name}…`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300"
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <MessageSquare size={36} />
            <p className="font-medium text-sm">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
