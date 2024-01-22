import { Avatar, Button, List, Spin, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { get } from "../common/request";

const PluginList = (prop: any) => {
  const { isInstall } = prop;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const getTotalPlugins = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      window.xiaoku.ipcSendInterface("getConfig");
      window.xiaoku.once(
        "msg-back-getConfig",
        async function (_event: any, ...args: any) {
          let baseURL =
            JSON.parse(args[0].data).plugin_config_base_url +
            "/total_plugins.json";
          if (isInstall) {
            let noUninstallURL =
              JSON.parse(args[0].data).plugin_config_base_url +
              "/system_plugin_names.json";
            get(noUninstallURL).then((noUninstallPluginList: any[]) => {
              window.xiaoku.ipcSendInterface("getPluginList");
              window.xiaoku.once(
                "msg-back-getPluginList",
                function (_event: any, data: any) {
                  data.forEach((item: any) => {
                    const isNoUnInstallPlugin = noUninstallPluginList.find(
                      (s: any) => s === item.name
                    );
                    if (isNoUnInstallPlugin) {
                      item.isUnInstall = false;
                    } else {
                      item.isUnInstall = true;
                    }
                  });
                  setData(data);
                  setLoading(false);
                }
              );
            });
          } else {
            get(baseURL)
              .then((res: any) => {
                window.xiaoku.ipcSendInterface("getPluginList");
                window.xiaoku.once(
                  "msg-back-getPluginList",
                  function (_event: any, plugins: any) {
                    res.forEach((item: any) => {
                      const find = plugins.find(
                        (s: any) => s.name === item.name
                      );
                      if (find) {
                        item.isInstall = true;
                        console.log(find.version, item.version);
                        if (find.version < item.version) {
                          item.upgrade = true;
                        } else {
                          item.upgrade = false;
                        }
                      }
                    });
                    setData(res);
                    setLoading(false);
                  }
                );
              })
              .catch((error: any) => {
                console.log(error);
              });
          }
        }
      );
    }, 500);
  }, [isInstall]);

  useEffect(() => {
    getTotalPlugins();
  }, [getTotalPlugins]);

  const installPlugin = (plugin: any) => {
    setLoading(true);
    window.xiaoku.ipcSendInterface("installPlugin", plugin);
    window.xiaoku.once("msg-back-installPlugin", () => {
      messageApi.open({
        type: "success",
        content: "安装成功",
      });
      window.xiaoku.ipcSendInterface("setRefreshLeft");
      getTotalPlugins();
    });
  };

  const upgradePlugin = (plugin: any) => {
    setLoading(true);
    window.xiaoku.ipcSendInterface("upgrade", plugin);
    window.xiaoku.once("msg-back-upgrade", () => {
      messageApi.open({
        type: "success",
        content: "更新成功",
      });
      window.xiaoku.ipcSendInterface("setRefreshLeft");
      window.xiaoku.ipcSendInterface("refreshPlugin", plugin);
      setTimeout(() => {
        getTotalPlugins();
      }, 300);
    });
  };

  const unInstallPlugin = (plugin: any) => {
    setLoading(true);
    window.xiaoku.ipcSendInterface("unInstallPlugin", plugin);
    window.xiaoku.once("msg-back-unInstallPlugin", (_event: any, data: any) => {
      messageApi.open({
        type: "success",
        content: "卸载成功",
      });
      window.xiaoku.ipcSendInterface("getConfig");
      window.xiaoku.once(
        "msg-back-getConfig",
        async function (_event: any, ...args: any) {
          const data = JSON.parse(args[0].data);
          const installPlugins: any[] = data.left_show_plugin;
          const findPluginIndex = installPlugins.findIndex(
            (s) => s === plugin.name
          );
          if (findPluginIndex !== -1) {
            installPlugins.splice(findPluginIndex, 1);
          }
          data.left_show_plugin = installPlugins;
          window.xiaoku.ipcSendInterface("setConfig", data);
          setTimeout(() => {
            window.xiaoku.ipcSendInterface("setRefreshLeft");
            getTotalPlugins();
          }, 500);
        }
      );
    });
  };
  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item: any, index) => (
            <List.Item
              actions={[
                isInstall ? (
                  item.isUnInstall === true ? (
                    <Button
                      danger
                      size="small"
                      onClick={() => {
                        unInstallPlugin(item);
                      }}
                    >
                      卸载
                    </Button>
                  ) : null
                ) : item.isInstall ? (
                  item.upgrade ? (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        upgradePlugin(item);
                      }}
                    >
                      更新
                    </Button>
                  ) : null
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      installPlugin(item);
                    }}
                  >
                    安装
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.logo} />}
                title={item.pluginName}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Spin>
    </>
  );
};

export default PluginList;
