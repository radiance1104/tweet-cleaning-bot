import { environment } from './environment';
import { MatterMostService } from './services/matter-most-service';

// 抽選
const message = lottery();
// Mattermostへ投稿
post(message);

function lottery(): string {
  let message = '@all 17:55〜18:00は掃除の時間です。\n抽選の結果、本日の担当はこちらになりました。\n\n';
  const workers = Array.from(environment.workers);
  message += '|掃除場所|担当|\n|---|---|\n';
  for (const task of environment.tasks) {
    message += '| ' + task.name + ' | ';
    for (let count = 0; count < task.number; count++) {
      const index = Math.floor(Math.random() * workers.length);
      const worker = workers.splice(index, 1);
      message += worker + 'さん ';
    }
    message += ' |\n';
  }
  message += '| ' + environment.other + ' | ' + workers.join('さん ') + 'さん, その他 |\n';
  return message;
}

async function post(message: string) {
  const matterMost = new MatterMostService();
  const token = await matterMost.signIn(environment.matterMost.email, environment.matterMost.password);
  await matterMost.postMessage(environment.matterMost.channelId, message);
}
