import React, { Component } from "react";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/chat.actions";
import ChatListItem from "../../../components/Chat/ChatSideBarComponents/ChatListItem/chat-list-item.component";

import classes from "./chat-list.module.css";
import Aux from "../../../hoc/Auxilliary/auxilliary";

class ChatList extends Component {
  arrayUnique = (array) => {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i].user.name === a[j].user.name) a.splice(j--, 1);
      }
    }

    return a;
  };
  render() {
    const {
      chatList,
      contacts,
      searchString,
      onSelectChat,
      onSelectContact,
      clicked,
    } = this.props;
    let chatListItems;
    if (chatList && chatList.length === 0) {
      chatListItems = this.arrayUnique(contacts).map((contact) => {
        return (
          <ChatListItem
            contactId={contact.user.id}
            name={contact.user.name}
            avatar={contact.user.avatar}
            key={contact.user.id}
            clicked={onSelectContact}
            select={clicked}
          />
        );
      });

      chatListItems = (
        <div className={classes.ConnectionsContainer}>
          <h3>Connections</h3>
          {chatListItems.length === 0 ? (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "1.2rem",
                textAlign: "center",
                color: "#555",
              }}
            >
              You do not have any connections. Start follow users to use this
              feature!
            </p>
          ) : (
            chatListItems
          )}
        </div>
      );
    } else {
      chatListItems = chatList.map((chat) => {
        return (
          <ChatListItem
            key={chat._id}
            name={chat.receiver.name}
            lastMessage={chat.lastMessage}
            avatar={chat.receiver.avatar}
            chatId={chat._id}
            contactId={chat.receiver._id}
            date={chat.lastMessageDate}
            unreadMessages={chat.unreadMessageCount}
            clicked={onSelectChat}
            select={clicked}
          />
        );
      });

      const contactItems = this.arrayUnique(contacts)
        .filter(
          (conn) =>
            chatList
              .map((chat) => chat.receiver.name)
              .indexOf(conn.user.name) === -1
        )
        .map((contact) => {
          return (
            <ChatListItem
              key={contact._id}
              name={contact.user.name}
              avatar={contact.user.avatar}
              contactId={contact.user.id}
              clicked={onSelectContact}
              select={clicked}
            />
          );
        });

      chatListItems = (
        <Aux>
          <div className={classes.ConnectionsContainer}>
            <h3>Recent Chats</h3>
            {chatListItems}
          </div>
          {contactItems.length !== 0 ? (
            <div className={classes.ConnectionsContainer}>
              <h3>Conenctions</h3>
              {contactItems}
            </div>
          ) : null}
        </Aux>
      );
    }

    if (searchString) {
      let searchedChats = chatList.filter((chat) =>
        chat.receiver.name
          .toLowerCase()
          .includes(searchString.toLowerCase().trim())
      );
      let connectionList = this.arrayUnique(contacts);
      let searchedContacts = connectionList.filter(
        (conn) =>
          conn.user.name
            .toLowerCase()
            .includes(searchString.toLowerCase().trim()) &&
          searchedChats
            .map((chat) => chat.receiver.name)
            .indexOf(conn.user.name) === -1
      );
      let chatListElements = searchedChats.map((chat) => {
        return (
          <ChatListItem
            key={chat._id}
            name={chat.receiver.name}
            lastMessage={chat.lastMessage}
            avatar={chat.receiver.avatar}
            chatId={chat._id}
            contactId={chat.receiver._id}
            date={chat.lastMessageDate}
            unreadMessages={chat.unreadMessageCount}
            clicked={onSelectChat}
            select={clicked}
          />
        );
      });
      let contactElements = searchedContacts.map((contact) => {
        return (
          <ChatListItem
            contactId={contact.user.id}
            name={contact.user.name}
            avatar={contact.user.avatar}
            key={contact._id}
            clicked={onSelectContact}
            select={clicked}
          />
        );
      });
      chatListItems = [...chatListElements, ...contactElements];
      if (chatListItems.length === 0) {
        chatListItems = (
          <p
            style={{
              fontSize: "18px",
              textAlign: "center",
              margin: "1rem",
              wordWrap: "pre-line",
            }}
          >{`No results found for: ${searchString}`}</p>
        );
      }
    }
    return <div className={classes.ChatList}>{chatListItems}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    chatList: state.chat.chatList,
    contacts: [...state.connections.followers, ...state.connections.following],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectContact: (contact) => dispatch(actions.selectContact(contact)),
    onSelectChat: (chatId, contact) =>
      dispatch(actions.selectChat(chatId, contact)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
