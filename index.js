const { BedrockPortal, Joinability, Modules } = require('bedrock-portal');

const TARGET_IP     = process.env.TARGET_IP || "";
const TARGET_PORT   = parseInt(process.env.TARGET_PORT || "19132", 10);
const JOIN          = process.env.JOINABILITY || "FriendsOfFriends";
const REALM_INVITE  = (process.env.REALM_INVITE || "").trim(); // ej. ABCDE

function need(name, v){ if(!v){ console.error(`❌ Falta ${name}.`); process.exit(1); } }
need("TARGET_IP", TARGET_IP);
need("REALM_INVITE", REALM_INVITE);

const JOIN_SAFE = Joinability[JOIN] ?? Joinability.FriendsOfFriends;

(async () => {
  try {
    const portal = new BedrockPortal({
      ip: TARGET_IP,
      port: TARGET_PORT,
      joinability: JOIN_SAFE,
      autoAcceptFriendRequests: true,
      autoAcceptRealmInvites: true
    });

    // 🔗 Escucha tu Realm y manda invitación al portal
    portal.use(Modules.RedirectFromRealm, {
      clientOptions: {
        realms: { realmInvite: REALM_INVITE } // ← código tipo ABCDE
      },
      // También puedes pedir la invitación escribiendo "invite" en el chat del Realm
      chatCommand: { enabled: true, message: "invite", cooldown: 10000 }
    });

    // Logs útiles
    portal.on('log', (m) => console.log('[portal]', m));
    portal.on('playerJoin', (p) => console.log('👤 Se unió al portal:', p?.gamertag));
    portal.on('error', (e) => console.error('🔥 Error:', e));

    console.log('🔌 Iniciando Bedrock Portal…');
    await portal.start();
    console.log(`✅ Portal activo → ${TARGET_IP}:${TARGET_PORT}`);
    console.log('💡 Al entrar al Realm recibirás una INVITACIÓN para saltar al server.');
    console.log('✍️ También puedes escribir "invite" en el chat del Realm para forzarla.');
  } catch (e) {
    console.error('❌ No se pudo iniciar:', e);
    process.exit(1);
  }
})();
