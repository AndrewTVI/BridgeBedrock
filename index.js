const { BedrockPortal, Joinability } = require('bedrock-portal');

const TARGET_IP   = process.env.TARGET_IP   || "127.0.0.1"; // cámbialo en Render como variable
const TARGET_PORT = parseInt(process.env.TARGET_PORT || "19132", 10);
const JOIN        = (process.env.JOINABILITY || "FriendsOfFriends");

(async () => {
  const portal = new BedrockPortal({
    ip: TARGET_IP,
    port: TARGET_PORT,
    joinability: Joinability[JOIN] ?? Joinability.FriendsOfFriends
  });

  await portal.start();
  console.log("✅ Bedrock Portal activo →", `${TARGET_IP}:${TARGET_PORT}`);
})();
