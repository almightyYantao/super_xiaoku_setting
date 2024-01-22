# Super Xiaoku 设置插件

## Config

- 插件配置仓库地址: 这个目录下面需要有是个文件
  - init_plugins.json (初始化插件)
  - left_show_plugins.json （左边显示插件）
  - system_plugin_names.json （系统级别插件，不允许删除）
  - total_plugins.json （所有插件列表）

可以直接放到代码托管平台：<https://gitcode.net/micookgzs/super_xiaoku_databases/-/tree/master>

- npm 私有仓库: 如果你准备在公司内部使用的话，不想要插件公布到公网上去，那么这边改成私有地址即可，默认是：https://registry.npmmirror.com/
- 菜单显示插件: 最多4个，"设置"必须有

## Package.json

```json
{
  "name": "super_xiaoku_system_setting",
  "pluginName": "设置",
  "version": "0.0.4",
  "description": "SuperXiaoKu 的设置插件",
  "main": "index.html",
  "preload": "preload.js",
  "logo": "https://qhstaticssl.kujiale.com/image/png/1705487076239/setting.png",
  "pluginType": "xiaoku",
  "author": "yantao",
  "license": "ISC"
}
```
