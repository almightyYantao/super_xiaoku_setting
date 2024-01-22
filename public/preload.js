// public/preload.js
const { ipcRenderer, contextBridge } = require("electron");

// 发布消息到主进程
const ipcSend = (type, data) => {
  ipcRenderer.send("msg-trigger", {
    type,
    data,
  });
};

// 定义 SuperXiaoKu 的 openAPI
const superXiaoKu = {
  ipcSendInterface(type, data) {
    ipcSend(type, data);
  },
  send(channel, data) {
    ipcRenderer.send(channel, data);
  },
  async invoke(channel, data) {
    return await ipcRenderer.invoke(channel, data);
  },
  on(channel, func) {
    // 从主进程接收消息，并调用渲染进程提供的回调函数
    ipcRenderer.on(channel, (_event, ...args) => func(_event, ...args));
  },
  once(channel, func) {
    // 从主进程接收消息，并调用渲染进程提供的回调函数
    ipcRenderer.once(channel, (_event, ...args) => func(_event, ...args));
  },
  removeAllListeners(channel) {
    ipcRenderer.removeAllListeners(channel);
  },
  removeListener(channel, func) {
    ipcRenderer.removeListener(channel, (_event, ...args) =>
      func(_event, ...args)
    );
  },
};
// 在上下文隔离启用的情况下使用预加载
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("xiaoku", superXiaoKu);
  } catch (error) {
    console.error(error);
  }
} else {
  window.xiaoku = superXiaoKu;
}
