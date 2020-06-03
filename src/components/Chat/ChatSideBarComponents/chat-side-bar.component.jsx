import React, { Component } from "react";
import classes from "./chat-side-bar.module.css";
import UserInfoHeader from "./UserInfoHeader/user-info-header-component";
import ChatSearch from "./ChatSearch/chat-search.componen";
import ChatList from "../../../containers/Chat/ChatList/chat-list.component";
import ChatCloseButton from "./ChatCloseButton/chat-close-button.component";

export default class ChatSideBar extends Component {
  render() {
    return (
      <div
        style={{ width: this.props.isChatSelected ? "30%" : "100%" }}
        className={classes.ChatSideBar}
      >
        <UserInfoHeader />
        <ChatSearch />
        <ChatList selectChat={this.props.clickChat} />
        <div className={classes.CloseBtn}>
          {this.props.isChatSelected ? null : (
            <ChatCloseButton closed={this.props.closed} />
          )}
        </div>
      </div>
    );
  }
}