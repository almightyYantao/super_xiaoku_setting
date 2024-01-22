import {
  Alert,
  Button,
  Form,
  Input,
  Select,
  SelectProps,
  Space,
  Spin,
  message,
} from "antd";
import { useEffect, useState } from "react";

const Config = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [isSaveError, setIsSaveError] = useState(false);
  const [errorContent, setErrorContent] = useState("");

  const onFinish = (values: any) => {
    setLoading(true);
    window.xiaoku.ipcSendInterface("setConfig", values);
    window.xiaoku.once("msg-back-setConfig", (_event: any, arg: boolean) => {
      if (arg === true) {
        messageApi.open({
          type: "success",
          content: "更新成功",
        });
        setIsSaveError(false);
      } else {
        messageApi.open({
          type: "error",
          content: "保存失败，请检查配置是否正确",
        });
        setIsSaveError(true);
        setErrorContent(
          "请检查仓库一下文件是否访问正确：\n'init_plugins.json'、'left_show_plugins.json'、'system_plugin_names.json'、'total_plugins.json'"
        );
      }
      setLoading(false);
      window.xiaoku.ipcSendInterface("setRefreshLeft");
    });
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  useEffect(() => {
    window.xiaoku.ipcSendInterface("getConfig");
    window.xiaoku.once(
      "msg-back-getConfig",
      function (_event: any, ...args: any) {
        const data = JSON.parse(args[0].data);
        form.setFieldsValue(data);
        window.xiaoku.ipcSendInterface("getPluginList");
        window.xiaoku.once(
          "msg-back-getPluginList",
          function (_event: any, data: any) {
            const value = data.map((item: any) => {
              item.label = item.pluginName;
              item.value = item.name;
              if (item.name === "super_xiaoku_system_setting") {
                item.disabled = true;
              }
              return item;
            });
            console.log(value);
            setOptions(value);
          }
        );
      }
    );
  }, [form]);

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="plugin_config_base_url"
            label="插件配置仓库地址"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="npm_config_url"
            label="npm 私有仓库"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="left_show_plugin"
            label="菜单显示插件"
            rules={[{ required: true }]}
          >
            <Select mode="multiple" options={options} maxCount={4} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {isSaveError ? (
          <Alert message={errorContent} type="error" showIcon />
        ) : null}
      </Spin>
    </>
  );
};

export default Config;
