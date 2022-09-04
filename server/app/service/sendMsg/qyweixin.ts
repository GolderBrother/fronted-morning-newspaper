import { QY_WEI_XIN_ROBOT_TOKEN } from "../../common";
import BaseService from "../baseService";

/**
 * 发送信息到企业微信群
 */
export default class Index extends BaseService {
  /**
   * 获取企业微信群机器人 webhook 地址
   * @param bizType 业务类型
   */
  getQYWeiXinWebHookUrl(): string {
    return `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${QY_WEI_XIN_ROBOT_TOKEN}`;
  }

  public async index(
    content
  ): Promise<{ data: any; result: boolean }> {
    const url = this.getQYWeiXinWebHookUrl();
    // const mockContent = `<font color="#389e0d">前端早报-2022/09/04</font>，欢迎大家阅读。

    // >#### 1. [VSCode 居然是个娱乐软件？让你 high 到爆的几款插件！](https://juejin.cn/post/7121526056489582600)
    // #### 2. [2022 年，前端深水区的裁员结局](https://juejin.cn/post/7126533116721627149)
    
    // 本服务由**[前端超神路](https://github.com/)**提供技术支持`;
    // 是否可以做成定时推送（周一到周五每天早上） 
    const data = {
      msgtype: "markdown",
      markdown: {
        content,
      },
    };
    
    const res = await this.app.curl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    if (res.status !== 200) {
      return {
        data: res,
        result: false,
      };
    }
    return {
      data: null,
      result: true,
    };
  }
}
