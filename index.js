const { BedrockPortal, Joinability } = require('bedrock-portal');

(async () => {
  const portal = new BedrockPortal({
    ip: process.env.TARGET_IP || "127.0.0.1",
    port: parseInt(process.env.TARGET_PORT || "19132"),
    joinability: Joinability.FriendsOfFriends,
    autoAcceptFriendRequests: true,   // ✅ acepta solicitudes de amistad
    autoAcceptRealmInvites: true      // ✅ acepta invitaciones a Realms
  });

  await portal.start();
  console.log("✅ Bedrock Portal activo y esperando conexiones...");
})();
