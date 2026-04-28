const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = 'EAAbUTdthNIgBRXHG5HVnlryHNb0LBzCwOCN1hyw6MKYkZCpm28ekPXXMcZAwujAsZBZBKhQL9CIZB2KlXbRr8FmHg9Dd8JhsplkvzRnolpqYQxPu7lvi50bjohNONt8gXz6RuZBl6JwhVNeadBqNNb7b9taGyfdeFBpujQi3CSPXAWvU7orrAL0QKNxopUhu36mVdExRdm';
const VERIFY_TOKEN = 'mybot2024';

const STEPS = [
  "L'Islam dans son sens générale qui est la soumission a Dieu était donc la même religion prêchée par tous les précédents prophètes paix sur eux tous. Le prophète Mohamed paix sur lui, était un avertisseur comme ce fut les cas de tous les prophètes, Abraham, Moise , Salomon, David, Jésus, ETC, ils ont été envoyés avec le même message, que seul Dieu doit être vénéré. Et donc Jésus est le messager de Dieu et non son fils, Dieu est unique, il n a pas engendré et n a pas été engendré. il ne nous est pas permis de donner à Dieu un associé en Lui assignant un fils. Alors tu veux connaitre les piliers de la foi?",
  "sachez que la croyance musulmane se repose sur 6 piliers qui sont différents des piliers de l'islam, le premier: croire en Allah, qu'il est le créateur, le suprême, le seul qui est en droit d'être adoré, l'unique, l'incomparable, le vrai Dieu (Allah), il n'a ni fils ni partenaire. le deuxième: croire aux anges, qu'ils sont une créature d'Allah et qu'ils ne possèdent aucune caractéristique divine. Le troisième: croire aux livres: C'est de croire aux révélations originaux donnés à tous les prophètes: Abraham Moïse, Jésus, Mohamed, et que le coran est le dernier de ces livres. Le quatrième: croire aux messagers et prophètes envoyés par Allah. Le cinquième: croire au jour du jugement dernier. tu veux les piliers de l'islam?",
  "Il te manque seulement les piliers de l'islam, vous devez savoir pour les 5 piliers de l'islam que le 1er est l'attestation: J'atteste que seul Allah est méritant de notre adoration, et j'atteste que Mohammed est son messager. Pour le 2ème pilier c'est la prière, 5 prières obligatoires par jour, le 3ème c'est le jeune du ramadan, le 4ème c'est l'aumône légale qu'on appelle zakat, qui est distribuée aux pauvres et le 5ème est le pèlerinage a la Mecque une fois dans sa vie pour celui qui a les moyens. vous êtes convaincue??",
  "Pour etre musulman ecris ça ici: J'atteste que seul Allah est méritant de notre adoration, et j'atteste que Mohammed est son messager."
];

global.userState = global.userState || {};
const processed = new Set();

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN)
    res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && !event.message.is_echo) {
          handleMessage(event.sender.id, event.message.mid);
        }
      });
    });
    res.sendStatus(200);
  }
});

function handleMessage(userId, messageId) {
  if (processed.has(messageId)) return;
  processed.add(messageId);
  if (global.userState[userId] >= STEPS.length) return;
  if (global.userState[userId] === undefined) global.userState[userId] = 0;
  const reply = STEPS[global.userState[userId]];
  sendMsg(userId, reply);
  global.userState[userId]++;
}

function sendMsg(id, text) {
  axios.post(
    `https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    { recipient: { id }, message: { text } }
  ).catch(e => console.error('خطأ:', e.message));
}

app.listen(process.env.PORT || 3000, () => console.log('البوت يعمل!'));
