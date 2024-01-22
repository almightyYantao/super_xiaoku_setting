import { Tabs, TabsProps } from "antd";
import PluginList from "./plugin";
import Config from "./config";

const IndexTab = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "配置管理",
      children: <Config />,
      destroyInactiveTabPane: true,
    },
    {
      key: "2",
      label: "已安装",
      children: <PluginList isInstall={true} />,
      destroyInactiveTabPane: true,
    },
    {
      key: "3",
      label: "插件列表",
      children: <PluginList isInstall={false} />,
      destroyInactiveTabPane: true,
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default IndexTab;
