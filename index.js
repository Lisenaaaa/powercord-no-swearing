/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { channels, messages } = require('powercord/webpack');
const wordList = require('./words').words;
const Settings = require('./components/settings');

module.exports = class RemoveSwearWords extends Plugin {
  async startPlugin () {
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'No Swearing',
      render: Settings
    });

    powercord.api.commands.registerCommand({
      command: 'currentChannelId',
      description: 'Returns the current channel\'s ID. Useful in DMs.',
      usage: '{c}',
      executor: () => ({
        send: false,
        result: `The current channel ID is **\`${channels.getChannelId()}\`**`
      })
    });

    inject('removeSwearWords', messages, 'sendMessage', (message) => {
      const whitelistedChannels = this.settings.get('whitelistedChannels').split(',');
      const currentChannel = channels.getChannelId();

      if (!whitelistedChannels.includes(currentChannel)) {
        const swearWords = wordList;

        let swearsRemoved = 0;

        for (const word of swearWords) {
          const regex = new RegExp(word, 'gmi');

          if (regex.test(message[1].content)) {
            swearsRemoved += message[1].content.match(regex).length;
          }

          message[1].content = message[1].content.replaceAll(regex, '🤬');
        }

        if (swearsRemoved > 0) {
          setTimeout(
            () =>
              this.sendEphemeralMessage(
                `Hey! Don't swear! I just had to remove ${swearsRemoved} bad word${swearsRemoved === 1 ? '' : 's'} from that message, before I could send it.`
              ),
            100
          );
        }
      }
    });
  }

  pluginWillUnload () {
    powercord.api.settings.unregisterSettings(this.entityID);
    powercord.api.commands.unregisterCommand('currentChannelId');
    uninject('removeSwearWords');
  }

  // this is from Little Furret#7901, https://canary.discord.com/channels/538759280057122817/755005784999329883/948454258603331584
  getModule (name) {
    let module;
    webpackChunkdiscord_app.push([
      [ Math.random() ],
      {},
      (r) => {
        module =
        module ||
        Object.values(r.c).find(
          (m) => m?.exports?.default && m.exports.default[name]
        );
      }
    ]);
    return module;
  }

  // guess who basically made this! https://canary.discord.com/channels/538759280057122817/755015856945102891/948455712953106433
  sendEphemeralMessage (content) {
    this.getModule('sendMessage').exports.default.sendBotMessage(
      this.getModule(
        'getLastSelectedChannelId'
      ).exports.default.getChannelId(),
      content
    );
  }
};
