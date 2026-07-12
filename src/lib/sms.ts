let client: any = null;

function getClient() {
  if (!client) {
    const Dysmsapi = require("@alicloud/dysmsapi20170525").default;
    const OpenApi = require("@alicloud/openapi-client");

    const config = new OpenApi.Config({
      accessKeyId: process.env.ALI_ACCESS_KEY_ID || "",
      accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET || "",
    });
    config.endpoint = "dysmsapi.aliyuncs.com";
    client = new Dysmsapi(config);
  }
  return client;
}

/**
 * 发送短信验证码（通过阿里云短信服务）
 * @param phone 手机号（纯数字，不含+86）
 * @param code 6位验证码
 */
export async function sendVerificationCode(phone: string, code: string) {
  // 未配置完整短信服务信息时模拟发送
  const requiredConfigs = [
    process.env.ALI_ACCESS_KEY_ID,
    process.env.ALI_ACCESS_KEY_SECRET,
    process.env.ALI_SMS_SIGN,
    process.env.ALI_SMS_TEMPLATE,
  ];
  if (requiredConfigs.some((config) => !config)) {
    console.log(`[DEV SMS] 验证码 ${code} → ${phone}`);
    return;
  }

  const Dysmsapi = require("@alicloud/dysmsapi20170525");
  const sendRequest = new Dysmsapi.SendSmsRequest();
  sendRequest.phoneNumbers = phone;
  sendRequest.signName = process.env.ALI_SMS_SIGN || "";
  sendRequest.templateCode = process.env.ALI_SMS_TEMPLATE || "";
  sendRequest.templateParam = JSON.stringify({ code });

  const response = await getClient().sendSms(sendRequest);

  if (response.body?.code !== "OK") {
    throw new Error(response.body?.message || "发送失败");
  }
}
