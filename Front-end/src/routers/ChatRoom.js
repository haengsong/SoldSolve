import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { faPaperPlane, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import NavBar from '../components/NavBar'


let stompClient = null;
function ChatRoom() {
  let store = useSelector((state) => { return state })
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { state } = useLocation();
  const [roomId] = useState(state.roomId);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [dbChats, setDbChats] = useState()

  useEffect(() => {
    let Sock = new SockJS('/ws-stomp');
    console.log(Sock)
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);

    return () => {
      if (stompClient.connected) {
        const chatMessage = {
          sender: store.info.info.userId,
          message: '상대방이 대화를 나갔습니다.',
          roomId: state.roomId,
          type: 'TALK'
        };
        stompClient.subscribe(`/sub/chat/room/${roomId}`, onMessageReceived);
        chatMessage['type'] = 'EXIT'
        stompClient.send('/pub/chat/message/', {}, JSON.stringify(chatMessage))
        stompClient.disconnect(`/sub/chat/room/${roomId}`)

      }
    };
  }, []);

  useEffect(() => {
    const roomChats = () => {
      axios({
        url: `/api/room/${roomId}`,
        method: 'get',
        headers: { Authorization: `Bearer ${localStorage.token}` }
      })
        .then(res => {
          console.log(res.data)
          const copyDbChats = res.data.reverse().slice(0, 50)
          console.log(copyDbChats)
          const copyChats = []
          copyDbChats.reverse().map(chat => {
            console.log(chat.chatContent)
            copyChats.push(chat)
          })
          setDbChats(copyChats)
        })
        .catch(err => {
          console.log(err)
        })
    }
    roomChats()
  }, [chats])

  const onConnected = () => {
    const chatMessage = {
      sender: store.info.info.userId,
      message: message,
      roomId: state.roomId,
      type: 'TALK'
    };
    console.log('연결완료');
    stompClient.subscribe(`/sub/chat/room/${roomId}`, onMessageReceived);
    chatMessage['type'] = 'JOIN'
    stompClient.send('/pub/chat/message/', {}, JSON.stringify(chatMessage))
  };

  const onMessageReceived = payload => {
    let payloadData = JSON.parse(payload.body);
    chats.push(payloadData);
    setChats([...chats]);
  };

  const sendChatHandler = (e) => {
    e.preventDefault();
    if (stompClient) {
      if (store.info.info.userId && message) {

        let messageData = message.replace(/ +(?= )/g, "");
        if (messageData !== "" && messageData !== " ") {
          const chatMessage = {
            sender: store.info.info.userId,
            message: message,
            roomId: state.roomId,
            type: 'TALK'
          };
          stompClient.send('/pub/chat/message/', {}, JSON.stringify(chatMessage));
        }
      }
    }
    setMessage('');
    inputRef.current.focus();
  };


  const onError = err => {
    console.log(err);
    throw err;
  };

  console.log(message, chats)
  return (
    <div>
      <NavBar></NavBar>
      <div className='chat_box'>
        <FontAwesomeIcon className='buyer_nickname' icon={faChevronLeft} style={{ float: 'right', width: '28px', height: '28px', margin: '4px 2px 0 8px', color: '#6667AB', marginRight: '265px', marginBottom: '12px', left: '6px', top: '11px', cursor: 'pointer' }} onClick={() => { navigate(-1) }} />
        <h3 className='buyer_nickname'>{state.you}</h3>
        <div className='chat_background'>
          <div className='chat_div' >
            <div className='li_box_container'>
              {dbChats && dbChats.map(dbChat => {
                if (dbChat.writeUser.nickname === store.info.info.nickName) {
                  return (
                    <p className='li_box_me' key={uuid()}>{dbChat.chatContent}</p>
                  )
                } else {
                  return (
                    <p className='li_box_other' key={uuid()}>{dbChat.chatContent}</p>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='input_box'>
        <form onSubmit={e => sendChatHandler(e)} style={{ display: 'flex', width: '100%' }}>
          <input className='chat_input' ref={inputRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            type="text"
            placeholder="메시지를 입력하세요"></input>
          <FontAwesomeIcon icon={faPaperPlane} style={{ float: 'right', width: '28px', height: '28px', margin: '4px 2px 0 8px', color: '#6667AB' }} onClick={e => sendChatHandler(e)} />
        </form>
      </div>
    </div >

  );
}

export default ChatRoom;