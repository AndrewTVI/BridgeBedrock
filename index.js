// index.js
const { BedrockPortal, Joinability } = require('bedrock-portal');

const TARGET_IP   = process.env.TARGET_IP || "";
const TARGET_PORT = parseInt(process.env.TARGET_PORT || "19132", 10);
const JOIN        = process.env.JOINABILITY || "FriendsOfFriends";

// Validación básica de config
function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Faltó la variable de entorno ${name}. Configúrala en Render → Environment.`);
    process.exit(1);
  }
}
requireEnv("TARGET_IP", TARGET_IP);

// Mapea el string a enum seguro
const JOINABILITY_SAFE = Joinability[JOIN] ?? Joinability.FriendsOfFriends;

(async () => {
  try {
    const portal = new BedrockPortal({
      ip: TARGET_IP,
      port: TARGET_PORT,
      joinability: JOINABILITY_SAFE,

      // ✅ Auto-aceptar invitaciones y amigos
      autoAcceptFriendRequests: true,
      autoAcceptRealmInvites: true,

      // Opcional: muestra formularios/listas si usas features extra
      showServerListForm: false,
      autoInviteOnCommand: true,
    });

    // Logs útiles
    portal.on('log', (msg) => console.log('[portal]', msg));
    portal.on('playerCount', (n) => console.log(`👥 Jugadores redirigidos: ${n}`));
    portal.on('error', (err) => console.error('🔥 Error del portal:', err));

    console.log('🔌 Iniciando Bedrock Portal…');
    await portal.start();

    console.log(`✅ Bedrock Portal activo → ${TARGET_IP}:${TARGET_PORT}`);
    console.log(`🔐 Joinability: ${JOINABILITY_SAFE === Joinability.FriendsOfFriends ? 'FriendsOfFriends' :
                                   JOINABILITY_SAFE === Joinability.InviteOnly ? 'InviteOnly' : 'Public'}`);
    console.log('💡 Tip: invita la cuenta del bot a tu Realm; con autoAcceptRealmInvites se unirá solo.');

    // Apagado limpio
    const shutdown = async (sig) => {
      try {
        console.log(`\n⚠️ Recibida señal ${sig}. Cerrando portal…`);
        await portal.stop?.();
      } catch (e) {
        console.error('Error al cerrar:', e);
      } finally {
        process.exit(0);
      }
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    console.error('❌ No se pudo iniciar el portal:', err);
    process.exit(1);
  }
})();
