// index.js
const { BedrockPortal, Joinability, Modules } = require('bedrock-portal');

const TARGET_IP     = process.env.TARGET_IP || "";
const TARGET_PORT   = parseInt(process.env.TARGET_PORT || "19132", 10);
const JOIN          = process.env.JOINABILITY || "Public";
const REALM_INVITE  = (process.env.REALM_INVITE || "").trim();
const BEDROCK_VER   = (process.env.BEDROCK_VERSION || "1.21.102").trim(); // 👈 forzamos versión

function need(name, v){ if(!v){ console.error(`❌ Falta ${name}`); process.exit(1); } }
need("TARGET_IP", TARGET_IP);
need("REALM_INVITE", REALM_INVITE);

const JOIN_SAFE = Joinability[JOIN] ?? Joinability.Public;

(async () => {
  const portal = new BedrockPortal({
    ip: TARGET_IP,
    port: TARGET_PORT,
    joinability: JOIN_SAFE,
    autoAcceptFriendRequests: true,
    autoAcceptRealmInvites: true,
  });

  portal.use(Modules.RedirectFromRealm, {
    clientOptions: {
      version: BEDROCK_VER,               // 👈 aquí
      realms: { realmInvite: REALM_INVITE }
    },
    chatCommand: { enabled: true, message: "invite", cooldown: 10000 }
  });

  portal.on('log', (m) => console.log('[portal]', m));
  portal.on('error', (e) => console.error('🔥 Error:', e));

  console.log('🔌 Iniciando Bedrock Portal…');
  await portal.start();
  console.log(`✅ Portal activo → ${TARGET_IP}:${TARGET_PORT}`);
})();
